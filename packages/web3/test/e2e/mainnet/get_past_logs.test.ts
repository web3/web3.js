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
import { hexToBytes } from 'web3-utils';

import Web3, { FMT_BYTES, FMT_NUMBER, LogAPI } from '../../../src';
import {
	closeOpenConnection,
	getSystemTestBackend,
} from '../../shared_fixtures/system_tests_utils';
import { toAllVariants } from '../../shared_fixtures/utils';
import { getSystemE2ETestProvider } from '../e2e_utils';

describe(`${getSystemTestBackend()} tests - getPastLogs`, () => {
	const provider = getSystemE2ETestProvider();
	const expectedLog: LogAPI = {
		address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
		blockHash: '0x89515ecc5eda6f038ce612fd7a285dc81ad0fc3cec1a1c2d2166565ac99d48db',
		blockNumber: '0x103dc29',
		data: '0x0000000000000000000000000000000000000000000000000000000146ee7540',
		logIndex: '0x63',
		removed: false,
		topics: [
			'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
			'0x000000000000000000000000b840fe2b3fd8f75275240c671d6ec659e4c9a500',
			'0x000000000000000000000000780a2d8ed56eede2f9d9b4dfd6fd3101ac20cab8',
		],
		transactionHash: '0x4284538004b3a8478835861d4354a33dba37a6daedcb692523478e5f9e7d8520',
		transactionIndex: '0xc',
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
			format: string;
		}>({
			format: Object.values(FMT_BYTES),
		}),
	)('should getPastLogs for deployed contract', async ({ format }) => {
		const result = (
			await web3.eth.getPastLogs(
				{
					fromBlock: '0x103dc29',
					toBlock: '0x103dc30',
					address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
				},
				{
					number: FMT_NUMBER.HEX,
					bytes: format as FMT_BYTES,
				},
			)
		)[0];

		switch (format) {
			case 'BYTES_HEX':
				// eslint-disable-next-line jest/no-conditional-expect
				expect(result).toStrictEqual(expectedLog);
				break;
			case 'BYTES_UINT8ARRAY':
				// eslint-disable-next-line jest/no-conditional-expect
				expect(result).toStrictEqual({
					...expectedLog,
					blockHash: new Uint8Array(hexToBytes(expectedLog.blockHash as string)),
					data: new Uint8Array(hexToBytes(expectedLog.data as string)),
					transactionHash: new Uint8Array(
						hexToBytes(expectedLog.transactionHash as string),
					),
					topics: expectedLog.topics?.map(topic => new Uint8Array(hexToBytes(topic))),
					// TODO Should these be formatted?
					// blockNumber: new Uint8Array(hexToBytes((expectedLog).blockNumber as string)),
					// data: new Uint8Array(hexToBytes((expectedLog).data as string)),
					// logIndex: new Uint8Array(hexToBytes((expectedLog).logIndex as string)),
					// transactionIndex: new Uint8Array(hexToBytes((expectedLog).transactionIndex as string)),
				});
				break;
			default:
				throw new Error('Unhandled format');
		}
	});
});
