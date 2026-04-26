const { merge }           = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack             = require("webpack");
const common              = require("./webpack.common");
const paths               = require("./paths");

module.exports = merge(common, {
  mode:    "production",
  // hidden-source-map: genera el mapa pero NO lo enlaza en el JS
  // → stack traces legibles en tu servidor de errores (Sentry, etc.)
  //   sin exponer el código fuente al usuario final
  // Usa false si prefieres sin sourcemaps en absoluto.
  devtool: "hidden-source-map",

  // ── Salida ───────────────────────────────────────────────────────────────────
  // publicPath vacío → rutas relativas: el HTML funciona en cualquier host/carpeta
  output: {
    path:       paths.dist,
    publicPath: "",
  },

  // ── Plugins exclusivos de prod ────────────────────────────────────────────────
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
  ],

  // ── CSS en prod: extrae a archivos .css separados con hash ──────────────────
  module: {
    rules: [
      {
        test: /\.(css|scss|sass)$/i,
        use: [
          {
            loader:  MiniCssExtractPlugin.loader,
            // Corrige rutas relativas de fuentes/img dentro del CSS
            options: { publicPath: "../" },
          },
          "css-loader",
          "postcss-loader",
          {
            loader:  "sass-loader",
            options: {
              sassOptions: {
                quietDeps: true,
                silenceDeprecations: ["import", "global-builtin", "color-functions"],
              },
            },
          },
        ],
      },
    ],
  },

  // ── Performance ──────────────────────────────────────────────────────────────
  performance: {
    hints:             "warning",
    // Este proyecto distribuye demos y librerías UI pesadas; mantenemos hints
    // solo para JS/CSS generados y con umbrales acordes al tamaño real del bundle.
    assetFilter:       (assetFilename) => /\.(js|css)$/i.test(assetFilename),
    maxEntrypointSize: 6_000_000,
    maxAssetSize:      1_000_000,
  },
});
