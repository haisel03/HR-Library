const { merge }  = require("webpack-merge");
const webpack    = require("webpack");
const common     = require("./webpack.common");

module.exports = merge(common, {
  mode:    "development",
  devtool: "eval-cheap-module-source-map",  // más rápido que inline-source-map,
                                             // igual de legible en dev

  // ── Dev Server ───────────────────────────────────────────────────────────────
  devServer: {
    static: {
      directory: common.output.path,
    },
    port:               9000,
    compress:           true,
    historyApiFallback: true,
    open: { app: { name: "firefox" } },

    // Evita que cada guardado recargue toda la página;
    // solo recarga si HMR no puede aplicar el cambio
    hot:    true,
    liveReload: false,

    client: {
      overlay: {
        errors:   true,
        warnings: false,
      },
      // Muestra progreso de compilación en el navegador
      progress: true,
    },

    // Cabeceras útiles para desarrollo local
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },

  // ── Optimización en dev ──────────────────────────────────────────────────────
  optimization: {
    // En dev no minificamos; solo necesitamos que los módulos
    // tengan IDs estables para que HMR funcione bien
    minimize:      false,
    moduleIds:     "named",
    runtimeChunk: "single",
  },

  // ── Plugins exclusivos de dev ────────────────────────────────────────────────
  plugins: [
    // Muestra nombres de módulos en el overlay de errores
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
          "style-loader",       // inyecta estilos en el DOM → HMR de CSS sin reload
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
