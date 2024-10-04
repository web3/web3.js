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
import { Web3 } from '../../src';
import { getSystemE2ETestProvider } from './e2e_utils';
import {
	closeOpenConnection,
	getSystemTestBackend,
	describeIf,
	BACKEND,
} from '../shared_fixtures/system_tests_utils';
import { toAllVariants } from '../shared_fixtures/utils';
import { sepoliaBlockData } from './fixtures/sepolia';
import { mainnetBlockData } from './fixtures/mainnet';

describeIf(getSystemTestBackend() !== 'hardhat')(
	`${getSystemTestBackend()} tests - getBlockUncleCount`,
	() => {
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
		// eslint-disable-next-line jest/consistent-test-it
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
		)('getBlockUncleCount', async ({ block }) => {
			let _blockData = blockData[block];
			if (block === 'blockHash' || block === 'blockNumber') {
				const latestBlock = await web3.eth.getBlock('finalized');
				_blockData =
					block === 'blockHash'
						? (latestBlock.hash as string)
						: Number(latestBlock.number);
			}
			const result = await web3.eth.getBlockUncleCount(_blockData);
			// eslint-disable-next-line no-null/no-null
			expect(result).toBe(block === 'pending' || block === 'earliest' ? null : BigInt(0));
		});
	},
);
