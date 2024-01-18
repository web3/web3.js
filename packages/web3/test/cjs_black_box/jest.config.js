/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	transform: {
		'^.+\\.(ts|tsx)$': ['ts-jest', { isolatedModules: true, tsconfig: './test/tsconfig.json' }],
	},
};
