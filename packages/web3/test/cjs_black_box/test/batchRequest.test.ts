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
/* eslint-disable import/no-relative-packages */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
	getSystemTestProvider,
	closeOpenConnection,
	isWs,
} from '../../shared_fixtures/system_tests_utils';
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const Web3 = require('web3').default;

describe('CJS - Black Box Unit Tests - web3.BatchRequest', () => {
	let web3: typeof Web3;

	beforeAll(() => {
		web3 = new Web3(getSystemTestProvider());
	});

	afterAll(async () => {
		if (isWs) await closeOpenConnection(web3);
	});

	it('should make a batch request', async () => {
		const request1 = {
			id: 42,
			method: 'eth_getBalance',
			params: ['0x4242000000000000000000000000000000000000', 'latest'],
		};
		const request2 = {
			id: 24,
			method: 'eth_getBalance',
			params: ['0x2424000000000000000000000000000000000000', 'latest'],
		};

		const batch = new web3.BatchRequest();
		const request1Promise = batch.add(request1);
		const request2Promise = batch.add(request2);

		const executePromise = batch.execute();
		const response = await Promise.all([request1Promise, request2Promise, executePromise]);

		const expectedResponse = [
			'0x0',
			'0x0',
			[
				{ jsonrpc: '2.0', id: 42, result: '0x0' },
				{ jsonrpc: '2.0', id: 24, result: '0x0' },
			],
		];
		expect(response).toStrictEqual(expectedResponse);
	});
});
