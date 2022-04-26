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

import {
	EthExecutionAPI,
	FormatType,
	DataFormat,
	format,
	DEFAULT_RETURN_FORMAT,
} from 'web3-common';
import { Web3Context } from 'web3-core';
import { Numbers } from 'web3-utils';
import { Eip1559NotSupportedError, UnsupportedTransactionTypeError } from '../errors';
// eslint-disable-next-line import/no-cycle
import { getBlock, getGasPrice } from '../rpc_method_wrappers';
import { InternalTransaction, Transaction } from '../types';
// eslint-disable-next-line import/no-cycle
import { getTransactionType } from './transaction_builder';

async function getEip1559GasPricing<ReturnFormat extends DataFormat>(
	transaction: FormatType<Transaction, typeof DEFAULT_RETURN_FORMAT>,
	web3Context: Web3Context<EthExecutionAPI>,
	returnFormat: ReturnFormat,
): Promise<FormatType<{ maxPriorityFeePerGas?: Numbers; maxFeePerGas?: Numbers }, ReturnFormat>> {
	const block = await getBlock(web3Context, web3Context.defaultBlock, false, returnFormat);

	if (block.baseFeePerGas === undefined) throw new Eip1559NotSupportedError();

	if (transaction.gasPrice !== undefined) {
		const convertedTransactionGasPrice = format(
			{ eth: 'uint' },
			transaction.gasPrice as Numbers,
			returnFormat,
		);

		return {
			maxPriorityFeePerGas: convertedTransactionGasPrice,
			maxFeePerGas: convertedTransactionGasPrice,
		};
	}
	return {
		maxPriorityFeePerGas: format(
			{ eth: 'uint' },
			transaction.maxPriorityFeePerGas ?? web3Context.defaultMaxPriorityFeePerGas,
			returnFormat,
		),
		maxFeePerGas: format(
			{ eth: 'uint' },
			(transaction.maxFeePerGas ??
				BigInt(block.baseFeePerGas) * BigInt(2) +
					BigInt(
						transaction.maxPriorityFeePerGas ?? web3Context.defaultMaxPriorityFeePerGas,
					)) as Numbers,
			returnFormat,
		),
	};
}

export async function getTransactionGasPricing<ReturnFormat extends DataFormat>(
	transaction: InternalTransaction,
	web3Context: Web3Context<EthExecutionAPI>,
	returnFormat: ReturnFormat,
): Promise<
	| FormatType<
			{ gasPrice?: Numbers; maxPriorityFeePerGas?: Numbers; maxFeePerGas?: Numbers },
			ReturnFormat
	  >
	| undefined
> {
	const transactionType = getTransactionType(transaction, web3Context);
	if (transactionType !== undefined) {
		if (transactionType.startsWith('-'))
			throw new UnsupportedTransactionTypeError(transactionType);

		// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2718.md#transactions
		if (transactionType < '0x0' || transactionType > '0x7f')
			throw new UnsupportedTransactionTypeError(transactionType);

		if (
			transaction.gasPrice === undefined &&
			(transactionType === '0x0' || transactionType === '0x1')
		)
			return {
				gasPrice: await getGasPrice(web3Context, returnFormat),
				maxPriorityFeePerGas: undefined,
				maxFeePerGas: undefined,
			};

		if (transactionType === '0x2') {
			return {
				gasPrice: undefined,
				...(await getEip1559GasPricing(transaction, web3Context, returnFormat)),
			};
		}
	}

	return undefined;
}
