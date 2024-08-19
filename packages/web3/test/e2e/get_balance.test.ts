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
import { isBigInt, isHexStrict, isString } from 'web3-validator';
import { toHex } from 'web3-utils';

import Web3, { FMT_BYTES, FMT_NUMBER } from '../../src';
import { getSystemE2ETestProvider, getE2ETestAccountAddress } from './e2e_utils';
import {
	closeOpenConnection,
	getSystemTestBackend,
	BACKEND,
} from '../shared_fixtures/system_tests_utils';
import { toAllVariants } from '../shared_fixtures/utils';
import { sepoliaBlockData } from './fixtures/sepolia';
import { mainnetBlockData } from './fixtures/mainnet';

describe(`${getSystemTestBackend()} tests - getBalance`, () => {
	const provider = getSystemE2ETestProvider();
	const blockData =
		getSystemTestBackend() === BACKEND.SEPOLIA ? sepoliaBlockData : mainnetBlockData;
	const expectedBalance =
		getSystemTestBackend() === BACKEND.SEPOLIA ? '172530374997217200' : '2099795781954790368';

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
			format: [FMT_NUMBER.BIGINT, FMT_NUMBER.HEX, FMT_NUMBER.STR],
		}),
	)('getBalance', async ({ block, format }) => {
		const result = await web3.eth.getBalance(getE2ETestAccountAddress(), blockData[block], {
			number: format as FMT_NUMBER,
			bytes: FMT_BYTES.HEX,
		});

		if (block === 'blockHash' || block === 'blockNumber') {
			switch (format) {
				case 'NUMBER_HEX':
					/**
					 * @NOTE toHex assumes if a string is passed it's a hexadecimal
					 * which is why the number string, expectedBalance, is being
					 * converted to a BigInt
					 */
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result).toBe(toHex(BigInt(expectedBalance)));
					break;
				case 'NUMBER_STR':
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result).toBe(expectedBalance);
					break;
				case 'NUMBER_BIGINT':
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result).toBe(BigInt(expectedBalance));
					break;
				default:
					throw new Error('Unhandled format');
			}
		} else {
			switch (format) {
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
