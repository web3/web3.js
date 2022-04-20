import { Address, BlockNumberOrTag, BlockTags } from 'web3-utils';

export const mockRpcResponse = '0xe8d4a51000';

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
	['blockNumber = BlockTags.LATEST', [address, BlockTags.LATEST]],
	['blockNumber = BlockTags.EARLIEST', [address, BlockTags.EARLIEST]],
	['blockNumber = BlockTags.PENDING', [address, BlockTags.PENDING]],
	['blockNumber = "0x4b7"', [address, '0x4b7']],
	['blockNumber = 1207', [address, 1207]],
	['blockNumber = "1207"', [address, '1207']],
	['blockNumber = BigInt("0x4b7")', [address, BigInt('0x4b7')]],
	['blockNumber = undefined', [address, undefined]],
];
