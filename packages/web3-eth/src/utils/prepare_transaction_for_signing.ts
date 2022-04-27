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
import { EthExecutionAPI, FMT_BYTES, FMT_NUMBER, FormatType } from 'web3-common';
import { Web3Context } from 'web3-core';
import { HexString, toNumber } from 'web3-utils';
import {
	PopulatedUnsignedEip1559Transaction,
	PopulatedUnsignedEip2930Transaction,
	PopulatedUnsignedTransaction,
	Transaction,
} from '../types';
import { validateTransactionForSigning } from '../validation';
import { formatTransaction } from './format_transaction';
import { transactionBuilder } from './transaction_builder';

const getEthereumjsTxDataFromTransaction = (
	transaction: FormatType<
		PopulatedUnsignedTransaction,
		{ number: FMT_NUMBER.HEX; bytes: FMT_BYTES.HEX }
	>,
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
		transaction as FormatType<
			PopulatedUnsignedEip2930Transaction,
			{ number: FMT_NUMBER.HEX; bytes: FMT_BYTES.HEX }
		>
	).accessList,
	maxPriorityFeePerGas: (
		transaction as FormatType<
			PopulatedUnsignedEip1559Transaction,
			{ number: FMT_NUMBER.HEX; bytes: FMT_BYTES.HEX }
		>
	).maxPriorityFeePerGas,
	maxFeePerGas: (
		transaction as FormatType<
			PopulatedUnsignedEip1559Transaction,
			{ number: FMT_NUMBER.HEX; bytes: FMT_BYTES.HEX }
		>
	).maxFeePerGas,
});

const getEthereumjsTransactionOptions = (
	transaction: FormatType<
		PopulatedUnsignedTransaction,
		{ number: FMT_NUMBER.HEX; bytes: FMT_BYTES.HEX }
	>,
	web3Context: Web3Context<EthExecutionAPI>,
) => {
	const hasTransactionSigningOptions =
		(transaction.chain !== undefined && transaction.hardfork !== undefined) ||
		transaction.common !== undefined;

	let common;
	if (!hasTransactionSigningOptions) {
		common = Common.custom(
			{
				name: 'custom-network',
				chainId: toNumber(transaction.chainId) as number,
				networkId:
					transaction.networkId !== undefined
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

	const formattedTransaction = formatTransaction(populatedTransaction, {
		number: FMT_NUMBER.HEX,
		bytes: FMT_BYTES.HEX,
	}) as unknown as FormatType<
		PopulatedUnsignedTransaction,
		{ number: FMT_NUMBER.HEX; bytes: FMT_BYTES.HEX }
	>;

	validateTransactionForSigning(
		formattedTransaction as unknown as FormatType<
			Transaction,
			{ number: FMT_NUMBER.HEX; bytes: FMT_BYTES.HEX }
		>,
	);

	return TransactionFactory.fromTxData(
		getEthereumjsTxDataFromTransaction(formattedTransaction),
		getEthereumjsTransactionOptions(formattedTransaction, web3Context),
	);
};
