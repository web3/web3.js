module.exports = {
	parserOptions: {
		project: './tsconfig.base.json',
		tsconfigRootDir: __dirname,
	},
	extends: ['eslint-config-base-web3/ts-jest'],
};
