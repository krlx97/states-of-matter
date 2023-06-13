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
    "ethers",
    "mongodb",
    "socket.io",
    "@som/shared/enums",
    "@som/shared/data",
    "@som/contracts/SomGame/artifacts/SomGame.json"
  ],
  plugins: [run(), typescript()]
};
