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

import Common from '@ethereumjs/common';
import { TransactionFactory, TxOptions } from '@ethereumjs/tx';
import {
	EthExecutionAPI,
	HexString,
	PopulatedUnsignedEip1559Transaction,
	PopulatedUnsignedEip2930Transaction,
	PopulatedUnsignedTransaction,
	Transaction,
} from 'web3-types';
import { Web3Context } from 'web3-core';
import { FormatType, ETH_DATA_FORMAT, toNumber } from 'web3-utils';
import { isNullish } from 'web3-validator';
import { validateTransactionForSigning } from '../validation';
import { formatTransaction } from './format_transaction';
import { transactionBuilder } from './transaction_builder';

const getEthereumjsTxDataFromTransaction = (
	transaction: FormatType<PopulatedUnsignedTransaction, typeof ETH_DATA_FORMAT>,
) => ({
	nonce: transaction.nonce,
	gasPrice: transaction.gasPrice,
	gasLimit: transaction.gasLimit,
	to: transaction.to,
	value: transaction.value,
	data: transaction.data,
	type: transaction.type,
	chainId: transaction.chainId,
	accessList: (
		transaction as FormatType<PopulatedUnsignedEip2930Transaction, typeof ETH_DATA_FORMAT>
	).accessList,
	maxPriorityFeePerGas: (
		transaction as FormatType<PopulatedUnsignedEip1559Transaction, typeof ETH_DATA_FORMAT>
	).maxPriorityFeePerGas,
	maxFeePerGas: (
		transaction as FormatType<PopulatedUnsignedEip1559Transaction, typeof ETH_DATA_FORMAT>
	).maxFeePerGas,
});

const getEthereumjsTransactionOptions = (
	transaction: FormatType<PopulatedUnsignedTransaction, typeof ETH_DATA_FORMAT>,
	web3Context: Web3Context<EthExecutionAPI>,
) => {
	const hasTransactionSigningOptions =
		(!isNullish(transaction.chain) && !isNullish(transaction.hardfork)) ||
		!isNullish(transaction.common);

	let common;
	if (!hasTransactionSigningOptions) {
		common = Common.custom(
			{
				name: 'custom-network',
				chainId: toNumber(transaction.chainId) as number,
				networkId: !isNullish(transaction.networkId)
					? (toNumber(transaction.networkId) as number)
					: undefined,
				defaultHardfork: transaction.hardfork ?? web3Context.defaultHardfork,
			},
			{
				baseChain: web3Context.defaultChain,
			},
		);
	} else if (transaction.common)
		common = Common.custom(
			{
				name: transaction.common.customChain.name ?? 'custom-network',
				chainId: toNumber(transaction.common.customChain.chainId) as number,
				networkId: toNumber(transaction.common.customChain.networkId) as number,
				defaultHardfork: transaction.common.hardfork ?? web3Context.defaultHardfork,
			},
			{
				baseChain: transaction.common.baseChain ?? web3Context.defaultChain,
			},
		);

	return { common } as TxOptions;
};

export const prepareTransactionForSigning = async (
	transaction: Transaction,
	web3Context: Web3Context<EthExecutionAPI>,
	privateKey?: HexString | Buffer,
) => {
	const populatedTransaction = (await transactionBuilder({
		transaction,
		web3Context,
		privateKey,
	})) as unknown as PopulatedUnsignedTransaction;

	const formattedTransaction = formatTransaction(
		populatedTransaction,
		ETH_DATA_FORMAT,
	) as unknown as FormatType<PopulatedUnsignedTransaction, typeof ETH_DATA_FORMAT>;

	validateTransactionForSigning(
		formattedTransaction as unknown as FormatType<Transaction, typeof ETH_DATA_FORMAT>,
	);

	return TransactionFactory.fromTxData(
		getEthereumjsTxDataFromTransaction(formattedTransaction),
		getEthereumjsTransactionOptions(formattedTransaction, web3Context),
	);
};
