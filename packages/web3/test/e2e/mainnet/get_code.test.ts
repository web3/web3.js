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
import { hexToBytes, toHex } from 'web3-utils';

import Web3, { FMT_BYTES, FMT_NUMBER } from '../../../src';
import {
	closeOpenConnection,
	getSystemTestBackend,
} from '../../shared_fixtures/system_tests_utils';
import { toAllVariants } from '../../shared_fixtures/utils';
import { getSystemE2ETestProvider, getE2ETestContractAddress } from '../e2e_utils';
import { mainnetCode } from '../fixtures/mainnet';

describe(`${getSystemTestBackend()} tests - getCode`, () => {
	const provider = getSystemE2ETestProvider();
	const blockData: {
		latest: 'latest';
		pending: 'pending';
		finalized: 'finalized';
		safe: 'safe';
		blockNumber: number;
		blockHash: string;
	} = {
		latest: 'latest',
		pending: 'pending',
		finalized: 'finalized',
		safe: 'safe',
		blockNumber: 17029884,
		blockHash: '0x2850e4a813762b2de589fa5268eacb92572defaf9520608deb129699e504cab2',
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
			block: 'latest' | 'pending' | 'finalized' | 'safe' | 'blockHash' | 'blockNumber';
			format: string;
		}>({
			block: ['latest', 'pending', 'safe', 'finalized', 'blockHash', 'blockNumber'],
			format: Object.values(FMT_BYTES),
		}),
	)('should getCode for deployed contract', async ({ block, format }) => {
		let _blockData = blockData[block];
		if (block === 'blockHash' || block === 'blockNumber') {
			const latestBlock = await web3.eth.getBlock('finalized');
			_blockData =
				block === 'blockHash' ? (latestBlock.hash as string) : toHex(latestBlock.number);
		}
		const result = await web3.eth.getCode(getE2ETestContractAddress(), _blockData, {
			number: FMT_NUMBER.HEX,
			bytes: format as FMT_BYTES,
		});

		switch (format) {
			case 'BYTES_HEX':
				// eslint-disable-next-line jest/no-conditional-expect
				expect(result).toBe(mainnetCode);
				break;
			case 'BYTES_UINT8ARRAY':
				// eslint-disable-next-line jest/no-conditional-expect
				expect(result).toStrictEqual(new Uint8Array(hexToBytes(mainnetCode)));
				break;
			default:
				throw new Error('Unhandled format');
		}
	});
});
