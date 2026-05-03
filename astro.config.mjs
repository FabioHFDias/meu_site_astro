import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://FabioHFDias.github.io",
  base: "/meu_site_astro",
  integrations: [tailwind()],
});
