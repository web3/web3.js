import { BlockNumberOrTag, BlockTags, Bytes } from 'web3-utils';

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
