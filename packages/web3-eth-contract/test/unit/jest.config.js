const base = require('../config/jest.config');

module.exports = {
	...base,
	testMatch: ['<rootDir>/test/unit/**/*.(spec|test).(js|ts)'],

	coverageDirectory: '../../.coverage/unit',
	collectCoverageFrom: ['src/**'],
	collectCoverage: true,
	coverageReporters: [
		[
			'json',
			{
				file: 'web3-eth-contract-unit-coverage.json',
			},
		],
	],
};
