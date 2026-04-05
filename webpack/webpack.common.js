const paths = require("./paths");
const helpers = require("./webpack.helpers");

const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { existsSync } = require("fs");
const { resolve } = require("path");

// Registrar partials Handlebars antes de procesar templates
helpers.registerHandlebarsPartials();

// ─── Assets estáticos a copiar ────────────────────────────────────────────────
const copyPatterns = [
	{ from: paths.img, to: "img", noErrorOnMissing: true },
	{ from: paths.fonts, to: "fonts", noErrorOnMissing: true },
	{
		from: "node_modules/bootstrap-icons/font/fonts",
		to: "fonts",
		noErrorOnMissing: true,
	},
	{
		from: resolve(paths.root, "docs"),
		to: "docs",
		noErrorOnMissing: true,
	},
];

// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
	// ── Entry points ────────────────────────────────────────────────────────────
	entry: helpers.buildEntries(),

	// ── Salida ──────────────────────────────────────────────────────────────────
	output: {
		path: paths.dist,
		filename: "js/[name].min.js",
		publicPath: "/",
		clean: true,            // reemplaza CleanWebpackPlugin (nativo desde webpack 5)
	},

	// ── Cache persistente ────────────────────────────────────────────────────────
	// Guarda el trabajo entre builds en disco → rebuilds hasta 5× más rápidos
	cache: {
		type: "filesystem",
		cacheDirectory: resolve(paths.root, "node_modules/.cache/webpack"),
		buildDependencies: {
			// Invalida cache si cambia cualquier config
			config: [
				__filename,
				resolve(__dirname, "webpack.helpers.js"),
				resolve(__dirname, "paths.js"),
			],
		},
	},

	// ── Performance ─────────────────────────────────────────────────────────────
	performance: { hints: false },

	// ── Optimización ────────────────────────────────────────────────────────────
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				parallel: true,       // usa todos los cores disponibles
				extractComments: false,
				terserOptions: {
					format: { comments: false },
					compress: { drop_console: false },
				},
			}),
			new CssMinimizerPlugin({
				parallel: true,
			}),
		],

		// Extrae vendor (node_modules) en un chunk compartido entre páginas
		// Evita duplicar Bootstrap, jQuery, etc. en cada bundle de página
		splitChunks: {
			chunks: "all",
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendors",
					chunks: "all",
					priority: 10,
				},
			},
		},
	},

	// ── Plugins ─────────────────────────────────────────────────────────────────
	plugins: [
		// Genera un .html por cada .hbs en src/views/pages/
		...helpers.buildHtmlPlugins(),

		// Copia img/, fonts/, docs/ tal cual al dist/
		new CopyWebpackPlugin({ patterns: copyPatterns }),

		// Extrae CSS en archivos separados (solo prod lo usa, pero se declara aquí
		// porque HtmlWebpackPlugin necesita conocer el plugin en common)
		new MiniCssExtractPlugin({
			filename: "css/[name].min.css",
			chunkFilename: "css/[name].min.css",
		}),

		// ELIMINADO: CleanWebpackPlugin  → output.clean: true lo reemplaza
		// ELIMINADO: HotModuleReplacementPlugin → solo va en dev (ver webpack.dev.js)
	],

	// ── Loaders ─────────────────────────────────────────────────────────────────
	module: {
		rules: [
			// JavaScript / JSX
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						cacheDirectory: true,
						presets: [
							["@babel/preset-env", {
								targets: "> 0.25%, not dead",
								useBuiltIns: "usage",
								corejs: 3,
							}],
						],
						// sin plugins: [] — preset-env ya incluye dynamic import
					},
				},
			},

			// Handlebars
			{
				test: /\.(hbs|handlebars)$/,
				loader: "handlebars-loader",
				options: {
					partialDirs: [paths.partials, paths.layouts],
				},
			},

			// Imágenes
			{
				test: /\.(png|jpe?g|gif|svg|ico)$/i,
				type: "asset/resource",
				generator: { filename: "img/[name][ext]" },
			},

			// Fuentes
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: "asset/resource",
				generator: { filename: "fonts/[name][ext]" },
			},
		],
	},

	// ── Resolución de módulos ────────────────────────────────────────────────────
	resolve: {
		modules: [paths.src, "node_modules"],
		extensions: [".js", ".jsx", ".hbs"],
		alias: {
			"@": paths.src,
			assets: paths.public,
		},
	},
};
