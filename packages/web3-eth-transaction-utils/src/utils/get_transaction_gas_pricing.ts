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
import { FormatType, DataFormat, format, ETH_DATA_FORMAT } from 'web3-utils';
import { Web3Context } from 'web3-core';
import {
	blockSchema,
	BlockTag,
	EthExecutionAPI,
	HexString,
	Numbers,
	Transaction,
} from 'web3-types';
import { isBlockTag, isBytes, isNullish } from 'web3-validator';
import { ethRpcMethods } from 'web3-rpc-methods';

import { Eip1559NotSupportedError, UnsupportedTransactionTypeError } from '../errors';
import { InternalTransaction } from '../types';
// eslint-disable-next-line import/no-cycle
import { getTransactionType } from './transaction_builder';

async function getEip1559GasPricing<ReturnFormat extends DataFormat>(
	transaction: FormatType<Transaction, typeof ETH_DATA_FORMAT>,
	web3Context: Web3Context<EthExecutionAPI>,
	returnFormat: ReturnFormat,
): Promise<FormatType<{ maxPriorityFeePerGas?: Numbers; maxFeePerGas?: Numbers }, ReturnFormat>> {
	let block;
	if (isBytes(web3Context.defaultBlock)) {
		const blockHashFormatted = format(
			{ eth: 'bytes32' },
			web3Context.defaultBlock,
			ETH_DATA_FORMAT,
		);
		block = format(
			blockSchema,
			await ethRpcMethods.getBlockByHash(
				web3Context.requestManager,
				blockHashFormatted,
				false,
			),
			returnFormat,
		);
	} else {
		const blockNumberFormatted = isBlockTag(web3Context.defaultBlock as HexString)
			? (web3Context.defaultBlock as BlockTag)
			: format({ eth: 'uint' }, web3Context.defaultBlock as Numbers, ETH_DATA_FORMAT);
		block = format(
			blockSchema,
			await ethRpcMethods.getBlockByNumber(
				web3Context.requestManager,
				blockNumberFormatted,
				false,
			),
			returnFormat,
		);
	}

	if (isNullish(block.baseFeePerGas)) throw new Eip1559NotSupportedError();

	if (!isNullish(transaction.gasPrice)) {
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
	if (!isNullish(transactionType)) {
		if (transactionType.startsWith('-'))
			throw new UnsupportedTransactionTypeError(transactionType);

		// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2718.md#transactions
		if (transactionType < '0x0' || transactionType > '0x7f')
			throw new UnsupportedTransactionTypeError(transactionType);

		if (
			isNullish(transaction.gasPrice) &&
			(transactionType === '0x0' || transactionType === '0x1')
		)
			return {
				gasPrice: format(
					{ eth: 'uint ' },
					await ethRpcMethods.getGasPrice(web3Context.requestManager),
					returnFormat,
				) as FormatType<Numbers, ReturnFormat>,
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
