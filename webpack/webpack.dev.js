const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const open = require("open");

module.exports = merge(common, {
	mode: "development",

	devtool: "inline-source-map",

	devServer: {
		static: {
			directory: common.output.path,
		},
		historyApiFallback: true,
		compress: true,
		port: 9000,

		client: {
			overlay: {
				errors: true,
				warnings: false,
			},
		},

		setupMiddlewares: (middlewares, devServer) => {
			const port = devServer.options.port;
			open(`http://localhost:${port}`, { app: { name: "firefox" } });
			return middlewares;
		},
	},

	module: {
		rules: [
			{
				test: /\.(css|scss|sass)$/i,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							sourceMap: true,
							importLoaders: 2,
						},
					},
					{
						loader: "postcss-loader",
						options: {
							sourceMap: true,
						},
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: true,
							sassOptions: {
								quietDeps: true,
							},
						},
					},
				],
			},
		],
	},
});
