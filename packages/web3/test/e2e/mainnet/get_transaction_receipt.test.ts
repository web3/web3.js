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
	)('getTransactionReceipt', async ({ transactionHash }) => {
		const result = await web3.eth.getTransactionReceipt(transactionHash);

		expect(result).toMatchObject({
			blockHash: '0x4cf4c590ad0c46e86c83d3156b6fafd7ec10da67da577ee8abae96854b3e474f',
			blockNumber: BigInt(20866453),
			cumulativeGasUsed: BigInt(1119067),
			effectiveGasPrice: BigInt(11058949155),
			from: '0xbbff54095b09940a4046e21ed5053f1ea2a1c581',
			gasUsed: BigInt(145229),
			logs: [
				{
					address: '0xb9612ce2807de435a562b40a5ba9200ab86065e1',
					topics: [
						'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
						'0x000000000000000000000000bbff54095b09940a4046e21ed5053f1ea2a1c581',
						'0x000000000000000000000000226b6b07e508bda9dffe13866f807346faf94627',
					],
					data: '0x0000000000000000000000000000000000000000000000001a33261efb6495ca',
					blockNumber: BigInt(20866453),
					transactionHash:
						'0x79fd3cd0c84acfbb1b9c8f2ab33517626eceb8cb42c21f1c21439ce36e0e6cab',
					transactionIndex: BigInt(6),
					blockHash: '0x4cf4c590ad0c46e86c83d3156b6fafd7ec10da67da577ee8abae96854b3e474f',
					logIndex: BigInt(30),
					removed: false,
				},
				{
					address: '0xb9612ce2807de435a562b40a5ba9200ab86065e1',
					topics: [
						'0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
						'0x000000000000000000000000bbff54095b09940a4046e21ed5053f1ea2a1c581',
						'0x00000000000000000000000080a64c6d7f12c47b7c66c5b4e20e72bc1fcd5d9e',
					],
					data: '0xffffffffffffffffffffffffffffffffffffffffffffffffe5ccd9e1049b6a35',
					blockNumber: BigInt(20866453),
					transactionHash:
						'0x79fd3cd0c84acfbb1b9c8f2ab33517626eceb8cb42c21f1c21439ce36e0e6cab',
					transactionIndex: BigInt(6),
					blockHash: '0x4cf4c590ad0c46e86c83d3156b6fafd7ec10da67da577ee8abae96854b3e474f',
					logIndex: BigInt(31),
					removed: false,
				},
				{
					address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					topics: [
						'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
						'0x000000000000000000000000226b6b07e508bda9dffe13866f807346faf94627',
						'0x00000000000000000000000080a64c6d7f12c47b7c66c5b4e20e72bc1fcd5d9e',
					],
					data: '0x00000000000000000000000000000000000000000000000013d4b60de784bded',
					blockNumber: BigInt(20866453),
					transactionHash:
						'0x79fd3cd0c84acfbb1b9c8f2ab33517626eceb8cb42c21f1c21439ce36e0e6cab',
					transactionIndex: BigInt(6),
					blockHash: '0x4cf4c590ad0c46e86c83d3156b6fafd7ec10da67da577ee8abae96854b3e474f',
					logIndex: BigInt(32),
					removed: false,
				},
				{
					address: '0x226b6b07e508bda9dffe13866f807346faf94627',
					topics: ['0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1'],
					data: '0x0000000000000000000000000000000000000000000000010eecfc5e451812f1000000000000000000000000000000000000000000000000b9cb01773305f8bc',
					blockNumber: BigInt(20866453),
					transactionHash:
						'0x79fd3cd0c84acfbb1b9c8f2ab33517626eceb8cb42c21f1c21439ce36e0e6cab',
					transactionIndex: BigInt(6),
					blockHash: '0x4cf4c590ad0c46e86c83d3156b6fafd7ec10da67da577ee8abae96854b3e474f',
					logIndex: BigInt(33),
					removed: false,
				},
				{
					address: '0x226b6b07e508bda9dffe13866f807346faf94627',
					topics: [
						'0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
						'0x00000000000000000000000080a64c6d7f12c47b7c66c5b4e20e72bc1fcd5d9e',
						'0x00000000000000000000000080a64c6d7f12c47b7c66c5b4e20e72bc1fcd5d9e',
					],
					data: '0x0000000000000000000000000000000000000000000000001a33261efb6495ca0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000013d4b60de784bded',
					blockNumber: BigInt(20866453),
					transactionHash:
						'0x79fd3cd0c84acfbb1b9c8f2ab33517626eceb8cb42c21f1c21439ce36e0e6cab',
					transactionIndex: BigInt(6),
					blockHash: '0x4cf4c590ad0c46e86c83d3156b6fafd7ec10da67da577ee8abae96854b3e474f',
					logIndex: BigInt(34),
					removed: false,
				},
				{
					address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					topics: [
						'0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65',
						'0x00000000000000000000000080a64c6d7f12c47b7c66c5b4e20e72bc1fcd5d9e',
					],
					data: '0x00000000000000000000000000000000000000000000000013d4b60de784bded',
					blockNumber: BigInt(20866453),
					transactionHash:
						'0x79fd3cd0c84acfbb1b9c8f2ab33517626eceb8cb42c21f1c21439ce36e0e6cab',
					transactionIndex: BigInt(6),
					blockHash: '0x4cf4c590ad0c46e86c83d3156b6fafd7ec10da67da577ee8abae96854b3e474f',
					logIndex: BigInt(35),
					removed: false,
				},
			],
			logsBloom:
				'0x00200000000000000000000080000001000000000000000000000000000000000000100000040000000000000000000002008000080000000002020000280000000000000000000000000008000000200000000100400000000000000000004000000000000000000000400000000000000000000000040000000010000000000000000000000000000000000000000000000000000000088000004000000000020000000000000000000000000004000000000000004000000000000000000000000002000000000000000000000000000000000000001000000002000000000050200008000000000000000000000000000000000000000000000000000000',
			status: BigInt(1),
			to: '0x80a64c6d7f12c47b7c66c5b4e20e72bc1fcd5d9e',
			transactionHash: '0x79fd3cd0c84acfbb1b9c8f2ab33517626eceb8cb42c21f1c21439ce36e0e6cab',
			transactionIndex: BigInt(6),
			type: BigInt(2),
		});
	});
});
