/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

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
