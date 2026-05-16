import { defineConfig } from "vite";
import handlebars from "./vite/handlebars-plugin.js";
import path from "path";
import fs from "fs";
import { visualizer } from "rollup-plugin-visualizer";

/** Inyecta <link rel="stylesheet"> a vendor.css en todos los HTML */
function vendorCssPlugin() {
	return {
		name: "vendor-css-injector",
		apply: "build",
		transformIndexHtml(html) {
			return html.replace(
				"</head>",
				'  <link rel="stylesheet" crossorigin href="./css/vendor.css">\n</head>',
			);
		},
	};
}

/** Mueve los <script> de <head> a </body>, mueve HTML a pages/ y reescribe rutas relativas */
function postProcessHtml() {
	return {
		name: "post-process-html",
		apply: "build",
		writeBundle() {
			const dist = path.resolve(__dirname, "dist");

			// 1. Mover scripts de <head> a </body>
			const htmlFiles = [];
			function walk(dir) {
				if (!fs.existsSync(dir)) return;
				for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
					const full = path.join(dir, entry.name);
					if (entry.isDirectory()) walk(full);
					else if (entry.name.endsWith(".html")) htmlFiles.push(full);
				}
			}
			walk(dist);

			for (const file of htmlFiles) {
				let html = fs.readFileSync(file, "utf-8");
				const headMatch = html.match(/<head>[\s\S]*?<\/head>/);
				if (!headMatch) continue;

				const headContent = headMatch[0];
				const scripts = headContent.match(/<script[\s\S]*?<\/script>/g);
				if (scripts && scripts.length > 0) {
					let newHead = headContent;
					const removed = [];
					for (const s of scripts) {
						newHead = newHead.replace(s, "");
						removed.push(s);
					}
					html = html.replace(headContent, newHead);
					html = html.replace("</body>", removed.join("\n") + "\n</body>");
				}
				fs.writeFileSync(file, html, "utf-8");
			}

			// 2. Mover HTML a pages/ y reescribir rutas relativas
			const pagesDir = path.join(dist, "pages");
			if (!fs.existsSync(pagesDir)) {
				fs.mkdirSync(pagesDir, { recursive: true });
			}

			for (const file of htmlFiles) {
				let html = fs.readFileSync(file, "utf-8");
				// Agregar ../ a rutas relativas de assets: css/, js/, img/, fonts/, json/, demos/
				html = html.replace(
					/(src|href)="(\.\/)?(css|js|img|fonts|json|demos)\//g,
					'$1="../$3/',
				);
				const filename = path.basename(file);
				fs.writeFileSync(path.join(pagesDir, filename), html, "utf-8");
				fs.unlinkSync(file);
			}
		},
	};
}

export default defineConfig({
	base: "",
	plugins: [
		vendorCssPlugin(),
		postProcessHtml(),
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
			input: {
				main: path.resolve(__dirname, "index.html"),
				vendor_css: path.resolve(__dirname, "src/scss/vendor.scss"),
			},
			output: {
				entryFileNames: "js/[name].min.js",
				chunkFileNames: "js/[name].min.js",
				manualChunks(id) {
					if (id.includes("node_modules")) {
						return "vendor";
					}
				},
				assetFileNames(chunkInfo) {
					if (chunkInfo.name === "vendor_css.css") {
						return "css/vendor.css";
					}
					if (chunkInfo.name.endsWith(".css")) {
						return "css/[name].min.css";
					}
					if (/\.(woff2?|eot|ttf|otf)$/.test(chunkInfo.name)) {
						return "fonts/[name]-[hash][extname]";
					}
					if (/\.(png|jpe?g|gif|svg|ico|webp)$/i.test(chunkInfo.name)) {
						return "img/[name]-[hash][extname]";
					}
					return "assets/[name]-[hash][extname]";
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
