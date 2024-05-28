/** @type {import('webpack').Configuration} */

import path from "path";
import nodeExternals from "webpack-node-externals";
import NodemonPlugin from "nodemon-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

export default (env, argv) => {
	const { mode } = argv;
	const isProduction = mode === "production";
	const devtool = isProduction ? false : "source-map";

	return {
		mode,
		devtool,
		externalsPresets: { node: true },
		externals: [
			nodeExternals({
				importType: "module"
			})
		],
		entry: "./src/index.ts",
		module: {
			rules: [
				{
					test: /\.(j|t)s$/,
					exclude: /node_modules/,
					use: "ts-loader"
				}
			]
		},
		resolve: { extensions: ["", ".js", ".ts"] },
		output: {
			path: path.resolve("."),
			filename: "index.js",
			library: {
				type: "module"
			}
		},
		plugins: [
			new NodemonPlugin({
				script: "./index.js",
				watch: path.resolve("./index.js"),
				ignore: ["*.js.map"],
				nodeArgs: ["--enable-source-maps"]
			}),
			new CleanWebpackPlugin({
				protectWebpackAssets: false,
				cleanOnceBeforeBuildPatterns: ["./*.js.map"],
				verbose: isProduction
			})
		],
		experiments: {
			outputModule: true
		}
	};
};
