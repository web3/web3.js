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

/* eslint-disable @typescript-eslint/no-unsafe-call */
import { JsonRpcOptionalRequest } from 'web3-common';

import { httpStringProvider, accounts } from '../fixtures/config';
import { Web3 } from '../../src/index';

describe('Batch Request', () => {
	let request1: JsonRpcOptionalRequest;
	let request2: JsonRpcOptionalRequest;
	beforeEach(() => {
		request1 = {
			id: 10,
			method: 'eth_getBalance',
			params: [accounts[0].address, 'latest'],
		};
		request2 = {
			id: 11,
			method: 'eth_getBalance',
			params: [accounts[1].address, 'latest'],
		};
	});

	it('should execute batch requests', async () => {
		const web3 = new Web3(httpStringProvider);

		const batch = new web3.BatchRequest();

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		batch.add(request1);
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		batch.add(request2);
		const response = await batch.execute();

		// todo need to expose expect in browser and not call jasmine
		const arrayContaining = expect.arrayContaining ?? jasmine.arrayContaining;
		const objectContaining = expect.objectContaining ?? jasmine.objectContaining;
		const stringMatching = expect.stringMatching ?? jasmine.stringMatching;
		expect(response).toEqual(
			arrayContaining([
				objectContaining({
					id: request1.id,
					result: stringMatching(/0[xX][0-9a-fA-F]+/),
				}),
				objectContaining({
					id: request2.id,
					result: stringMatching(/0[xX][0-9a-fA-F]+/),
				}),
			]),
		);
	});
});
