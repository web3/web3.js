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
import { BlockNumberOrTag, BlockTags, Uint } from 'web3-types';

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - blockNumber
 *     - transactionIndex
 */
type TestData = [string, [BlockNumberOrTag, Uint]];
export const testData: TestData[] = [
	[
		'blockNumber = "0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8"',
		['0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8', '0x88df016'],
	],
	['blockNumber = BlockTags.LATEST', [BlockTags.LATEST, '0x88df016']],
	['blockNumber = BlockTags.EARLIEST', [BlockTags.EARLIEST, '0x88df016']],
	['blockNumber = BlockTags.PENDING', [BlockTags.PENDING, '0x88df016']],
	['blockNumber = "0x4b7"', ['0x4b7', '0x88df016']],
];
