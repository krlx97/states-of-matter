import {resolve} from "path";
import {defineConfig} from "vite";
import {svelte} from "@sveltejs/vite-plugin-svelte";

const config = defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      data: resolve("./src/shared/data"),
      responses: resolve("./src/shared/responses"),
      services: resolve("./src/shared/services"),
      stores: resolve("./src/shared/stores"),
      ui: resolve("./src/shared/ui")
    }
  }
});

export default config;
