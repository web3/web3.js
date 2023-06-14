module.exports = {
	parserOptions: {
		project: './config/tsconfig.base.json',
		tsconfigRootDir: __dirname,
	},
	extends: ['web3-base/ts-jest'],
};
