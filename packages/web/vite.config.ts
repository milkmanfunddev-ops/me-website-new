import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    include: [
      "use-sync-external-store/shim",
      "use-sync-external-store/shim/index.js",
    ],
  },
  ssr: {
    noExternal: [
      "@clerk/tanstack-react-start",
      "@clerk/clerk-react",
      "@clerk/shared",
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@convex": path.resolve(__dirname, "../../packages/convex/convex"),
    },
  },
  plugins: [
    tanstackStart(),
    nitro({
      /* Top level, not under `config`: from nitro 3.0 beta the plugin's options
       * extend NitroConfig directly. "/" is deliberately not listed: it pulls
       * Sanity content, so freezing it at build time is a separate call to
       * make. */
      prerender: {
        /* /links has no loader and no client-side fetching, so it can be
         * emitted as static HTML at build time. */
        routes: ["/links"],
      },
    }),
    viteReact(),
    tailwindcss(),
  ],
});
