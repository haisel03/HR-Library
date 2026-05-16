import { defineConfig } from "vite";
import handlebars from "./vite/handlebars-plugin.js";
import path from "path";

export default defineConfig({
  base: "",
  plugins: [
    handlebars({
      pagesDir: "src/views/pages",
      layoutsDir: "src/views/layouts",
      partialsDir: "src/views/partials",
      demosDir: "public/demos",
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      assets: path.resolve(__dirname, "public"),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ["import"],
      },
    },
    devSourcemap: true,
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: false,
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: "js/[name].min.js",
        chunkFileNames: "js/[name].min.js",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendors";
          }
        },
      },
    },
  },

  server: {
    port: 9000,
    open: true,
    hmr: true,
  },
});
