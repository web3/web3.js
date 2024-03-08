/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
	transform: {
		'^.+\\.(ts|tsx)$': [
			'ts-jest',
			{
				tsconfig: '../config/tsconfig.esm.json',
			},
		],
	},
};
