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

import { DataFormat, DEFAULT_RETURN_FORMAT, FMT_NUMBER, TransactionWithSender } from 'web3-common';
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
} from 'web3-utils';
import { transactionWithSender } from './rpc_methods_wrappers';

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getBalanceValidData: [
	[Address, BlockNumberOrTag | undefined, DataFormat | undefined],
	[Address, BlockNumberOrTag, DataFormat | undefined],
][] = [
	// All possible undefined values
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	// Defined blockNumber, undefined returnType
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	// Undefined blockNumber, returnType = DEFAULT_RETURN_FORMAT
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined, DEFAULT_RETURN_FORMAT],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	// Defined blockNumber, returnType = DEFAULT_RETURN_FORMAT
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7', DEFAULT_RETURN_FORMAT],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7', DEFAULT_RETURN_FORMAT],
	],
	// Undefined blockNumber, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			undefined,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	// Defined blockNumber, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x4b7',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x4b7',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	// Undefined blockNumber, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			undefined,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	// Defined blockNumber, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x4b7',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x4b7',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	// Undefined blockNumber, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			undefined,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	// Defined blockNumber, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x4b7',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x4b7',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getBlockValidData: [
	[HexString32Bytes | BlockNumberOrTag | undefined, boolean | undefined, DataFormat | undefined],
	[HexString32Bytes | BlockNumberOrTag, boolean, DataFormat | undefined],
][] = [
	// All possible undefined values
	[
		[undefined, undefined, undefined],
		[BlockTags.LATEST, false, DEFAULT_RETURN_FORMAT],
	],
	// Defined block, undefined hydrated and returnType
	[
		[
			'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
			undefined,
			undefined,
		],
		[
			'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
			false,
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[BlockTags.LATEST, undefined, undefined],
		[BlockTags.LATEST, false, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, undefined, undefined],
		[BlockTags.EARLIEST, false, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, undefined, undefined],
		[BlockTags.PENDING, false, DEFAULT_RETURN_FORMAT],
	],
	// Defined block, hydrated = true, and undefined returnType
	[
		[BlockTags.LATEST, true, undefined],
		[BlockTags.LATEST, true, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, true, undefined],
		[BlockTags.EARLIEST, true, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, true, undefined],
		[BlockTags.PENDING, true, DEFAULT_RETURN_FORMAT],
	],
	// Defined block, hydrated = false, and undefined returnType
	[
		[BlockTags.LATEST, false, undefined],
		[BlockTags.LATEST, false, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, false, undefined],
		[BlockTags.EARLIEST, false, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, false, undefined],
		[BlockTags.PENDING, false, DEFAULT_RETURN_FORMAT],
	],
	// Defined block, hydrated = true, and returnType = DEFAULT_RETURN_FORMAT
	[
		[BlockTags.LATEST, true, DEFAULT_RETURN_FORMAT],
		[BlockTags.LATEST, true, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, true, DEFAULT_RETURN_FORMAT],
		[BlockTags.EARLIEST, true, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, true, DEFAULT_RETURN_FORMAT],
		[BlockTags.PENDING, true, DEFAULT_RETURN_FORMAT],
	],
	// Defined block, hydrated = true, and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[BlockTags.LATEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.LATEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.EARLIEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.EARLIEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.PENDING, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.PENDING, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	// Defined block, hydrated = true, and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[BlockTags.LATEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.LATEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		[BlockTags.EARLIEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.EARLIEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		[BlockTags.PENDING, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.PENDING, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	// Defined block, hydrated = true, and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[BlockTags.LATEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.LATEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.EARLIEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.EARLIEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.PENDING, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.PENDING, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getBlockTransactionCountValidData: [
	[HexString32Bytes | BlockNumberOrTag | undefined, DataFormat | undefined],
	[HexString32Bytes | BlockNumberOrTag, DataFormat | undefined],
][] = [
	// All possible undefined values
	[
		[undefined, undefined],
		[BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	// Defined block, undefined returnType
	[
		['0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae', undefined],
		[
			'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[BlockTags.LATEST, undefined],
		[BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, undefined],
		[BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, undefined],
		[BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	// Defined block and returnType = DEFAULT_RETURN_FORMAT
	[
		[BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
		[BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
		[BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
		[BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	// Defined block and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[BlockTags.LATEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.LATEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.EARLIEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.EARLIEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.PENDING, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.PENDING, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	// Defined block, hydrated = true, and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[BlockTags.LATEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.LATEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		[BlockTags.EARLIEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.EARLIEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		[BlockTags.PENDING, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.PENDING, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	// Defined block and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[BlockTags.LATEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.LATEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.EARLIEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.EARLIEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.PENDING, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.PENDING, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getBlockUncleCountValidData: [
	[HexString32Bytes | BlockNumberOrTag | undefined, DataFormat | undefined],
	[HexString32Bytes | BlockNumberOrTag, DataFormat | undefined],
][] = [
	// All possible undefined values
	[
		[undefined, undefined],
		[BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	// Defined block, undefined returnType
	[
		['0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae', undefined],
		[
			'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[BlockTags.LATEST, undefined],
		[BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, undefined],
		[BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, undefined],
		[BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	// Defined block and returnType = DEFAULT_RETURN_FORMAT
	[
		[BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
		[BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
		[BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
		[BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	// Defined block and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[BlockTags.LATEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.LATEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.EARLIEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.EARLIEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.PENDING, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.PENDING, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	// Defined block, hydrated = true, and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[BlockTags.LATEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.LATEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		[BlockTags.EARLIEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.EARLIEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		[BlockTags.PENDING, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.PENDING, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	// Defined block and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[BlockTags.LATEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.LATEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.EARLIEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.EARLIEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.PENDING, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.PENDING, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getUncleValidData: [
	[HexString32Bytes | BlockNumberOrTag | undefined, Uint, DataFormat | undefined],
	[HexString32Bytes | BlockNumberOrTag, Uint, DataFormat | undefined],
][] = [
	// All possible undefined values
	[
		[undefined, '0x0', undefined],
		[BlockTags.LATEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	// Defined block, uncleIndex = '0x0', and undefined returnType
	[
		['0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2', '0x0', undefined],
		[
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
			'0x0',
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[BlockTags.LATEST, '0x0', undefined],
		[BlockTags.LATEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, '0x0', undefined],
		[BlockTags.EARLIEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, '0x0', undefined],
		[BlockTags.PENDING, '0x0', DEFAULT_RETURN_FORMAT],
	],
	// Defined block, uncleIndex = '0x0', and undefined returnType
	[
		[BlockTags.LATEST, '0x0', undefined],
		[BlockTags.LATEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, '0x0', undefined],
		[BlockTags.EARLIEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, '0x0', undefined],
		[BlockTags.PENDING, '0x0', DEFAULT_RETURN_FORMAT],
	],
	// Defined block, uncleIndex = true, and returnType = DEFAULT_RETURN_FORMAT
	[
		[BlockTags.LATEST, '0x0', DEFAULT_RETURN_FORMAT],
		[BlockTags.LATEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, '0x0', DEFAULT_RETURN_FORMAT],
		[BlockTags.EARLIEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, '0x0', DEFAULT_RETURN_FORMAT],
		[BlockTags.PENDING, '0x0', DEFAULT_RETURN_FORMAT],
	],
	// Defined block, uncleIndex = '0x0', and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[BlockTags.LATEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.LATEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.EARLIEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.EARLIEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.PENDING, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.PENDING, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	// Defined block, uncleIndex = '0x0', and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[BlockTags.LATEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.LATEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		[BlockTags.EARLIEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.EARLIEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		[BlockTags.PENDING, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.PENDING, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	// Defined block, uncleIndex = '0x0', and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[BlockTags.LATEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.LATEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.EARLIEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.EARLIEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.PENDING, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.PENDING, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
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
	[HexString32Bytes, DataFormat | undefined],
	[HexString32Bytes, DataFormat | undefined],
][] = [
	// Defined transactionHash, undefined returnType
	[
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', undefined],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			DEFAULT_RETURN_FORMAT,
		],
	],
	// Defined transactionHash and returnType = DEFAULT_RETURN_FORMAT
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			DEFAULT_RETURN_FORMAT,
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			DEFAULT_RETURN_FORMAT,
		],
	],
	// Defined transactionHash and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	// Defined block, hydrated = true, and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	// Defined block and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getTransactionFromBlockValidData: [
	[HexString32Bytes | BlockNumberOrTag | undefined, Uint, DataFormat | undefined],
	[HexString32Bytes | BlockNumberOrTag, Uint, DataFormat | undefined],
][] = [
	// All possible undefined values
	[
		[undefined, '0x0', undefined],
		[BlockTags.LATEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	// Defined block, uncleIndex = '0x0', and undefined returnType
	[
		['0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2', '0x0', undefined],
		[
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
			'0x0',
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[BlockTags.LATEST, '0x0', undefined],
		[BlockTags.LATEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, '0x0', undefined],
		[BlockTags.EARLIEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, '0x0', undefined],
		[BlockTags.PENDING, '0x0', DEFAULT_RETURN_FORMAT],
	],
	// Defined block, uncleIndex = '0x0', and undefined returnType
	[
		[BlockTags.LATEST, '0x0', undefined],
		[BlockTags.LATEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, '0x0', undefined],
		[BlockTags.EARLIEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, '0x0', undefined],
		[BlockTags.PENDING, '0x0', DEFAULT_RETURN_FORMAT],
	],
	// Defined block, uncleIndex = true, and returnType = DEFAULT_RETURN_FORMAT
	[
		[BlockTags.LATEST, '0x0', DEFAULT_RETURN_FORMAT],
		[BlockTags.LATEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, '0x0', DEFAULT_RETURN_FORMAT],
		[BlockTags.EARLIEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, '0x0', DEFAULT_RETURN_FORMAT],
		[BlockTags.PENDING, '0x0', DEFAULT_RETURN_FORMAT],
	],
	// Defined block, uncleIndex = '0x0', and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[BlockTags.LATEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.LATEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.EARLIEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.EARLIEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.PENDING, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.PENDING, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	// Defined block, uncleIndex = '0x0', and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[BlockTags.LATEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.LATEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		[BlockTags.EARLIEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.EARLIEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		[BlockTags.PENDING, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.PENDING, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	// Defined block, uncleIndex = '0x0', and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[BlockTags.LATEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.LATEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.EARLIEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.EARLIEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.PENDING, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.PENDING, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getTransactionReceiptValidData: [
	[HexString32Bytes, DataFormat | undefined],
	[HexString32Bytes, DataFormat | undefined],
][] = [
	// Defined block, undefined returnType
	[
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', undefined],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			DEFAULT_RETURN_FORMAT,
		],
	],
	// Defined block and returnType = DEFAULT_RETURN_FORMAT
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			DEFAULT_RETURN_FORMAT,
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			DEFAULT_RETURN_FORMAT,
		],
	],
	// Defined block and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	// Defined block, hydrated = true, and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	// Defined block and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getTransactionCountValidData: [
	[Address, HexString32Bytes | BlockNumberOrTag | undefined, DataFormat | undefined],
	[Address, HexString32Bytes | BlockNumberOrTag, DataFormat | undefined],
][] = [
	// All possible undefined values
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
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
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	// Defined block, uncleIndex = and undefined returnType
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	// Defined block, uncleIndex = true, and returnType = DEFAULT_RETURN_FORMAT
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	// Defined block, uncleIndex = and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	// Defined block, uncleIndex = and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	// Defined block, uncleIndex = and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
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
		DataFormat | undefined,
	],
	[Partial<TransactionWithSender>, HexString32Bytes | BlockNumberOrTag, DataFormat | undefined],
][] = [
	// All possible undefined values
	[
		[transactionWithSender, undefined, undefined],
		[transactionWithSender, BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
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
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[transactionWithSender, BlockTags.LATEST, undefined],
		[transactionWithSender, BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[transactionWithSender, BlockTags.EARLIEST, undefined],
		[transactionWithSender, BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[transactionWithSender, BlockTags.PENDING, undefined],
		[transactionWithSender, BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	// Defined transaction and block number, undefined returnType
	[
		[transactionWithSender, BlockTags.LATEST, undefined],
		[transactionWithSender, BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[transactionWithSender, BlockTags.EARLIEST, undefined],
		[transactionWithSender, BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[transactionWithSender, BlockTags.PENDING, undefined],
		[transactionWithSender, BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	// Defined transaction and block number, returnType = DEFAULT_RETURN_FORMAT
	[
		[transactionWithSender, BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
		[transactionWithSender, BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[transactionWithSender, BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
		[transactionWithSender, BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[transactionWithSender, BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
		[transactionWithSender, BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	// Defined transaction and block number, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[
			transactionWithSender,
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			transactionWithSender,
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			transactionWithSender,
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			transactionWithSender,
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			transactionWithSender,
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			transactionWithSender,
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	// Defined transaction and block number, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[
			transactionWithSender,
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			transactionWithSender,
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			transactionWithSender,
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			transactionWithSender,
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			transactionWithSender,
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			transactionWithSender,
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	// Defined transaction and block number, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[
			transactionWithSender,
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			transactionWithSender,
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			transactionWithSender,
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			transactionWithSender,
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			transactionWithSender,
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			transactionWithSender,
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getFeeHistoryValidData: [
	[Uint, HexString32Bytes | BlockNumberOrTag | undefined, number[], DataFormat | undefined],
	[Uint, HexString32Bytes | BlockNumberOrTag, number[], DataFormat | undefined],
][] = [
	// All possible undefined values
	[
		['0x4', undefined, [], undefined],
		['0x4', BlockTags.LATEST, [], DEFAULT_RETURN_FORMAT],
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
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		['0x4', BlockTags.LATEST, [], undefined],
		['0x4', BlockTags.LATEST, [], DEFAULT_RETURN_FORMAT],
	],
	[
		['0x4', BlockTags.EARLIEST, [], undefined],
		['0x4', BlockTags.EARLIEST, [], DEFAULT_RETURN_FORMAT],
	],
	[
		['0x4', BlockTags.PENDING, [], undefined],
		['0x4', BlockTags.PENDING, [], DEFAULT_RETURN_FORMAT],
	],
	// Defined transaction and block number, undefined returnType
	[
		['0x4', BlockTags.LATEST, [], undefined],
		['0x4', BlockTags.LATEST, [], DEFAULT_RETURN_FORMAT],
	],
	[
		['0x4', BlockTags.EARLIEST, [], undefined],
		['0x4', BlockTags.EARLIEST, [], DEFAULT_RETURN_FORMAT],
	],
	[
		['0x4', BlockTags.PENDING, [], undefined],
		['0x4', BlockTags.PENDING, [], DEFAULT_RETURN_FORMAT],
	],
	// Defined transaction and block number, returnType = DEFAULT_RETURN_FORMAT
	[
		['0x4', BlockTags.LATEST, [], DEFAULT_RETURN_FORMAT],
		['0x4', BlockTags.LATEST, [], DEFAULT_RETURN_FORMAT],
	],
	[
		['0x4', BlockTags.EARLIEST, [], DEFAULT_RETURN_FORMAT],
		['0x4', BlockTags.EARLIEST, [], DEFAULT_RETURN_FORMAT],
	],
	[
		['0x4', BlockTags.PENDING, [], DEFAULT_RETURN_FORMAT],
		['0x4', BlockTags.PENDING, [], DEFAULT_RETURN_FORMAT],
	],
	// Defined transaction and block number, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		['0x4', BlockTags.LATEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		['0x4', BlockTags.LATEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		['0x4', BlockTags.EARLIEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		['0x4', BlockTags.EARLIEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		['0x4', BlockTags.PENDING, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		['0x4', BlockTags.PENDING, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	// Defined transaction and block number, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		['0x4', BlockTags.LATEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		['0x4', BlockTags.LATEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		['0x4', BlockTags.EARLIEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		['0x4', BlockTags.EARLIEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		['0x4', BlockTags.PENDING, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		['0x4', BlockTags.PENDING, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	// Defined transaction and block number, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		['0x4', BlockTags.LATEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		['0x4', BlockTags.LATEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		['0x4', BlockTags.EARLIEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		['0x4', BlockTags.EARLIEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		['0x4', BlockTags.PENDING, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		['0x4', BlockTags.PENDING, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
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
	[Address, HexString32Bytes, BlockNumberOrTag | undefined, DataFormat | undefined],
	[Address, HexString32Bytes, BlockNumberOrTag, DataFormat | undefined],
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
			DEFAULT_RETURN_FORMAT,
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
			DEFAULT_RETURN_FORMAT,
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
			DEFAULT_RETURN_FORMAT,
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
			DEFAULT_RETURN_FORMAT,
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
			DEFAULT_RETURN_FORMAT,
		],
	],
	// Defined block number, returnType = DEFAULT_RETURN_FORMAT
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			DEFAULT_RETURN_FORMAT,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			DEFAULT_RETURN_FORMAT,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			DEFAULT_RETURN_FORMAT,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			DEFAULT_RETURN_FORMAT,
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			DEFAULT_RETURN_FORMAT,
		],
	],
	// Defined block number, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	// Defined block number, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	// Defined block number, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			'0x1',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x1234567890123456789012345678901234567890',
			'0x295a70b2de5e3953354a6a8344e616ed314d7251',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
];
