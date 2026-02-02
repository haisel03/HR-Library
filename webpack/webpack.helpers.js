const paths = require("./paths");
const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Handlebars = require("handlebars");

/* =====================================================
	 UTILIDAD: REGISTRAR DIRECTORIO COMO PARTIALS
===================================================== */
function registerDirAsPartials(dir, prefix = "") {
	if (!fs.existsSync(dir)) return;

	fs.readdirSync(dir).forEach((file) => {
		if (!file.endsWith(".hbs")) return;

		const name = prefix + path.parse(file).name;
		const template = fs.readFileSync(path.join(dir, file), "utf8");

		Handlebars.registerPartial(name, template);
	});
}

module.exports = {
	/* =====================================================
		 ENTRY POINTS
	===================================================== */
	entry: () => {
		const entryObj = {
			app: path.resolve(paths.js, "app.js"),
		};

		if (fs.existsSync(paths.demos)) {
			fs.readdirSync(paths.demos)
				.filter((file) => file.endsWith(".js"))
				.forEach((file) => {
					const name = path.parse(file).name;
					entryObj[name] = path.resolve(paths.demos, file);
				});
		}

		return entryObj;
	},

	/* =====================================================
		 HTML PLUGINS
	===================================================== */
	html: () => {
		if (!fs.existsSync(paths.pages)) {
			throw new Error(`Directorio no encontrado: ${paths.pages}`);
		}

		return fs
			.readdirSync(paths.pages)
			.filter((file) => file.endsWith(".hbs"))
			.map((file) => {
				const name = path.parse(file).name;
				const jsFile = path.resolve(paths.demos, `${name}.js`);
				//const chunks = fs.existsSync(jsFile) ? ["app", name] : ["app"];
				const chunks = ["app"];
				if (fs.existsSync(jsFile)) {
					chunks.push(name);
				}

				return new HtmlWebpackPlugin({
					filename: `${name}.html`,
					template: path.resolve(paths.pages, file),
					inject: "body",
					scriptLoading: "blocking",
					minify: false,
					chunks,
				});
			});
	},

	/* =====================================================
		 HANDLEBARS: PARTIALS + LAYOUTS
	===================================================== */
	handlebar: () => {
		// Partials normales
		registerDirAsPartials(paths.partials);

		// Layouts como partials (prefijo layout-)
		registerDirAsPartials(paths.layouts, "layout-");
	},
};
