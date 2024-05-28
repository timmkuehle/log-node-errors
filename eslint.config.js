/** @type {import('eslint').Linter.FlatConfig[]} */

import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import eslint from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
	{
		...eslint.configs.recommended,
		...eslintConfigPrettier,
		files: ["**/*.@(t|j)s"],
		languageOptions: {
			globals: globals.node
		},
		rules: {
			"no-unused-vars": "warn"
		}
	},
	{
		files: ["src/**/*.ts"],
		languageOptions: {
			parser: tsParser,
			parserOptions: { project: ["tsconfig.json"] }
		},
		plugins: { "@typescript-eslint": tsPlugin },
		rules: {
			...tsPlugin.configs.recommended.rules,
			"no-undef": "off",
			"@typescript-eslint/no-unused-vars": "warn"
		}
	}
];
