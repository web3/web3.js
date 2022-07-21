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
import { BlockNumberOrTag, BlockTags, Bytes } from 'web3-types';

export const mockRpcResponse = '0xb';

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - blockNumber
 */
type TestData = [string, [Bytes | BlockNumberOrTag | undefined]];
export const testData: TestData[] = [
	// Testing block cases
	// blockNumber = bytes
	[
		'blockNumber = "0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8"',
		['0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8'],
	],
	[
		'blockNumber = Buffer("0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8", "hex")',
		[Buffer.from('0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8', 'hex')],
	],
	[
		'blockNumber = Uint8Array("d5677cf67b5aa051bb40496e68ad359eb97cfbf8")',
		[
			new Uint8Array([
				213, 103, 124, 246, 123, 90, 160, 81, 187, 64, 73, 110, 104, 173, 53, 158, 185, 124,
				251, 248,
			]),
		],
	],
	// blockNumber = BlockTag
	['blockNumber = BlockTags.LATEST', [BlockTags.LATEST]],
	['blockNumber = BlockTags.EARLIEST', [BlockTags.EARLIEST]],
	['blockNumber = BlockTags.PENDING', [BlockTags.PENDING]],
	// blockNumber = Numbers
	['blockNumber = "0x4b7"', ['0x4b7']],
	['blockNumber = 1207', [1207]],
	['blockNumber = "1207"', ['1207']],
	['blockNumber = BigInt("0x4b7")', [BigInt('0x4b7')]],
	['blockNumber = undefined', [undefined]],
];
