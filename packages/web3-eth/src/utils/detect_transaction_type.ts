import { EthExecutionAPI } from 'web3-common';
import { TransactionTypeParser, Web3Context } from 'web3-core';
import { convertToValidType, HexString, ValidTypes } from 'web3-utils';
import { Transaction } from '../types';

export const defaultTransactionTypeParser: TransactionTypeParser = transaction => {
	const tx = transaction as unknown as Transaction;

	if (tx.type !== undefined)
		return convertToValidType(tx.type, ValidTypes.HexString) as HexString;

	if (
		tx.maxFeePerGas !== undefined ||
		tx.maxPriorityFeePerGas !== undefined ||
		tx.hardfork === 'london' ||
		tx.common?.hardfork === 'london'
	)
		return '0x2';

	if (tx.accessList !== undefined || tx.hardfork === 'berlin' || tx.common?.hardfork === 'berlin')
		return '0x1';

	return undefined;
};

export const detectTransactionType = (
	transaction: Transaction,
	web3Context?: Web3Context<EthExecutionAPI>,
) =>
	(web3Context?.transactionTypeParser ?? defaultTransactionTypeParser)(
		transaction as unknown as Record<string, unknown>,
	);
