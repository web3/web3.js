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
import Web3, { Numbers } from '../../../src';
import {
	getDeployedStorageContractAddress,
	getSystemE2ETestProvider,
	getE2ETestAccountAddress,
} from '../e2e_utils';
import {
	closeOpenConnection,
	getSystemTestBackend,
} from '../../shared_fixtures/system_tests_utils';
import { toAllVariants } from '../../shared_fixtures/utils';

describe(`${getSystemTestBackend()} tests - getStorageAt`, () => {
	const provider = getSystemE2ETestProvider();
	const blockData: {
		earliest: 'earliest';
		latest: 'latest';
		pending: 'pending';
		finalized: 'finalized';
		safe: 'safe';
		blockNumber: number;
		blockHash: string;
	} = {
		earliest: 'earliest',
		latest: 'latest',
		pending: 'pending',
		finalized: 'finalized',
		safe: 'safe',
		blockNumber: 3240768,
		blockHash: '0xe5e66eab79bf9236eface52c33ecdbad381069e533dc70e3f54e2f7727b5f6ca',
	};

	let web3: Web3;

	beforeAll(() => {
		web3 = new Web3(provider);
	});

	afterAll(async () => {
		await closeOpenConnection(web3);
	});

	it.each(
		toAllVariants<{
			storageSlot: Numbers;
			block:
				| 'earliest'
				| 'latest'
				| 'pending'
				| 'finalized'
				| 'safe'
				| 'blockHash'
				| 'blockNumber';
		}>({
			storageSlot: ['0x1', '1', 1, BigInt(1)],
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
	)('getStorageAt', async ({ storageSlot, block }) => {
		const result = await web3.eth.getStorageAt(
			getDeployedStorageContractAddress(),
			storageSlot,
			blockData[block],
		);

		if (blockData[block] === 'earliest') {
			// eslint-disable-next-line jest/no-conditional-expect
			expect(result).toBe('0x');
		} else {
			// eslint-disable-next-line jest/no-conditional-expect
			expect(result).toBe(
				`0x000000000000000000000000${getE2ETestAccountAddress()
					.substring(2)
					.toLowerCase()}`,
			);
		}
	});
});
