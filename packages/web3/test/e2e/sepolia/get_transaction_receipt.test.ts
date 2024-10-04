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
				'0xcf811d80757452f648f74bea7cdee088c5c2addafd8d049f644fc8cafee7a50d',
				bytesToUint8Array(
					hexToBytes(
						'0xcf811d80757452f648f74bea7cdee088c5c2addafd8d049f644fc8cafee7a50d',
					),
				),
				new Uint8Array(
					hexToBytes(
						'0xcf811d80757452f648f74bea7cdee088c5c2addafd8d049f644fc8cafee7a50d',
					),
				),
			],
		}),
	)('getTransactionReceipt', async ({ transactionHash }) => {
		const result = await web3.eth.getTransactionReceipt(transactionHash);

		expect(result).toMatchObject({
			blockHash: '0xbdec00d52c5b4e1c00e0821fdaa492c0330ae06504d27a7e9f2e3e014957e96d',
			blockNumber: BigInt(6790201),
			cumulativeGasUsed: BigInt(96860),
			effectiveGasPrice: BigInt(344362611607),
			from: '0xaa88878d91bc1a7b7f71c592349efc44b5f3b77d',
			gasUsed: BigInt(48430),
			logs: [
				{
					address: '0xd600d94d0812f7edfa47d0cf02a767b1dd14a01b',
					topics: ['0x590c2f125cf2856ae220fc1092c632f5e2e27e42627e4535a158f2eeb3426beb'],
					data: '0x4d053fdf52290285953409c8d9abdacc0000000066fb1966037903179f0000000000000000000000000000000000000000000000000000000000000000aa36a7000000000000000000000000000000000000000000000000000000000007a13b000000000000000000000000aa88878d91bc1a7b7f71c592349efc44b5f3b77d00000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000299c007f9c00000000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000042307865303035356565653061613530353230616230616234313266353530366639663565666465366363356132656563323164303161306332626634663839626131000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001a3078313a3a6170746f735f636f696e3a3a4170746f73436f696e000000000000',
					blockNumber: BigInt(6790201),
					transactionHash:
						'0xcf811d80757452f648f74bea7cdee088c5c2addafd8d049f644fc8cafee7a50d',
					transactionIndex: BigInt(1),
					blockHash: '0xbdec00d52c5b4e1c00e0821fdaa492c0330ae06504d27a7e9f2e3e014957e96d',
					logIndex: BigInt(1),
					removed: false,
				},
			],
			logsBloom:
				'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000010000000000000000000000000000000004000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
			status: BigInt(1),
			to: '0xd600d94d0812f7edfa47d0cf02a767b1dd14a01b',
			transactionHash: '0xcf811d80757452f648f74bea7cdee088c5c2addafd8d049f644fc8cafee7a50d',
			transactionIndex: BigInt(1),
			type: BigInt(0),
		});
	});
});
