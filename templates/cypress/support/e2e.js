// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

import 'cypress-jest-adapter';

// Enable the hook to match Jest
global.beforeAll = global.before;
global.afterAll = global.after;

// In e2e tests we just need to use jest mocking API
global.jest = {
	fn: global.cy.stub,
	spyOn: global.cy.spy,
};

global.it = it;
global.test = it;
global.it.each = data => (describe, test) => {
	const prs = [];
	for (const d of data) {
		if (Array.isArray(d)) {
			prs.push(global.it(describe, test.bind(undefined, ...d)));
		} else {
			prs.push(global.it(describe, test.bind(undefined, d)));
		}
	}
	return Promise.all(prs);
};
