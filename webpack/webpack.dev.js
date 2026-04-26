const { merge } = require("webpack-merge");
const webpack   = require("webpack");
const common    = require("./webpack.common");

module.exports = merge(common, {
  mode:    "development",
  devtool: "eval-cheap-module-source-map",

  // ── Salida en dev: sin hash → evita acumular archivos en HMR ────────────────
  output: {
    filename:      "js/[name].js",
    chunkFilename: "js/[name].chunk.js",
  },

  // ── Dev Server ───────────────────────────────────────────────────────────────
  devServer: {
    static: {
      directory: common.output.path,
    },
    port:     9000,
    compress: true,
    // Usa el navegador predeterminado del sistema en vez de hardcodear Firefox
    open:     true,

    hot:        true,
    liveReload: false,

    client: {
      overlay: {
        errors:   true,
        warnings: false,
      },
      progress: true,
    },

    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },

  // ── Optimización en dev ──────────────────────────────────────────────────────
  optimization: {
    minimize:  false,
    moduleIds: "named",
    // runtimeChunk heredado de common → HMR funciona correctamente
  },

  // ── Performance: silenciar en dev, solo importa en prod ─────────────────────
  performance: { hints: false },

  // ── Plugins exclusivos de dev ────────────────────────────────────────────────
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
  ],

  // ── CSS en dev: inyectado en <style> para HMR instantáneo ───────────────────
  module: {
    rules: [
      {
        test: /\.(css|scss|sass)$/i,
        use: [
          "style-loader",
          {
            loader:  "css-loader",
            options: { sourceMap: true, importLoaders: 2 },
          },
          {
            loader:  "postcss-loader",
            options: { sourceMap: true },
          },
          {
            loader:  "sass-loader",
            options: {
              sourceMap:   true,
              sassOptions: { quietDeps: true },
            },
          },
        ],
      },
    ],
  },
});
