import { Block, FeeHistoryResult, ReceiptInfo, TransactionInfo } from 'web3-common';
import { Transaction } from './types';

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
];

export const convertibleTransactionProperties: KeysOfUnion<Transaction>[] = [
	'value',
	'gas',
	'gasPrice',
	'type',
	'maxFeePerGas',
	'maxPriorityFeePerGas',
	'nonce',
];

export const convertibleTransactionCustomChainProperties = ['networkId', 'chainId'];

export const convertibleReceiptInfoProperties: (keyof ReceiptInfo)[] = [
	'transactionIndex',
	'blockNumber',
	'cumulativeGasUsed',
	'gasUsed',
	'status',
];

export const convertibleFeeHistoryResultProperties: (keyof FeeHistoryResult)[] = [
	'oldestBlock',
	'baseFeePerGas',
];
