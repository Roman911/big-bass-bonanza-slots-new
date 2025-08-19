const path = require("path");
const HtmlBundlerPlugin = require("html-bundler-webpack-plugin");

let mode = "production";
console.log(mode + " mode");

module.exports = {
	mode: mode,
	devtool: mode === "development" ? "inline-source-map" : false,
	output: {
		path: path.resolve(__dirname, "dist"),
		clean: true,
		publicPath: ""
	},
	optimization: {
		splitChunks: false,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	plugins: [
		new HtmlBundlerPlugin({
			entry: "src/",
			js: {
				inline: true,
				// Додаємо налаштування для чанків
				chunk: {
					// Відключаємо створення окремого файлу для вендорів (бібліотек)
					vendor: false,
				},
			},
			css: {
				inline: true,
			},
		}),
	],
	module: {
		rules: [
			// Правило для HTML, яке використовує лоадер самого плагіна
			{
				test: /\.html$/,
				loader: HtmlBundlerPlugin.loader,
			},
			// Правила для стилів з повним ланцюжком лоадерів
			{
				test: /\.(s?css)$/,
				use: ["css-loader", "postcss-loader", "sass-loader"],
			},
			// Правило для ресурсів (зображення, шрифти, звуки)
			{
				test: /\.(png|svg|jpe?g|gif|ico|webp|woff|woff2|eot|ttf|otf|mp3|ogg|wav)$/i,
				type: "asset/inline",
			},
			// Правило для JS
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
	// Налаштування для dev-сервера
	devServer: {
		static: path.resolve(__dirname, "dist"),
		watchFiles: ["src/**/*.*"],
		hot: true,
	},
};
