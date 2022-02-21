import { TransactionWithSender } from 'web3-common';
import {
	Address,
	BlockNumberOrTag,
	BlockTags,
	Filter,
	HexString32Bytes,
	HexString8Bytes,
	HexStringBytes,
	Uint,
	Uint256,
	ValidTypes,
} from 'web3-utils';
import { transactionWithSender } from './rpc_methods_wrappers';

// Array consists of: returnType parameter
export const getHashRateValidData: [ValidTypes | undefined][] = [
	[undefined],
	[ValidTypes.HexString],
	[ValidTypes.NumberString],
	[ValidTypes.Number],
	[ValidTypes.BigInt],
];

// Array consists of: returnType parameter, mock RPC result, expected output
export const getGasPriceValidData: [ValidTypes | undefined][] = [
	[undefined],
	[ValidTypes.HexString],
	[ValidTypes.NumberString],
	[ValidTypes.Number],
	[ValidTypes.BigInt],
];

// Array consists of: returnType parameter
export const getBlockNumberValidData: [ValidTypes | undefined][] = [
	[undefined],
	[ValidTypes.HexString],
	[ValidTypes.NumberString],
	[ValidTypes.Number],
	[ValidTypes.BigInt],
];

// Array consists of: returnType parameter
export const getChainIdValidData: [ValidTypes | undefined][] = [
	[undefined],
	[ValidTypes.HexString],
	[ValidTypes.NumberString],
	[ValidTypes.Number],
	[ValidTypes.BigInt],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getBalanceValidData: [
	[Address, BlockNumberOrTag | undefined, ValidTypes | undefined],
	[Address, BlockNumberOrTag, ValidTypes | undefined],
][] = [
	// All possible undefined values
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, undefined],
	],
	// Defined blockNumber, undefined returnType
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, undefined],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, undefined],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, undefined],
	],
	// Undefined blockNumber, returnType = ValidTypes.HexString
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined, ValidTypes.HexString],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.HexString],
	],
	// Defined blockNumber, returnType = ValidTypes.HexString
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.HexString],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.HexString],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.HexString],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.HexString],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.HexString],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.HexString],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7', ValidTypes.HexString],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7', ValidTypes.HexString],
	],
	// Undefined blockNumber, returnType = ValidTypes.NumberString
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined, ValidTypes.NumberString],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.NumberString],
	],
	// Defined blockNumber, returnType = ValidTypes.NumberString
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.NumberString],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.NumberString],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.NumberString],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.NumberString],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.NumberString],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.NumberString],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7', ValidTypes.NumberString],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7', ValidTypes.NumberString],
	],
	// Undefined blockNumber, returnType = ValidTypes.Number
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined, ValidTypes.Number],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.Number],
	],
	// Defined blockNumber, returnType = ValidTypes.Number
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.Number],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.Number],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.Number],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.Number],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.Number],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.Number],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7', ValidTypes.Number],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7', ValidTypes.Number],
	],
	// Undefined blockNumber, returnType = ValidTypes.BigInt
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined, ValidTypes.BigInt],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.BigInt],
	],
	// Defined blockNumber, returnType = ValidTypes.BigInt
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.BigInt],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.BigInt],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.BigInt],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.BigInt],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.BigInt],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.BigInt],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7', ValidTypes.BigInt],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7', ValidTypes.BigInt],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getBlockValidData: [
	[HexString32Bytes | BlockNumberOrTag | undefined, boolean | undefined, ValidTypes | undefined],
	[HexString32Bytes | BlockNumberOrTag, boolean, ValidTypes | undefined],
][] = [
	// All possible undefined values
	[
		[undefined, undefined, undefined],
		[BlockTags.LATEST, false, undefined],
	],
	// Defined block, undefined hydrated and returnType
	[
		[
			'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
			undefined,
			undefined,
		],
		['0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae', false, undefined],
	],
	[
		[BlockTags.LATEST, undefined, undefined],
		[BlockTags.LATEST, false, undefined],
	],
	[
		[BlockTags.EARLIEST, undefined, undefined],
		[BlockTags.EARLIEST, false, undefined],
	],
	[
		[BlockTags.PENDING, undefined, undefined],
		[BlockTags.PENDING, false, undefined],
	],
	// Defined block, hydrated = true, and undefined returnType
	[
		[BlockTags.LATEST, true, undefined],
		[BlockTags.LATEST, true, undefined],
	],
	[
		[BlockTags.EARLIEST, true, undefined],
		[BlockTags.EARLIEST, true, undefined],
	],
	[
		[BlockTags.PENDING, true, undefined],
		[BlockTags.PENDING, true, undefined],
	],
	// Defined block, hydrated = false, and undefined returnType
	[
		[BlockTags.LATEST, false, undefined],
		[BlockTags.LATEST, false, undefined],
	],
	[
		[BlockTags.EARLIEST, false, undefined],
		[BlockTags.EARLIEST, false, undefined],
	],
	[
		[BlockTags.PENDING, false, undefined],
		[BlockTags.PENDING, false, undefined],
	],
	// Defined block, hydrated = true, and returnType = ValidTypes.HexString
	[
		[BlockTags.LATEST, true, ValidTypes.HexString],
		[BlockTags.LATEST, true, ValidTypes.HexString],
	],
	[
		[BlockTags.EARLIEST, true, ValidTypes.HexString],
		[BlockTags.EARLIEST, true, ValidTypes.HexString],
	],
	[
		[BlockTags.PENDING, true, ValidTypes.HexString],
		[BlockTags.PENDING, true, ValidTypes.HexString],
	],
	// Defined block, hydrated = true, and returnType = ValidTypes.NumberString
	[
		[BlockTags.LATEST, true, ValidTypes.NumberString],
		[BlockTags.LATEST, true, ValidTypes.NumberString],
	],
	[
		[BlockTags.EARLIEST, true, ValidTypes.NumberString],
		[BlockTags.EARLIEST, true, ValidTypes.NumberString],
	],
	[
		[BlockTags.PENDING, true, ValidTypes.NumberString],
		[BlockTags.PENDING, true, ValidTypes.NumberString],
	],
	// Defined block, hydrated = true, and returnType = ValidTypes.Number
	[
		[BlockTags.LATEST, true, ValidTypes.Number],
		[BlockTags.LATEST, true, ValidTypes.Number],
	],
	[
		[BlockTags.EARLIEST, true, ValidTypes.Number],
		[BlockTags.EARLIEST, true, ValidTypes.Number],
	],
	[
		[BlockTags.PENDING, true, ValidTypes.Number],
		[BlockTags.PENDING, true, ValidTypes.Number],
	],
	// Defined block, hydrated = true, and returnType = ValidTypes.BigInt
	[
		[BlockTags.LATEST, true, ValidTypes.BigInt],
		[BlockTags.LATEST, true, ValidTypes.BigInt],
	],
	[
		[BlockTags.EARLIEST, true, ValidTypes.BigInt],
		[BlockTags.EARLIEST, true, ValidTypes.BigInt],
	],
	[
		[BlockTags.PENDING, true, ValidTypes.BigInt],
		[BlockTags.PENDING, true, ValidTypes.BigInt],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getBlockTransactionCountValidData: [
	[HexString32Bytes | BlockNumberOrTag | undefined, ValidTypes | undefined],
	[HexString32Bytes | BlockNumberOrTag, ValidTypes | undefined],
][] = [
	// All possible undefined values
	[
		[undefined, undefined],
		[BlockTags.LATEST, undefined],
	],
	// Defined block, undefined returnType
	[
		['0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae', undefined],
		['0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae', undefined],
	],
	[
		[BlockTags.LATEST, undefined],
		[BlockTags.LATEST, undefined],
	],
	[
		[BlockTags.EARLIEST, undefined],
		[BlockTags.EARLIEST, undefined],
	],
	[
		[BlockTags.PENDING, undefined],
		[BlockTags.PENDING, undefined],
	],
	// Defined block and returnType = ValidTypes.HexString
	[
		[BlockTags.LATEST, ValidTypes.HexString],
		[BlockTags.LATEST, ValidTypes.HexString],
	],
	[
		[BlockTags.EARLIEST, ValidTypes.HexString],
		[BlockTags.EARLIEST, ValidTypes.HexString],
	],
	[
		[BlockTags.PENDING, ValidTypes.HexString],
		[BlockTags.PENDING, ValidTypes.HexString],
	],
	// Defined block and returnType = ValidTypes.NumberString
	[
		[BlockTags.LATEST, ValidTypes.NumberString],
		[BlockTags.LATEST, ValidTypes.NumberString],
	],
	[
		[BlockTags.EARLIEST, ValidTypes.NumberString],
		[BlockTags.EARLIEST, ValidTypes.NumberString],
	],
	[
		[BlockTags.PENDING, ValidTypes.NumberString],
		[BlockTags.PENDING, ValidTypes.NumberString],
	],
	// Defined block, hydrated = true, and returnType = ValidTypes.Number
	[
		[BlockTags.LATEST, ValidTypes.Number],
		[BlockTags.LATEST, ValidTypes.Number],
	],
	[
		[BlockTags.EARLIEST, ValidTypes.Number],
		[BlockTags.EARLIEST, ValidTypes.Number],
	],
	[
		[BlockTags.PENDING, ValidTypes.Number],
		[BlockTags.PENDING, ValidTypes.Number],
	],
	// Defined block and returnType = ValidTypes.BigInt
	[
		[BlockTags.LATEST, ValidTypes.BigInt],
		[BlockTags.LATEST, ValidTypes.BigInt],
	],
	[
		[BlockTags.EARLIEST, ValidTypes.BigInt],
		[BlockTags.EARLIEST, ValidTypes.BigInt],
	],
	[
		[BlockTags.PENDING, ValidTypes.BigInt],
		[BlockTags.PENDING, ValidTypes.BigInt],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getBlockUncleCountValidData: [
	[HexString32Bytes | BlockNumberOrTag | undefined, ValidTypes | undefined],
	[HexString32Bytes | BlockNumberOrTag, ValidTypes | undefined],
][] = [
	// All possible undefined values
	[
		[undefined, undefined],
		[BlockTags.LATEST, undefined],
	],
	// Defined block, undefined returnType
	[
		['0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae', undefined],
		['0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae', undefined],
	],
	[
		[BlockTags.LATEST, undefined],
		[BlockTags.LATEST, undefined],
	],
	[
		[BlockTags.EARLIEST, undefined],
		[BlockTags.EARLIEST, undefined],
	],
	[
		[BlockTags.PENDING, undefined],
		[BlockTags.PENDING, undefined],
	],
	// Defined block and returnType = ValidTypes.HexString
	[
		[BlockTags.LATEST, ValidTypes.HexString],
		[BlockTags.LATEST, ValidTypes.HexString],
	],
	[
		[BlockTags.EARLIEST, ValidTypes.HexString],
		[BlockTags.EARLIEST, ValidTypes.HexString],
	],
	[
		[BlockTags.PENDING, ValidTypes.HexString],
		[BlockTags.PENDING, ValidTypes.HexString],
	],
	// Defined block and returnType = ValidTypes.NumberString
	[
		[BlockTags.LATEST, ValidTypes.NumberString],
		[BlockTags.LATEST, ValidTypes.NumberString],
	],
	[
		[BlockTags.EARLIEST, ValidTypes.NumberString],
		[BlockTags.EARLIEST, ValidTypes.NumberString],
	],
	[
		[BlockTags.PENDING, ValidTypes.NumberString],
		[BlockTags.PENDING, ValidTypes.NumberString],
	],
	// Defined block, hydrated = true, and returnType = ValidTypes.Number
	[
		[BlockTags.LATEST, ValidTypes.Number],
		[BlockTags.LATEST, ValidTypes.Number],
	],
	[
		[BlockTags.EARLIEST, ValidTypes.Number],
		[BlockTags.EARLIEST, ValidTypes.Number],
	],
	[
		[BlockTags.PENDING, ValidTypes.Number],
		[BlockTags.PENDING, ValidTypes.Number],
	],
	// Defined block and returnType = ValidTypes.BigInt
	[
		[BlockTags.LATEST, ValidTypes.BigInt],
		[BlockTags.LATEST, ValidTypes.BigInt],
	],
	[
		[BlockTags.EARLIEST, ValidTypes.BigInt],
		[BlockTags.EARLIEST, ValidTypes.BigInt],
	],
	[
		[BlockTags.PENDING, ValidTypes.BigInt],
		[BlockTags.PENDING, ValidTypes.BigInt],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getUncleValidData: [
	[HexString32Bytes | BlockNumberOrTag | undefined, Uint, ValidTypes | undefined],
	[HexString32Bytes | BlockNumberOrTag, Uint, ValidTypes | undefined],
][] = [
	// All possible undefined values
	[
		[undefined, '0x0', undefined],
		[BlockTags.LATEST, '0x0', undefined],
	],
	// Defined block, uncleIndex = '0x0', and undefined returnType
	[
		['0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2', '0x0', undefined],
		['0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2', '0x0', undefined],
	],
	[
		[BlockTags.LATEST, '0x0', undefined],
		[BlockTags.LATEST, '0x0', undefined],
	],
	[
		[BlockTags.EARLIEST, '0x0', undefined],
		[BlockTags.EARLIEST, '0x0', undefined],
	],
	[
		[BlockTags.PENDING, '0x0', undefined],
		[BlockTags.PENDING, '0x0', undefined],
	],
	// Defined block, uncleIndex = '0x0', and undefined returnType
	[
		[BlockTags.LATEST, '0x0', undefined],
		[BlockTags.LATEST, '0x0', undefined],
	],
	[
		[BlockTags.EARLIEST, '0x0', undefined],
		[BlockTags.EARLIEST, '0x0', undefined],
	],
	[
		[BlockTags.PENDING, '0x0', undefined],
		[BlockTags.PENDING, '0x0', undefined],
	],
	// Defined block, uncleIndex = true, and returnType = ValidTypes.HexString
	[
		[BlockTags.LATEST, '0x0', ValidTypes.HexString],
		[BlockTags.LATEST, '0x0', ValidTypes.HexString],
	],
	[
		[BlockTags.EARLIEST, '0x0', ValidTypes.HexString],
		[BlockTags.EARLIEST, '0x0', ValidTypes.HexString],
	],
	[
		[BlockTags.PENDING, '0x0', ValidTypes.HexString],
		[BlockTags.PENDING, '0x0', ValidTypes.HexString],
	],
	// Defined block, uncleIndex = '0x0', and returnType = ValidTypes.NumberString
	[
		[BlockTags.LATEST, '0x0', ValidTypes.NumberString],
		[BlockTags.LATEST, '0x0', ValidTypes.NumberString],
	],
	[
		[BlockTags.EARLIEST, '0x0', ValidTypes.NumberString],
		[BlockTags.EARLIEST, '0x0', ValidTypes.NumberString],
	],
	[
		[BlockTags.PENDING, '0x0', ValidTypes.NumberString],
		[BlockTags.PENDING, '0x0', ValidTypes.NumberString],
	],
	// Defined block, uncleIndex = '0x0', and returnType = ValidTypes.Number
	[
		[BlockTags.LATEST, '0x0', ValidTypes.Number],
		[BlockTags.LATEST, '0x0', ValidTypes.Number],
	],
	[
		[BlockTags.EARLIEST, '0x0', ValidTypes.Number],
		[BlockTags.EARLIEST, '0x0', ValidTypes.Number],
	],
	[
		[BlockTags.PENDING, '0x0', ValidTypes.Number],
		[BlockTags.PENDING, '0x0', ValidTypes.Number],
	],
	// Defined block, uncleIndex = '0x0', and returnType = ValidTypes.BigInt
	[
		[BlockTags.LATEST, '0x0', ValidTypes.BigInt],
		[BlockTags.LATEST, '0x0', ValidTypes.BigInt],
	],
	[
		[BlockTags.EARLIEST, '0x0', ValidTypes.BigInt],
		[BlockTags.EARLIEST, '0x0', ValidTypes.BigInt],
	],
	[
		[BlockTags.PENDING, '0x0', ValidTypes.BigInt],
		[BlockTags.PENDING, '0x0', ValidTypes.BigInt],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 * - expected output
 */
export const getTransactionValidData: [
	[HexString32Bytes, ValidTypes | undefined],
	[HexString32Bytes, ValidTypes | undefined],
][] = [
	// Defined transactionHash, undefined returnType
	[
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', undefined],
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', undefined],
	],
	// Defined transactionHash and returnType = ValidTypes.HexString
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			ValidTypes.HexString,
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			ValidTypes.HexString,
		],
	],
	// Defined transactionHash and returnType = ValidTypes.NumberString
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			ValidTypes.NumberString,
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			ValidTypes.NumberString,
		],
	],
	// Defined block, hydrated = true, and returnType = ValidTypes.Number
	[
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', ValidTypes.Number],
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', ValidTypes.Number],
	],
	// Defined block and returnType = ValidTypes.BigInt
	[
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', ValidTypes.BigInt],
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', ValidTypes.BigInt],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getTransactionFromBlockValidData: [
	[HexString32Bytes | BlockNumberOrTag | undefined, Uint, ValidTypes | undefined],
	[HexString32Bytes | BlockNumberOrTag, Uint, ValidTypes | undefined],
][] = [
	// All possible undefined values
	[
		[undefined, '0x0', undefined],
		[BlockTags.LATEST, '0x0', undefined],
	],
	// Defined block, uncleIndex = '0x0', and undefined returnType
	[
		['0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2', '0x0', undefined],
		['0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2', '0x0', undefined],
	],
	[
		[BlockTags.LATEST, '0x0', undefined],
		[BlockTags.LATEST, '0x0', undefined],
	],
	[
		[BlockTags.EARLIEST, '0x0', undefined],
		[BlockTags.EARLIEST, '0x0', undefined],
	],
	[
		[BlockTags.PENDING, '0x0', undefined],
		[BlockTags.PENDING, '0x0', undefined],
	],
	// Defined block, uncleIndex = '0x0', and undefined returnType
	[
		[BlockTags.LATEST, '0x0', undefined],
		[BlockTags.LATEST, '0x0', undefined],
	],
	[
		[BlockTags.EARLIEST, '0x0', undefined],
		[BlockTags.EARLIEST, '0x0', undefined],
	],
	[
		[BlockTags.PENDING, '0x0', undefined],
		[BlockTags.PENDING, '0x0', undefined],
	],
	// Defined block, uncleIndex = true, and returnType = ValidTypes.HexString
	[
		[BlockTags.LATEST, '0x0', ValidTypes.HexString],
		[BlockTags.LATEST, '0x0', ValidTypes.HexString],
	],
	[
		[BlockTags.EARLIEST, '0x0', ValidTypes.HexString],
		[BlockTags.EARLIEST, '0x0', ValidTypes.HexString],
	],
	[
		[BlockTags.PENDING, '0x0', ValidTypes.HexString],
		[BlockTags.PENDING, '0x0', ValidTypes.HexString],
	],
	// Defined block, uncleIndex = '0x0', and returnType = ValidTypes.NumberString
	[
		[BlockTags.LATEST, '0x0', ValidTypes.NumberString],
		[BlockTags.LATEST, '0x0', ValidTypes.NumberString],
	],
	[
		[BlockTags.EARLIEST, '0x0', ValidTypes.NumberString],
		[BlockTags.EARLIEST, '0x0', ValidTypes.NumberString],
	],
	[
		[BlockTags.PENDING, '0x0', ValidTypes.NumberString],
		[BlockTags.PENDING, '0x0', ValidTypes.NumberString],
	],
	// Defined block, uncleIndex = '0x0', and returnType = ValidTypes.Number
	[
		[BlockTags.LATEST, '0x0', ValidTypes.Number],
		[BlockTags.LATEST, '0x0', ValidTypes.Number],
	],
	[
		[BlockTags.EARLIEST, '0x0', ValidTypes.Number],
		[BlockTags.EARLIEST, '0x0', ValidTypes.Number],
	],
	[
		[BlockTags.PENDING, '0x0', ValidTypes.Number],
		[BlockTags.PENDING, '0x0', ValidTypes.Number],
	],
	// Defined block, uncleIndex = '0x0', and returnType = ValidTypes.BigInt
	[
		[BlockTags.LATEST, '0x0', ValidTypes.BigInt],
		[BlockTags.LATEST, '0x0', ValidTypes.BigInt],
	],
	[
		[BlockTags.EARLIEST, '0x0', ValidTypes.BigInt],
		[BlockTags.EARLIEST, '0x0', ValidTypes.BigInt],
	],
	[
		[BlockTags.PENDING, '0x0', ValidTypes.BigInt],
		[BlockTags.PENDING, '0x0', ValidTypes.BigInt],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getTransactionReceiptValidData: [
	[HexString32Bytes, ValidTypes | undefined],
	[HexString32Bytes, ValidTypes | undefined],
][] = [
	// Defined block, undefined returnType
	[
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', undefined],
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', undefined],
	],
	// Defined block and returnType = ValidTypes.HexString
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			ValidTypes.HexString,
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			ValidTypes.HexString,
		],
	],
	// Defined block and returnType = ValidTypes.NumberString
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			ValidTypes.NumberString,
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			ValidTypes.NumberString,
		],
	],
	// Defined block, hydrated = true, and returnType = ValidTypes.Number
	[
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', ValidTypes.Number],
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', ValidTypes.Number],
	],
	// Defined block and returnType = ValidTypes.BigInt
	[
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', ValidTypes.BigInt],
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', ValidTypes.BigInt],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getTransactionCountValidData: [
	[Address, HexString32Bytes | BlockNumberOrTag | undefined, ValidTypes | undefined],
	[Address, HexString32Bytes | BlockNumberOrTag, ValidTypes | undefined],
][] = [
	// All possible undefined values
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, undefined],
	],
	// Defined address and block number, undefined returnType
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
			undefined,
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
			undefined,
		],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, undefined],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, undefined],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, undefined],
	],
	// Defined block, uncleIndex = and undefined returnType
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, undefined],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, undefined],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, undefined],
	],
	// Defined block, uncleIndex = true, and returnType = ValidTypes.HexString
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.HexString],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.HexString],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.HexString],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.HexString],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.HexString],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.HexString],
	],
	// Defined block, uncleIndex = and returnType = ValidTypes.NumberString
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.NumberString],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.NumberString],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.NumberString],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.NumberString],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.NumberString],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.NumberString],
	],
	// Defined block, uncleIndex = and returnType = ValidTypes.Number
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.Number],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.Number],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.Number],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.Number],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.Number],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.Number],
	],
	// Defined block, uncleIndex = and returnType = ValidTypes.BigInt
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.BigInt],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.BigInt],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.BigInt],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.BigInt],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.BigInt],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.BigInt],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const estimateGasValidData: [
	[
		Partial<TransactionWithSender>,
		HexString32Bytes | BlockNumberOrTag | undefined,
		ValidTypes | undefined,
	],
	[Partial<TransactionWithSender>, HexString32Bytes | BlockNumberOrTag, ValidTypes | undefined],
][] = [
	// All possible undefined values
	[
		[transactionWithSender, undefined, undefined],
		[transactionWithSender, BlockTags.LATEST, undefined],
	],
	// Defined transaction and block number, undefined returnType
	[
		[
			transactionWithSender,
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
			undefined,
		],
		[
			transactionWithSender,
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
			undefined,
		],
	],
	[
		[transactionWithSender, BlockTags.LATEST, undefined],
		[transactionWithSender, BlockTags.LATEST, undefined],
	],
	[
		[transactionWithSender, BlockTags.EARLIEST, undefined],
		[transactionWithSender, BlockTags.EARLIEST, undefined],
	],
	[
		[transactionWithSender, BlockTags.PENDING, undefined],
		[transactionWithSender, BlockTags.PENDING, undefined],
	],
	// Defined transaction and block number, undefined returnType
	[
		[transactionWithSender, BlockTags.LATEST, undefined],
		[transactionWithSender, BlockTags.LATEST, undefined],
	],
	[
		[transactionWithSender, BlockTags.EARLIEST, undefined],
		[transactionWithSender, BlockTags.EARLIEST, undefined],
	],
	[
		[transactionWithSender, BlockTags.PENDING, undefined],
		[transactionWithSender, BlockTags.PENDING, undefined],
	],
	// Defined transaction and block number, returnType = ValidTypes.HexString
	[
		[transactionWithSender, BlockTags.LATEST, ValidTypes.HexString],
		[transactionWithSender, BlockTags.LATEST, ValidTypes.HexString],
	],
	[
		[transactionWithSender, BlockTags.EARLIEST, ValidTypes.HexString],
		[transactionWithSender, BlockTags.EARLIEST, ValidTypes.HexString],
	],
	[
		[transactionWithSender, BlockTags.PENDING, ValidTypes.HexString],
		[transactionWithSender, BlockTags.PENDING, ValidTypes.HexString],
	],
	// Defined transaction and block number, returnType = ValidTypes.NumberString
	[
		[transactionWithSender, BlockTags.LATEST, ValidTypes.NumberString],
		[transactionWithSender, BlockTags.LATEST, ValidTypes.NumberString],
	],
	[
		[transactionWithSender, BlockTags.EARLIEST, ValidTypes.NumberString],
		[transactionWithSender, BlockTags.EARLIEST, ValidTypes.NumberString],
	],
	[
		[transactionWithSender, BlockTags.PENDING, ValidTypes.NumberString],
		[transactionWithSender, BlockTags.PENDING, ValidTypes.NumberString],
	],
	// Defined transaction and block number, returnType = ValidTypes.Number
	[
		[transactionWithSender, BlockTags.LATEST, ValidTypes.Number],
		[transactionWithSender, BlockTags.LATEST, ValidTypes.Number],
	],
	[
		[transactionWithSender, BlockTags.EARLIEST, ValidTypes.Number],
		[transactionWithSender, BlockTags.EARLIEST, ValidTypes.Number],
	],
	[
		[transactionWithSender, BlockTags.PENDING, ValidTypes.Number],
		[transactionWithSender, BlockTags.PENDING, ValidTypes.Number],
	],
	// Defined transaction and block number, returnType = ValidTypes.BigInt
	[
		[transactionWithSender, BlockTags.LATEST, ValidTypes.BigInt],
		[transactionWithSender, BlockTags.LATEST, ValidTypes.BigInt],
	],
	[
		[transactionWithSender, BlockTags.EARLIEST, ValidTypes.BigInt],
		[transactionWithSender, BlockTags.EARLIEST, ValidTypes.BigInt],
	],
	[
		[transactionWithSender, BlockTags.PENDING, ValidTypes.BigInt],
		[transactionWithSender, BlockTags.PENDING, ValidTypes.BigInt],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getFeeHistoryValidData: [
	[Uint, HexString32Bytes | BlockNumberOrTag | undefined, number[], ValidTypes | undefined],
	[Uint, HexString32Bytes | BlockNumberOrTag, number[], ValidTypes | undefined],
][] = [
	// All possible undefined values
	[
		['0x4', undefined, [], undefined],
		['0x4', BlockTags.LATEST, [], undefined],
	],
	// Defined transaction and block number, undefined returnType
	[
		[
			'0x4',
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
			[],
			undefined,
		],
		[
			'0x4',
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
			[],
			undefined,
		],
	],
	[
		['0x4', BlockTags.LATEST, [], undefined],
		['0x4', BlockTags.LATEST, [], undefined],
	],
	[
		['0x4', BlockTags.EARLIEST, [], undefined],
		['0x4', BlockTags.EARLIEST, [], undefined],
	],
	[
		['0x4', BlockTags.PENDING, [], undefined],
		['0x4', BlockTags.PENDING, [], undefined],
	],
	// Defined transaction and block number, undefined returnType
	[
		['0x4', BlockTags.LATEST, [], undefined],
		['0x4', BlockTags.LATEST, [], undefined],
	],
	[
		['0x4', BlockTags.EARLIEST, [], undefined],
		['0x4', BlockTags.EARLIEST, [], undefined],
	],
	[
		['0x4', BlockTags.PENDING, [], undefined],
		['0x4', BlockTags.PENDING, [], undefined],
	],
	// Defined transaction and block number, returnType = ValidTypes.HexString
	[
		['0x4', BlockTags.LATEST, [], ValidTypes.HexString],
		['0x4', BlockTags.LATEST, [], ValidTypes.HexString],
	],
	[
		['0x4', BlockTags.EARLIEST, [], ValidTypes.HexString],
		['0x4', BlockTags.EARLIEST, [], ValidTypes.HexString],
	],
	[
		['0x4', BlockTags.PENDING, [], ValidTypes.HexString],
		['0x4', BlockTags.PENDING, [], ValidTypes.HexString],
	],
	// Defined transaction and block number, returnType = ValidTypes.NumberString
	[
		['0x4', BlockTags.LATEST, [], ValidTypes.NumberString],
		['0x4', BlockTags.LATEST, [], ValidTypes.NumberString],
	],
	[
		['0x4', BlockTags.EARLIEST, [], ValidTypes.NumberString],
		['0x4', BlockTags.EARLIEST, [], ValidTypes.NumberString],
	],
	[
		['0x4', BlockTags.PENDING, [], ValidTypes.NumberString],
		['0x4', BlockTags.PENDING, [], ValidTypes.NumberString],
	],
	// Defined transaction and block number, returnType = ValidTypes.Number
	[
		['0x4', BlockTags.LATEST, [], ValidTypes.Number],
		['0x4', BlockTags.LATEST, [], ValidTypes.Number],
	],
	[
		['0x4', BlockTags.EARLIEST, [], ValidTypes.Number],
		['0x4', BlockTags.EARLIEST, [], ValidTypes.Number],
	],
	[
		['0x4', BlockTags.PENDING, [], ValidTypes.Number],
		['0x4', BlockTags.PENDING, [], ValidTypes.Number],
	],
	// Defined transaction and block number, returnType = ValidTypes.BigInt
	[
		['0x4', BlockTags.LATEST, [], ValidTypes.BigInt],
		['0x4', BlockTags.LATEST, [], ValidTypes.BigInt],
	],
	[
		['0x4', BlockTags.EARLIEST, [], ValidTypes.BigInt],
		['0x4', BlockTags.EARLIEST, [], ValidTypes.BigInt],
	],
	[
		['0x4', BlockTags.PENDING, [], ValidTypes.BigInt],
		['0x4', BlockTags.PENDING, [], ValidTypes.BigInt],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getStorageAtValidData: [
	[Address, Uint256, BlockNumberOrTag | undefined],
	[Address, Uint256, BlockNumberOrTag],
][] = [
	// All possible undefined values
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x0', undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x0', BlockTags.LATEST],
	],
	// Defined address, storageSlot, and blockNumber
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x0', BlockTags.LATEST],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x0', BlockTags.LATEST],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x0', BlockTags.EARLIEST],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x0', BlockTags.EARLIEST],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x0', BlockTags.PENDING],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x0', BlockTags.PENDING],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getCodeValidData: [
	[Address, BlockNumberOrTag | undefined],
	[Address, BlockNumberOrTag],
][] = [
	// All possible undefined values
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
	],
	// Defined address and blockNumber
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING],
	],
];

/**
 * Array consists of:
 * - input
 * - mock RPC result
 */
export const sendSignedTransactionValidData: [HexStringBytes][] = [
	['0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675'],
];

/**
 * Array consists of:
 * - array of inputs
 */
export const signValidData: [[HexStringBytes, Address]][] = [
	[['0xdeadbeaf', '0x407d73d8a49eeb85d32cf465507dd71d507100c1']],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getPastLogsValidData: [Filter, Filter][] = [
	[
		{},
		{
			fromBlock: BlockTags.LATEST,
			toBlock: BlockTags.LATEST,
		},
	],
	[
		{
			address: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			topics: [
				'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
				null,
				[
					'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
					'0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
				],
			],
		},
		{
			fromBlock: BlockTags.LATEST,
			toBlock: BlockTags.LATEST,
			address: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			topics: [
				'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
				null,
				[
					'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
					'0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
				],
			],
		},
	],
	[
		{
			fromBlock: BlockTags.LATEST,
			toBlock: BlockTags.LATEST,
		},
		{
			fromBlock: BlockTags.LATEST,
			toBlock: BlockTags.LATEST,
		},
	],
	[
		{
			fromBlock: BlockTags.PENDING,
			toBlock: BlockTags.PENDING,
		},
		{
			fromBlock: BlockTags.PENDING,
			toBlock: BlockTags.PENDING,
		},
	],
	[
		{
			fromBlock: BlockTags.EARLIEST,
			toBlock: BlockTags.EARLIEST,
		},
		{
			fromBlock: BlockTags.EARLIEST,
			toBlock: BlockTags.EARLIEST,
		},
	],
];

/**
 * Array consists of:
 * - array of inputs
 */
export const submitWorkValidData: [[HexString8Bytes, HexString32Bytes, HexString32Bytes]][] = [
	[
		[
			'0x0000000000000001',
			'0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
			'0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000',
		],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getProofValidData: [
	[Address, HexString32Bytes, BlockNumberOrTag | undefined, ValidTypes | undefined],
	[Address, HexString32Bytes, BlockNumberOrTag, ValidTypes | undefined],
][] = [
	// All possible undefined values
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			undefined,
			undefined,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			undefined,
		],
	],
	// Defined block number, undefined returnType
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			undefined,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			undefined,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			undefined,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			undefined,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			undefined,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			undefined,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			undefined,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			undefined,
		],
	],
	// Defined block number, returnType = ValidTypes.HexString
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			ValidTypes.HexString,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			ValidTypes.HexString,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			ValidTypes.HexString,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			ValidTypes.HexString,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			ValidTypes.HexString,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			ValidTypes.HexString,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			ValidTypes.HexString,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			ValidTypes.HexString,
		],
	],
	// Defined block number, returnType = ValidTypes.NumberString
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			ValidTypes.NumberString,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			ValidTypes.NumberString,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			ValidTypes.NumberString,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			ValidTypes.NumberString,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			ValidTypes.NumberString,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			ValidTypes.NumberString,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			ValidTypes.NumberString,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			ValidTypes.NumberString,
		],
	],
	// Defined block number, returnType = ValidTypes.Number
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			ValidTypes.Number,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			ValidTypes.Number,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			ValidTypes.Number,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			ValidTypes.Number,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			ValidTypes.Number,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			ValidTypes.Number,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			ValidTypes.Number,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			ValidTypes.Number,
		],
	],
	// Defined block number, returnType = ValidTypes.BigInt
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			ValidTypes.BigInt,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			ValidTypes.BigInt,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			ValidTypes.BigInt,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			ValidTypes.BigInt,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			ValidTypes.BigInt,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			ValidTypes.BigInt,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			ValidTypes.BigInt,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			ValidTypes.BigInt,
		],
	],
];
