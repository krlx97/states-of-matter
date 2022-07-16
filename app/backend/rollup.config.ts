import {defineConfig} from "rollup";
// import commonjs from '@rollup/plugin-commonjs';
// import {nodeResolve} from '@rollup/plugin-node-resolve';
// import json from '@rollup/plugin-json';
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
    "process",
    "eosjs",
    "eosjs/dist/eosjs-jssig.js",
    "mongodb",
    "node-fetch",
    "socket.io",
    "@som/shared/data",
    "@som/shared/enums"
  ],
  plugins: [run(), typescript()]
});
