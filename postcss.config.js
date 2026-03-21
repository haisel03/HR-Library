module.exports = {
  plugins: [
    require("autoprefixer"),
    require("postcss-preset-env")({
      stage: 3,
      autoprefixer: false, // evitar que corra dos veces (autoprefixer ya está arriba)
    }),
  ],
};
