module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
	},
	parserOptions: {
		ecmaVersion: 2016,
		project: './tsconfig.base.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	extends: ['eslint-config-base-web3/ts'],
	settings: {
		'import/resolver': {
			typescript: {}, // this loads tsconfig.json to eslint
		},
	},
	overrides: [
		{
			files: ['*.test.ts'],
			rules: {
				'@typescript-eslint/no-unsafe-call': 'off',
				'import/no-unresolved': 'off',
			},
		},
		{
			files: ['*.ts'],
			rules: {
				'default-param-last': 'off',
			},
		},
	],
};
