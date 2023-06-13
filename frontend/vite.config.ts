import {resolve} from "path";
import {defineConfig} from "vite";
import {svelte} from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      data: resolve("./src/shared/data"),
      models: resolve("./src/shared/models"),
      responses: resolve("./src/shared/responses"),
      services: resolve("./src/shared/services"),
      stores: resolve("./src/shared/stores"),
      validators: resolve("./src/shared/validators"),
      ui: resolve("./src/shared/ui")
    }
  }
});
