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
import { FeeHistoryResultAPI, BlockNumberOrTag, BlockTags, Numbers } from 'web3-types';

export const mockRpcResponse: FeeHistoryResultAPI = {
	oldestBlock: '0xa30950',
	baseFeePerGas: '0x9',
	reward: [],
};

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - blockCount
 * 	   - newestBlock
 * 	   - rewardPercentiles
 */
type TestData = [string, [Numbers, BlockNumberOrTag | undefined, Numbers[]]];
export const testData: TestData[] = [
	// Testing blockCount cases
	[
		'blockCount = "0x4b7", newestBlock = "0xa30950", rewardPercentiles = ["0x0"]',
		['0x4b7', '0xa30950', ['0x0']],
	],
	[
		'blockCount = 1207, newestBlock = "0xa30950", rewardPercentiles = ["0x0"]',
		[1207, '0xa30950', ['0x0']],
	],
	[
		'blockCount = "1207", newestBlock = "0xa30950", rewardPercentiles = ["0x0"]',
		['1207', '0xa30950', ['0x0']],
	],
	[
		'blockCount = BigInt("0x4b7"), newestBlock = "0xa30950", rewardPercentiles = ["0x0"]',
		[BigInt('0x4b7'), '0xa30950', ['0x0']],
	],

	// Testing newestBlock cases
	// blockNumber = BlockTag
	[
		'blockCount = "0x4b7", newestBlock = BlockTags.LATEST, rewardPercentiles = ["0x0"]',
		['0x4b7', BlockTags.LATEST, ['0x0']],
	],
	[
		'blockCount = "0x4b7", newestBlock = BlockTags.EARLIEST, rewardPercentiles = ["0x0"]',
		['0x4b7', BlockTags.EARLIEST, ['0x0']],
	],
	[
		'blockCount = "0x4b7", newestBlock = BlockTags.PENDING, rewardPercentiles = ["0x0"]',
		['0x4b7', BlockTags.PENDING, ['0x0']],
	],
	// blockNumber = Numbers
	[
		'blockCount = "0x4b7", newestBlock = 1207, rewardPercentiles = ["0x0"]',
		['0x4b7', 1207, ['0x0']],
	],
	[
		'blockCount = "0x4b7", newestBlock = "1207", rewardPercentiles = ["0x0"]',
		['0x4b7', '1207', ['0x0']],
	],
	[
		'blockCount = "0x4b7", newestBlock = BigInt("0x4b7"), rewardPercentiles = ["0x0"]',
		['0x4b7', BigInt('0x4b7'), ['0x0']],
	],
	[
		'blockCount = "0x4b7", newestBlock = undefined, rewardPercentiles = ["0x0"]',
		['0x4b7', undefined, ['0x0']],
	],

	// Testing rewardPercentiles cases
	[
		'blockCount = "0x4b7", newestBlock = "0xa30950", rewardPercentiles = [0]',
		['0x4b7', '0xa30950', [0]],
	],
	[
		'blockCount = "0x4b7", newestBlock = "0xa30950", rewardPercentiles = ["0"]',
		['0x4b7', '0xa30950', ['0']],
	],
	[
		'blockCount = "0x4b7", newestBlock = "0xa30950", rewardPercentiles = [BigInt("0x0")]',
		['0x4b7', '0xa30950', [BigInt('0x0')]],
	],
];
