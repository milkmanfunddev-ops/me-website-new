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
      /* `prerender` belongs under `config` — as a top-level key it was silently
       * ignored, which is why nothing was ever actually prerendered (and why
       * tsc flagged it). "/" is deliberately not listed: it pulls Sanity
       * content, so freezing it at build time is a separate call to make. */
      config: {
        prerender: {
          /* /links has no loader and no client-side fetching, so it can be
           * emitted as static HTML at build time. */
          routes: ["/links"],
        },
      },
    }),
    viteReact(),
    tailwindcss(),
  ],
});
