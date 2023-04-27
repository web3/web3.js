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
import { hexToBytes } from 'web3-utils';

export const mockRpcResponse: TransactionInfo = {
	accessList: [],
	blockHash: '0xc9e87d2d1aa23d241fe281b8db7856c497320aa4f1f582a7fcd4fab7d2addf74',
	blockNumber: '0xc66332',
	chainId: '0x1',
	from: '0xcfb162c6de7ee2b49048b270cb5e297da5b6e6c3',
	gas: '0x31d00',
	gasPrice: '0xa83613262',
	hash: '0x5f67b495f9c53b942cb1bfacaf175ad887372d7227454a971f15f5e6a7639ad1',
	input: '0x38ed17390000000000000000000000000000000000000000000000147ebc6d689cc81c8c0000000000000000000000000000000000000000000000005b7471df733ea75c00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000cfb162c6de7ee2b49048b270cb5e297da5b6e6c30000000000000000000000000000000000000000000000000000000061134c8f0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000d084b83c305dafd76ae3e1b4e1f1fe2ecccb3988000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000d2877702675e6ceb975b4a1dff9fb7baf4c91ea9',
	maxFeePerGas: '0xf2cec3661',
	maxPriorityFeePerGas: '0xb2d05e00',
	nonce: '0xb8',
	r: '0x9d201db7621ee0e204841ea374cca3397c7f1a880c5f83207d8cd7e5b4b9e984',
	s: '0x391b00b10782665d8c5138aef912ea77a59024bf7962f4d1faedcc45bf91d568',
	to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
	transactionIndex: '0xc8',
	type: '0x2',
	v: '0x0',
	value: '0x0',
};

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - transactionHash
 */
type TestData = [string, [Bytes]];
export const testData: TestData[] = [
	// transactionHash = Bytes
	[
		'transactionHash = "0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8"',
		['0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8'],
	],
	[
		'transactionHash = hexToBytes("0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8")',
		[hexToBytes('0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8')],
	],
	[
		'transactionHash = hexToBytes("d5677cf67b5aa051bb40496e68ad359eb97cfbf8")',
		[
			new Uint8Array([
				213, 103, 124, 246, 123, 90, 160, 81, 187, 64, 73, 110, 104, 173, 53, 158, 185, 124,
				251, 248,
			]),
		],
	],
];
