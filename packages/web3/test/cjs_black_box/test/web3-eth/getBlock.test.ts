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
import { validator } from 'web3-validator';
import { blockSchema } from 'web3-eth';
import {
	closeOpenConnection,
	getSystemTestProvider,
	isWs,
	// eslint-disable-next-line import/no-relative-packages
} from '../../../shared_fixtures/system_tests_utils';
/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const Web3 = require('web3').default;

describe('CJS - Black Box Unit Tests - web3.eth.getBlock', () => {
	let web3: typeof Web3;

	beforeAll(() => {
		web3 = new Web3(getSystemTestProvider());
	});

	afterAll(async () => {
		if (isWs) await closeOpenConnection(web3);
	});

	it('should get the latest block and validate it against blockSchema', async () => {
		const response = await web3.eth.getBlock('latest');
		expect(response).toBeDefined();
		expect(validator.validateJSONSchema(blockSchema, response)).toBeUndefined();
	});

	it('should get the latest block and validate it against blockSchema - hydrated = true', async () => {
		const response = await web3.eth.getBlock('latest', true);
		expect(response).toBeDefined();
		expect(validator.validateJSONSchema(blockSchema, response)).toBeUndefined();
	});
});
