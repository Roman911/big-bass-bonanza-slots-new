const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { SourceMapDevToolPlugin, ProvidePlugin } = require("webpack")
const path = require("path");
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");
const HtmlInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;

let mode = "production";

if (process.env.NODE_ENV === "production") {
	mode = "production";
}
console.log(mode + " mode");

module.exports = {
	mode: mode,
	output: {
		filename: "[name].[contenthash].js",
		assetModuleFilename: "assets/[name][ext][query]",
		clean: true,
	},
	devtool: mode === "development" ? "source-map" : false,
	optimization: {
		splitChunks: false,
		runtimeChunk: false,
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].[contenthash].css",
		}),
		new HtmlWebpackPlugin({
			template: "./src/index.html",
		}),
		// У dev залишимо мапи, у prod devtool=false -> не створюються окремі файли
		// new SourceMapDevToolPlugin(), // якщо ввімкнути — з’являться додаткові файли
		new ProvidePlugin({ PIXI: 'pixi.js' }),
		new HtmlInlineScriptPlugin(), // інлайнить <script> у HTML
		new HtmlInlineCSSWebpackPlugin({ leaveCSSFile: false }), // інлайнить CSS і видаляє .css файли
	],
	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: "html-loader",
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					mode === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [
									[
										"postcss-preset-env",
										{
											// Options
										},
									],
								],
							},
						},
					},
					"sass-loader",
				],
			},
			{
				test: /\.(png|svg|jpe?g|gif)$/i,
				type: "asset/inline",
			},
			{
				test: /\.(ogg|mp3|wav)$/i,
				type: "asset/inline",
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/inline',
			},
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
			},
		],
	},
};
