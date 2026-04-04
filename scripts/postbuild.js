const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const nestedPages = path.join(dist, "src", "pages");

/** Copia equivalente a CopyWebpackPlugin en webpack.common.js */
function copyWebpackLikeAssets() {
	const docsSrc = path.join(root, "docs");
	if (fs.existsSync(docsSrc)) {
		fs.cpSync(docsSrc, path.join(dist, "docs"), { recursive: true });
		console.log("postbuild: copiado docs/ → dist/docs/");
	}
	const biFonts = path.join(
		root,
		"node_modules/bootstrap-icons/font/fonts",
	);
	if (fs.existsSync(biFonts)) {
		const destFonts = path.join(dist, "fonts");
		fs.mkdirSync(destFonts, { recursive: true });
		fs.cpSync(biFonts, destFonts, { recursive: true });
		console.log("postbuild: fuentes bootstrap-icons → dist/fonts/");
	}
}

/**
 * HtmlWebpackPlugin emitía `${name}.html` en la raíz de dist.
 * Vite deja los HTML bajo dist/src/pages/; los movemos a dist/ y
 * ajustamos rutas relativas (../../js → js, etc.).
 */
function rewriteAssetPaths(html) {
	return html
		.replace(/\.\.\/\.\.\/js\//g, "js/")
		.replace(/\.\.\/\.\.\/css\//g, "css/")
		.replace(/\.\.\/\.\.\/assets\//g, "assets/")
		.replace(/\.\.\/\.\.\/demos\//g, "demos/");
}

if (fs.existsSync(nestedPages)) {
	for (const file of fs.readdirSync(nestedPages)) {
		if (!file.endsWith(".html")) continue;
		const from = path.join(nestedPages, file);
		const to = path.join(dist, file);
		let html = fs.readFileSync(from, "utf8");
		html = rewriteAssetPaths(html);
		fs.writeFileSync(to, html, "utf8");
		fs.unlinkSync(from);
	}

	let dir = nestedPages;
	while (dir !== dist && dir.startsWith(dist)) {
		try {
			fs.rmdirSync(dir);
		} catch {
			break;
		}
		dir = path.dirname(dir);
	}
	try {
		fs.rmSync(path.join(dist, "src"), { recursive: true, force: true });
	} catch {
		/* ignore */
	}
	console.log("Post-build: HTML en raíz de dist/ (paridad con HtmlWebpackPlugin).");
} else {
	console.warn(
		"postbuild: no se encontró dist/src/pages; ¿falta vite build?",
	);
}

copyWebpackLikeAssets();
