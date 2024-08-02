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
	getSystemE2ETestProvider,
	getE2ETestAccountAddress,
	getE2ETestContractAddress,
} from '../e2e_utils';
import {
	closeOpenConnection,
	getSystemTestBackend,
} from '../../shared_fixtures/system_tests_utils';
import { toAllVariants } from '../../shared_fixtures/utils';
import { sepoliaBlockData } from '../fixtures/sepolia';

describe(`${getSystemTestBackend()} tests - getStorageAt`, () => {
	const provider = getSystemE2ETestProvider();

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
		let blockData = sepoliaBlockData[block];
		if (block === 'blockHash' || block === 'blockNumber') {
			const blockNumber = await web3.eth.getBlockNumber();
			blockData = Number(blockNumber);
			if (block === 'blockHash') {
				blockData = (await web3.eth.getBlock(blockNumber)).hash as string;
			}
		}

		const result = await web3.eth.getStorageAt(
			getE2ETestContractAddress(),
			storageSlot,
			blockData,
		);
		if (sepoliaBlockData[block] === 'earliest') {
			// Nethermind returns 0x while Geth returns 0x0000000000000000000000000000000000000000000000000000000000000000
			// eslint-disable-next-line jest/no-conditional-expect
			expect(
				result === '0x' ||
					result === '0x0000000000000000000000000000000000000000000000000000000000000000',
			).toBeTruthy();
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
