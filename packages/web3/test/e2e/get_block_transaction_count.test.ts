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
import { isBigInt, isHexStrict, isNumber, isString } from 'web3-validator';

import Web3, { FMT_BYTES, FMT_NUMBER } from '../../src';
import { getSystemE2ETestProvider } from './e2e_utils';
import {
	closeOpenConnection,
	getSystemTestBackend,
	BACKEND,
} from '../shared_fixtures/system_tests_utils';
import { toAllVariants } from '../shared_fixtures/utils';
import { sepoliaBlockData } from './fixtures/sepolia';
import { mainnetBlockData } from './fixtures/mainnet';

describe(`${getSystemTestBackend()} tests - getBlockTransactionCount`, () => {
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
			format: string;
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
			format: Object.values(FMT_NUMBER),
		}),
	)('getBlockTransactionCount', async ({ block, format }) => {
		let _blockData = blockData[block];
		if (block === 'blockHash' || block === 'blockNumber') {
			/**
			 * @NOTE Getting a block too far back in history
			 * results in a missing trie node error, so
			 * we get latest block for this test
			 */
			const latestBlock = await web3.eth.getBlock('finalized');
			_blockData =
				block === 'blockHash' ? (latestBlock.hash as string) : Number(latestBlock.number);
		}

		const result = await web3.eth.getBlockTransactionCount(_blockData, {
			number: format as FMT_NUMBER,
			bytes: FMT_BYTES.HEX,
		});
		if (block === 'pending') {
			// eslint-disable-next-line no-null/no-null
			const expectedResult = result === null || Number(result) > 0;
			// eslint-disable-next-line jest/no-conditional-expect
			expect(expectedResult).toBeTruthy();
		} else {
			switch (format) {
				case 'NUMBER_NUMBER':
					// eslint-disable-next-line jest/no-conditional-expect
					expect(isNumber(result)).toBeTruthy();
					break;
				case 'NUMBER_HEX':
					// eslint-disable-next-line jest/no-conditional-expect
					expect(isHexStrict(result)).toBeTruthy();
					break;
				case 'NUMBER_STR':
					// eslint-disable-next-line jest/no-conditional-expect
					expect(isString(result)).toBeTruthy();
					break;
				case 'NUMBER_BIGINT':
					// eslint-disable-next-line jest/no-conditional-expect
					expect(isBigInt(result)).toBeTruthy();
					break;
				default:
					throw new Error('Unhandled format');
			}
		}
	});
});
