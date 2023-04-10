/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	globals: {
		'ts-jest': {
			tsconfig: '../config/tsconfig.cjs.json',
		},
	},
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
};
