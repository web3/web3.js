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
import { Bytes } from 'web3-types';
import { bytesToUint8Array, hexToBytes } from 'web3-utils';

import Web3 from '../../../src';
import { getSystemE2ETestProvider } from '../e2e_utils';
import {
	closeOpenConnection,
	getSystemTestBackend,
} from '../../shared_fixtures/system_tests_utils';
import { toAllVariants } from '../../shared_fixtures/utils';

describe(`${getSystemTestBackend()} tests - getTransactionReceipt`, () => {
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
			transactionHash: Bytes;
		}>({
			transactionHash: [
				'0xe3d28c23ffcd8b94b8f2fd802b4c8dd17a5f19992660acd082ac229ab410b959',
				bytesToUint8Array(
					hexToBytes(
						'0xe3d28c23ffcd8b94b8f2fd802b4c8dd17a5f19992660acd082ac229ab410b959',
					),
				),
				new Uint8Array(
					hexToBytes(
						'0xe3d28c23ffcd8b94b8f2fd802b4c8dd17a5f19992660acd082ac229ab410b959',
					),
				),
			],
		}),
	)('getTransactionReceipt', async ({ transactionHash }) => {
		const result = await web3.eth.getTransactionReceipt(transactionHash);

		expect(result).toMatchObject({
			blockHash: '0xdb1cb1fc3867fa28e4ba2297fbb1e65b81a3212beb1b73cbcbfe40c4192ee948',
			blockNumber: BigInt(3229301),
			contractAddress: '0xedfd52255571b4a9a9d4445989e39f5c14ff0447',
			cumulativeGasUsed: BigInt(579732),
			effectiveGasPrice: BigInt(2500000008),
			from: '0xa127c5e6a7e3600ac34a9a9928e52521677e7211',
			gasUsed: BigInt(347850),
			logs: [
				{
					address: '0xedfd52255571b4a9a9d4445989e39f5c14ff0447',
					blockHash: '0xdb1cb1fc3867fa28e4ba2297fbb1e65b81a3212beb1b73cbcbfe40c4192ee948',
					blockNumber: BigInt(3229301),
					data: '0x',
					logIndex: BigInt(4),
					removed: false,
					topics: [
						'0x342827c97908e5e2f71151c08502a66d44b6f758e3ac2f1de95f02eb95f0a735',
						'0x0000000000000000000000000000000000000000000000000000000000000000',
						'0x000000000000000000000000a127c5e6a7e3600ac34a9a9928e52521677e7211',
					],
					transactionHash:
						'0xe3d28c23ffcd8b94b8f2fd802b4c8dd17a5f19992660acd082ac229ab410b959',
					transactionIndex: BigInt(8),
				},
			],
			logsBloom:
				'0x00000000000000000000000000000000000000000400000001000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000060000000000040010000800000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000010000000000000000000000000000000',
			status: BigInt(1),
			transactionHash: '0xe3d28c23ffcd8b94b8f2fd802b4c8dd17a5f19992660acd082ac229ab410b959',
			transactionIndex: BigInt(8),
			type: BigInt(2),
		});
	});
});
