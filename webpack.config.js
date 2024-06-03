/** @type {import('webpack').Configuration} */

import path from "path";
import nodeExternals from "webpack-node-externals";
import NodemonPlugin from "nodemon-webpack-plugin";

export default (env, argv) => {
	const { mode } = argv;
	const isProduction = mode === "production";
	const devtool = isProduction ? false : "source-map";
	const commonConfig = {
		mode,
		devtool,
		externalsPresets: { node: true },
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
			path: path.resolve(".", "dist")
		},
		plugins: [
			new NodemonPlugin({
				script: "./dist/index.js",
				watch: path.resolve("./index.js"),
				ignore: ["*.js.map"],
				nodeArgs: ["--enable-source-maps"]
			})
		]
	};

	return [
		{
			...commonConfig,
			externals: [
				nodeExternals({
					importType: "module"
				})
			],
			output: {
				...commonConfig.output,
				filename: "index.js",
				library: {
					type: "module"
				},
				clean: {
					keep: "index.cjs.js"
				}
			},
			experiments: {
				outputModule: true
			}
		},
		{
			...commonConfig,
			externals: [
				nodeExternals({
					importType: "umd"
				})
			],
			output: {
				...commonConfig.output,
				filename: "index.cjs.js",
				library: {
					type: "umd"
				},
				clean: {
					keep: "index.js"
				}
			}
		}
	];
};
