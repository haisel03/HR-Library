import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "",
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
      output: {
        globals: {
          jquery: "$",
        },
      },
    },
  },
});
