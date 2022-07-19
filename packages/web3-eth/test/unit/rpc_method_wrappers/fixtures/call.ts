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
import { BlockNumberOrTag, BlockTags, TransactionCall } from 'web3-types';

export const mockRpcResponse = '0x000000000000000000000000000000000000000000000000000000000000000a';

const transaction: TransactionCall = {
	from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
	to: '0x3535353535353535353535353535353535353535',
	value: '0x174876e800',
	gas: '0x5208',
	gasPrice: '0x4a817c800',
	type: '0x0',
	maxFeePerGas: '0x1229298c00',
	maxPriorityFeePerGas: '0x49504f80',
	data: '0x',
	nonce: '0x4',
	chain: 'mainnet',
	hardfork: 'berlin',
	chainId: '0x1',
	gasLimit: '0x5208',
	v: '0x25',
	r: '0x4f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88d',
	s: '0x7e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0',
};

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - blockNumber
 *     - uncleIndex
 *     - returnFormat
 * - mockRpcResponse
 */
type TestData = [string, [TransactionCall, BlockNumberOrTag | undefined]];
export const testData: TestData[] = [
	// blockNumber = BlockTag
	[
		`${JSON.stringify(transaction)}\nblockNumber = BlockTags.LATEST`,
		[transaction, BlockTags.LATEST],
	],
	[
		`${JSON.stringify(transaction)}\nblockNumber = BlockTags.EARLIEST`,
		[transaction, BlockTags.EARLIEST],
	],
	[
		`${JSON.stringify(transaction)}\nblockNumber = BlockTags.PENDING`,
		[transaction, BlockTags.PENDING],
	],
	// blockNumber = Numbers
	[`${JSON.stringify(transaction)}\nblockNumber = "0x4b7"`, [transaction, '0x4b7']],
	[`${JSON.stringify(transaction)}\nblockNumber = 1207`, [transaction, 1207]],
	[`${JSON.stringify(transaction)}\nblockNumber = "1207"`, [transaction, '1207']],
	[
		`${JSON.stringify(transaction)}\nblockNumber = BigInt("0x4b7")`,
		[transaction, BigInt('0x4b7')],
	],
	[`${JSON.stringify(transaction)}\nblockNumber = undefined`, [transaction, undefined]],
];
