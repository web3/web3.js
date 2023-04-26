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
	const expectedLogs: LogAPI[] = [
		{
			address: '0xedfd52255571b4a9a9d4445989e39f5c14ff0447',
			blockHash: '0xdb1cb1fc3867fa28e4ba2297fbb1e65b81a3212beb1b73cbcbfe40c4192ee948',
			blockNumber: '0x314675',
			data: '0x',
			logIndex: '0x4',
			removed: false,
			topics: [
				'0x342827c97908e5e2f71151c08502a66d44b6f758e3ac2f1de95f02eb95f0a735',
				'0x0000000000000000000000000000000000000000000000000000000000000000',
				'0x000000000000000000000000a127c5e6a7e3600ac34a9a9928e52521677e7211',
			],
			transactionHash: '0xe3d28c23ffcd8b94b8f2fd802b4c8dd17a5f19992660acd082ac229ab410b959',
			transactionIndex: '0x8',
		},
	];

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
		const result = await web3.eth.getPastLogs(
			{
				fromBlock: 'earliest',
				toBlock: 'latest',
				address: '0xEdFd52255571b4a9A9d4445989E39f5c14Ff0447',
			},
			{
				number: FMT_NUMBER.HEX,
				bytes: format as FMT_BYTES,
			},
		);

		switch (format) {
			case 'BYTES_HEX':
				// eslint-disable-next-line jest/no-conditional-expect
				expect(result).toStrictEqual(expectedLogs);
				break;
			case 'BYTES_UINT8ARRAY':
				// eslint-disable-next-line jest/no-conditional-expect
				expect(result).toStrictEqual([
					{
						...expectedLogs[0],
						blockHash: new Uint8Array(hexToBytes(expectedLogs[0].blockHash as string)),
						data: new Uint8Array(hexToBytes(expectedLogs[0].data as string)),
						transactionHash: new Uint8Array(
							hexToBytes(expectedLogs[0].transactionHash as string),
						),
						topics: expectedLogs[0].topics?.map(
							topic => new Uint8Array(hexToBytes(topic)),
						),
						// TODO Should these be formatted?
						// blockNumber: new Uint8Array(hexToBytes((expectedLogs[0]).blockNumber as string)),
						// data: new Uint8Array(hexToBytes((expectedLogs[0]).data as string)),
						// logIndex: new Uint8Array(hexToBytes((expectedLogs[0]).logIndex as string)),
						// transactionIndex: new Uint8Array(hexToBytes((expectedLogs[0]).transactionIndex as string)),
					},
				]);
				break;
			default:
				throw new Error('Unhandled format');
		}
	});
});
