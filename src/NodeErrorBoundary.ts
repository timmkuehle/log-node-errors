interface StackLine {
	function: string;
	file: string;
	line?: number;
	column?: number;
}

type Stack = StackLine[];

interface Error {
	message: string;
	stack?: Stack;
}

export class NodeErrorBoundary {
	private error?: Error;
	private env: "production" | "development";

	constructor() {
		this.env = (process.env.npm_lifecycle_script ?? "").includes(
			"development"
		)
			? "development"
			: "production";
	}

	execute(main: () => void) {
		try {
			main();
		} catch (error) {
			this.formatError(error);
		}
	}

	private formatError(error: unknown) {
		if (!(error instanceof Error)) return;

		this.error = {
			message: error.message,
			stack: error.stack
				?.split("\n")
				.slice(1)
				.map((file) => {
					const fileEnv = file.includes("file:///")
						? "file"
						: file.includes("node:")
							? "node"
							: "webpack";

					const splitter = new RegExp(`\\(?${fileEnv}:\\/{0,2}`);

					const segments = file.replace(/^ *at /, "").split(splitter);

					const position = new RegExp("[0-9]+:[0-9]+(?=\\)$)")
						.exec(segments[1])?.[0]
						.split(":");

					return {
						function: segments[0].replace(/ *$/, ""),
						file:
							fileEnv === "webpack"
								? segments[1]
										.replace(/(:[0-9]+){2}\)/, "")
										.replace(
											new RegExp(
												`^${process.env.npm_package_name ?? ""}`
											),
											process.cwd()
										)
								: segments[1].replace(/(:[0-9]+){2}\)/, ""),
						line: parseInt(position?.[0] ?? "-1"),
						column: parseInt(position?.[1] ?? "-1")
					};
				})
		};

		console.log(this.error);
	}
}
