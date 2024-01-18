/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
	transform: {
		'^.+\\.(ts|tsx)$': ['ts-jest', { isolatedModules: true, tsconfig: './test/tsconfig.json' }],
	},
};
