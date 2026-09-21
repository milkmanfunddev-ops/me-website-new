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
    tanstackStart({
      /* /links has no loader and no client-side fetching, so it is emitted as
       * static HTML at build time. This is TanStack Start's prerenderer, not
       * Nitro's: Nitro's runs before the server bundle exists and gets a 404
       * for every route. "/" is deliberately not listed: it pulls Sanity
       * content, so freezing it at build time is a separate call to make. */
      pages: [{ path: "/links", prerender: { enabled: true } }],
      prerender: {
        // Both default to on, which would freeze every static route and every
        // page /links links to, including Sanity-driven ones.
        autoStaticPathsDiscovery: false,
        crawlLinks: false,
      },
      // The site serves its own /sitemap.xml route.
      sitemap: { enabled: false },
    }),
    nitro(),
    viteReact(),
    tailwindcss(),
  ],
});
