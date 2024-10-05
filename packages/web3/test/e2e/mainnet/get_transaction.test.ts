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
import { Bytes, TransactionInfo } from 'web3-types';
import { bytesToUint8Array, hexToBytes } from 'web3-utils';

import Web3 from '../../../src';
import { getSystemE2ETestProvider } from '../e2e_utils';
import {
	closeOpenConnection,
	getSystemTestBackend,
} from '../../shared_fixtures/system_tests_utils';
import { toAllVariants } from '../../shared_fixtures/utils';

describe(`${getSystemTestBackend()} tests - getTransaction`, () => {
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
				'0x79fd3cd0c84acfbb1b9c8f2ab33517626eceb8cb42c21f1c21439ce36e0e6cab',
				bytesToUint8Array(
					hexToBytes(
						'0x79fd3cd0c84acfbb1b9c8f2ab33517626eceb8cb42c21f1c21439ce36e0e6cab',
					),
				),
				new Uint8Array(
					hexToBytes(
						'0x79fd3cd0c84acfbb1b9c8f2ab33517626eceb8cb42c21f1c21439ce36e0e6cab',
					),
				),
			],
		}),
	)('getTransaction', async ({ transactionHash }) => {
		const result = await web3.eth.getTransaction(transactionHash);

		expect(result).toMatchObject<TransactionInfo>({
			blockHash: '0x4cf4c590ad0c46e86c83d3156b6fafd7ec10da67da577ee8abae96854b3e474f',
			blockNumber: BigInt(20866453),
			from: '0xbbff54095b09940a4046e21ed5053f1ea2a1c581',
			gas: BigInt(320260),
			gasPrice: BigInt(11058949155),
			maxFeePerGas: BigInt(13199607524),
			maxPriorityFeePerGas: BigInt(3000000000),
			hash: '0x79fd3cd0c84acfbb1b9c8f2ab33517626eceb8cb42c21f1c21439ce36e0e6cab',
			input: '0x3d0e3ec50000000000000000000000000000000000000000000000001a33261efb6495ca000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000bbff54095b09940a4046e21ed5053f1ea2a1c5810000000000000000000000000000000000000000000000000000000066fb25a80000000000000000000000005c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000b9612ce2807de435a562b40a5ba9200ab86065e1000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			nonce: BigInt(985),
			to: '0x80a64c6d7f12c47b7c66c5b4e20e72bc1fcd5d9e',
			transactionIndex: BigInt(6),
			value: BigInt(0),
			type: BigInt(2),
			accessList: [],
			chainId: BigInt(1),
			v: BigInt(1),
			r: '0xac126c6ad95a7a8970ce4ca34d61a3a2245e8d7f11bde871dd66ac43435405c6',
			s: '0x1beeda8ed32586243281807ee42d8e524d5050bd7f224f62e5dce812472ecee5',
			data: '0x3d0e3ec50000000000000000000000000000000000000000000000001a33261efb6495ca000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000bbff54095b09940a4046e21ed5053f1ea2a1c5810000000000000000000000000000000000000000000000000000000066fb25a80000000000000000000000005c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000b9612ce2807de435a562b40a5ba9200ab86065e1000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		});
	});
});
