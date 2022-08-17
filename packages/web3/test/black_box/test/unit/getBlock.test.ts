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
import Web3 from 'web3';
import { validator } from 'web3-validator';
import { blockSchema } from 'web3-eth';

import { getSystemTestBackend } from '../../../shared_fixtures/system_tests_utils';

export const describeIf = (condition: (() => boolean) | boolean) =>
	(typeof condition === 'function' ? condition() : condition) ? describe : describe.skip;

describeIf(getSystemTestBackend() === 'http')('Black Box Unit Tests - HTTP - getBlock', () => {
	let web3: Web3;

	beforeAll(() => {
		web3 = new Web3('http://localhost:8545');
	});

	it('should get the latest block and validate it against blockSchema', async () => {
		expect(validator.validateJSONSchema(blockSchema, await web3.eth.getBlock('latest')));
	});
});

describeIf(getSystemTestBackend() === 'ws')('Black Box Unit Tests - WS - getBlock', () => {
	let web3: Web3;

	beforeAll(async () => {
		web3 = new Web3('ws://localhost:8545');

        let status = '';
        while (status !== 'connected') {
            console.log(web3.provider);
        }
	});

	it('should get the latest block and validate it against blockSchema', async () => {
		expect(validator.validateJSONSchema(blockSchema, await web3.eth.getBlock('latest')));
	});
});
