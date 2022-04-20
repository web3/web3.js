import { Address, BlockNumberOrTag, BlockTags } from 'web3-utils';

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
