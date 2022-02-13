import {defineConfig} from "rollup";
import run from "@rollup/plugin-run";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "es",
    sourcemap: true
  },
  external: [
    "crypto",
    "http",
    "eosjs",
    "eosjs/dist/eosjs-jssig.js",
    "mongodb",
    "node-fetch",
    "socket.io",
    "@som/shared/data",
    "@som/shared/enums"
  ],
  plugins: [
    run(),
    typescript(),
  ]
});
