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
// TODO For some reason when running this test with a WebSocket provider
// the test takes a long time to run afterAll
import Web3 from 'web3';
import {
	closeOpenConnection,
	getSystemTestProvider,
	isWs,
} from 'web3/test/shared_fixtures/system_tests_utils';
import { validator } from 'web3-validator';

jest.setTimeout(15000);

// TODO Consider adding this to web3.eth.accounts package
const accountSchema = {
	type: 'object',
	required: ['address', 'privateKey'],
	// TODO Should validation functions as well
	// required: ['address', 'privateKey', 'signTransaction', 'sign', 'encrypt'],
	properties: {
		address: { type: 'string' },
		privateKey: { type: 'string' },
	},
};

describe('Black Box Unit Tests - web3.eth.accounts.create', () => {
	let web3: Web3;

	beforeAll(() => {
		web3 = new Web3(getSystemTestProvider());
	});

	afterAll(async () => {
		if (isWs) await closeOpenConnection(web3);
	});

	it('should create an account', () => {
		const response = web3.eth.accounts.create();
		expect(response).toBeDefined();
		expect(response.signTransaction).toBeDefined();
		expect(response.sign).toBeDefined();
		expect(response.encrypt).toBeDefined();
		expect(validator.validateJSONSchema(accountSchema, response)).toBeUndefined();
	});
});
