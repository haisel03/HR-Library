const path = require("path");

// Raíz del proyecto (un nivel arriba de /config o donde vivan estos archivos)
const ROOT = path.resolve(__dirname, "../");

module.exports = {
  root: ROOT,

  // ── Build ────────────────────────────────────────────────────────────────────
  dist: path.join(ROOT, "dist"),

  // ── Fuentes ──────────────────────────────────────────────────────────────────
  src:  path.join(ROOT, "src"),
  js:   path.join(ROOT, "src/js"),
  scss: path.join(ROOT, "src/scss"),

  // ── Vistas (Handlebars) ───────────────────────────────────────────────────────
  views:    path.join(ROOT, "src/views"),
  pages:    path.join(ROOT, "src/views/pages"),
  layouts:  path.join(ROOT, "src/views/layouts"),
  partials: path.join(ROOT, "src/views/partials"),

  // ── Assets públicos ───────────────────────────────────────────────────────────
  public: path.join(ROOT, "public"),
  demos:  path.join(ROOT, "public/demos"),
  img:    path.join(ROOT, "public/img"),
  fonts:  path.join(ROOT, "public/fonts"),
};
