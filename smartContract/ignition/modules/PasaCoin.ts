import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("PasaCoinDeployOnly", (m) => {
  const token = "0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D";

  const rondas = m.contract("PasaCoin", [token]);

  return { rondas };
});
