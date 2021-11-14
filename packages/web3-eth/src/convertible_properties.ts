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
	'type',
	'nonce',
	'gas',
	'value',
	'maxFeePerGas',
	'maxPriorityFeePerGas',
	'yParity',
	'v',
	'gasPrice',
	'blockNumber',
	'transactionIndex',
];

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
