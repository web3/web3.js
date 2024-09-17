module.exports = {
	env: {
		node: true,
		commonjs: true,
		es2021: true,
	},
	parserOptions: {
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
		ecmaVersion: 12,
	},
};
