import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ['*.{js,ts,mjs,cjs,ts,tsx}'] },
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	eslintPluginPrettierRecommended,
	...tseslint.configs.recommended,
];
