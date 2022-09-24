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
import { BlockNumberOrTag, BlockTags } from 'web3-types';

export const mockRpcResponse = '0xb';

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - blockNumber
 *     - hydrated
 */
type TestData = [string, [BlockNumberOrTag, boolean]];
export const testData: TestData[] = [
	[
		'blockNumber = "0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8"',
		['0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8', true],
	],
	['blockNumber = BlockTags.LATEST', [BlockTags.LATEST, true]],
	['blockNumber = BlockTags.EARLIEST', [BlockTags.EARLIEST, true]],
	['blockNumber = BlockTags.PENDING', [BlockTags.PENDING, true]],
	['blockNumber = "0x4b7"', ['0x4b7', true]],
];
