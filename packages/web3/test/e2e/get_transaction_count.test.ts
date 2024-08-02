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
import Web3 from '../../src';
import { getSystemE2ETestProvider, getE2ETestAccountAddress } from './e2e_utils';
import {
	closeOpenConnection,
	getSystemTestBackend,
	BACKEND,
} from '../shared_fixtures/system_tests_utils';
import { toAllVariants } from '../shared_fixtures/utils';
import { sepoliaBlockData } from './fixtures/sepolia';
import { mainnetBlockData } from './fixtures/mainnet';

describe(`${getSystemTestBackend()} tests - getTransactionCount`, () => {
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
			block:
				| 'earliest'
				| 'latest'
				| 'pending'
				| 'finalized'
				| 'safe'
				| 'blockHash'
				| 'blockNumber';
		}>({
			block: [
				'earliest',
				'latest',
				'pending',
				'safe',
				'finalized',
				'blockHash',
				'blockNumber',
			],
		}),
	)('getTransactionCount', async ({ block }) => {
		const result = await web3.eth.getTransactionCount(
			getE2ETestAccountAddress(),
			blockData[block],
		);

		if (block === 'blockHash' || block === 'blockNumber') {
			const expectedTxCount =
				getSystemTestBackend() === BACKEND.SEPOLIA ? BigInt(1) : BigInt(11);
			// eslint-disable-next-line jest/no-conditional-expect
			expect(result).toBe(expectedTxCount);
		} else {
			// eslint-disable-next-line jest/no-conditional-expect
			expect(typeof result).toBe('bigint');
		}
	});
});
