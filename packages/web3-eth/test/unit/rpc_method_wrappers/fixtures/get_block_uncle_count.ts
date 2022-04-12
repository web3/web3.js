import { DataFormat } from 'web3-common';
import { BlockTags, Bytes, HexString } from 'web3-utils';

import { BlockNumberOrTag } from '../../../../src/types';
import { returnFormats } from './return_formats';

const mockRpcResponse = '0xb';

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - block (identifier e.g. hash, block number, or BlockTag)
 */
export const testCases: [string, [Bytes | BlockNumberOrTag | undefined]][] = [
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

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - blockNumber
 *     - returnFormat
 * - mockRpcResponse (formatted as returnFormat)
 */
type TestData = [string, [Bytes | BlockNumberOrTag | undefined, DataFormat], HexString];

/**
 * For each testCase in testCases, we add a version of testCase with each returnFormat in returnFormats.
 * This also adds mockRpcResponse to each testCase
 */
export const testData = (() => {
	const _testData: TestData[] = [];
	for (const testCase of testCases) {
		for (const returnFormat of returnFormats) {
			const [testTitle, inputParameters] = testCase;
			_testData.push([
				testTitle,
				[...inputParameters, returnFormat],
				mockRpcResponse,
			]);
		}
	}
	return _testData;
})();
