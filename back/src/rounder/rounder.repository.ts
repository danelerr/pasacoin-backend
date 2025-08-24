import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParticipationRounded } from 'src/entities/participationRounded.entity';
import { Rounders } from 'src/entities/rounded.entity';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateRoundedPrivateDto } from './Dtos/createRoundedPrivateDto';
import { RoundOfStatus } from 'src/enum/roundOfStatus';
import { RoundOfVisibility } from 'src/enum/roundOfVisibility';
import { CreateRoundedPublicDto } from './Dtos/createRoundedPublicDto';
import { ethers } from 'ethers';

@Injectable()
export class RounderRepository {
  @InjectRepository(Rounders)
  private readonly roundedRepository: Repository<Rounders>;
  @InjectRepository(ParticipationRounded)
  private readonly participationRoundersRepository: Repository<ParticipationRounded>;
  async getAllRoundedPublicCreatedRepository() {
    return await this.roundedRepository.find({
      where: {
        visibility: RoundOfVisibility.PUBLIC,
        status: RoundOfStatus.CREATED,
      },
    });
  }
  async getAllRoundedUsersRepository(user: Users) {
    return await this.participationRoundersRepository
      .createQueryBuilder('participation')
      .leftJoinAndSelect('participation.rounder', 'rounder')
      .where('participation.user = :userId', { userId: user.id })
      .andWhere('rounder.status IN (:...statuses)', {
        statuses: [RoundOfStatus.IN_PROGRESS, RoundOfStatus.CREATED],
      })
      .getMany();
  }
  async getCountRoundedUserByUuid(id: string) {
    return await this.participationRoundersRepository.count({
      where: {
        user: { id },
        finalizedRounded: false,
      },
    });
  }
  async postCreateRoundedPrivateRepository(
    createRoundedPrivateDto: CreateRoundedPrivateDto,
    user: Users,
  ) {
    const newRounded = this.roundedRepository.create({
      createDate: new Date(),
      numberOfRounds: createRoundedPrivateDto.numberOfRounds,
      payOfRounds: createRoundedPrivateDto.payOfRounds,
      numberOfParticipants: createRoundedPrivateDto.numberOfRounds,
      numberActualOfParticipants: 1,
      durationOfRound: createRoundedPrivateDto.durationOfRounds,
      lastDatePayOfRound: null,
      numberMaxOfRounds: createRoundedPrivateDto.numberOfRounds,
      numberActualOfRounds: 0,
      status: RoundOfStatus.CREATED,
      visibility: RoundOfVisibility.PRIVATE,
    });
    const newRoundedSave = await this.roundedRepository.save(newRounded);
    const newParticipationRounded = this.participationRoundersRepository.create(
      {
        user: user,
        rounder: newRoundedSave,
        finalizedRounded: false,
      },
    );
    await this.participationRoundersRepository.save(newParticipationRounded);
    console.log(
      'Ronda privada creada por el usuario:',
      user.email,
      'ID de la ronda:',
      newRoundedSave.id,
    );
    return 'Ronda privada creada con éxito';
  }

  async postCreateRoundedPublicRepository(
    createRoundedPublicDto: CreateRoundedPublicDto,
    user: Users,
  ) {
    const newRoundedPublic = this.roundedRepository.create({
      createDate: new Date(),
      numberOfRounds: createRoundedPublicDto.numberOfRounds,
      payOfRounds: createRoundedPublicDto.payOfRounds,
      numberOfParticipants: createRoundedPublicDto.numberOfRounds,
      numberActualOfParticipants: 0,
      durationOfRound: createRoundedPublicDto.durationOfRounds,
      lastDatePayOfRound: null,
      numberMaxOfRounds: createRoundedPublicDto.numberOfRounds,
      numberActualOfRounds: 0,
      status: RoundOfStatus.CREATED,
      visibility: RoundOfVisibility.PUBLIC,
    });
    const newRoundedPublicSave =
      await this.roundedRepository.save(newRoundedPublic);
    console.log(
      'Ronda pública creada por el usuario:',
      user.email,
      'ID de la ronda:',
      newRoundedPublicSave.id,
    );
    return 'Ronda pública creada con éxito';
  }
  async geRoundedByUuid(idRounded: string) {
    return await this.roundedRepository.findOne({
      where: { id: idRounded },
    });
  }
  async joinRoundedPublicRepository(user: Users, rounded: Rounders) {
    rounded.numberActualOfParticipants += 1;
    if (rounded.numberActualOfParticipants < rounded.numberOfParticipants) {
      await this.roundedRepository.save(rounded);
      const newParticipationRounded =
        this.participationRoundersRepository.create({
          user: user,
          rounder: rounded,
          finalizedRounded: false,
        });
      await this.participationRoundersRepository.save(newParticipationRounded);
      console.log(
        'Usuario:',
        user.wallet,
        'se ha unido a la ronda pública ID:',
        rounded.id,
      );
      return 'Te has unido a la ronda pública con éxito';
    }

    // Cuando la ronda se llena
    rounded.status = RoundOfStatus.IN_PROGRESS;
    const now = new Date();
    const nextPayDate = new Date(
      now.getTime() + rounded.durationOfRound * 24 * 60 * 60 * 1000,
    );
    rounded.lastDatePayOfRound = nextPayDate;
    await this.roundedRepository.save(rounded);

    const newParticipationRounded = this.participationRoundersRepository.create(
      {
        user: user,
        rounder: rounded,
        finalizedRounded: false,
      },
    );
    await this.participationRoundersRepository.save(newParticipationRounded);

    // --- Obtener las wallets de los participantes de la ronda ---
    const participations = await this.participationRoundersRepository.find({
      where: { rounder: { id: rounded.id } },
      relations: ['user'],
    });
    const participants = participations.map((p) => p.user.wallet);

    // --- Lógica para llamar al contrato inteligente ---
    try {
      const PASACOIN_ABI = [
        'function createRound(uint256 roundId,uint256 totalRounds,uint256 amountPerRound,uint256 durationDays,uint256 initialLastPaymentDate,address[] participants) external',
      ];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const provider = new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const ownerWallet = new ethers.Wallet(
        process.env.OWNER_PRIVATE_KEY!,
        provider,
      );
      const contractAddress = '0x4e5d585ef8696aD9894fC0Ea26d920e42548a6fF';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const contract = new ethers.Contract(
        contractAddress,
        PASACOIN_ABI,
        ownerWallet,
      );

      const tokenDecimals = 6;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const amountPerRound = ethers.parseUnits(
        rounded.payOfRounds.toString(),
        tokenDecimals,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const tx = await contract.createRound(
        Number(rounded.id), // roundId
        rounded.numberOfRounds, // totalRounds
        amountPerRound, // amountPerRound
        rounded.durationOfRound, // durationDays
        Math.floor(nextPayDate.getTime() / 1000), // initialLastPaymentDate
        participants,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await tx.wait();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log('Ronda creada en el contrato inteligente:', tx.hash);
    } catch (error) {
      console.error('Error al crear la ronda en el contrato:', error);
      // Puedes lanzar una excepción o manejar el error según tu lógica
    }
    // --- Fin lógica contrato ---

    console.log(
      'Usuario:',
      user.wallet,
      'se ha unido a la ronda pública ID:',
      rounded.id,
    );
    const newRoundedPublic = this.roundedRepository.create({
      createDate: new Date(),
      numberOfRounds: rounded.numberOfRounds,
      payOfRounds: rounded.payOfRounds,
      numberOfParticipants: rounded.numberOfParticipants,
      numberActualOfParticipants: 0,
      durationOfRound: rounded.durationOfRound,
      lastDatePayOfRound: null,
      numberMaxOfRounds: rounded.numberOfRounds,
      numberActualOfRounds: 0,
      status: RoundOfStatus.CREATED,
      visibility: RoundOfVisibility.PUBLIC,
    });
    await this.roundedRepository.save(newRoundedPublic);
    console.log(
      'Ronda pública creada automáticamente ID:',
      newRoundedPublic.id,
    );
    return 'Te has unido a la ronda pública con éxito, la ronda ha comenzado';
  }

  getUserInRoundedByUuid(idUser: string, idRounded: string) {
    return this.participationRoundersRepository.findOne({
      where: {
        user: { id: idUser },
        rounder: { id: idRounded },
      },
    });
  }
}
