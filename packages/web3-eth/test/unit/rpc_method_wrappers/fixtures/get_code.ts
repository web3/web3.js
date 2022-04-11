import { DataFormat, format } from 'web3-common';
import { Address, BlockTags, Bytes } from 'web3-utils';

import { BlockNumberOrTag } from '../../../../src/types';
import { returnFormats } from './return_formats';

const address = '0x407d73d8a49eeb85d32cf465507dd71d507100c1';
const mockRpcResponse =
	'0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056';

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - address
 *     - blockNumber
 */
export const testCases: [string, [Address, BlockNumberOrTag | undefined]][] = [
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

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - address
 *     - blockNumber
 *     - returnFormat
 * - mockRpcResponse (formatted as returnFormat)
 */
type TestData = [string, [Address, BlockNumberOrTag | undefined, DataFormat], Bytes];

/**
 * For each testCase in testCases, we add a version of testCase with each returnFormat in returnFormats.
 * This also adds mockRpcResponse formatted as returnFormat
 */
export const testData = (() => {
	const _testData: TestData[] = [];
	for (const testCase of testCases) {
		for (const returnFormat of returnFormats) {
			const [testTitle, inputParameters] = testCase;
			const mockRpcResponseFormatted = format(
				{ eth: 'bytes' },
				mockRpcResponse,
				returnFormat,
			);
			_testData.push([
				testTitle,
				[...inputParameters, returnFormat],
				mockRpcResponseFormatted,
			]);
		}
	}
	return _testData;
})();
