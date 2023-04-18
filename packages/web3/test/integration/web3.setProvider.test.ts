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

import Web3 from '../../src/index';
import {
	closeOpenConnection,
	describeIf,
	getSystemTestProviderUrl,
	isHttp,
	isWs,
	waitForOpenConnection,
} from '../shared_fixtures/system_tests_utils';

describeIf(isWs || isHttp)('web3.contract.setProvider', () => {
	let clientUrl: string;
	let secontUrl: string;
	let web3: Web3;

	beforeAll(async () => {
		clientUrl = getSystemTestProviderUrl();
		secontUrl = clientUrl.startsWith('http')
			? clientUrl.replace('http', 'ws')
			: clientUrl.replace('ws', 'http');
		web3 = new Web3(clientUrl);

		await waitForOpenConnection(web3);
	});

	afterAll(async () => {
		await closeOpenConnection(web3);
	});

	test('create few contracts and check providers', () => {
		const c1 = new web3.eth.Contract([]);
		const c2 = new web3.eth.Contract([]);

		expect(c1.provider).toBe(web3.provider);
		expect(c2.provider).toBe(web3.provider);
	});

	test('create few contracts and check providers. set different provider', () => {
		const c1 = new web3.eth.Contract([]);
		const c2 = new web3.eth.Contract([]);

		expect(c1.provider).toBe(web3.provider);
		expect(c2.provider).toBe(web3.provider);

		web3.setProvider(secontUrl);

		expect(c1.provider).toBe(web3.provider);
		expect(c2.provider).toBe(web3.provider);
	});

	test('create few contracts, set different provider to contract and check other contract', () => {
		const c1 = new web3.eth.Contract([]);
		const c2 = new web3.eth.Contract([]);

		expect(c1.provider).toBe(web3.provider);
		expect(c2.provider).toBe(web3.provider);

		c1.setProvider(secontUrl);

		expect(c1.provider).toBe(web3.provider);
		expect(c2.provider).toBe(web3.provider);
	});
});
