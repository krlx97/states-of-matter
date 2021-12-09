import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import cssOnly from "rollup-plugin-css-only";
import livereload from "rollup-plugin-livereload";
import svelte from "rollup-plugin-svelte";
import {terser} from "rollup-plugin-terser";
import preprocess from "svelte-preprocess";

const production = !process.env.ROLLUP_WATCH;

const serve = () => {
  let server;

  const toExit = () => {
    if (server) { server.kill(0); }
  };

  return {
    writeBundle() {
      if (server) { return; }

      server = require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true
      });

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    }
  };
};

export default {
  input: "src/main.ts",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "dist/build/bundle.js"
  },
  plugins: [
    cssOnly({
      output: "bundle.css"
    }),
    nodeResolve({
      browser: true,
      dedupe: ["svelte"]
    }),
    commonjs(),
    typescript(),
    svelte({
      preprocess: preprocess({
        sourceMap: !production
      }),
      compilerOptions: {
        dev: !production
      }
    }),
    !production && serve(),
    !production && livereload("dist"),
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};
