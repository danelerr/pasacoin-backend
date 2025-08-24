// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title PasaCoin Hackaton Mobil3 powered by Monad
/// @author Team2 -Lupe, Pool, Daniel y Javier
/// @notice Contrato de rondas rotativas usando USDM
/// @notice Owner crea rondas; participantes pagan cada ronda y cuando todos pagan, el pool va al siguiente receptor en orden.
/// @dev Interfaz ERC20 
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}
contract PasaCoin {
    address public owner;
    IERC20 public token; // token ERC20 (USDT u otro)

    enum RoundStatus { InProgress, Finalized }

    struct RoundInfo {
        uint256 id;
        uint256 totalRounds;         // número total de rondas por completar
        uint256 amountPerRound;      // valor que debe enviar cada participante (en unidades del token)
        uint256 durationDays;        // duración en días para calcular el "deadline informativo" (lastPaymentDate)
        uint256 lastPaymentDate;     // fecha informativa (deadline) para la ronda actual; NO es obligatoria/enforced
        uint256 currentRoundNumber;  // ronda actual (empieza en 1)
        address[] participants;      // orden de receptores
        uint256 currentReceiverIndex;// índice en participants que recibirá cuando se complete la ronda actual
        RoundStatus status;
        uint256 paidCount;           // conteo de pagos para la ronda actual
        bool exists;
    }

    // RoundId => RoundInfo
    mapping(uint256 => RoundInfo) private rounds;

    // paidRound[roundId][participant] = lastRoundNumberPaid
    // si paidRound == currentRoundNumber significa ya pagó esa ronda
    mapping(uint256 => mapping(address => uint256)) public paidRound;

    // isParticipant lookup 
    mapping(uint256 => mapping(address => bool)) public isParticipant;

    // reentrancy guard simple
    bool private locked;

    // Events
    event RoundCreated(
        uint256 indexed roundId,
        uint256 totalRounds,
        uint256 amountPerRound,
        uint256 durationDays,
        uint256 lastPaymentDate,
        address[] participants
    );
    event Paid(uint256 indexed roundId, address indexed from, uint256 amount, uint256 roundNumber);
    event RoundCompleted(uint256 indexed roundId, uint256 roundNumberCompleted, address indexed paidTo, uint256 amountSent);
    event RoundFinalized(uint256 indexed roundId);
    event OwnerChanged(address indexed previousOwner, address indexed newOwner);
    event TokenChanged(address indexed previousToken, address indexed newToken);
    event EmergencyWithdraw(address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "solo owner");
        _;
    }

    modifier noReentrant() {
        require(!locked, "reentrancy guard");
        locked = true;
        _;
        locked = false;
    }

    constructor(address _token) {
        require(_token != address(0), "token no puede ser 0x0");
        owner = msg.sender;
        token = IERC20(_token);
    }

    /// @notice Cambiar la direccion del token (solo owner)
    function setToken(address _token) external onlyOwner {
        require(_token != address(0), "token no puede ser 0x0");
        address previous = address(token);
        token = IERC20(_token);
        emit TokenChanged(previous, _token);
    }

    /// @notice Crea una nueva ronda (solo owner)
    /// @param roundId identificador unico de la ronda
    /// @param totalRounds numero total de rondas a completar
    /// @param amountPerRound cantidad (en unidades del token) que cada participante deberá pagar por ronda
    /// @param durationDays duracion en dias usada para actualizar lastPaymentDate informativo cada vez que se complete una ronda
    /// @param initialLastPaymentDate timestamp (UNIX) informativo (deadline) para la primera ronda
    /// @param participants lista de participantes en el orden en el que recibirán los pagos
    function createRound(
        uint256 roundId,
        uint256 totalRounds,
        uint256 amountPerRound,
        uint256 durationDays,
        uint256 initialLastPaymentDate,
        address[] calldata participants
    ) external onlyOwner {
        require(!rounds[roundId].exists, "roundId ya existe");
        require(participants.length > 0, "debe haber al menos 1 participante");
        require(totalRounds >= 1, "totalRounds >= 1");
        require(amountPerRound > 0, "amountPerRound > 0");
        require(initialLastPaymentDate > 0, "initialLastPaymentDate > 0");

        RoundInfo storage r = rounds[roundId];
        r.id = roundId;
        r.totalRounds = totalRounds;
        r.amountPerRound = amountPerRound;
        r.durationDays = durationDays;
        r.lastPaymentDate = initialLastPaymentDate; 
        r.currentRoundNumber = 1;
        r.currentReceiverIndex = 0;
        r.status = RoundStatus.InProgress;
        r.paidCount = 0;
        r.exists = true;

        // copiar participantes y setear mapping 
        for (uint i = 0; i < participants.length; i++) {
            require(participants[i] != address(0), "participante no puede ser 0x0");
            r.participants.push(participants[i]);
            isParticipant[roundId][participants[i]] = true;
        }

        emit RoundCreated(roundId, totalRounds, amountPerRound, durationDays, initialLastPaymentDate, participants);
    }

    /// @notice Pagar la ronda actual de la ronda especificada. Solo participantes pueden llamar.
    /// @param roundId identificador de la ronda
    /// @dev El usuario debe haber llamado antes token.approve(contract, amountPerRound)
    function pay(uint256 roundId) external noReentrant {
        require(rounds[roundId].exists, "ronda no existe");
        RoundInfo storage r = rounds[roundId];
        require(r.status == RoundStatus.InProgress, "ronda no en progreso");

        // comprobar que msg.sender sea participante 
        require(isParticipant[roundId][msg.sender], "no eres participante de esta ronda");

        // chequear si ya pagó la ronda actual
        require(paidRound[roundId][msg.sender] != r.currentRoundNumber, "ya pagaste esta ronda");

        // Transferir token desde el participante al contrato (approve + transferFrom)
        _safeTransferFrom(token, msg.sender, address(this), r.amountPerRound);

        // marcar pago 
        paidRound[roundId][msg.sender] = r.currentRoundNumber;
        r.paidCount += 1;

        emit Paid(roundId, msg.sender, r.amountPerRound, r.currentRoundNumber);

        // si ya pagaron todos, distribuir pool al receptor actual
        if (r.paidCount == r.participants.length) {
            uint256 pool = r.amountPerRound * r.participants.length;
            address receiver = r.participants[r.currentReceiverIndex];

            // guardamos el numero de ronda que se completó para el evento
            uint256 completedRoundNumber = r.currentRoundNumber;

            // EFFECTS: preparar siguiente ronda / actualizar campos antes de la interacción externa
            r.currentReceiverIndex = (r.currentReceiverIndex + 1) % r.participants.length;
            r.currentRoundNumber += 1;
            r.paidCount = 0;
            r.lastPaymentDate = block.timestamp + (r.durationDays * 1 days); // solo informativo

            // si se completaron todas las rondas marcar finalizada
            bool justFinalized = false;
            if (r.currentRoundNumber > r.totalRounds) {
                r.status = RoundStatus.Finalized;
                justFinalized = true;
            }

            // INTERACTION: transferir tokens al receptor
            _safeTransfer(token, receiver, pool);

            emit RoundCompleted(roundId, completedRoundNumber, receiver, pool);

            if (justFinalized) {
                emit RoundFinalized(roundId);
            }
        }
    }

    /// @notice Devuelve información básica de la ronda
    function getRoundSummary(uint256 roundId) external view returns (
        uint256 id,
        uint256 totalRounds,
        uint256 amountPerRound,
        uint256 durationDays,
        uint256 lastPaymentDate,
        uint256 currentRoundNumber,
        uint256 currentReceiverIndex,
        RoundStatus status,
        uint256 participantCount,
        uint256 paidCount
    ) {
        require(rounds[roundId].exists, "ronda no existe");
        RoundInfo storage r = rounds[roundId];
        return (
            r.id,
            r.totalRounds,
            r.amountPerRound,
            r.durationDays,
            r.lastPaymentDate,
            r.currentRoundNumber,
            r.currentReceiverIndex,
            r.status,
            r.participants.length,
            r.paidCount
        );
    }

    /// @notice Devuelve la lista de participantes de una ronda
    function getParticipants(uint256 roundId) external view returns (address[] memory) {
        require(rounds[roundId].exists, "ronda no existe");
        return rounds[roundId].participants;
    }

    /// @notice Comprueba si una address es participante de la ronda 
    function checkIsParticipant(uint256 roundId, address who) external view returns (bool) {
        require(rounds[roundId].exists, "ronda no existe");
        return isParticipant[roundId][who];
    }

    /// @notice Cambiar owner (solo owner actual)
    function changeOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "owner no puede ser 0x0");
        address previous = owner;
        owner = newOwner;
        emit OwnerChanged(previous, newOwner);
    }

    /// @notice Permite al owner retirar tokens del contrato en caso de emergencia
    function emergencyWithdraw(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "to 0x0");
        _safeTransfer(token, to, amount);
        emit EmergencyWithdraw(to, amount);
    }

    // evitar que se envíen ETH por error al contrato (no permitido)
    receive() external payable {
        revert("no enviar ETH; usar token ERC20 y approve + pay(roundId)");
    }
    fallback() external payable {
        revert("fallback: usar token ERC20 y approve + pay(roundId)");
    }

    /* ------------------------------------------------------------------- */
    /* -------------------- Funciones internas para ERC20 ----------------- */
    /* ------------------------------------------------------------------- */

    /// @dev Realiza transferFrom y verifica éxito incluso si token no devuelve bool 
    function _safeTransferFrom(IERC20 _token, address from, address to, uint256 amount) internal {
        (bool success, bytes memory data) =
            address(_token).call(abi.encodeWithSelector(_token.transferFrom.selector, from, to, amount));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "transferFrom failed");
    }

    /// @dev Realiza transfer y verifica éxito incluso si token no devuelve bool
    function _safeTransfer(IERC20 _token, address to, uint256 amount) internal {
        (bool success, bytes memory data) =
            address(_token).call(abi.encodeWithSelector(_token.transfer.selector, to, amount));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "transfer failed");
    }
}

