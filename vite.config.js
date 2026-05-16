import { defineConfig } from "vite";
import handlebars from "./vite/handlebars-plugin.js";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  base: "",
  plugins: [
    handlebars({
      pagesDir: "src/views/pages",
      layoutsDir: "src/views/layouts",
      partialsDir: "src/views/partials",
      demosDir: "public/demos",
    }),
    visualizer({
      filename: "dist/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
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
        silenceDeprecations: ["import", "color-functions", "global-builtin"],
      },
    },
    devSourcemap: true,
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: "js/[name].min.js",
        chunkFileNames: "js/[name].min.js",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("fullcalendar") || id.includes("@fullcalendar")) {
              return "vendor-calendar";
            }
            if (id.includes("quill")) {
              return "vendor-editor";
            }
            if (id.includes("chart.js")) {
              return "vendor-charts";
            }
            if (id.includes("datatables")) {
              return "vendor-tables";
            }
            if (id.includes("bootstrap")) {
              return "vendor-bootstrap";
            }
            if (id.includes("jquery") || id.includes("jQuery")) {
              return "vendor-jquery";
            }
            if (id.includes("flatpickr")) {
              return "vendor-flatpickr";
            }
            if (id.includes("select2")) {
              return "vendor-select2";
            }
            if (id.includes("sweetalert2")) {
              return "vendor-swal";
            }
            if (id.includes("pdfmake") || id.includes("jszip") || id.includes("xlsx")) {
              return "vendor-export";
            }
            return "vendor-misc";
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
