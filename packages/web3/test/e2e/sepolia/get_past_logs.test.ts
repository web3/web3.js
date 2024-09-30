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
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { hexToBytes, numberToHex, hexToNumber } from 'web3-utils';
import { Log } from 'web3-types';
import Web3, { FMT_BYTES, FMT_NUMBER, LogAPI } from '../../../src';
import {
	closeOpenConnection,
	getSystemTestBackend,
} from '../../shared_fixtures/system_tests_utils';
import { toAllVariants } from '../../shared_fixtures/utils';
import { getSystemE2ETestProvider, getE2ETestContractAddress } from '../e2e_utils';

describe(`${getSystemTestBackend()} tests - getPastLogs`, () => {
	const provider = getSystemE2ETestProvider();
	const expectedLogs: LogAPI[] = [
		{
			address: getE2ETestContractAddress(),
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
			byteFormat: string;
			numberFormat: string;
		}>({
			byteFormat: Object.values(FMT_BYTES),
			numberFormat: Object.values(FMT_NUMBER),
		}),
	)('should getPastLogs for deployed contract', async ({ byteFormat, numberFormat }) => {
		const result = (
			await web3.eth.getPastLogs(
				{
					fromBlock: 3229301,
					toBlock: 3229310,
					address: getE2ETestContractAddress(),
				},
				{
					number: numberFormat as FMT_NUMBER,
					bytes: byteFormat as FMT_BYTES,
				},
			)
		)[0] as unknown as Log;
		if (typeof result !== 'string') {
			switch (numberFormat) {
				case 'NUMBER_STR':
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result?.blockNumber).toBe(
						hexToNumber(numberToHex(expectedLogs[0].blockNumber as string)).toString(),
					);
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result?.logIndex).toStrictEqual(
						hexToNumber(numberToHex(expectedLogs[0].logIndex as string)).toString(),
					);
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result?.transactionIndex).toStrictEqual(
						hexToNumber(
							numberToHex(expectedLogs[0].transactionIndex as string),
						).toString(),
					);
					break;
				case 'NUMBER_BIGINT':
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result.blockNumber).toBe(BigInt(expectedLogs[0].blockNumber as string));
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result?.logIndex).toStrictEqual(
						BigInt(expectedLogs[0].logIndex as string),
					);
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result?.transactionIndex).toStrictEqual(
						BigInt(expectedLogs[0].transactionIndex as string),
					);
					break;
				case 'NUMBER_NUMBER':
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result?.blockNumber).toStrictEqual(
						hexToNumber(numberToHex(expectedLogs[0].blockNumber as string)),
					);
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result?.logIndex).toStrictEqual(
						hexToNumber(numberToHex(expectedLogs[0].logIndex as string)),
					);
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result?.transactionIndex).toStrictEqual(
						hexToNumber(numberToHex(expectedLogs[0].transactionIndex as string)),
					);
					break;
				case 'NUMBER_HEX':
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result?.blockNumber).toStrictEqual(
						numberToHex(expectedLogs[0].blockNumber as string),
					);
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result?.logIndex).toStrictEqual(
						numberToHex(expectedLogs[0].logIndex as string),
					);
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result?.transactionIndex).toStrictEqual(
						numberToHex(expectedLogs[0].transactionIndex as string),
					);
					break;
				default:
					throw new Error('Unhandled format');
			}

			switch (byteFormat) {
				case 'BYTES_HEX':
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result.blockHash).toBe(expectedLogs[0].blockHash as string);
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result.data).toBe(expectedLogs[0].data as string);
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result.transactionHash).toBe(expectedLogs[0].transactionHash as string);
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result.topics).toStrictEqual(expectedLogs[0].topics);
					break;
				case 'BYTES_UINT8ARRAY':
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result.blockHash).toStrictEqual(
						new Uint8Array(hexToBytes(expectedLogs[0].blockHash as string)),
					);
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result.data).toStrictEqual(
						new Uint8Array(hexToBytes(expectedLogs[0].data as string)),
					);
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result.transactionHash).toStrictEqual(
						new Uint8Array(hexToBytes(expectedLogs[0].transactionHash as string)),
					);
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result.topics).toStrictEqual(
						expectedLogs[0].topics?.map(
							(topic: string) => new Uint8Array(hexToBytes(topic)),
						),
					);
					break;
				default:
					throw new Error('Unhandled format');
			}
		}
	});
});
