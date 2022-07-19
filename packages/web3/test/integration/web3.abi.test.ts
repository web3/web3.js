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

import { validEncodeParametersData } from '../shared_fixtures/data';
import {
	getSystemTestProvider,
	waitForOpenConnection,
	closeOpenConnection,
} from '../shared_fixtures/system_tests_utils';
import Web3 from '../../src/index';

describe('web3.abi', () => {
	let clientUrl: string;
	let web3: Web3;

	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
		web3 = new Web3(clientUrl);

		await waitForOpenConnection(web3);
	});

	afterAll(async () => {
		await closeOpenConnection(web3);
	});

	it('hash correctly', () => {
		const validData = validEncodeParametersData[0];

		const encodedParameters = web3.eth.abi.encodeParameters(
			validData.input[0],
			validData.input[1],
		);
		expect(encodedParameters).toEqual(validData.output);
	});
});
