const base = require('../config/jest.config');

module.exports = {
	...base,
	testMatch: ['<rootDir>/test/unit/**/*.(spec|test).(js|ts)'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	coverageDirectory: '.coverage/unit',
	collectCoverageFrom: ['src/**'],
};
