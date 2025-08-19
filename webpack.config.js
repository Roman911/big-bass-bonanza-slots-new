const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ProvidePlugin } = require("webpack");
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
		publicPath: "",
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
			inject: "body",
			scriptLoading: "blocking",
			chunks: "all", // важливо: включити ВСІ чанки у HTML
		}),
		new ProvidePlugin({ PIXI: "pixi.js" }),
		new HtmlInlineScriptPlugin(), // інлайнить усі <script> з HtmlWebpackPlugin
		new HtmlInlineCSSWebpackPlugin({ leaveCSSFile: false }), // інлайнить CSS і видаляє файли
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
				type: "asset/inline",
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
