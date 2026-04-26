const paths = require("./paths");
const helpers = require("./webpack.helpers");

const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { resolve } = require("path");

// Registrar partials Handlebars antes de procesar templates
helpers.registerHandlebarsPartials();

// ─── Assets estáticos a copiar ────────────────────────────────────────────────
const copyPatterns = [
	{ from: paths.img,   to: "img",   noErrorOnMissing: true },
	{ from: paths.fonts, to: "fonts", noErrorOnMissing: true },
	{
		from: "node_modules/bootstrap-icons/font/fonts",
		to:   "fonts",
		noErrorOnMissing: true,
	},
	{
		from: resolve(paths.root, "docs"),
		to:   "docs",
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
		// [contenthash] invalida el cache del browser SOLO cuando cambia el contenido
		// → usuarios siempre reciben la versión más reciente sin romper el cache innecesariamente
		filename:   "js/[name].[contenthash:8].min.js",
		publicPath: "/",
		clean: true,
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

	// ── Optimización ────────────────────────────────────────────────────────────
	optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: true,
				extractComments: false,
				terserOptions: {
					format: { comments: false },
					compress: {
						drop_console: true,    // elimina console.* en producción
						drop_debugger: true,   // elimina debugger statements
					},
				},
			}),
			new CssMinimizerPlugin({
				parallel: true,
			}),
		],

		// El runtime (mapa de chunks) en su propio archivo
		// → el hash de vendors NO cambia cuando solo editas app.js
		runtimeChunk: "single",

		// Extrae vendor (node_modules) en un chunk compartido entre páginas
		// Evita duplicar Bootstrap, jQuery, etc. en cada bundle de página
		splitChunks: {
			chunks: "all",
			cacheGroups: {
				vendors: {
					test:     /[\\/]node_modules[\\/]/,
					name:     "vendors",
					chunks:   "all",
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

		// Extrae CSS en archivos separados con hash para cache busting
		new MiniCssExtractPlugin({
			filename:      "css/[name].[contenthash:8].min.css",
			chunkFilename: "css/[name].[contenthash:8].min.css",
		}),
	],

	// ── Loaders ─────────────────────────────────────────────────────────────────
	module: {
		rules: [
			// JavaScript / JSX
			{
				test:    /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						cacheDirectory: true,
						presets: [
							["@babel/preset-env", {
								targets:     "> 0.25%, not dead",
								useBuiltIns: "usage",
								corejs:      3,
							}],
						],
					},
				},
			},

			// Handlebars
			{
				test:   /\.(hbs|handlebars)$/,
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
		modules:    [paths.src, "node_modules"],
		extensions: [".js", ".jsx", ".hbs"],
		alias: {
			"@":     paths.src,
			assets:  paths.public,
		},
		// No seguir symlinks → resolución más rápida (útil con monorepos y npm link)
		symlinks: false,
	},
};
