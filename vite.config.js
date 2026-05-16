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
				'  <link rel="stylesheet" crossorigin href="./assets/vendor.css">\n</head>',
			);
		},
	};
}

/** Mueve los <script> de <head> a </body> y limpia JS huérfanos de entries CSS */
function postProcessHtml() {
	return {
		name: "post-process-html",
		apply: "build",
		writeBundle() {
			const dist = path.resolve(__dirname, "dist");
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
				if (!scripts || scripts.length === 0) continue;

				let newHead = headContent;
				const removed = [];
				for (const s of scripts) {
					newHead = newHead.replace(s, "");
					removed.push(s);
				}
				html = html.replace(headContent, newHead);
				html = html.replace("</body>", removed.join("\n") + "\n</body>");
				fs.writeFileSync(file, html, "utf-8");
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
						return "assets/vendor.css";
					}
					if (chunkInfo.name.endsWith(".css")) {
						return "assets/[name]-[hash].css";
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
