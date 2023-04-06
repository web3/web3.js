const base = require('../config/jest.config');

module.exports = {
	...base,
	testMatch: ['<rootDir>/test/unit/**/*.(spec|test).(js|ts)'],

	coverageDirectory: '../../.coverage/unit',
	collectCoverageFrom: ['src/**/*.ts'],
	collectCoverage: true,
	coverageReporters: [
		[
			'json',
			{
				file: 'web3-eth-accounts-unit-coverage.json',
			},
		],
	],
};
