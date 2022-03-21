import {
	Block,
	FeeHistoryResult,
	FilterResults,
	ReceiptInfo,
	TransactionInfo,
	TransactionWithSender,
} from 'web3-common';
import {
	HexString32Bytes,
	ValidTypes,
	ValidReturnTypes,
	Address,
	BlockNumberOrTag,
	BlockTags,
	HexString,
	Uint,
	Uint256,
	HexStringBytes,
	Filter,
	HexString8Bytes,
	Numbers,
} from 'web3-utils';

import {
	AccountObjectFormatted,
	BlockFormatted,
	FeeHistoryResultFormatted,
	ReceiptInfoFormatted,
	TransactionInfoFormatted,
} from '../../src/types';
import { AccountObject } from '../../src/web3_eth_execution_api';

// Array consists of: returnType parameter, mock RPC result, expected output
export const getHashRateValidData: [
	ValidTypes | undefined,
	ValidReturnTypes[ValidTypes],
	ValidReturnTypes[ValidTypes],
][] = [
	[undefined, '0x38a', '0x38a'],
	[ValidTypes.HexString, '0x38a', '0x38a'],
	[ValidTypes.NumberString, '0x38a', '906'],
	[ValidTypes.Number, '0x38a', 906],
	[ValidTypes.BigInt, '0x38a', BigInt('0x38a')],
];

// Array consists of: returnType parameter, mock RPC result, expected output
export const getGasPriceValidData: [
	ValidTypes | undefined,
	ValidReturnTypes[ValidTypes],
	ValidReturnTypes[ValidTypes],
][] = [
	[undefined, '0x1dfd14000', '0x1dfd14000'],
	[ValidTypes.HexString, '0x1dfd14000', '0x1dfd14000'],
	[ValidTypes.NumberString, '0x1dfd14000', '8049999872'],
	[ValidTypes.Number, '0x1dfd14000', 8049999872],
	[ValidTypes.BigInt, '0x1dfd14000', BigInt('0x1dfd14000')],
];

// Array consists of: returnType parameter, mock RPC result, expected output
export const getBlockNumberValidData: [
	ValidTypes | undefined,
	ValidReturnTypes[ValidTypes],
	ValidReturnTypes[ValidTypes],
][] = [
	[undefined, '0x4b7', '0x4b7'],
	[ValidTypes.HexString, '0x4b7', '0x4b7'],
	[ValidTypes.NumberString, '0x4b7', '1207'],
	[ValidTypes.Number, '0x4b7', 1207],
	[ValidTypes.BigInt, '0x4b7', BigInt('0x4b7')],
];

/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 * - array of passed RPC parameters (excluding requestManager) - This is to account for any defaults set by the method
 * - expected output
 */
export const getBalanceValidData: [
	[Address, BlockNumberOrTag | undefined, ValidTypes | undefined],
	ValidReturnTypes[ValidTypes],
	[Address, BlockNumberOrTag],
	ValidReturnTypes[ValidTypes],
][] = [
	// All possible undefined values
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined, undefined],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		'0xe8d4a51000',
	],
	// Defined blockNumber, undefined returnType
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, undefined],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		'0xe8d4a51000',
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, undefined],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		'0xe8d4a51000',
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, undefined],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		'0xe8d4a51000',
	],
	// Undefined blockNumber, returnType = ValidTypes.HexString
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined, ValidTypes.HexString],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		'0xe8d4a51000',
	],
	// Defined blockNumber, returnType = ValidTypes.HexString
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.HexString],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		'0xe8d4a51000',
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.HexString],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST],
		'0xe8d4a51000',
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.HexString],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING],
		'0xe8d4a51000',
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7', ValidTypes.HexString],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7'],
		'0xe8d4a51000',
	],
	// Undefined blockNumber, returnType = ValidTypes.NumberString
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined, ValidTypes.NumberString],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		'1000000000000',
	],
	// Defined blockNumber, returnType = ValidTypes.NumberString
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.NumberString],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		'1000000000000',
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.NumberString],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST],
		'1000000000000',
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.NumberString],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING],
		'1000000000000',
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7', ValidTypes.NumberString],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7'],
		'1000000000000',
	],
	// Undefined blockNumber, returnType = ValidTypes.Number
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined, ValidTypes.Number],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		1000000000000,
	],
	// Defined blockNumber, returnType = ValidTypes.Number
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.Number],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		1000000000000,
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.Number],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST],
		1000000000000,
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.Number],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING],
		1000000000000,
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7', ValidTypes.Number],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7'],
		1000000000000,
	],
	// Undefined blockNumber, returnType = ValidTypes.BigInt
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined, ValidTypes.BigInt],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		BigInt(1000000000000),
	],
	// Defined blockNumber, returnType = ValidTypes.BigInt
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.BigInt],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		BigInt(1000000000000),
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.BigInt],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST],
		BigInt(1000000000000),
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.BigInt],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING],
		BigInt(1000000000000),
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7', ValidTypes.BigInt],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7'],
		BigInt(1000000000000),
	],
];

const block: Block = {
	parentHash: '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
	sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
	miner: '0xbb7b8287f3f0a933474a79eae42cbca977791171',
	stateRoot: '0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d',
	transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
	receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
	logsBloom:
		'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	difficulty: '0x4ea3f27bc',
	number: '0x1b4',
	gasLimit: '0x1388',
	gasUsed: '0x1c96e73',
	timestamp: '0x55ba467c',
	extraData: '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
	mixHash: '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
	nonce: '0x1c11920a4',
	totalDifficulty: '0x78ed983323d',
	size: '0x220',
	transactions: [
		'0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
		'0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
		'0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
	],
	uncles: [
		'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
		'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
		'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
	],
	hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
	baseFeePerGas: '0x13afe8b904',
};
const transactionInfo: TransactionInfo = {
	blockHash: '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
	blockNumber: '0x5daf3b',
	from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
	gas: '0xc350',
	gasPrice: '0x4a817c800',
	hash: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
	input: '0x68656c6c6f21',
	nonce: '0x15',
	to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
	transactionIndex: '0x41',
	value: '0xf3dbb76162000',
	v: '0x25',
	r: '0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea',
	s: '0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c',
	type: '0x0',
	maxFeePerGas: '0x1475505aab',
	maxPriorityFeePerGas: '0x7f324180',
	chainId: '0x1',
};
const hydratedTransactions: TransactionInfo[] = [transactionInfo, transactionInfo, transactionInfo];
const blockFormattedNumberString: BlockFormatted<ValidTypes.NumberString> = {
	...block,
	transactions: hydratedTransactions,
	difficulty: '21109876668',
	number: '436',
	gasLimit: '5000',
	gasUsed: '29978227',
	timestamp: '1438271100',
	nonce: '7534616740',
	totalDifficulty: '8310116004413',
	baseFeePerGas: '84555643140',
	size: '544',
};
const blockFormattedNumber: BlockFormatted<ValidTypes.Number> = {
	...block,
	transactions: hydratedTransactions,
	difficulty: 21109876668,
	number: 436,
	gasLimit: 5000,
	gasUsed: 29978227,
	timestamp: 1438271100,
	nonce: 7534616740,
	totalDifficulty: 8310116004413,
	baseFeePerGas: 84555643140,
	size: 544,
};
const blockFormattedBigInt: BlockFormatted<ValidTypes.BigInt> = {
	...block,
	transactions: hydratedTransactions,
	// TODO Change this to TransactionInfoFormatted
	difficulty: BigInt('21109876668'),
	number: BigInt('436'),
	gasLimit: BigInt('5000'),
	gasUsed: BigInt('29978227'),
	timestamp: BigInt('1438271100'),
	nonce: BigInt('7534616740'),
	totalDifficulty: BigInt('8310116004413'),
	baseFeePerGas: BigInt('84555643140'),
	size: BigInt('544'),
};

/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 * - expected RPC methods to be called
 * - array of passed RPC parameters (excluding requestManager) - This is to account for any defaults set by the method
 * - expected output
 */
export const getBlockValidData: [
	[HexString32Bytes | BlockNumberOrTag | undefined, boolean | undefined, ValidTypes | undefined],
	Block,
	'getBlockByHash' | 'getBlockByNumber',
	[HexString32Bytes | BlockNumberOrTag, boolean],
	(
		| BlockFormatted
		| BlockFormatted<ValidTypes.NumberString>
		| BlockFormatted<ValidTypes.Number>
		| BlockFormatted<ValidTypes.BigInt>
	),
][] = [
	// All possible undefined values
	[
		[undefined, undefined, undefined],
		block,
		'getBlockByNumber',
		[BlockTags.LATEST, false],
		block as BlockFormatted,
	],
	// Defined block, undefined hydrated and returnType
	[
		[
			'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
			undefined,
			undefined,
		],
		block,
		'getBlockByHash',
		['0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae', false],
		block as BlockFormatted,
	],
	[
		[BlockTags.LATEST, undefined, undefined],
		block,
		'getBlockByNumber',
		[BlockTags.LATEST, false],
		block as BlockFormatted,
	],
	[
		[BlockTags.EARLIEST, undefined, undefined],
		block,
		'getBlockByNumber',
		[BlockTags.EARLIEST, false],
		block as BlockFormatted,
	],
	[
		[BlockTags.PENDING, undefined, undefined],
		block,
		'getBlockByNumber',
		[BlockTags.PENDING, false],
		block as BlockFormatted,
	],
	// Defined block, hydrated = true, and undefined returnType
	[
		[BlockTags.LATEST, true, undefined],
		{
			...block,
			transactions: hydratedTransactions,
		},
		'getBlockByNumber',
		[BlockTags.LATEST, true],
		{
			...block,
			transactions: hydratedTransactions,
		} as BlockFormatted,
	],
	[
		[BlockTags.EARLIEST, true, undefined],
		{
			...block,
			transactions: hydratedTransactions,
		},
		'getBlockByNumber',
		[BlockTags.EARLIEST, true],
		{
			...block,
			transactions: hydratedTransactions,
		} as BlockFormatted,
	],
	[
		[BlockTags.PENDING, true, undefined],
		{
			...block,
			transactions: hydratedTransactions,
		},
		'getBlockByNumber',
		[BlockTags.PENDING, true],
		{
			...block,
			transactions: hydratedTransactions,
		} as BlockFormatted,
	],
	// Defined block, hydrated = false, and undefined returnType
	[
		[BlockTags.LATEST, false, undefined],
		block,
		'getBlockByNumber',
		[BlockTags.LATEST, false],
		block as BlockFormatted,
	],
	[
		[BlockTags.EARLIEST, false, undefined],
		block,
		'getBlockByNumber',
		[BlockTags.EARLIEST, false],
		block as BlockFormatted,
	],
	[
		[BlockTags.PENDING, false, undefined],
		block,
		'getBlockByNumber',
		[BlockTags.PENDING, false],
		block as BlockFormatted,
	],
	// Defined block, hydrated = true, and returnType = ValidTypes.HexString
	[
		[BlockTags.LATEST, true, ValidTypes.HexString],
		{
			...block,
			transactions: hydratedTransactions,
		},
		'getBlockByNumber',
		[BlockTags.LATEST, true],
		{
			...block,
			transactions: hydratedTransactions,
		} as BlockFormatted,
	],
	[
		[BlockTags.EARLIEST, true, ValidTypes.HexString],
		{
			...block,
			transactions: hydratedTransactions,
		},
		'getBlockByNumber',
		[BlockTags.EARLIEST, true],
		{
			...block,
			transactions: hydratedTransactions,
		} as BlockFormatted,
	],
	[
		[BlockTags.PENDING, true, ValidTypes.HexString],
		{
			...block,
			transactions: hydratedTransactions,
		},
		'getBlockByNumber',
		[BlockTags.PENDING, true],
		{
			...block,
			transactions: hydratedTransactions,
		} as BlockFormatted,
	],
	// Defined block, hydrated = true, and returnType = ValidTypes.NumberString
	[
		[BlockTags.LATEST, true, ValidTypes.NumberString],
		{
			...block,
			transactions: hydratedTransactions,
		},
		'getBlockByNumber',
		[BlockTags.LATEST, true],
		blockFormattedNumberString,
	],
	[
		[BlockTags.EARLIEST, true, ValidTypes.NumberString],
		{
			...block,
			transactions: hydratedTransactions,
		},
		'getBlockByNumber',
		[BlockTags.EARLIEST, true],
		blockFormattedNumberString,
	],
	[
		[BlockTags.PENDING, true, ValidTypes.NumberString],
		{
			...block,
			transactions: hydratedTransactions,
		},
		'getBlockByNumber',
		[BlockTags.PENDING, true],
		blockFormattedNumberString,
	],
	// Defined block, hydrated = true, and returnType = ValidTypes.Number
	[
		[BlockTags.LATEST, true, ValidTypes.Number],
		{
			...block,
			transactions: hydratedTransactions,
		},
		'getBlockByNumber',
		[BlockTags.LATEST, true],
		blockFormattedNumber,
	],
	[
		[BlockTags.EARLIEST, true, ValidTypes.Number],
		{
			...block,
			transactions: hydratedTransactions,
		},
		'getBlockByNumber',
		[BlockTags.EARLIEST, true],
		blockFormattedNumber,
	],
	[
		[BlockTags.PENDING, true, ValidTypes.Number],
		{
			...block,
			transactions: hydratedTransactions,
		},
		'getBlockByNumber',
		[BlockTags.PENDING, true],
		blockFormattedNumber,
	],
	// Defined block, hydrated = true, and returnType = ValidTypes.BigInt
	[
		[BlockTags.LATEST, true, ValidTypes.BigInt],
		{
			...block,
			transactions: hydratedTransactions,
		},
		'getBlockByNumber',
		[BlockTags.LATEST, true],
		blockFormattedBigInt,
	],
	[
		[BlockTags.EARLIEST, true, ValidTypes.BigInt],
		{
			...block,
			transactions: hydratedTransactions,
		},
		'getBlockByNumber',
		[BlockTags.EARLIEST, true],
		blockFormattedBigInt,
	],
	[
		[BlockTags.PENDING, true, ValidTypes.BigInt],
		{
			...block,
			transactions: hydratedTransactions,
		},
		'getBlockByNumber',
		[BlockTags.PENDING, true],
		blockFormattedBigInt,
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 * - expected RPC methods to be called
 * - array of passed RPC parameters (excluding requestManager) - This is to account for any defaults set by the method
 * - expected output
 */
export const getBlockTransactionCountValidData: [
	[HexString32Bytes | BlockNumberOrTag | undefined, ValidTypes | undefined],
	HexString,
	'getBlockTransactionCountByHash' | 'getBlockTransactionCountByNumber',
	[HexString32Bytes | BlockNumberOrTag],
	ValidReturnTypes[ValidTypes],
][] = [
	// All possible undefined values
	[[undefined, undefined], '0xb', 'getBlockTransactionCountByNumber', [BlockTags.LATEST], '0xb'],
	// Defined block, undefined returnType
	[
		['0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae', undefined],
		'0xb',
		'getBlockTransactionCountByHash',
		['0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae'],
		'0xb',
	],
	[
		[BlockTags.LATEST, undefined],
		'0xb',
		'getBlockTransactionCountByNumber',
		[BlockTags.LATEST],
		'0xb',
	],
	[
		[BlockTags.EARLIEST, undefined],
		'0xb',
		'getBlockTransactionCountByNumber',
		[BlockTags.EARLIEST],
		'0xb',
	],
	[
		[BlockTags.PENDING, undefined],
		'0xb',
		'getBlockTransactionCountByNumber',
		[BlockTags.PENDING],
		'0xb',
	],
	// Defined block and returnType = ValidTypes.HexString
	[
		[BlockTags.LATEST, ValidTypes.HexString],
		'0xb',
		'getBlockTransactionCountByNumber',
		[BlockTags.LATEST],
		'0xb',
	],
	[
		[BlockTags.EARLIEST, ValidTypes.HexString],
		'0xb',
		'getBlockTransactionCountByNumber',
		[BlockTags.EARLIEST],
		'0xb',
	],
	[
		[BlockTags.PENDING, ValidTypes.HexString],
		'0xb',
		'getBlockTransactionCountByNumber',
		[BlockTags.PENDING],
		'0xb',
	],
	// Defined block and returnType = ValidTypes.NumberString
	[
		[BlockTags.LATEST, ValidTypes.NumberString],
		'0xb',
		'getBlockTransactionCountByNumber',
		[BlockTags.LATEST],
		'11',
	],
	[
		[BlockTags.EARLIEST, ValidTypes.NumberString],
		'0xb',
		'getBlockTransactionCountByNumber',
		[BlockTags.EARLIEST],
		'11',
	],
	[
		[BlockTags.PENDING, ValidTypes.NumberString],
		'0xb',
		'getBlockTransactionCountByNumber',
		[BlockTags.PENDING],
		'11',
	],
	// Defined block, hydrated = true, and returnType = ValidTypes.Number
	[
		[BlockTags.LATEST, ValidTypes.Number],
		'0xb',
		'getBlockTransactionCountByNumber',
		[BlockTags.LATEST],
		11,
	],
	[
		[BlockTags.EARLIEST, ValidTypes.Number],
		'0xb',
		'getBlockTransactionCountByNumber',
		[BlockTags.EARLIEST],
		11,
	],
	[
		[BlockTags.PENDING, ValidTypes.Number],
		'0xb',
		'getBlockTransactionCountByNumber',
		[BlockTags.PENDING],
		11,
	],
	// Defined block and returnType = ValidTypes.BigInt
	[
		[BlockTags.LATEST, ValidTypes.BigInt],
		'0xb',
		'getBlockTransactionCountByNumber',
		[BlockTags.LATEST],
		BigInt('0xb'),
	],
	[
		[BlockTags.EARLIEST, ValidTypes.BigInt],
		'0xb',
		'getBlockTransactionCountByNumber',
		[BlockTags.EARLIEST],
		BigInt('0xb'),
	],
	[
		[BlockTags.PENDING, ValidTypes.BigInt],
		'0xb',
		'getBlockTransactionCountByNumber',
		[BlockTags.PENDING],
		BigInt('0xb'),
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 * - expected RPC methods to be called
 * - array of passed RPC parameters (excluding requestManager) - This is to account for any defaults set by the method
 * - expected output
 */
export const getBlockUncleCountValidData: [
	[HexString32Bytes | BlockNumberOrTag | undefined, ValidTypes | undefined],
	HexString,
	'getUncleCountByBlockHash' | 'getUncleCountByBlockNumber',
	[HexString32Bytes | BlockNumberOrTag],
	ValidReturnTypes[ValidTypes],
][] = [
	// All possible undefined values
	[[undefined, undefined], '0xb', 'getUncleCountByBlockNumber', [BlockTags.LATEST], '0xb'],
	// Defined block, undefined returnType
	[
		['0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae', undefined],
		'0xb',
		'getUncleCountByBlockHash',
		['0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae'],
		'0xb',
	],
	[[BlockTags.LATEST, undefined], '0xb', 'getUncleCountByBlockNumber', [BlockTags.LATEST], '0xb'],
	[
		[BlockTags.EARLIEST, undefined],
		'0xb',
		'getUncleCountByBlockNumber',
		[BlockTags.EARLIEST],
		'0xb',
	],
	[
		[BlockTags.PENDING, undefined],
		'0xb',
		'getUncleCountByBlockNumber',
		[BlockTags.PENDING],
		'0xb',
	],
	// Defined block and returnType = ValidTypes.HexString
	[
		[BlockTags.LATEST, ValidTypes.HexString],
		'0xb',
		'getUncleCountByBlockNumber',
		[BlockTags.LATEST],
		'0xb',
	],
	[
		[BlockTags.EARLIEST, ValidTypes.HexString],
		'0xb',
		'getUncleCountByBlockNumber',
		[BlockTags.EARLIEST],
		'0xb',
	],
	[
		[BlockTags.PENDING, ValidTypes.HexString],
		'0xb',
		'getUncleCountByBlockNumber',
		[BlockTags.PENDING],
		'0xb',
	],
	// Defined block and returnType = ValidTypes.NumberString
	[
		[BlockTags.LATEST, ValidTypes.NumberString],
		'0xb',
		'getUncleCountByBlockNumber',
		[BlockTags.LATEST],
		'11',
	],
	[
		[BlockTags.EARLIEST, ValidTypes.NumberString],
		'0xb',
		'getUncleCountByBlockNumber',
		[BlockTags.EARLIEST],
		'11',
	],
	[
		[BlockTags.PENDING, ValidTypes.NumberString],
		'0xb',
		'getUncleCountByBlockNumber',
		[BlockTags.PENDING],
		'11',
	],
	// Defined block, hydrated = true, and returnType = ValidTypes.Number
	[
		[BlockTags.LATEST, ValidTypes.Number],
		'0xb',
		'getUncleCountByBlockNumber',
		[BlockTags.LATEST],
		11,
	],
	[
		[BlockTags.EARLIEST, ValidTypes.Number],
		'0xb',
		'getUncleCountByBlockNumber',
		[BlockTags.EARLIEST],
		11,
	],
	[
		[BlockTags.PENDING, ValidTypes.Number],
		'0xb',
		'getUncleCountByBlockNumber',
		[BlockTags.PENDING],
		11,
	],
	// Defined block and returnType = ValidTypes.BigInt
	[
		[BlockTags.LATEST, ValidTypes.BigInt],
		'0xb',
		'getUncleCountByBlockNumber',
		[BlockTags.LATEST],
		BigInt('0xb'),
	],
	[
		[BlockTags.EARLIEST, ValidTypes.BigInt],
		'0xb',
		'getUncleCountByBlockNumber',
		[BlockTags.EARLIEST],
		BigInt('0xb'),
	],
	[
		[BlockTags.PENDING, ValidTypes.BigInt],
		'0xb',
		'getUncleCountByBlockNumber',
		[BlockTags.PENDING],
		BigInt('0xb'),
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 * - expected RPC methods to be called
 * - array of passed RPC parameters (excluding requestManager) - This is to account for any defaults set by the method
 * - expected output
 */
export const getUncleValidData: [
	[HexString32Bytes | BlockNumberOrTag | undefined, Uint, ValidTypes | undefined],
	Block,
	'getUncleByBlockHashAndIndex' | 'getUncleByBlockNumberAndIndex',
	[HexString32Bytes | BlockNumberOrTag, Uint],
	(
		| BlockFormatted
		| BlockFormatted<ValidTypes.NumberString>
		| BlockFormatted<ValidTypes.Number>
		| BlockFormatted<ValidTypes.BigInt>
	),
][] = [
	// All possible undefined values
	[
		[undefined, '0x0', undefined],
		block,
		'getUncleByBlockNumberAndIndex',
		[BlockTags.LATEST, '0x0'],
		block as BlockFormatted,
	],
	// Defined block, uncleIndex = '0x0', and undefined returnType
	[
		['0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2', '0x0', undefined],
		block,
		'getUncleByBlockHashAndIndex',
		['0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2', '0x0'],
		block as BlockFormatted,
	],
	[
		[BlockTags.LATEST, '0x0', undefined],
		block,
		'getUncleByBlockNumberAndIndex',
		[BlockTags.LATEST, '0x0'],
		block as BlockFormatted,
	],
	[
		[BlockTags.EARLIEST, '0x0', undefined],
		block,
		'getUncleByBlockNumberAndIndex',
		[BlockTags.EARLIEST, '0x0'],
		block as BlockFormatted,
	],
	[
		[BlockTags.PENDING, '0x0', undefined],
		block,
		'getUncleByBlockNumberAndIndex',
		[BlockTags.PENDING, '0x0'],
		block as BlockFormatted,
	],
	// Defined block, uncleIndex = '0x0', and undefined returnType
	[
		[BlockTags.LATEST, '0x0', undefined],
		block,
		'getUncleByBlockNumberAndIndex',
		[BlockTags.LATEST, '0x0'],
		block as BlockFormatted,
	],
	[
		[BlockTags.EARLIEST, '0x0', undefined],
		block,
		'getUncleByBlockNumberAndIndex',
		[BlockTags.EARLIEST, '0x0'],
		block as BlockFormatted,
	],
	[
		[BlockTags.PENDING, '0x0', undefined],
		block,
		'getUncleByBlockNumberAndIndex',
		[BlockTags.PENDING, '0x0'],
		block as BlockFormatted,
	],
	// Defined block, uncleIndex = true, and returnType = ValidTypes.HexString
	[
		[BlockTags.LATEST, '0x0', ValidTypes.HexString],
		block,
		'getUncleByBlockNumberAndIndex',
		[BlockTags.LATEST, '0x0'],
		block as BlockFormatted,
	],
	[
		[BlockTags.EARLIEST, '0x0', ValidTypes.HexString],
		block,
		'getUncleByBlockNumberAndIndex',
		[BlockTags.EARLIEST, '0x0'],
		block as BlockFormatted,
	],
	[
		[BlockTags.PENDING, '0x0', ValidTypes.HexString],
		block,
		'getUncleByBlockNumberAndIndex',
		[BlockTags.PENDING, '0x0'],
		block as BlockFormatted,
	],
	// Defined block, uncleIndex = '0x0', and returnType = ValidTypes.NumberString
	[
		[BlockTags.LATEST, '0x0', ValidTypes.NumberString],
		block,
		'getUncleByBlockNumberAndIndex',
		[BlockTags.LATEST, '0x0'],
		{
			...blockFormattedNumberString,
			transactions: block.transactions,
		},
	],
	[
		[BlockTags.EARLIEST, '0x0', ValidTypes.NumberString],
		block,
		'getUncleByBlockNumberAndIndex',
		[BlockTags.EARLIEST, '0x0'],
		{
			...blockFormattedNumberString,
			transactions: block.transactions,
		},
	],
	[
		[BlockTags.PENDING, '0x0', ValidTypes.NumberString],
		block,
		'getUncleByBlockNumberAndIndex',
		[BlockTags.PENDING, '0x0'],
		{
			...blockFormattedNumberString,
			transactions: block.transactions,
		},
	],
	// Defined block, uncleIndex = '0x0', and returnType = ValidTypes.Number
	[
		[BlockTags.LATEST, '0x0', ValidTypes.Number],
		block,
		'getUncleByBlockNumberAndIndex',
		[BlockTags.LATEST, '0x0'],
		{
			...blockFormattedNumber,
			transactions: block.transactions,
		},
	],
	[
		[BlockTags.EARLIEST, '0x0', ValidTypes.Number],
		block,
		'getUncleByBlockNumberAndIndex',
		[BlockTags.EARLIEST, '0x0'],
		{
			...blockFormattedNumber,
			transactions: block.transactions,
		},
	],
	[
		[BlockTags.PENDING, '0x0', ValidTypes.Number],
		block,
		'getUncleByBlockNumberAndIndex',
		[BlockTags.PENDING, '0x0'],
		{
			...blockFormattedNumber,
			transactions: block.transactions,
		},
	],
	// Defined block, uncleIndex = '0x0', and returnType = ValidTypes.BigInt
	[
		[BlockTags.LATEST, '0x0', ValidTypes.BigInt],
		block,
		'getUncleByBlockNumberAndIndex',
		[BlockTags.LATEST, '0x0'],
		{
			...blockFormattedBigInt,
			transactions: block.transactions,
		},
	],
	[
		[BlockTags.EARLIEST, '0x0', ValidTypes.BigInt],
		block,
		'getUncleByBlockNumberAndIndex',
		[BlockTags.EARLIEST, '0x0'],
		{
			...blockFormattedBigInt,
			transactions: block.transactions,
		},
	],
	[
		[BlockTags.PENDING, '0x0', ValidTypes.BigInt],
		block,
		'getUncleByBlockNumberAndIndex',
		[BlockTags.PENDING, '0x0'],
		{
			...blockFormattedBigInt,
			transactions: block.transactions,
		},
	],
];

const transactionInfoNumberString: TransactionInfoFormatted<ValidTypes.NumberString> = {
	...transactionInfo,
	blockNumber: '6139707',
	gas: '50000',
	gasPrice: '20000000000',
	type: '0',
	nonce: '21',
	transactionIndex: '65',
	value: '4290000000000000',
	v: '37',
	maxFeePerGas: '87867546283',
	maxPriorityFeePerGas: '2134000000',
	chainId: '1',
};
const transactionInfoNumber: TransactionInfoFormatted<ValidTypes.Number> = {
	...transactionInfo,
	blockNumber: 6139707,
	gas: 50000,
	gasPrice: 20000000000,
	type: 0,
	nonce: 21,
	transactionIndex: 65,
	value: 4290000000000000,
	v: 37,
	maxFeePerGas: 87867546283,
	maxPriorityFeePerGas: 2134000000,
	chainId: 1,
};
const transactionInfoBigInt: TransactionInfoFormatted<ValidTypes.BigInt> = {
	...transactionInfo,
	blockNumber: BigInt('6139707'),
	gas: BigInt('50000'),
	gasPrice: BigInt('20000000000'),
	type: BigInt('0'),
	nonce: BigInt('21'),
	transactionIndex: BigInt('65'),
	value: BigInt('4290000000000000'),
	v: BigInt('37'),
	maxFeePerGas: BigInt('87867546283'),
	maxPriorityFeePerGas: BigInt('2134000000'),
	chainId: BigInt('1'),
};
/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 * - array of passed RPC parameters (excluding requestManager) - This is to account for any defaults set by the method
 * - expected output
 */
export const getTransactionValidData: [
	[HexString32Bytes, ValidTypes | undefined],
	TransactionInfo | null,
	[HexString32Bytes],
	(
		| TransactionInfoFormatted
		| TransactionInfoFormatted<ValidTypes.NumberString>
		| TransactionInfoFormatted<ValidTypes.Number>
		| TransactionInfoFormatted<ValidTypes.BigInt>
	),
][] = [
	// Defined transactionHash, undefined returnType
	[
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', undefined],
		transactionInfo,
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547'],
		transactionInfo,
	],
	// Defined transactionHash and returnType = ValidTypes.HexString
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			ValidTypes.HexString,
		],
		transactionInfo,
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547'],
		transactionInfo,
	],
	// Defined transactionHash and returnType = ValidTypes.NumberString
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			ValidTypes.NumberString,
		],
		transactionInfo,
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547'],
		transactionInfoNumberString,
	],
	// Defined block, hydrated = true, and returnType = ValidTypes.Number
	[
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', ValidTypes.Number],
		transactionInfo,
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547'],
		transactionInfoNumber,
	],
	// Defined block and returnType = ValidTypes.BigInt
	[
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', ValidTypes.BigInt],
		transactionInfo,
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547'],
		transactionInfoBigInt,
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 * - expected RPC methods to be called
 * - array of passed RPC parameters (excluding requestManager) - This is to account for any defaults set by the method
 * - expected output
 */
export const getTransactionFromBlockValidData: [
	[HexString32Bytes | BlockNumberOrTag | undefined, Uint, ValidTypes | undefined],
	TransactionInfo,
	'getTransactionByBlockHashAndIndex' | 'getTransactionByBlockNumberAndIndex',
	[HexString32Bytes | BlockNumberOrTag, Uint],
	(
		| TransactionInfoFormatted
		| TransactionInfoFormatted<ValidTypes.NumberString>
		| TransactionInfoFormatted<ValidTypes.Number>
		| TransactionInfoFormatted<ValidTypes.BigInt>
	),
][] = [
	// All possible undefined values
	[
		[undefined, '0x0', undefined],
		transactionInfo,
		'getTransactionByBlockNumberAndIndex',
		[BlockTags.LATEST, '0x0'],
		transactionInfo,
	],
	// Defined block, uncleIndex = '0x0', and undefined returnType
	[
		['0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2', '0x0', undefined],
		transactionInfo,
		'getTransactionByBlockHashAndIndex',
		['0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2', '0x0'],
		transactionInfo,
	],
	[
		[BlockTags.LATEST, '0x0', undefined],
		transactionInfo,
		'getTransactionByBlockNumberAndIndex',
		[BlockTags.LATEST, '0x0'],
		transactionInfo,
	],
	[
		[BlockTags.EARLIEST, '0x0', undefined],
		transactionInfo,
		'getTransactionByBlockNumberAndIndex',
		[BlockTags.EARLIEST, '0x0'],
		transactionInfo,
	],
	[
		[BlockTags.PENDING, '0x0', undefined],
		transactionInfo,
		'getTransactionByBlockNumberAndIndex',
		[BlockTags.PENDING, '0x0'],
		transactionInfo,
	],
	// Defined block, uncleIndex = '0x0', and undefined returnType
	[
		[BlockTags.LATEST, '0x0', undefined],
		transactionInfo,
		'getTransactionByBlockNumberAndIndex',
		[BlockTags.LATEST, '0x0'],
		transactionInfo,
	],
	[
		[BlockTags.EARLIEST, '0x0', undefined],
		transactionInfo,
		'getTransactionByBlockNumberAndIndex',
		[BlockTags.EARLIEST, '0x0'],
		transactionInfo,
	],
	[
		[BlockTags.PENDING, '0x0', undefined],
		transactionInfo,
		'getTransactionByBlockNumberAndIndex',
		[BlockTags.PENDING, '0x0'],
		transactionInfo,
	],
	// Defined block, uncleIndex = true, and returnType = ValidTypes.HexString
	[
		[BlockTags.LATEST, '0x0', ValidTypes.HexString],
		transactionInfo,
		'getTransactionByBlockNumberAndIndex',
		[BlockTags.LATEST, '0x0'],
		transactionInfo,
	],
	[
		[BlockTags.EARLIEST, '0x0', ValidTypes.HexString],
		transactionInfo,
		'getTransactionByBlockNumberAndIndex',
		[BlockTags.EARLIEST, '0x0'],
		transactionInfo,
	],
	[
		[BlockTags.PENDING, '0x0', ValidTypes.HexString],
		transactionInfo,
		'getTransactionByBlockNumberAndIndex',
		[BlockTags.PENDING, '0x0'],
		transactionInfo,
	],
	// Defined block, uncleIndex = '0x0', and returnType = ValidTypes.NumberString
	[
		[BlockTags.LATEST, '0x0', ValidTypes.NumberString],
		transactionInfo,
		'getTransactionByBlockNumberAndIndex',
		[BlockTags.LATEST, '0x0'],
		transactionInfoNumberString,
	],
	[
		[BlockTags.EARLIEST, '0x0', ValidTypes.NumberString],
		transactionInfo,
		'getTransactionByBlockNumberAndIndex',
		[BlockTags.EARLIEST, '0x0'],
		transactionInfoNumberString,
	],
	[
		[BlockTags.PENDING, '0x0', ValidTypes.NumberString],
		transactionInfo,
		'getTransactionByBlockNumberAndIndex',
		[BlockTags.PENDING, '0x0'],
		transactionInfoNumberString,
	],
	// Defined block, uncleIndex = '0x0', and returnType = ValidTypes.Number
	[
		[BlockTags.LATEST, '0x0', ValidTypes.Number],
		transactionInfo,
		'getTransactionByBlockNumberAndIndex',
		[BlockTags.LATEST, '0x0'],
		transactionInfoNumber,
	],
	[
		[BlockTags.EARLIEST, '0x0', ValidTypes.Number],
		transactionInfo,
		'getTransactionByBlockNumberAndIndex',
		[BlockTags.EARLIEST, '0x0'],
		transactionInfoNumber,
	],
	[
		[BlockTags.PENDING, '0x0', ValidTypes.Number],
		transactionInfo,
		'getTransactionByBlockNumberAndIndex',
		[BlockTags.PENDING, '0x0'],
		transactionInfoNumber,
	],
	// Defined block, uncleIndex = '0x0', and returnType = ValidTypes.BigInt
	[
		[BlockTags.LATEST, '0x0', ValidTypes.BigInt],
		transactionInfo,
		'getTransactionByBlockNumberAndIndex',
		[BlockTags.LATEST, '0x0'],
		transactionInfoBigInt,
	],
	[
		[BlockTags.EARLIEST, '0x0', ValidTypes.BigInt],
		transactionInfo,
		'getTransactionByBlockNumberAndIndex',
		[BlockTags.EARLIEST, '0x0'],
		transactionInfoBigInt,
	],
	[
		[BlockTags.PENDING, '0x0', ValidTypes.BigInt],
		transactionInfo,
		'getTransactionByBlockNumberAndIndex',
		[BlockTags.PENDING, '0x0'],
		transactionInfoBigInt,
	],
];

const receiptInfo: ReceiptInfo = {
	transactionHash: '0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
	transactionIndex: '0x41',
	blockHash: '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
	blockNumber: '0x5daf3b',
	from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
	to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
	cumulativeGasUsed: '0x33bc', // 13244
	gasUsed: '0x4dc', // 1244
	contractAddress: '0xb60e8dd61c5d32be8058bb8eb970870f07233155',
	logs: [],
	logsBloom: '0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
	root: '0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
	status: '0x1',
};
const receiptInfoNumberString: ReceiptInfoFormatted<ValidTypes.NumberString> = {
	...receiptInfo,
	transactionIndex: '65',
	blockNumber: '6139707',
	cumulativeGasUsed: '13244',
	gasUsed: '1244',
	status: '1',
};
const receiptInfoNumber: ReceiptInfoFormatted<ValidTypes.Number> = {
	...receiptInfo,
	transactionIndex: 65,
	blockNumber: 6139707,
	cumulativeGasUsed: 13244,
	gasUsed: 1244,
	status: 1,
};
const receiptInfoBigInt: ReceiptInfoFormatted<ValidTypes.BigInt> = {
	...receiptInfo,
	transactionIndex: BigInt('65'),
	blockNumber: BigInt('6139707'),
	cumulativeGasUsed: BigInt('13244'),
	gasUsed: BigInt('1244'),
	status: BigInt('1'),
};
/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 * - array of passed RPC parameters (excluding requestManager) - This is to account for any defaults set by the method
 * - expected output
 */
export const getTransactionReceiptValidData: [
	[HexString32Bytes, ValidTypes | undefined],
	ReceiptInfo | null,
	[HexString32Bytes],
	(
		| ReceiptInfoFormatted
		| ReceiptInfoFormatted<ValidTypes.NumberString>
		| ReceiptInfoFormatted<ValidTypes.Number>
		| ReceiptInfoFormatted<ValidTypes.BigInt>
	),
][] = [
	// Defined block, undefined returnType
	[
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', undefined],
		receiptInfo,
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547'],
		receiptInfo,
	],
	// Defined block and returnType = ValidTypes.HexString
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			ValidTypes.HexString,
		],
		receiptInfo,
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547'],
		receiptInfo,
	],
	// Defined block and returnType = ValidTypes.NumberString
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			ValidTypes.NumberString,
		],
		receiptInfo,
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547'],
		receiptInfoNumberString,
	],
	// Defined block, hydrated = true, and returnType = ValidTypes.Number
	[
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', ValidTypes.Number],
		receiptInfo,
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547'],
		receiptInfoNumber,
	],
	// Defined block and returnType = ValidTypes.BigInt
	[
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', ValidTypes.BigInt],
		receiptInfo,
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547'],
		receiptInfoBigInt,
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 * - array of passed RPC parameters (excluding requestManager) - This is to account for any defaults set by the method
 * - expected output
 */
export const getTransactionCountValidData: [
	[Address, HexString32Bytes | BlockNumberOrTag | undefined, ValidTypes | undefined],
	string,
	[Address, HexString32Bytes | BlockNumberOrTag],
	ValidReturnTypes[ValidTypes],
][] = [
	// All possible undefined values
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined, undefined],
		'0x42',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		'0x42',
	],
	// Defined address and block number, undefined returnType
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
			undefined,
		],
		'0x42',
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
		],
		'0x42',
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, undefined],
		'0x42',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		'0x42',
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, undefined],
		'0x42',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST],
		'0x42',
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, undefined],
		'0x42',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING],
		'0x42',
	],
	// Defined block, uncleIndex = and undefined returnType
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, undefined],
		'0x42',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		'0x42',
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, undefined],
		'0x42',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST],
		'0x42',
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, undefined],
		'0x42',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING],
		'0x42',
	],
	// Defined block, uncleIndex = true, and returnType = ValidTypes.HexString
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.HexString],
		'0x42',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		'0x42',
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.HexString],
		'0x42',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST],
		'0x42',
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.HexString],
		'0x42',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING],
		'0x42',
	],
	// Defined block, uncleIndex = and returnType = ValidTypes.NumberString
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.NumberString],
		'0x42',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		'66',
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.NumberString],
		'0x42',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST],
		'66',
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.NumberString],
		'0x42',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING],
		'66',
	],
	// Defined block, uncleIndex = and returnType = ValidTypes.Number
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.Number],
		'0x42',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		66,
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.Number],
		'0x42',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST],
		66,
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.Number],
		'0x42',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING],
		66,
	],
	// Defined block, uncleIndex = and returnType = ValidTypes.BigInt
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, ValidTypes.BigInt],
		'0x42',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		BigInt('0x42'),
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, ValidTypes.BigInt],
		'0x42',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST],
		BigInt('0x42'),
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, ValidTypes.BigInt],
		'0x42',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING],
		BigInt('0x42'),
	],
];

// export const getPendingTransactionValidData: [
// 	ValidTypes | undefined,
// 	TransactionInfo[],
// 	(
// 		| TransactionInfoFormatted
// 		| TransactionInfoFormatted<ValidTypes.NumberString>
// 		| TransactionInfoFormatted<ValidTypes.Number>
// 		| TransactionInfoFormatted<ValidTypes.BigInt>
// 	)[],
// ][] = [
// 	[
// 		undefined,
// 		[transactionInfo, transactionInfo, transactionInfo],
// 		[transactionInfo, transactionInfo, transactionInfo],
// 	],
// [
// 	ValidTypes.HexString,
// 	[transactionInfo, transactionInfo, transactionInfo],
// 	[transactionInfo, transactionInfo, transactionInfo],
// ],
// [
// 	ValidTypes.Number,
// 	[transactionInfo, transactionInfo, transactionInfo],
// 	[transactionInfoNumber, transactionInfoNumber, transactionInfoNumber],
// ],
// [
// 	ValidTypes.NumberString,
// 	[transactionInfo, transactionInfo, transactionInfo],
// 	[transactionInfoNumberString, transactionInfoNumberString, transactionInfoNumberString],
// ],
// [
// 	ValidTypes.BigInt,
// 	[transactionInfo, transactionInfo, transactionInfo],
// 	[transactionInfoBigInt, transactionInfoBigInt, transactionInfoBigInt],
// ],
// ];

export const transactionWithSender: TransactionWithSender = {
	to: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
	type: '0x0',
	nonce: '0x1',
	gas: '0xc350',
	value: '0x1',
	input: '0x0',
	maxFeePerGas: '0x1475505aab',
	maxPriorityFeePerGas: '0x7f324180',
	accessList: [],
	gasPrice: '0x4a817c800',
	from: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
	chainId: '0x1',
};
/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 * - array of passed RPC parameters (excluding requestManager) - This is to account for any defaults set by the method
 * - expected output
 */
export const estimateGasValidData: [
	[
		Partial<TransactionWithSender>,
		HexString32Bytes | BlockNumberOrTag | undefined,
		ValidTypes | undefined,
	],
	string,
	[Partial<TransactionWithSender>, HexString32Bytes | BlockNumberOrTag],
	ValidReturnTypes[ValidTypes],
][] = [
	// All possible undefined values
	[
		[transactionWithSender, undefined, undefined],
		'0x5208',
		[transactionWithSender, BlockTags.LATEST],
		'0x5208',
	],
	// Defined transaction and block number, undefined returnType
	[
		[
			transactionWithSender,
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
			undefined,
		],
		'0x5208',
		[
			transactionWithSender,
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
		],
		'0x5208',
	],
	[
		[transactionWithSender, BlockTags.LATEST, undefined],
		'0x5208',
		[transactionWithSender, BlockTags.LATEST],
		'0x5208',
	],
	[
		[transactionWithSender, BlockTags.EARLIEST, undefined],
		'0x5208',
		[transactionWithSender, BlockTags.EARLIEST],
		'0x5208',
	],
	[
		[transactionWithSender, BlockTags.PENDING, undefined],
		'0x5208',
		[transactionWithSender, BlockTags.PENDING],
		'0x5208',
	],
	// Defined transaction and block number, undefined returnType
	[
		[transactionWithSender, BlockTags.LATEST, undefined],
		'0x5208',
		[transactionWithSender, BlockTags.LATEST],
		'0x5208',
	],
	[
		[transactionWithSender, BlockTags.EARLIEST, undefined],
		'0x5208',
		[transactionWithSender, BlockTags.EARLIEST],
		'0x5208',
	],
	[
		[transactionWithSender, BlockTags.PENDING, undefined],
		'0x5208',
		[transactionWithSender, BlockTags.PENDING],
		'0x5208',
	],
	// Defined transaction and block number, returnType = ValidTypes.HexString
	[
		[transactionWithSender, BlockTags.LATEST, ValidTypes.HexString],
		'0x5208',
		[transactionWithSender, BlockTags.LATEST],
		'0x5208',
	],
	[
		[transactionWithSender, BlockTags.EARLIEST, ValidTypes.HexString],
		'0x5208',
		[transactionWithSender, BlockTags.EARLIEST],
		'0x5208',
	],
	[
		[transactionWithSender, BlockTags.PENDING, ValidTypes.HexString],
		'0x5208',
		[transactionWithSender, BlockTags.PENDING],
		'0x5208',
	],
	// Defined transaction and block number, returnType = ValidTypes.NumberString
	[
		[transactionWithSender, BlockTags.LATEST, ValidTypes.NumberString],
		'0x5208',
		[transactionWithSender, BlockTags.LATEST],
		'21000',
	],
	[
		[transactionWithSender, BlockTags.EARLIEST, ValidTypes.NumberString],
		'0x5208',
		[transactionWithSender, BlockTags.EARLIEST],
		'21000',
	],
	[
		[transactionWithSender, BlockTags.PENDING, ValidTypes.NumberString],
		'0x5208',
		[transactionWithSender, BlockTags.PENDING],
		'21000',
	],
	// Defined transaction and block number, returnType = ValidTypes.Number
	[
		[transactionWithSender, BlockTags.LATEST, ValidTypes.Number],
		'0x5208',
		[transactionWithSender, BlockTags.LATEST],
		21000,
	],
	[
		[transactionWithSender, BlockTags.EARLIEST, ValidTypes.Number],
		'0x5208',
		[transactionWithSender, BlockTags.EARLIEST],
		21000,
	],
	[
		[transactionWithSender, BlockTags.PENDING, ValidTypes.Number],
		'0x5208',
		[transactionWithSender, BlockTags.PENDING],
		21000,
	],
	// Defined transaction and block number, returnType = ValidTypes.BigInt
	[
		[transactionWithSender, BlockTags.LATEST, ValidTypes.BigInt],
		'0x5208',
		[transactionWithSender, BlockTags.LATEST],
		BigInt('0x5208'),
	],
	[
		[transactionWithSender, BlockTags.EARLIEST, ValidTypes.BigInt],
		'0x5208',
		[transactionWithSender, BlockTags.EARLIEST],
		BigInt('0x5208'),
	],
	[
		[transactionWithSender, BlockTags.PENDING, ValidTypes.BigInt],
		'0x5208',
		[transactionWithSender, BlockTags.PENDING],
		BigInt('0x5208'),
	],
];

const feeHistoryResult: FeeHistoryResult = {
	oldestBlock: '0xa30950',
	baseFeePerGas: '0x9',
	reward: [],
};
const feeHistoryResultNumberString: FeeHistoryResultFormatted<ValidTypes.NumberString> = {
	...feeHistoryResult,
	oldestBlock: '10684752',
	baseFeePerGas: '9',
};
const feeHistoryResultNumber: FeeHistoryResultFormatted<ValidTypes.Number> = {
	...feeHistoryResult,
	oldestBlock: 10684752,
	baseFeePerGas: 9,
};
const feeHistoryResultBigInt: FeeHistoryResultFormatted<ValidTypes.BigInt> = {
	...feeHistoryResult,
	oldestBlock: BigInt('0xa30950'),
	baseFeePerGas: BigInt('0x9'),
};
/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 * - array of passed RPC parameters (excluding requestManager) - This is to account for any defaults set by the method
 * - expected output
 */
export const getFeeHistoryValidData: [
	[Uint, HexString32Bytes | BlockNumberOrTag | undefined, number[], ValidTypes | undefined],
	FeeHistoryResult,
	[Uint, HexString32Bytes | BlockNumberOrTag, number[]],
	(
		| FeeHistoryResultFormatted
		| FeeHistoryResultFormatted<ValidTypes.NumberString>
		| FeeHistoryResultFormatted<ValidTypes.Number>
		| FeeHistoryResultFormatted<ValidTypes.BigInt>
	),
][] = [
	// All possible undefined values
	[
		['0x4', undefined, [], undefined],
		feeHistoryResult,
		['0x4', BlockTags.LATEST, []],
		feeHistoryResult,
	],
	// Defined transaction and block number, undefined returnType
	[
		[
			'0x4',
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
			[],
			undefined,
		],
		feeHistoryResult,
		['0x4', '0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2', []],
		feeHistoryResult,
	],
	[
		['0x4', BlockTags.LATEST, [], undefined],
		feeHistoryResult,
		['0x4', BlockTags.LATEST, []],
		feeHistoryResult,
	],
	[
		['0x4', BlockTags.EARLIEST, [], undefined],
		feeHistoryResult,
		['0x4', BlockTags.EARLIEST, []],
		feeHistoryResult,
	],
	[
		['0x4', BlockTags.PENDING, [], undefined],
		feeHistoryResult,
		['0x4', BlockTags.PENDING, []],
		feeHistoryResult,
	],
	// Defined transaction and block number, undefined returnType
	[
		['0x4', BlockTags.LATEST, [], undefined],
		feeHistoryResult,
		['0x4', BlockTags.LATEST, []],
		feeHistoryResult,
	],
	[
		['0x4', BlockTags.EARLIEST, [], undefined],
		feeHistoryResult,
		['0x4', BlockTags.EARLIEST, []],
		feeHistoryResult,
	],
	[
		['0x4', BlockTags.PENDING, [], undefined],
		feeHistoryResult,
		['0x4', BlockTags.PENDING, []],
		feeHistoryResult,
	],
	// Defined transaction and block number, returnType = ValidTypes.HexString
	[
		['0x4', BlockTags.LATEST, [], ValidTypes.HexString],
		feeHistoryResult,
		['0x4', BlockTags.LATEST, []],
		feeHistoryResult,
	],
	[
		['0x4', BlockTags.EARLIEST, [], ValidTypes.HexString],
		feeHistoryResult,
		['0x4', BlockTags.EARLIEST, []],
		feeHistoryResult,
	],
	[
		['0x4', BlockTags.PENDING, [], ValidTypes.HexString],
		feeHistoryResult,
		['0x4', BlockTags.PENDING, []],
		feeHistoryResult,
	],
	// Defined transaction and block number, returnType = ValidTypes.NumberString
	[
		['0x4', BlockTags.LATEST, [], ValidTypes.NumberString],
		feeHistoryResult,
		['0x4', BlockTags.LATEST, []],
		feeHistoryResultNumberString,
	],
	[
		['0x4', BlockTags.EARLIEST, [], ValidTypes.NumberString],
		feeHistoryResult,
		['0x4', BlockTags.EARLIEST, []],
		feeHistoryResultNumberString,
	],
	[
		['0x4', BlockTags.PENDING, [], ValidTypes.NumberString],
		feeHistoryResult,
		['0x4', BlockTags.PENDING, []],
		feeHistoryResultNumberString,
	],
	// Defined transaction and block number, returnType = ValidTypes.Number
	[
		['0x4', BlockTags.LATEST, [], ValidTypes.Number],
		feeHistoryResult,
		['0x4', BlockTags.LATEST, []],
		feeHistoryResultNumber,
	],
	[
		['0x4', BlockTags.EARLIEST, [], ValidTypes.Number],
		feeHistoryResult,
		['0x4', BlockTags.EARLIEST, []],
		feeHistoryResultNumber,
	],
	[
		['0x4', BlockTags.PENDING, [], ValidTypes.Number],
		feeHistoryResult,
		['0x4', BlockTags.PENDING, []],
		feeHistoryResultNumber,
	],
	// Defined transaction and block number, returnType = ValidTypes.BigInt
	[
		['0x4', BlockTags.LATEST, [], ValidTypes.BigInt],
		feeHistoryResult,
		['0x4', BlockTags.LATEST, []],
		feeHistoryResultBigInt,
	],
	[
		['0x4', BlockTags.EARLIEST, [], ValidTypes.BigInt],
		feeHistoryResult,
		['0x4', BlockTags.EARLIEST, []],
		feeHistoryResultBigInt,
	],
	[
		['0x4', BlockTags.PENDING, [], ValidTypes.BigInt],
		feeHistoryResult,
		['0x4', BlockTags.PENDING, []],
		feeHistoryResultBigInt,
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 * - array of passed RPC parameters (excluding requestManager) - This is to account for any defaults set by the method
 */
export const getStorageAtValidData: [
	[Address, Uint256, BlockNumberOrTag | undefined],
	HexStringBytes,
	[Address, Uint256, BlockNumberOrTag],
][] = [
	// All possible undefined values
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x0', undefined],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x0', BlockTags.LATEST],
	],
	// Defined address, storageSlot, and blockNumber
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x0', BlockTags.LATEST],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x0', BlockTags.LATEST],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x0', BlockTags.EARLIEST],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x0', BlockTags.EARLIEST],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x0', BlockTags.PENDING],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x0', BlockTags.PENDING],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 * - array of passed RPC parameters (excluding requestManager) - This is to account for any defaults set by the method
 */
export const getCodeValidData: [
	[Address, BlockNumberOrTag | undefined],
	HexStringBytes,
	[Address, BlockNumberOrTag],
][] = [
	// All possible undefined values
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
	],
	// Defined address and blockNumber
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING],
		'0xe8d4a51000',
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING],
	],
];

/**
 * Array consists of:
 * - input
 * - mock RPC result
 */
export const sendSignedTransactionValidData: [HexStringBytes, HexString32Bytes][] = [
	[
		'0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
		'0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331',
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 */
export const signValidData: [[HexStringBytes, Address], HexString32Bytes][] = [
	[
		['0xdeadbeaf', '0x407d73d8a49eeb85d32cf465507dd71d507100c1'],
		'0xa3f20717a250c2b0b729b7e5becbff67fdaef7e0699da4de7ca5895b02a170a12d887fd3b17bfdce3481f10bea41f45ba9f709d39ce8325427b57afcfc994cee1b',
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 * - array of passed RPC parameters (excluding requestManager) - This is to account for any defaults set by the method
 */
export const getPastLogsValidData: [Filter, FilterResults, Filter][] = [
	[
		{},
		[
			{
				logIndex: '0x1',
				blockNumber: '0x1b4',
				blockHash: '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
				transactionHash: '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
				transactionIndex: '0x0',
				address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
				data: '0x0000000000000000000000000000000000000000000000000000000000000000',
				topics: ['0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5'],
			},
		],
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
		[
			{
				logIndex: '0x1',
				blockNumber: '0x1b4',
				blockHash: '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
				transactionHash: '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
				transactionIndex: '0x0',
				address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
				data: '0x0000000000000000000000000000000000000000000000000000000000000000',
				topics: ['0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5'],
			},
		],
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
		[
			{
				logIndex: '0x1',
				blockNumber: '0x1b4',
				blockHash: '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
				transactionHash: '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
				transactionIndex: '0x0',
				address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
				data: '0x0000000000000000000000000000000000000000000000000000000000000000',
				topics: ['0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5'],
			},
		],
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
		[
			{
				logIndex: '0x1',
				blockNumber: '0x1b4',
				blockHash: '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
				transactionHash: '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
				transactionIndex: '0x0',
				address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
				data: '0x0000000000000000000000000000000000000000000000000000000000000000',
				topics: ['0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5'],
			},
		],
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
		[
			{
				logIndex: '0x1',
				blockNumber: '0x1b4',
				blockHash: '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
				transactionHash: '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
				transactionIndex: '0x0',
				address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
				data: '0x0000000000000000000000000000000000000000000000000000000000000000',
				topics: ['0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5'],
			},
		],
		{
			fromBlock: BlockTags.EARLIEST,
			toBlock: BlockTags.EARLIEST,
		},
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 */
export const submitWorkValidData: [
	[HexString8Bytes, HexString32Bytes, HexString32Bytes],
	boolean,
][] = [
	[
		[
			'0x0000000000000001',
			'0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
			'0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000',
		],
		true,
	],
];

const accountObject: AccountObject = {
	accountProof: [
		'0xf90211a090dcaf88c40c7bbc95a912cbdde67c175767b31173df9ee4b0d733bfdd511c43a0babe369f6b12092f49181ae04ca173fb68d1a5456f18d20fa32cba73954052bda0473ecf8a7e36a829e75039a3b055e51b8332cbf03324ab4af2066bbd6fbf0021a0bbda34753d7aa6c38e603f360244e8f59611921d9e1f128372fec0d586d4f9e0a04e44caecff45c9891f74f6a2156735886eedf6f1a733628ebc802ec79d844648a0a5f3f2f7542148c973977c8a1e154c4300fec92f755f7846f1b734d3ab1d90e7a0e823850f50bf72baae9d1733a36a444ab65d0a6faaba404f0583ce0ca4dad92da0f7a00cbe7d4b30b11faea3ae61b7f1f2b315b61d9f6bd68bfe587ad0eeceb721a07117ef9fc932f1a88e908eaead8565c19b5645dc9e5b1b6e841c5edbdfd71681a069eb2de283f32c11f859d7bcf93da23990d3e662935ed4d6b39ce3673ec84472a0203d26456312bbc4da5cd293b75b840fc5045e493d6f904d180823ec22bfed8ea09287b5c21f2254af4e64fca76acc5cd87399c7f1ede818db4326c98ce2dc2208a06fc2d754e304c48ce6a517753c62b1a9c1d5925b89707486d7fc08919e0a94eca07b1c54f15e299bd58bdfef9741538c7828b5d7d11a489f9c20d052b3471df475a051f9dd3739a927c89e357580a4c97b40234aa01ed3d5e0390dc982a7975880a0a089d613f26159af43616fd9455bb461f4869bfede26f2130835ed067a8b967bfb80',
		'0xf90211a0395d87a95873cd98c21cf1df9421af03f7247880a2554e20738eec2c7507a494a0bcf6546339a1e7e14eb8fb572a968d217d2a0d1f3bc4257b22ef5333e9e4433ca012ae12498af8b2752c99efce07f3feef8ec910493be749acd63822c3558e6671a0dbf51303afdc36fc0c2d68a9bb05dab4f4917e7531e4a37ab0a153472d1b86e2a0ae90b50f067d9a2244e3d975233c0a0558c39ee152969f6678790abf773a9621a01d65cd682cc1be7c5e38d8da5c942e0a73eeaef10f387340a40a106699d494c3a06163b53d956c55544390c13634ea9aa75309f4fd866f312586942daf0f60fb37a058a52c1e858b1382a8893eb9c1f111f266eb9e21e6137aff0dddea243a567000a037b4b100761e02de63ea5f1fcfcf43e81a372dafb4419d126342136d329b7a7ba032472415864b08f808ba4374092003c8d7c40a9f7f9fe9cc8291f62538e1cc14a074e238ff5ec96b810364515551344100138916594d6af966170ff326a092fab0a0d31ac4eef14a79845200a496662e92186ca8b55e29ed0f9f59dbc6b521b116fea090607784fe738458b63c1942bba7c0321ae77e18df4961b2bc66727ea996464ea078f757653c1b63f72aff3dcc3f2a2e4c8cb4a9d36d1117c742833c84e20de994a0f78407de07f4b4cb4f899dfb95eedeb4049aeb5fc1635d65cf2f2f4dfd25d1d7a0862037513ba9d45354dd3e36264aceb2b862ac79d2050f14c95657e43a51b85c80',
		'0xf90171a04ad705ea7bf04339fa36b124fa221379bd5a38ffe9a6112cb2d94be3a437b879a08e45b5f72e8149c01efcb71429841d6a8879d4bbe27335604a5bff8dfdf85dcea00313d9b2f7c03733d6549ea3b810e5262ed844ea12f70993d87d3e0f04e3979ea0b59e3cdd6750fa8b15164612a5cb6567cdfb386d4e0137fccee5f35ab55d0efda0fe6db56e42f2057a071c980a778d9a0b61038f269dd74a0e90155b3f40f14364a08538587f2378a0849f9608942cf481da4120c360f8391bbcc225d811823c6432a026eac94e755534e16f9552e73025d6d9c30d1d7682a4cb5bd7741ddabfd48c50a041557da9a74ca68da793e743e81e2029b2835e1cc16e9e25bd0c1e89d4ccad6980a041dda0a40a21ade3a20fcd1a4abb2a42b74e9a32b02424ff8db4ea708a5e0fb9a09aaf8326a51f613607a8685f57458329b41e938bb761131a5747e066b81a0a16808080a022e6cef138e16d2272ef58434ddf49260dc1de1f8ad6dfca3da5d2a92aaaadc58080',
		'0xf851808080a009833150c367df138f1538689984b8a84fc55692d3d41fe4d1e5720ff5483a6980808080808080808080a0a319c1c415b271afc0adcb664e67738d103ac168e0bc0b7bd2da7966165cb9518080',
	],
	balance: '0x0',
	codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
	nonce: '0x0',
	storageHash: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
	storageProof: [
		{
			key: '0x0000000000000000000000000000000000000000000000000000000000000000',
			value: '0x0',
			proof: [],
		},
		{
			key: '0x0000000000000000000000000000000000000000000000000000000000000001',
			value: '0x0',
			proof: [],
		},
	],
};
const accountObjectNumberString: AccountObjectFormatted<string> = {
	accountProof: [
		'0xf90211a090dcaf88c40c7bbc95a912cbdde67c175767b31173df9ee4b0d733bfdd511c43a0babe369f6b12092f49181ae04ca173fb68d1a5456f18d20fa32cba73954052bda0473ecf8a7e36a829e75039a3b055e51b8332cbf03324ab4af2066bbd6fbf0021a0bbda34753d7aa6c38e603f360244e8f59611921d9e1f128372fec0d586d4f9e0a04e44caecff45c9891f74f6a2156735886eedf6f1a733628ebc802ec79d844648a0a5f3f2f7542148c973977c8a1e154c4300fec92f755f7846f1b734d3ab1d90e7a0e823850f50bf72baae9d1733a36a444ab65d0a6faaba404f0583ce0ca4dad92da0f7a00cbe7d4b30b11faea3ae61b7f1f2b315b61d9f6bd68bfe587ad0eeceb721a07117ef9fc932f1a88e908eaead8565c19b5645dc9e5b1b6e841c5edbdfd71681a069eb2de283f32c11f859d7bcf93da23990d3e662935ed4d6b39ce3673ec84472a0203d26456312bbc4da5cd293b75b840fc5045e493d6f904d180823ec22bfed8ea09287b5c21f2254af4e64fca76acc5cd87399c7f1ede818db4326c98ce2dc2208a06fc2d754e304c48ce6a517753c62b1a9c1d5925b89707486d7fc08919e0a94eca07b1c54f15e299bd58bdfef9741538c7828b5d7d11a489f9c20d052b3471df475a051f9dd3739a927c89e357580a4c97b40234aa01ed3d5e0390dc982a7975880a0a089d613f26159af43616fd9455bb461f4869bfede26f2130835ed067a8b967bfb80',
		'0xf90211a0395d87a95873cd98c21cf1df9421af03f7247880a2554e20738eec2c7507a494a0bcf6546339a1e7e14eb8fb572a968d217d2a0d1f3bc4257b22ef5333e9e4433ca012ae12498af8b2752c99efce07f3feef8ec910493be749acd63822c3558e6671a0dbf51303afdc36fc0c2d68a9bb05dab4f4917e7531e4a37ab0a153472d1b86e2a0ae90b50f067d9a2244e3d975233c0a0558c39ee152969f6678790abf773a9621a01d65cd682cc1be7c5e38d8da5c942e0a73eeaef10f387340a40a106699d494c3a06163b53d956c55544390c13634ea9aa75309f4fd866f312586942daf0f60fb37a058a52c1e858b1382a8893eb9c1f111f266eb9e21e6137aff0dddea243a567000a037b4b100761e02de63ea5f1fcfcf43e81a372dafb4419d126342136d329b7a7ba032472415864b08f808ba4374092003c8d7c40a9f7f9fe9cc8291f62538e1cc14a074e238ff5ec96b810364515551344100138916594d6af966170ff326a092fab0a0d31ac4eef14a79845200a496662e92186ca8b55e29ed0f9f59dbc6b521b116fea090607784fe738458b63c1942bba7c0321ae77e18df4961b2bc66727ea996464ea078f757653c1b63f72aff3dcc3f2a2e4c8cb4a9d36d1117c742833c84e20de994a0f78407de07f4b4cb4f899dfb95eedeb4049aeb5fc1635d65cf2f2f4dfd25d1d7a0862037513ba9d45354dd3e36264aceb2b862ac79d2050f14c95657e43a51b85c80',
		'0xf90171a04ad705ea7bf04339fa36b124fa221379bd5a38ffe9a6112cb2d94be3a437b879a08e45b5f72e8149c01efcb71429841d6a8879d4bbe27335604a5bff8dfdf85dcea00313d9b2f7c03733d6549ea3b810e5262ed844ea12f70993d87d3e0f04e3979ea0b59e3cdd6750fa8b15164612a5cb6567cdfb386d4e0137fccee5f35ab55d0efda0fe6db56e42f2057a071c980a778d9a0b61038f269dd74a0e90155b3f40f14364a08538587f2378a0849f9608942cf481da4120c360f8391bbcc225d811823c6432a026eac94e755534e16f9552e73025d6d9c30d1d7682a4cb5bd7741ddabfd48c50a041557da9a74ca68da793e743e81e2029b2835e1cc16e9e25bd0c1e89d4ccad6980a041dda0a40a21ade3a20fcd1a4abb2a42b74e9a32b02424ff8db4ea708a5e0fb9a09aaf8326a51f613607a8685f57458329b41e938bb761131a5747e066b81a0a16808080a022e6cef138e16d2272ef58434ddf49260dc1de1f8ad6dfca3da5d2a92aaaadc58080',
		'0xf851808080a009833150c367df138f1538689984b8a84fc55692d3d41fe4d1e5720ff5483a6980808080808080808080a0a319c1c415b271afc0adcb664e67738d103ac168e0bc0b7bd2da7966165cb9518080',
	],
	balance: '0',
	codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
	nonce: '0',
	storageHash: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
	storageProof: [
		{
			key: '0x0000000000000000000000000000000000000000000000000000000000000000',
			value: '0',
			proof: [],
		},
		{
			key: '0x0000000000000000000000000000000000000000000000000000000000000001',
			value: '0',
			proof: [],
		},
	],
};
const accountObjectNumber: AccountObjectFormatted<number> = {
	accountProof: [
		'0xf90211a090dcaf88c40c7bbc95a912cbdde67c175767b31173df9ee4b0d733bfdd511c43a0babe369f6b12092f49181ae04ca173fb68d1a5456f18d20fa32cba73954052bda0473ecf8a7e36a829e75039a3b055e51b8332cbf03324ab4af2066bbd6fbf0021a0bbda34753d7aa6c38e603f360244e8f59611921d9e1f128372fec0d586d4f9e0a04e44caecff45c9891f74f6a2156735886eedf6f1a733628ebc802ec79d844648a0a5f3f2f7542148c973977c8a1e154c4300fec92f755f7846f1b734d3ab1d90e7a0e823850f50bf72baae9d1733a36a444ab65d0a6faaba404f0583ce0ca4dad92da0f7a00cbe7d4b30b11faea3ae61b7f1f2b315b61d9f6bd68bfe587ad0eeceb721a07117ef9fc932f1a88e908eaead8565c19b5645dc9e5b1b6e841c5edbdfd71681a069eb2de283f32c11f859d7bcf93da23990d3e662935ed4d6b39ce3673ec84472a0203d26456312bbc4da5cd293b75b840fc5045e493d6f904d180823ec22bfed8ea09287b5c21f2254af4e64fca76acc5cd87399c7f1ede818db4326c98ce2dc2208a06fc2d754e304c48ce6a517753c62b1a9c1d5925b89707486d7fc08919e0a94eca07b1c54f15e299bd58bdfef9741538c7828b5d7d11a489f9c20d052b3471df475a051f9dd3739a927c89e357580a4c97b40234aa01ed3d5e0390dc982a7975880a0a089d613f26159af43616fd9455bb461f4869bfede26f2130835ed067a8b967bfb80',
		'0xf90211a0395d87a95873cd98c21cf1df9421af03f7247880a2554e20738eec2c7507a494a0bcf6546339a1e7e14eb8fb572a968d217d2a0d1f3bc4257b22ef5333e9e4433ca012ae12498af8b2752c99efce07f3feef8ec910493be749acd63822c3558e6671a0dbf51303afdc36fc0c2d68a9bb05dab4f4917e7531e4a37ab0a153472d1b86e2a0ae90b50f067d9a2244e3d975233c0a0558c39ee152969f6678790abf773a9621a01d65cd682cc1be7c5e38d8da5c942e0a73eeaef10f387340a40a106699d494c3a06163b53d956c55544390c13634ea9aa75309f4fd866f312586942daf0f60fb37a058a52c1e858b1382a8893eb9c1f111f266eb9e21e6137aff0dddea243a567000a037b4b100761e02de63ea5f1fcfcf43e81a372dafb4419d126342136d329b7a7ba032472415864b08f808ba4374092003c8d7c40a9f7f9fe9cc8291f62538e1cc14a074e238ff5ec96b810364515551344100138916594d6af966170ff326a092fab0a0d31ac4eef14a79845200a496662e92186ca8b55e29ed0f9f59dbc6b521b116fea090607784fe738458b63c1942bba7c0321ae77e18df4961b2bc66727ea996464ea078f757653c1b63f72aff3dcc3f2a2e4c8cb4a9d36d1117c742833c84e20de994a0f78407de07f4b4cb4f899dfb95eedeb4049aeb5fc1635d65cf2f2f4dfd25d1d7a0862037513ba9d45354dd3e36264aceb2b862ac79d2050f14c95657e43a51b85c80',
		'0xf90171a04ad705ea7bf04339fa36b124fa221379bd5a38ffe9a6112cb2d94be3a437b879a08e45b5f72e8149c01efcb71429841d6a8879d4bbe27335604a5bff8dfdf85dcea00313d9b2f7c03733d6549ea3b810e5262ed844ea12f70993d87d3e0f04e3979ea0b59e3cdd6750fa8b15164612a5cb6567cdfb386d4e0137fccee5f35ab55d0efda0fe6db56e42f2057a071c980a778d9a0b61038f269dd74a0e90155b3f40f14364a08538587f2378a0849f9608942cf481da4120c360f8391bbcc225d811823c6432a026eac94e755534e16f9552e73025d6d9c30d1d7682a4cb5bd7741ddabfd48c50a041557da9a74ca68da793e743e81e2029b2835e1cc16e9e25bd0c1e89d4ccad6980a041dda0a40a21ade3a20fcd1a4abb2a42b74e9a32b02424ff8db4ea708a5e0fb9a09aaf8326a51f613607a8685f57458329b41e938bb761131a5747e066b81a0a16808080a022e6cef138e16d2272ef58434ddf49260dc1de1f8ad6dfca3da5d2a92aaaadc58080',
		'0xf851808080a009833150c367df138f1538689984b8a84fc55692d3d41fe4d1e5720ff5483a6980808080808080808080a0a319c1c415b271afc0adcb664e67738d103ac168e0bc0b7bd2da7966165cb9518080',
	],
	balance: 0,
	codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
	nonce: 0,
	storageHash: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
	storageProof: [
		{
			key: '0x0000000000000000000000000000000000000000000000000000000000000000',
			value: 0,
			proof: [],
		},
		{
			key: '0x0000000000000000000000000000000000000000000000000000000000000001',
			value: 0,
			proof: [],
		},
	],
};
const accountObjectBigInt: AccountObjectFormatted<bigint> = {
	accountProof: [
		'0xf90211a090dcaf88c40c7bbc95a912cbdde67c175767b31173df9ee4b0d733bfdd511c43a0babe369f6b12092f49181ae04ca173fb68d1a5456f18d20fa32cba73954052bda0473ecf8a7e36a829e75039a3b055e51b8332cbf03324ab4af2066bbd6fbf0021a0bbda34753d7aa6c38e603f360244e8f59611921d9e1f128372fec0d586d4f9e0a04e44caecff45c9891f74f6a2156735886eedf6f1a733628ebc802ec79d844648a0a5f3f2f7542148c973977c8a1e154c4300fec92f755f7846f1b734d3ab1d90e7a0e823850f50bf72baae9d1733a36a444ab65d0a6faaba404f0583ce0ca4dad92da0f7a00cbe7d4b30b11faea3ae61b7f1f2b315b61d9f6bd68bfe587ad0eeceb721a07117ef9fc932f1a88e908eaead8565c19b5645dc9e5b1b6e841c5edbdfd71681a069eb2de283f32c11f859d7bcf93da23990d3e662935ed4d6b39ce3673ec84472a0203d26456312bbc4da5cd293b75b840fc5045e493d6f904d180823ec22bfed8ea09287b5c21f2254af4e64fca76acc5cd87399c7f1ede818db4326c98ce2dc2208a06fc2d754e304c48ce6a517753c62b1a9c1d5925b89707486d7fc08919e0a94eca07b1c54f15e299bd58bdfef9741538c7828b5d7d11a489f9c20d052b3471df475a051f9dd3739a927c89e357580a4c97b40234aa01ed3d5e0390dc982a7975880a0a089d613f26159af43616fd9455bb461f4869bfede26f2130835ed067a8b967bfb80',
		'0xf90211a0395d87a95873cd98c21cf1df9421af03f7247880a2554e20738eec2c7507a494a0bcf6546339a1e7e14eb8fb572a968d217d2a0d1f3bc4257b22ef5333e9e4433ca012ae12498af8b2752c99efce07f3feef8ec910493be749acd63822c3558e6671a0dbf51303afdc36fc0c2d68a9bb05dab4f4917e7531e4a37ab0a153472d1b86e2a0ae90b50f067d9a2244e3d975233c0a0558c39ee152969f6678790abf773a9621a01d65cd682cc1be7c5e38d8da5c942e0a73eeaef10f387340a40a106699d494c3a06163b53d956c55544390c13634ea9aa75309f4fd866f312586942daf0f60fb37a058a52c1e858b1382a8893eb9c1f111f266eb9e21e6137aff0dddea243a567000a037b4b100761e02de63ea5f1fcfcf43e81a372dafb4419d126342136d329b7a7ba032472415864b08f808ba4374092003c8d7c40a9f7f9fe9cc8291f62538e1cc14a074e238ff5ec96b810364515551344100138916594d6af966170ff326a092fab0a0d31ac4eef14a79845200a496662e92186ca8b55e29ed0f9f59dbc6b521b116fea090607784fe738458b63c1942bba7c0321ae77e18df4961b2bc66727ea996464ea078f757653c1b63f72aff3dcc3f2a2e4c8cb4a9d36d1117c742833c84e20de994a0f78407de07f4b4cb4f899dfb95eedeb4049aeb5fc1635d65cf2f2f4dfd25d1d7a0862037513ba9d45354dd3e36264aceb2b862ac79d2050f14c95657e43a51b85c80',
		'0xf90171a04ad705ea7bf04339fa36b124fa221379bd5a38ffe9a6112cb2d94be3a437b879a08e45b5f72e8149c01efcb71429841d6a8879d4bbe27335604a5bff8dfdf85dcea00313d9b2f7c03733d6549ea3b810e5262ed844ea12f70993d87d3e0f04e3979ea0b59e3cdd6750fa8b15164612a5cb6567cdfb386d4e0137fccee5f35ab55d0efda0fe6db56e42f2057a071c980a778d9a0b61038f269dd74a0e90155b3f40f14364a08538587f2378a0849f9608942cf481da4120c360f8391bbcc225d811823c6432a026eac94e755534e16f9552e73025d6d9c30d1d7682a4cb5bd7741ddabfd48c50a041557da9a74ca68da793e743e81e2029b2835e1cc16e9e25bd0c1e89d4ccad6980a041dda0a40a21ade3a20fcd1a4abb2a42b74e9a32b02424ff8db4ea708a5e0fb9a09aaf8326a51f613607a8685f57458329b41e938bb761131a5747e066b81a0a16808080a022e6cef138e16d2272ef58434ddf49260dc1de1f8ad6dfca3da5d2a92aaaadc58080',
		'0xf851808080a009833150c367df138f1538689984b8a84fc55692d3d41fe4d1e5720ff5483a6980808080808080808080a0a319c1c415b271afc0adcb664e67738d103ac168e0bc0b7bd2da7966165cb9518080',
	],
	balance: BigInt('0x0'),
	codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
	nonce: BigInt('0x0'),
	storageHash: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
	storageProof: [
		{
			key: '0x0000000000000000000000000000000000000000000000000000000000000000',
			value: BigInt('0x0'),
			proof: [],
		},
		{
			key: '0x0000000000000000000000000000000000000000000000000000000000000001',
			value: BigInt('0x0'),
			proof: [],
		},
	],
};
/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 * - array of passed RPC parameters (excluding requestManager) - This is to account for any defaults set by the method
 * - expected output
 */
export const getProofValidData: [
	[Address, HexString32Bytes, BlockNumberOrTag | undefined, ValidTypes | undefined],
	AccountObject,
	[Address, HexString32Bytes, BlockNumberOrTag],
	(
		| AccountObject
		| AccountObjectFormatted<string>
		| AccountObjectFormatted<number>
		| AccountObjectFormatted<bigint>
	),
][] = [
	// All possible undefined values
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			undefined,
			undefined,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
		],
		accountObject,
	],
	// Defined block number, undefined returnType
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			undefined,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
		],
		accountObject,
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			undefined,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
		],
		accountObject,
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			undefined,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
		],
		accountObject,
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			undefined,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
		],
		accountObject,
	],
	// Defined block number, returnType = ValidTypes.HexString
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			ValidTypes.HexString,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
		],
		accountObject,
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			ValidTypes.HexString,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
		],
		accountObject,
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			ValidTypes.HexString,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
		],
		accountObject,
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			ValidTypes.HexString,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
		],
		accountObject,
	],
	// Defined block number, returnType = ValidTypes.NumberString
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			ValidTypes.NumberString,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
		],
		accountObjectNumberString,
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			ValidTypes.NumberString,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
		],
		accountObjectNumberString,
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			ValidTypes.NumberString,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
		],
		accountObjectNumberString,
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			ValidTypes.NumberString,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
		],
		accountObjectNumberString,
	],
	// Defined block number, returnType = ValidTypes.Number
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			ValidTypes.Number,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
		],
		accountObjectNumber,
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			ValidTypes.Number,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
		],
		accountObjectNumber,
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			ValidTypes.Number,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
		],
		accountObjectNumber,
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			ValidTypes.Number,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
		],
		accountObjectNumber,
	],
	// Defined block number, returnType = ValidTypes.BigInt
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			ValidTypes.BigInt,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
		],
		accountObjectBigInt,
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			ValidTypes.BigInt,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
		],
		accountObjectBigInt,
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			ValidTypes.BigInt,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
		],
		accountObjectBigInt,
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			ValidTypes.BigInt,
		],
		accountObject,
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
		],
		accountObjectBigInt,
	],
];

export const getChainIdValidData: [ValidTypes | undefined, Uint, Numbers][] = [
	[undefined, '0x3d', '0x3d'],
	[ValidTypes.HexString, '0x3d', '0x3d'],
	[ValidTypes.Number, '0x3d', 61],
	[ValidTypes.NumberString, '0x3d', '61'],
	[ValidTypes.BigInt, '0x3d', BigInt('0x3d')],
];
