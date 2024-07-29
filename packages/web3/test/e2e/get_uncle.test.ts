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
import { Numbers } from 'web3-types';

import Web3 from '../../src';
import { getSystemE2ETestProvider } from './e2e_utils';
import {
	closeOpenConnection,
	getSystemTestBackend,
	BACKEND,
} from '../shared_fixtures/system_tests_utils';
import { toAllVariants } from '../shared_fixtures/utils';
import { mainnetBlockData } from './fixtures/mainnet';
import { sepoliaBlockData } from './fixtures/sepolia';

describe(`${getSystemTestBackend()} tests - getUncle`, () => {
	const provider = getSystemE2ETestProvider();
	const blockData =
		getSystemTestBackend() === BACKEND.SEPOLIA ? sepoliaBlockData : mainnetBlockData;

	let web3: Web3;

	beforeAll(() => {
		web3 = new Web3(provider);
	});

	afterAll(async () => {
		await closeOpenConnection(web3);
	});

	it.each(
		toAllVariants<{
			block: 'earliest' | 'latest' | 'pending' | 'finalized' | 'safe';
			uncleIndex: Numbers;
		}>({
			block: ['earliest', 'latest', 'pending', 'safe', 'finalized'],
			uncleIndex: ['0x1', '1', 1, BigInt(1)],
		}),
	)('getUncle', async ({ block, uncleIndex }) => {
		// TODO Returns Position Index is incorrect RPC error
		// when the client is Nethermind, but not Geth
		const result = await web3.eth.getUncle(blockData[block], uncleIndex);

		// eslint-disable-next-line no-null/no-null
		expect(result).toBeNull();
	});
});
