import path from "path";
import nodeExternals from "webpack-node-externals";
import BundleDeclarationsWebpackPlugin from "bundle-declarations-webpack-plugin";
import NodemonPlugin from "nodemon-webpack-plugin";

/** @type {(env: any, argv: any) => import('webpack').Configuration | import('webpack').Configuration[]} */
export default (env, argv) => {
	const { mode } = argv;
	const isProduction = mode === "production";
	const devtool = isProduction ? false : "source-map";

	/** @type {import('webpack').Configuration} */
	const baseConfig = {
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
				watch: [path.resolve("./dist/index.js")],
				ignore: ["*.js.map"],
				nodeArgs: ["--enable-source-maps"]
			})
		]
	};

	/** @type {import('webpack').Configuration} */
	const mjsConfig = {
		...baseConfig,
		externals: [nodeExternals({ importType: "module" })],
		output: {
			...baseConfig.output,
			filename: "index.js",
			library: { type: "module" },
			clean: isProduction ? { keep: "index.cjs" } : true
		},
		experiments: {
			outputModule: true
		}
	};

	/** @type {import('webpack').Configuration} */
	const cjsConfig = {
		...baseConfig,
		externals: [nodeExternals({ importType: "commonjs" })],
		output: {
			...baseConfig.output,
			filename: "index.cjs",
			library: {
				type: "commonjs2"
			},
			clean: {
				keep: /^(index.js|.+\.d\.ts)$/
			}
		}
	};

	return isProduction
		? [
				{
					...mjsConfig,
					plugins: [
						...baseConfig.plugins,
						new BundleDeclarationsWebpackPlugin.default()
					]
				},
				cjsConfig
			]
		: mjsConfig;
};
