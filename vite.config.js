import { defineConfig } from "vite";
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
				const name = file.replace(/\.html$/, "");
				// Prefijo html-: en webpack los .min.js de "index", "crud", etc. son los demos en public/demos, no el HTML
				entries[`html-${name}`] = resolve(pagesDir, file);
				return entries;
			}, {})
	: {};

/**
 * Paridad con webpack (v3 / webpack.common.js + webpack.prod.js):
 * - JS: js/[name].min.js
 * - CSS: css/[name].min.css (un solo CSS si cssCodeSplit: false → app.scss)
 * - vendors en chunk separado (splitChunks.cacheGroups.vendors)
 * - Copia: img/fonts/docs + fuentes bootstrap-icons (CopyWebpackPlugin)
 * - HTML en raíz de dist/ (como HtmlWebpackPlugin filename: `${name}.html`)
 */
export default defineConfig(({ mode }) => ({
	root: __dirname,
	base: "",
	publicDir: "public",
	server: {
		port: 9000,
	},
	define:
		mode === "production"
			? { "process.env.NODE_ENV": JSON.stringify("production") }
			: {},
	plugins: [],
	css: {
		preprocessorOptions: {
			scss: {
				includePaths: [resolve(__dirname, "node_modules")],
			},
		},
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
		// Un CSS principal como MiniCssExtractPlugin con un solo entry de estilos vía app.js
		cssCodeSplit: false,
		assetsInlineLimit: 0,
		rollupOptions: {
			input,
			output: {
				// Misma idea que webpack: vendors + chunks con nombre .min
				manualChunks(id) {
					if (id.includes("node_modules")) {
						return "vendors";
					}
				},
				entryFileNames: "js/[name].min.js",
				chunkFileNames: "js/[name].min.js",
				assetFileNames: (assetInfo) => {
					const n = assetInfo.name || "";
					// Igual que MiniCssExtractPlugin con entry "app": css/app.min.css
					if (n.endsWith(".css")) {
						return "css/app.min.css";
					}
					if (/\.(png|jpe?g|gif|svg|ico)$/i.test(n)) {
						return "img/[name][extname]";
					}
					if (/\.(woff2?|eot|ttf|otf)$/i.test(n)) {
						return "fonts/[name][extname]";
					}
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
}));
