const { merge }          = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack            = require("webpack");
const common             = require("./webpack.common");
const paths              = require("./paths");

module.exports = merge(common, {
  mode:    "production",
  devtool: false,          // sin sourcemaps en prod (velocidad + seguridad)

  // ── Salida ───────────────────────────────────────────────────────────────────
  output: {
    path:       paths.dist,
    filename:   "js/[name].min.js",
    publicPath: "",        // rutas relativas para que el HTML funcione en cualquier host
  },

  // ── Plugins exclusivos de prod ────────────────────────────────────────────────
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),

    // NOTA: MiniCssExtractPlugin ya está declarado en common.js para que
    // HtmlWebpackPlugin lo conozca. Aquí solo reemplazamos el loader
    // (style-loader → MiniCssExtractPlugin.loader) via las rules de abajo.
    // No instanciamos el plugin de nuevo para evitar duplicados.
  ],

  // ── CSS en prod: extrae a archivos .css separados ────────────────────────────
  module: {
    rules: [
      {
        test: /\.(css|scss|sass)$/i,
        use: [
          {
            loader:  MiniCssExtractPlugin.loader,
            options: { publicPath: "../" },   // corrige rutas relativas de fuentes/img en CSS
          },
          "css-loader",
          "postcss-loader",
          {
            loader:  "sass-loader",
            options: { sassOptions: { quietDeps: true } },
          },
        ],
      },
    ],
  },

  // ── Performance ──────────────────────────────────────────────────────────────
  performance: {
    hints:                "warning",   // avisa si un asset supera el límite (no bloquea)
    maxEntrypointSize:    512_000,
    maxAssetSize:         512_000,
  },
});
