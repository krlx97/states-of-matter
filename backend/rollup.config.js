import run from "@rollup/plugin-run";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "es",
    sourcemap: true
  },
  external: [
    "crypto",
    "http",
    "bcrypt",
    "ethers",
    "jsonwebtoken",
    "mongodb",
    "node-cron",
    "socket.io",
    "@som/shared/enums",
    "@som/shared/data",
    "@som/contracts/EthericCrystals/artifacts/EthericCrystals.json",
    "@som/contracts/EthericEnergy/artifacts/EthericEnergy.json",
    "@som/contracts/Game/artifacts/Game.json",
    "@som/contracts/Collectibles/artifacts/Collectibles.json"
  ],
  plugins: [run(), typescript()]
};
