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
import { Address, BlockNumberOrTag, BlockTags } from 'web3-types';

export const mockRpcResponse =
	'0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056';

const address = '0x407d73d8a49eeb85d32cf465507dd71d507100c1';

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - address
 *     - blockNumber
 */
type TestData = [string, [Address, BlockNumberOrTag | undefined]];
export const testData: TestData[] = [
	// Testing blockNumber cases
	['blockNumber = BlockTags.LATEST', [address, BlockTags.LATEST]],
	['blockNumber = BlockTags.EARLIEST', [address, BlockTags.EARLIEST]],
	['blockNumber = BlockTags.PENDING', [address, BlockTags.PENDING]],
	['blockNumber = "0x4b7"', [address, '0x4b7']],
	['blockNumber = 1207', [address, 1207]],
	['blockNumber = "1207"', [address, '1207']],
	['blockNumber = BigInt("0x4b7")', [address, BigInt('0x4b7')]],
	['blockNumber = undefined', [address, undefined]],
];
