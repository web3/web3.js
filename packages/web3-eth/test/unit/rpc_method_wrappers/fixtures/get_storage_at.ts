import { Address, BlockNumberOrTag, BlockTags, Numbers } from 'web3-utils';

export const mockRpcResponse = '0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234';

const address = '0x407d73d8a49eeb85d32cf465507dd71d507100c1';

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - address
 *     - storageSlot
 *     - blockNumber
 */
type TestData = [string, [Address, Numbers, BlockNumberOrTag | undefined]];
export const testData: TestData[] = [
	// Testing storageSlot cases
	['storageSlot = "0x4b7", blockNumber = undefined', [address, '0x4b7', undefined]],
	['storageSlot = 1207, blockNumber = undefined', [address, 1207, undefined]],
	['storageSlot = "1207", blockNumber = undefined', [address, '1207', undefined]],
	[
		'storageSlot = BigInt("0x4b7"), blockNumber = undefined',
		[address, BigInt('0x4b7'), undefined],
	],
	// Testing blockNumber cases
	['storageSlot = "0x4b7", blockNumber = BlockTags.LATEST', [address, '0x4b7', BlockTags.LATEST]],
	[
		'storageSlot = "0x4b7", blockNumber = BlockTags.EARLIEST',
		[address, '0x4b7', BlockTags.EARLIEST],
	],
	[
		'storageSlot = "0x4b7", blockNumber = BlockTags.PENDING',
		[address, '0x4b7', BlockTags.PENDING],
	],
	['storageSlot = "0x4b7", blockNumber = "0x4b7"', [address, '0x4b7', '0x4b7']],
	['storageSlot = "0x4b7", blockNumber = 1207', [address, '0x4b7', 1207]],
	['storageSlot = "0x4b7", blockNumber = "1207"', [address, '0x4b7', '1207']],
	['storageSlot = "0x4b7", blockNumber = BigInt("0x4b7")', [address, '0x4b7', BigInt('0x4b7')]],
	['storageSlot = "0x4b7", blockNumber = undefined', [address, '0x4b7', undefined]],
];
