const paths           = require("./paths");
const path            = require("path");
const fs              = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Handlebars      = require("handlebars");

/* ─────────────────────────────────────────────────────────────────────────────
   UTILIDAD INTERNA: registra todos los .hbs de un directorio como partials
   Se llama una sola vez al arrancar webpack (no en cada compilación).
───────────────────────────────────────────────────────────────────────────── */
function registerDirAsPartials(dir, prefix = "") {
  if (!fs.existsSync(dir)) return;

  fs.readdirSync(dir)
    .filter((file) => file.endsWith(".hbs"))
    .forEach((file) => {
      const name     = prefix + path.parse(file).name;
      const template = fs.readFileSync(path.join(dir, file), "utf8");
      Handlebars.registerPartial(name, template);
    });
}

module.exports = {
  /* ───────────────────────────────────────────────────────────────────────────
     buildEntries()
     Lee src/js/app.js como entry principal y agrega uno por cada
     .js encontrado en public/demos/ (si el directorio existe).
  ─────────────────────────────────────────────────────────────────────────── */
  buildEntries() {
    const entries = {
      app: path.resolve(paths.js, "app.js"),
    };

    if (fs.existsSync(paths.demos)) {
      fs.readdirSync(paths.demos)
        .filter((file) => file.endsWith(".js"))
        .forEach((file) => {
          const name     = path.parse(file).name;
          entries[name]  = path.resolve(paths.demos, file);
        });
    }

    return entries;
  },

  /* ───────────────────────────────────────────────────────────────────────────
     buildHtmlPlugins()
     Genera un HtmlWebpackPlugin por cada .hbs en src/views/pages/.
     Si existe un demo JS con el mismo nombre que la página, lo incluye
     como chunk adicional (ej: index.hbs → chunks: ["vendors", "app", "index"]).
  ─────────────────────────────────────────────────────────────────────────── */
  buildHtmlPlugins() {
    if (!fs.existsSync(paths.pages)) {
      throw new Error(`[webpack.helpers] Directorio de páginas no encontrado: ${paths.pages}`);
    }

    return fs
      .readdirSync(paths.pages)
      .filter((file) => file.endsWith(".hbs"))
      .map((file) => {
        const name    = path.parse(file).name;
        const demoJs  = path.resolve(paths.demos, `${name}.js`);

        // "vendors" siempre primero si splitChunks lo genera;
        // luego el entry principal y, si existe, el demo específico de la página
        const chunks  = ["vendors", "app"];
        if (fs.existsSync(demoJs)) chunks.push(name);

        return new HtmlWebpackPlugin({
          filename:      `${name}.html`,
          template:      path.resolve(paths.pages, file),
          inject:        "body",
          scriptLoading: "blocking",
          minify:        false,
          chunks,
          // Orden estricto: vendors → app → demo (si existe)
          chunksSortMode: "manual",
        });
      });
  },

  /* ───────────────────────────────────────────────────────────────────────────
     registerHandlebarsPartials()
     Registra partials y layouts una sola vez al iniciar webpack.
     - src/views/partials/*.hbs  → {{> nombre}}
     - src/views/layouts/*.hbs   → {{> layout-nombre}}
  ─────────────────────────────────────────────────────────────────────────── */
  registerHandlebarsPartials() {
    registerDirAsPartials(paths.partials);
    registerDirAsPartials(paths.layouts, "layout-");
  },
};
