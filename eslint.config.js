import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

/** @type {import("typescript-eslint").ConfigWithExtends[]} */
export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		...eslintConfigPrettier,
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: { project: ["tsconfig.json"] },
			globals: globals.node
		},
		rules: {
			"no-undef": "off",
			"@typescript-eslint/no-unused-vars": "warn"
		}
	},
	{
		files: ["**/*.{js,cjs,mjs,d.ts}"],
		...tseslint.configs.disableTypeChecked,
		rules: {
			...tseslint.configs.disableTypeChecked.rules,
			"no-undef": "error",
			"no-unused-vars": "warn"
		}
	},
	{
		files: ["dist/**/*.{js,cjs,mjs,d.ts}"],
		rules: {
			"@typescript-eslint/no-unused-expressions": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"no-unused-vars": "off"
		}
	}
);
