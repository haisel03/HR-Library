const path = require("path");
const fs = require("fs");
const Handlebars = require("handlebars");
const parseLayoutParams = require("./parseLayoutParams.js");

const root = path.resolve(__dirname, "..");
const paths = {
	views: path.join(root, "src/views"),
	pages: path.join(root, "src/views/pages"),
	partials: path.join(root, "src/views/partials"),
	layouts: path.join(root, "src/views/layouts"),
	demos: path.join(root, "public/demos"),
	output: path.join(root, "src/pages"),
};

function registerPartials(dir, prefix = "") {
	if (!fs.existsSync(dir)) return;

	fs.readdirSync(dir)
		.filter((file) => file.endsWith(".hbs"))
		.forEach((file) => {
			const name = prefix + path.parse(file).name;
			const template = fs.readFileSync(path.join(dir, file), "utf8");
			Handlebars.registerPartial(name, template);
		});
}

function createOutputDir(dir) {
	fs.rmSync(dir, { recursive: true, force: true });
	fs.mkdirSync(dir, { recursive: true });
}

function generatePage(file) {
	const name = path.parse(file).name;
	const template = fs.readFileSync(path.join(paths.pages, file), "utf8");
	const context = parseLayoutParams(template);
	const compiled = Handlebars.compile(template)(context);

	const scriptTags = ['<script type="module" src="../js/app.js"></script>'];

	if (fs.existsSync(path.join(paths.demos, `${name}.js`))) {
		// Ruta absoluta desde la raíz del sitio: demos viven en public/demos (Vite los sirve en /demos/)
		scriptTags.push(`<script type="module" src="/demos/${name}.js"></script>`);
	}

	// Robust script injection: insert before last </body> or </html> or append
	let html = compiled;
	const scriptsBlock = scriptTags.join("\n    ") + "\n";
	const lastBodyMatch = html.lastIndexOf("</body>");
	if (lastBodyMatch !== -1) {
		html = html.slice(0, lastBodyMatch) + scriptsBlock + html.slice(lastBodyMatch);
	} else {
		const lastHtmlMatch = html.lastIndexOf("</html>");
		if (lastHtmlMatch !== -1) {
			html = html.slice(0, lastHtmlMatch) + scriptsBlock + html.slice(lastHtmlMatch);
		} else {
			html += scriptsBlock;
		}
	}
	fs.writeFileSync(path.join(paths.output, `${name}.html`), html, "utf8");
}

function generateAllPages() {
	registerPartials(paths.partials);
	registerPartials(paths.layouts);

	createOutputDir(paths.output);

	if (!fs.existsSync(paths.pages)) {
		throw new Error(`No se encontró el directorio de páginas: ${paths.pages}`);
	}

	const pageFiles = fs
		.readdirSync(paths.pages)
		.filter((file) => file.endsWith(".hbs"));
	pageFiles.forEach(generatePage);

	console.log(`Generadas ${pageFiles.length} páginas con scripts en ${paths.output}`);
}

generateAllPages();
