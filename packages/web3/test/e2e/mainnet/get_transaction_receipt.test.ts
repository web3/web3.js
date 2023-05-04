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
				'0x9a968248400868beb931ed96ee37517275794ff44e8d968c29f0f3430a504594',
				bytesToUint8Array(
					hexToBytes(
						'0x9a968248400868beb931ed96ee37517275794ff44e8d968c29f0f3430a504594',
					),
				),
				new Uint8Array(
					hexToBytes(
						'0x9a968248400868beb931ed96ee37517275794ff44e8d968c29f0f3430a504594',
					),
				),
			],
		}),
	)('getTransactionReceipt', async ({ transactionHash }) => {
		const result = await web3.eth.getTransactionReceipt(transactionHash);

		expect(result).toMatchObject({
			blockHash: '0xabc81c29235c7962f5a0420644761627bdc064a560c7d1842cdf9517f7d7984e',
			blockNumber: BigInt(17030310),
			// contractAddress: '0xedfd52255571b4a9a9d4445989e39f5c14ff0447',
			cumulativeGasUsed: BigInt(9010200),
			effectiveGasPrice: BigInt(19330338402),
			from: '0xd67da12dc33d9730d9341bbfa4f0b67d0688b28b',
			gasUsed: BigInt(245737),
			logs: [
				{
					address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
					blockHash: '0xabc81c29235c7962f5a0420644761627bdc064a560c7d1842cdf9517f7d7984e',
					blockNumber: BigInt(17030310),
					data: '0x0000000000000000000000000000000000000000000000000000000000668442',
					logIndex: BigInt(200),
					removed: false,
					topics: [
						'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
						'0x000000000000000000000000d67da12dc33d9730d9341bbfa4f0b67d0688b28b',
						'0x000000000000000000000000a6e265667e1e18c28f2b5dc529f775c5f0d56d4a',
					],
					transactionHash:
						'0x9a968248400868beb931ed96ee37517275794ff44e8d968c29f0f3430a504594',
					transactionIndex: BigInt(91),
				},
				{
					address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
					blockHash: '0xabc81c29235c7962f5a0420644761627bdc064a560c7d1842cdf9517f7d7984e',
					blockNumber: BigInt(17030310),
					data: '0x0000000000000000000000000000000000000000000000000000000000015bb2',
					logIndex: BigInt(201),
					removed: false,
					topics: [
						'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
						'0x000000000000000000000000d67da12dc33d9730d9341bbfa4f0b67d0688b28b',
						'0x000000000000000000000000a6e265667e1e18c28f2b5dc529f775c5f0d56d4a',
					],
					transactionHash:
						'0x9a968248400868beb931ed96ee37517275794ff44e8d968c29f0f3430a504594',
					transactionIndex: BigInt(91),
				},
				{
					address: '0x5de8ab7e27f6e7a1fff3e5b337584aa43961beef',
					blockHash: '0xabc81c29235c7962f5a0420644761627bdc064a560c7d1842cdf9517f7d7984e',
					blockNumber: BigInt(17030310),
					data: '0x00000000000000000000000000000000000000003fff92b9d57d1d7fca09d7dc',
					logIndex: BigInt(202),
					removed: false,
					topics: [
						'0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
						'0x000000000000000000000000d67da12dc33d9730d9341bbfa4f0b67d0688b28b',
						'0x00000000000000000000000069a592d2129415a4a1d1b1e309c17051b7f28d57',
					],
					transactionHash:
						'0x9a968248400868beb931ed96ee37517275794ff44e8d968c29f0f3430a504594',
					transactionIndex: BigInt(91),
				},
				{
					address: '0x5de8ab7e27f6e7a1fff3e5b337584aa43961beef',
					blockHash: '0xabc81c29235c7962f5a0420644761627bdc064a560c7d1842cdf9517f7d7984e',
					blockNumber: BigInt(17030310),
					data: '0x000000000000000000000000000000000000000000006d462a82e28035f62824',
					logIndex: BigInt(203),
					removed: false,
					topics: [
						'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
						'0x000000000000000000000000d67da12dc33d9730d9341bbfa4f0b67d0688b28b',
						'0x000000000000000000000000a6e265667e1e18c28f2b5dc529f775c5f0d56d4a',
					],
					transactionHash:
						'0x9a968248400868beb931ed96ee37517275794ff44e8d968c29f0f3430a504594',
					transactionIndex: BigInt(91),
				},
				{
					address: '0xa6e265667e1e18c28f2b5dc529f775c5f0d56d4a',
					blockHash: '0xabc81c29235c7962f5a0420644761627bdc064a560c7d1842cdf9517f7d7984e',
					blockNumber: BigInt(17030310),
					data: '0x000000000000000000000000000000000000000000000001a055690d9db80000',
					logIndex: BigInt(204),
					removed: false,
					topics: [
						'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
						'0x0000000000000000000000000000000000000000000000000000000000000000',
						'0x000000000000000000000000d67da12dc33d9730d9341bbfa4f0b67d0688b28b',
					],
					transactionHash:
						'0x9a968248400868beb931ed96ee37517275794ff44e8d968c29f0f3430a504594',
					transactionIndex: BigInt(91),
				},
				{
					address: '0x69a592d2129415a4a1d1b1e309c17051b7f28d57',
					blockHash: '0xabc81c29235c7962f5a0420644761627bdc064a560c7d1842cdf9517f7d7984e',
					blockNumber: BigInt(17030310),
					data: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001a055690d9db8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
					logIndex: BigInt(205),
					removed: false,
					topics: [
						'0x1abc43bc3dd8b6c8bb9bcf1a14a84f83981bf5335700ef07758efefcb03a8c75',
						'0x000000000000000000000000a6e265667e1e18c28f2b5dc529f775c5f0d56d4a',
						'0x000000000000000000000000d67da12dc33d9730d9341bbfa4f0b67d0688b28b',
						'0x000000000000000000000000d67da12dc33d9730d9341bbfa4f0b67d0688b28b',
					],
					transactionHash:
						'0x9a968248400868beb931ed96ee37517275794ff44e8d968c29f0f3430a504594',
					transactionIndex: BigInt(91),
				},
			],
			status: BigInt(1),
			transactionHash: '0x9a968248400868beb931ed96ee37517275794ff44e8d968c29f0f3430a504594',
			transactionIndex: BigInt(91),
			type: BigInt(2),
		});
	});
});
