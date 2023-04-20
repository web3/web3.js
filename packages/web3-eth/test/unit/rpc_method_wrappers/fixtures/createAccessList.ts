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
import {
	BlockNumberOrTag,
	BlockTags,
	DataFormat,
	DEFAULT_RETURN_FORMAT,
	TransactionForAccessList,
} from 'web3-types';

export const mockRpcResponse =
	'{"accessList":[{"address":"0x15859bdf5aff2080a9968f6a410361e9598df62f","storageKeys":["0x0000000000000000000000000000000000000000000000000000000000000000"]}],"gasUsed":"0x7671"}';

const transaction: TransactionForAccessList = {
	from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
	to: '0x940b25304947ae863568B3804434EC77E2160b87',
	value: '0x0',
	gas: '0x5208',
	gasPrice: '0x4a817c800',
	data: '0x9a67c8b100000000000000000000000000000000000000000000000000000000000004d0',
};

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - transaction
 *     - blocknumberortag
 * - mockRpcResponse
 */
type TestData = [string, [TransactionForAccessList, BlockNumberOrTag | undefined, DataFormat]];
export const testData: TestData[] = [
	// blockNumber = BlockTag
	[
		`${JSON.stringify(transaction)}\nblockNumber = BlockTags.LATEST`,
		[transaction, BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		`${JSON.stringify(transaction)}\nblockNumber = BlockTags.EARLIEST`,
		[transaction, BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		`${JSON.stringify(transaction)}\nblockNumber = BlockTags.PENDING`,
		[transaction, BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	[
		`${JSON.stringify(transaction)}\nblockNumber = BlockTags.SAFE`,
		[transaction, BlockTags.SAFE, DEFAULT_RETURN_FORMAT],
	],
	[
		`${JSON.stringify(transaction)}\nblockNumber = BlockTags.FINALIZED`,
		[transaction, BlockTags.FINALIZED, DEFAULT_RETURN_FORMAT],
	],
	// blockNumber = Numbers
	[
		`${JSON.stringify(transaction)}\nblockNumber = "0x4b7"`,
		[transaction, '0x4b7', DEFAULT_RETURN_FORMAT],
	],
	[
		`${JSON.stringify(transaction)}\nblockNumber = 1207`,
		[transaction, 1207, DEFAULT_RETURN_FORMAT],
	],
	[
		`${JSON.stringify(transaction)}\nblockNumber = "1207"`,
		[transaction, '1207', DEFAULT_RETURN_FORMAT],
	],
	[
		`${JSON.stringify(transaction)}\nblockNumber = BigInt("0x4b7")`,
		[transaction, BigInt('0x4b7'), DEFAULT_RETURN_FORMAT],
	],
	[
		`${JSON.stringify(transaction)}\nblockNumber = undefined`,
		[transaction, BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
];
