import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { readdirSync, existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");

const pagesDir = resolve(__dirname, "src/pages");
const input = existsSync(pagesDir)
	? readdirSync(pagesDir)
			.filter((file) => file.endsWith(".html"))
			.reduce((entries, file) => {
				entries[file.replace(/\.html$/, "")] = resolve(pagesDir, file);
				return entries;
			}, {})
	: {};

export default defineConfig({
	server: {
		port: 9000,
	},
	base: "",
	plugins: [
		legacy({
			targets: ["defaults", "not IE 11"],
			additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
		}),
	],
	// app.scss se importa solo desde app.js; no anteponer app.scss aquí (provoca
	// auto-import recursivo y duplicados / errores de Sass).
	css: {
		preprocessorOptions: {
			// Equivalente al prefijo ~ de Webpack para paquetes en node_modules
			scss: {
				includePaths: [resolve(__dirname, "node_modules")],
			},
		},
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
		rollupOptions: {
			input,
			output: {
				entryFileNames: "js/[name].js",
				chunkFileNames: "js/[name].js",
				assetFileNames: (asset) => {
					if (asset.name.endsWith(".css")) return "css/[name][extname]";
					if (
						["png", "jpg", "jpeg", "gif", "svg", "ico"].some((ext) =>
							asset.name.endsWith("." + ext),
						)
					)
						return "img/[name][extname]";
					return "assets/[name][extname]";
				},
			},
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
			assets: resolve(__dirname, "public"),
		},
	},
});
