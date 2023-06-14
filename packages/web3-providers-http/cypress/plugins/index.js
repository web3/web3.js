/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const webpackPreprocessor = require('@cypress/webpack-preprocessor');
const webpackOptions = require('../webpack.config.js');

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
	on('file:preprocessor', webpackPreprocessor({ webpackOptions }));

	config.env.WEB3_SYSTEM_TEST_ENV = process.env.WEB3_SYSTEM_TEST_ENV;
	config.env.WEB3_SYSTEM_TEST_BACKEND = process.env.WEB3_SYSTEM_TEST_BACKEND;
	config.env.WEB3_SYSTEM_TEST_MNEMONIC = process.env.WEB3_SYSTEM_TEST_MNEMONIC;
	config.env.WEB3_SYSTEM_TEST_PORT = process.env.WEB3_SYSTEM_TEST_PORT;
	config.env.WEB3_SYSTEM_TEST_PROVIDER = process.env.WEB3_SYSTEM_TEST_PROVIDER;
	config.env.WEB3_SYSTEM_TEST_ENGINE = process.env.WEB3_SYSTEM_TEST_ENGINE;

	return config;
};
