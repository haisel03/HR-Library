const path = require("path");

const ROOT = path.resolve(__dirname, "../");

module.exports = {
  root: ROOT,

  // Build
  dist: path.join(ROOT, "dist"),

  // Source
  src: path.join(ROOT, "src"),
  js: path.join(ROOT, "src/js"),
  scss: path.join(ROOT, "src/scss"),

  // Views (Handlebars)
  views: path.join(ROOT, "src/views"),
  pages: path.join(ROOT, "src/views/pages"),
  layouts: path.join(ROOT, "src/views/layouts"),
  partials: path.join(ROOT, "src/views/partials"),

  // Public assets
  public: path.join(ROOT, "public"),
  demos: path.join(ROOT, "public/demos"),
  img: path.join(ROOT, "public/img"),
  fonts: path.join(ROOT, "public/fonts"),
};
