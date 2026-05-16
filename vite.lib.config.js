import { defineConfig } from "vite";
import path from "path";
import { readFileSync, writeFileSync } from "fs";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist/lib",
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: "src/js/app.js",
      name: "App",
      formats: ["es", "umd"],
      fileName: (format) => `hr-library.${format}.js`,
    },
    rollupOptions: {
      external: [
        "jquery",
        "bootstrap",
        "chart.js",
        "quill",
        /^@fullcalendar\//,
        /^datatables\.net/,
      ],
      output: {
        globals: {
          jquery: "$",
          bootstrap: "bootstrap",
          "chart.js": "Chart",
          quill: "Quill",
        },
      },
    },
  },
});

// Write a package.json for the lib subpath so consumers can import directly
const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));
writeFileSync(
  "dist/lib/package.json",
  JSON.stringify({
    name: "hr-library",
    version: pkg.version,
    main: "hr-library.umd.js",
    module: "hr-library.es.js",
    private: false,
    sideEffects: false,
  }),
);
