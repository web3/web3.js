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

import { Block, FeeHistoryResult, ReceiptInfo, TransactionInfo } from 'web3-common';

export const convertibleBlockProperties: (keyof Block)[] = [
	'difficulty',
	'number',
	'gasLimit',
	'gasUsed',
	'timestamp',
	'nonce',
	'totalDifficulty',
	'baseFeePerGas',
	'size',
];

// https://stackoverflow.com/a/49402091
type KeysOfUnion<T> = T extends T ? keyof T : never;
export const convertibleTransactionInfoProperties: KeysOfUnion<TransactionInfo>[] = [
	'blockNumber',
	'gas',
	'gasPrice',
	'type',
	'nonce',
	'transactionIndex',
	'value',
	'v',
	'maxFeePerGas',
	'maxPriorityFeePerGas',
	'yParity',
	'chainId',
];

export const convertibleReceiptInfoProperties: (keyof ReceiptInfo)[] = [
	'transactionIndex',
	'blockNumber',
	'cumulativeGasUsed',
	'gasUsed',
	'status',
	'effectiveGasPrice',
];

export const convertibleFeeHistoryResultProperties: (keyof FeeHistoryResult)[] = [
	'oldestBlock',
	'baseFeePerGas',
];
