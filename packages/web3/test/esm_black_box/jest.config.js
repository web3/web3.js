/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
	globals: {
		'ts-jest': {
			tsconfig: '../config/tsconfig.esm.json',
		},
	},
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
};
