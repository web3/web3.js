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
import { BlockNumberOrTag, BlockTags, Bytes, Numbers, Transaction } from 'web3-types';

export const mockRpcResponse: Transaction = {
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
type TestData = [string, [Bytes | BlockNumberOrTag | undefined, Numbers]];
export const testData: TestData[] = [
	// blockNumber = Bytes, transactionIndex = HexString
	[
		'blockNumber = "0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8", transactionIndex = "0x0"',
		['0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8', '0x0'],
	],
	[
		'blockNumber = Buffer("0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8", "hex"), transactionIndex = "0x0"',
		[Buffer.from('0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8', 'hex'), '0x0'],
	],
	[
		'blockNumber = Uint8Array("d5677cf67b5aa051bb40496e68ad359eb97cfbf8"), transactionIndex = "0x0"',
		[
			new Uint8Array([
				213, 103, 124, 246, 123, 90, 160, 81, 187, 64, 73, 110, 104, 173, 53, 158, 185, 124,
				251, 248,
			]),
			'0x0',
		],
	],
	// blockNumber = BlockTag, transactionIndex = HexString
	['blockNumber = BlockTags.LATEST, transactionIndex = "0x0"', [BlockTags.LATEST, '0x0']],
	['blockNumber = BlockTags.EARLIEST, transactionIndex = "0x0"', [BlockTags.EARLIEST, '0x0']],
	['blockNumber = BlockTags.PENDING, transactionIndex = "0x0"', [BlockTags.PENDING, '0x0']],
	// blockNumber = Numbers, transactionIndex = HexString
	['blockNumber = "0x4b7", transactionIndex = "0x0"', ['0x4b7', '0x0']],
	['blockNumber = 1207, transactionIndex = "0x0"', [1207, '0x0']],
	['blockNumber = "1207", transactionIndex = "0x0"', ['1207', '0x0']],
	['blockNumber = BigInt("0x4b7"), transactionIndex = "0x0"', [BigInt('0x4b7'), '0x0']],
	['blockNumber = undefined, transactionIndex = "0x0"', [undefined, '0x0']],

	// blockNumber = Bytes, transactionIndex = number
	[
		'blockNumber = "0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8", transactionIndex = 0',
		['0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8, transactionIndex = 0', 0],
	],
	[
		'blockNumber = Buffer("0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8", "hex"), transactionIndex = 0',
		[Buffer.from('0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8', 'hex'), 0],
	],
	[
		'blockNumber = Uint8Array("d5677cf67b5aa051bb40496e68ad359eb97cfbf8"), transactionIndex = 0',
		[
			new Uint8Array([
				213, 103, 124, 246, 123, 90, 160, 81, 187, 64, 73, 110, 104, 173, 53, 158, 185, 124,
				251, 248,
			]),
			0,
		],
	],
	// blockNumber = BlockTag, transactionIndex = number
	['blockNumber = BlockTags.LATEST, transactionIndex = 0', [BlockTags.LATEST, 0]],
	['blockNumber = BlockTags.EARLIEST, transactionIndex = 0', [BlockTags.EARLIEST, 0]],
	['blockNumber = BlockTags.PENDING, transactionIndex = 0', [BlockTags.PENDING, 0]],
	// blockNumber = Numbers, transactionIndex = number
	['blockNumber = "0x4b7"', ['0x4b7, transactionIndex = 0', 0]],
	['blockNumber = 1207, transactionIndex = 0', [1207, 0]],
	['blockNumber = "1207", transactionIndex = 0', ['1207', 0]],
	['blockNumber = BigInt("0x4b7"), transactionIndex = 0', [BigInt('0x4b7'), 0]],
	['blockNumber = undefined, transactionIndex = 0', [undefined, 0]],

	// blockNumber = Bytes, transactionIndex = NumberString
	[
		'blockNumber = "0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8", transactionIndex = "0"',
		['0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8', '0'],
	],
	[
		'blockNumber = Buffer("0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8", "hex"), transactionIndex = "0"',
		[Buffer.from('0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8', 'hex'), '0'],
	],
	[
		'blockNumber = Uint8Array("d5677cf67b5aa051bb40496e68ad359eb97cfbf8"), transactionIndex = "0"',
		[
			new Uint8Array([
				213, 103, 124, 246, 123, 90, 160, 81, 187, 64, 73, 110, 104, 173, 53, 158, 185, 124,
				251, 248,
			]),
			'0',
		],
	],
	// blockNumber = BlockTag, transactionIndex = NumberString
	['blockNumber = BlockTags.LATEST, transactionIndex = "0"', [BlockTags.LATEST, '0']],
	['blockNumber = BlockTags.EARLIEST, transactionIndex = "0"', [BlockTags.EARLIEST, '0']],
	['blockNumber = BlockTags.PENDING, transactionIndex = "0"', [BlockTags.PENDING, '0']],
	// blockNumber = Numbers, transactionIndex = NumberString
	['blockNumber = "0x4b7", transactionIndex = "0"', ['0x4b7', '0']],
	['blockNumber = 1207, transactionIndex = "0"', [1207, '0']],
	['blockNumber = "1207", transactionIndex = "0"', ['1207', '0']],
	['blockNumber = BigInt("0x4b7"), transactionIndex = "0"', [BigInt('0x4b7'), '0']],
	['blockNumber = undefined, transactionIndex = "0"', [undefined, '0']],

	// blockNumber = Bytes, transactionIndex = BigInt
	[
		'blockNumber = "0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8", transactionIndex = BigInt("0x0")',
		['0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8', BigInt('0x0')],
	],
	[
		'blockNumber = Buffer("0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8", "hex"), transactionIndex = BigInt("0x0")',
		[Buffer.from('0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8', 'hex'), BigInt('0x0')],
	],
	[
		'blockNumber = Uint8Array("d5677cf67b5aa051bb40496e68ad359eb97cfbf8"), transactionIndex = BigInt("0x0")',
		[
			new Uint8Array([
				213, 103, 124, 246, 123, 90, 160, 81, 187, 64, 73, 110, 104, 173, 53, 158, 185, 124,
				251, 248,
			]),
			BigInt('0x0'),
		],
	],
	// blockNumber = BlockTag, transactionIndex = BigInt
	[
		'blockNumber = BlockTags.LATEST, transactionIndex = BigInt("0x0")',
		[BlockTags.LATEST, BigInt('0x0')],
	],
	[
		'blockNumber = BlockTags.EARLIEST, transactionIndex = BigInt("0x0")',
		[BlockTags.EARLIEST, BigInt('0x0')],
	],
	[
		'blockNumber = BlockTags.PENDING, transactionIndex = BigInt("0x0")',
		[BlockTags.PENDING, BigInt('0x0')],
	],
	// blockNumber = Numbers, transactionIndex = BigInt
	['blockNumber = "0x4b7", transactionIndex = BigInt("0x0")', ['0x4b7', BigInt('0x0')]],
	['blockNumber = 1207, transactionIndex = BigInt("0x0")', [1207, BigInt('0x0')]],
	['blockNumber = "1207", transactionIndex = BigInt("0x0")', ['1207', BigInt('0x0')]],
	[
		'blockNumber = BigInt("0x4b7"), transactionIndex = BigInt("0x0")',
		[BigInt('0x4b7'), BigInt('0x0')],
	],
	['blockNumber = undefined, transactionIndex = BigInt("0x0")', [undefined, BigInt('0x0')]],
];
