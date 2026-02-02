const paths = require("./paths");
const helpers = require("./webpack.helpers");

const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

// Registrar partials Handlebars (IMPORTANTE)
helpers.handlebar();

module.exports = {
	entry: helpers.entry(),

	output: {
		path: paths.dist,
		filename: "js/[name].min.js",
		publicPath: "/",
		clean: true,
	},

	performance: {
		hints: false,
	},

	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: false,
				terserOptions: {
					format: { comments: false },
				},
			}),
			new CssMinimizerPlugin(),
		],
	},

	plugins: [
		...helpers.html(),

		new CleanWebpackPlugin(),

		new CopyWebpackPlugin({
			patterns: [
				{ from: paths.img, to: "img" },
				{ from: paths.fonts, to: "fonts" },
				{ from: "node_modules/bootstrap-icons/font/fonts", to: "fonts" },
				{
					from: "docs",
					to: "docs",
					noErrorOnMissing: true,
				},
			],
		}),

		new MiniCssExtractPlugin({
			filename: "css/[name].min.css",
			chunkFilename: "css/[name].min.css",
		}),

		new webpack.HotModuleReplacementPlugin(),
	],

	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
			},
			{
				test: /\.(hbs|handlebars)$/,
				loader: "handlebars-loader",
				options: {
					partialDirs: [
						paths.partials,
						paths.layouts
					],
				},
			},

			{
				test: /\.(png|jpe?g|gif|svg|ico)$/i,
				type: "asset/resource",
				generator: {
					filename: "img/[name][ext]",
				},
			},

			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: "asset/resource",
				generator: {
					filename: "fonts/[name][ext]",
				},
			},
		],
	},

	resolve: {
		modules: [paths.src, "node_modules"],
		extensions: [".js", ".jsx", ".hbs"],
		alias: {
			"@": paths.src,
			assets: paths.public,
		},
	},
};
