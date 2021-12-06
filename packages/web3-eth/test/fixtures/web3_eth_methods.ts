import { Block, TransactionInfo } from 'web3-common';
import {
	HexString32Bytes,
	ValidTypes,
	ValidReturnTypes,
	Address,
	BlockNumberOrTag,
	BlockTags,
	HexString,
	Uint,
} from 'web3-utils';
import { BlockFormatted } from '../../src/types';

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
const transaction: TransactionInfo = {
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
};
const hydratedTransactions: TransactionInfo[] = [transaction, transaction, transaction];
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

/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 * - expected RPC methods to be called
 * - array of passed RPC parameters (excluding requestManager) - This is to account for any defaults set by the method
 * - expected output
 */
export const getTransactionValidData: [
	[HexString32Bytes, ValidTypes | undefined],
	TransactionInfo | null,
	'getUncleCountByBlockHash' | 'getUncleCountByBlockNumber',
	[HexString32Bytes | BlockNumberOrTag],
	// TODO Change this to TransactionInfoFormatted
	ValidReturnTypes[ValidTypes],
][] = [
	// Defined block, undefined returnType
	[
		['0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae', undefined],
		transaction,
		'getUncleCountByBlockHash',
		['0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae'],
		'0xb',
	],
	[
		[BlockTags.LATEST, undefined],
		transaction,
		'getUncleCountByBlockNumber',
		[BlockTags.LATEST],
		'0xb',
	],
	[
		[BlockTags.EARLIEST, undefined],
		transaction,
		'getUncleCountByBlockNumber',
		[BlockTags.EARLIEST],
		'0xb',
	],
	[
		[BlockTags.PENDING, undefined],
		transaction,
		'getUncleCountByBlockNumber',
		[BlockTags.PENDING],
		'0xb',
	],
	// Defined block and returnType = ValidTypes.HexString
	[
		[BlockTags.LATEST, ValidTypes.HexString],
		transaction,
		'getUncleCountByBlockNumber',
		[BlockTags.LATEST],
		'0xb',
	],
	[
		[BlockTags.EARLIEST, ValidTypes.HexString],
		transaction,
		'getUncleCountByBlockNumber',
		[BlockTags.EARLIEST],
		'0xb',
	],
	[
		[BlockTags.PENDING, ValidTypes.HexString],
		transaction,
		'getUncleCountByBlockNumber',
		[BlockTags.PENDING],
		'0xb',
	],
	// Defined block and returnType = ValidTypes.NumberString
	[
		[BlockTags.LATEST, ValidTypes.NumberString],
		transaction,
		'getUncleCountByBlockNumber',
		[BlockTags.LATEST],
		'11',
	],
	[
		[BlockTags.EARLIEST, ValidTypes.NumberString],
		transaction,
		'getUncleCountByBlockNumber',
		[BlockTags.EARLIEST],
		'11',
	],
	[
		[BlockTags.PENDING, ValidTypes.NumberString],
		transaction,
		'getUncleCountByBlockNumber',
		[BlockTags.PENDING],
		'11',
	],
	// Defined block, hydrated = true, and returnType = ValidTypes.Number
	[
		[BlockTags.LATEST, ValidTypes.Number],
		transaction,
		'getUncleCountByBlockNumber',
		[BlockTags.LATEST],
		11,
	],
	[
		[BlockTags.EARLIEST, ValidTypes.Number],
		transaction,
		'getUncleCountByBlockNumber',
		[BlockTags.EARLIEST],
		11,
	],
	[
		[BlockTags.PENDING, ValidTypes.Number],
		transaction,
		'getUncleCountByBlockNumber',
		[BlockTags.PENDING],
		11,
	],
	// Defined block and returnType = ValidTypes.BigInt
	[
		[BlockTags.LATEST, ValidTypes.BigInt],
		transaction,
		'getUncleCountByBlockNumber',
		[BlockTags.LATEST],
		BigInt('0xb'),
	],
	[
		[BlockTags.EARLIEST, ValidTypes.BigInt],
		transaction,
		'getUncleCountByBlockNumber',
		[BlockTags.EARLIEST],
		BigInt('0xb'),
	],
	[
		[BlockTags.PENDING, ValidTypes.BigInt],
		transaction,
		'getUncleCountByBlockNumber',
		[BlockTags.PENDING],
		BigInt('0xb'),
	],
];
