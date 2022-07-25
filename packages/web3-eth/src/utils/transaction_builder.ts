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
	DEFAULT_RETURN_FORMAT,
	ETH_DATA_FORMAT,
	FormatType,
	format,
	DataFormat,
	isAddress,
} from 'web3-utils';
import {
	EthExecutionAPI,
	Address,
	HexString,
	ValidChains,
	Hardfork,
	Transaction,
	TransactionWithLocalWalletIndex,
} from 'web3-types';
import { Web3Context } from 'web3-core';
import { privateKeyToAddress } from 'web3-eth-accounts';
import { getId, Web3NetAPI } from 'web3-net';
import { isNullish, isNumber } from 'web3-validator';
import { NUMBER_DATA_FORMAT } from '../constants';
import {
	InvalidTransactionWithSender,
	LocalWalletNotAvailableError,
	TransactionDataAndInputError,
	UnableToPopulateNonceError,
} from '../errors';
// eslint-disable-next-line import/no-cycle
import { getChainId, getTransactionCount } from '../rpc_method_wrappers';
import { detectTransactionType } from './detect_transaction_type';
// eslint-disable-next-line import/no-cycle
import { getTransactionGasPricing } from './get_transaction_gas_pricing';
import { transactionSchema } from '../schemas';
import { InternalTransaction } from '../types';

export const getTransactionFromAttr = (
	web3Context: Web3Context<EthExecutionAPI>,
	transaction?: Transaction | TransactionWithLocalWalletIndex,
	privateKey?: HexString | Buffer,
) => {
	if (transaction?.from !== undefined) {
		if (typeof transaction.from === 'string' && isAddress(transaction.from)) {
			return transaction.from;
		}
		if (isNumber(transaction.from)) {
			if (web3Context.wallet) {
				const account = web3Context.wallet.get(
					format({ eth: 'uint' }, transaction.from, NUMBER_DATA_FORMAT),
				);

				if (!isNullish(account)) {
					return account.address;
				}

				throw new LocalWalletNotAvailableError();
			}
			throw new LocalWalletNotAvailableError();
		} else {
			throw new InvalidTransactionWithSender(transaction.from);
		}
	}
	if (!isNullish(privateKey)) return privateKeyToAddress(privateKey);
	if (!isNullish(web3Context.defaultAccount)) return web3Context.defaultAccount;

	return undefined;
};

export const getTransactionNonce = async <ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	address?: Address,
	returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
) => {
	if (isNullish(address)) {
		// TODO if (web3.eth.accounts.wallet) use address from local wallet
		throw new UnableToPopulateNonceError();
	}

	return getTransactionCount(web3Context, address, web3Context.defaultBlock, returnFormat);
};

export const getTransactionType = (
	transaction: FormatType<Transaction, typeof ETH_DATA_FORMAT>,
	web3Context: Web3Context<EthExecutionAPI>,
) => {
	const inferredType = detectTransactionType(transaction, web3Context);

	if (!isNullish(inferredType)) return inferredType;
	if (!isNullish(web3Context.defaultTransactionType))
		return format({ eth: 'uint' }, web3Context.defaultTransactionType, ETH_DATA_FORMAT);

	return undefined;
};

// Keep in mind that the order the properties of populateTransaction get populated matters
// as some of the properties are dependent on others
export async function defaultTransactionBuilder<ReturnType = Record<string, unknown>>(options: {
	transaction: Record<string, unknown>;
	web3Context: Web3Context<EthExecutionAPI & Web3NetAPI>;
	privateKey?: HexString | Buffer;
}): Promise<ReturnType> {
	// let populatedTransaction = { ...options.transaction } as unknown as InternalTransaction;
	let populatedTransaction = format(
		transactionSchema,
		options.transaction,
		DEFAULT_RETURN_FORMAT,
	) as InternalTransaction;

	if (isNullish(populatedTransaction.from)) {
		populatedTransaction.from = getTransactionFromAttr(
			options.web3Context,
			undefined,
			options.privateKey,
		);
	}

	// TODO: Debug why need to typecase getTransactionNonce
	if (isNullish(populatedTransaction.nonce)) {
		populatedTransaction.nonce = await getTransactionNonce(
			options.web3Context,
			populatedTransaction.from,
			ETH_DATA_FORMAT,
		);
	}

	if (isNullish(populatedTransaction.value)) {
		populatedTransaction.value = '0x';
	}

	if (!isNullish(populatedTransaction.data) && !isNullish(populatedTransaction.input)) {
		throw new TransactionDataAndInputError({
			data: populatedTransaction.data,
			input: populatedTransaction.input,
		});
	} else if (!isNullish(populatedTransaction.input)) {
		populatedTransaction.data = populatedTransaction.input;
		delete populatedTransaction.input;
	}

	if (isNullish(populatedTransaction.data) || populatedTransaction.data === '') {
		populatedTransaction.data = '0x';
	} else if (!populatedTransaction.data.startsWith('0x')) {
		populatedTransaction.data = `0x${populatedTransaction.data}`;
	}

	if (isNullish(populatedTransaction.common)) {
		if (isNullish(populatedTransaction.chain)) {
			populatedTransaction.chain = options.web3Context.defaultChain as ValidChains;
		}
		if (isNullish(populatedTransaction.hardfork)) {
			populatedTransaction.hardfork = options.web3Context.defaultHardfork as Hardfork;
		}
	}

	if (
		isNullish(populatedTransaction.chainId) &&
		isNullish(populatedTransaction.common?.customChain.chainId)
	) {
		populatedTransaction.chainId = await getChainId(options.web3Context, ETH_DATA_FORMAT);
	}

	if (isNullish(populatedTransaction.networkId)) {
		populatedTransaction.networkId =
			(options.web3Context.defaultNetworkId as string) ??
			(await getId(options.web3Context, ETH_DATA_FORMAT));
	}

	if (isNullish(populatedTransaction.gasLimit) && !isNullish(populatedTransaction.gas)) {
		populatedTransaction.gasLimit = populatedTransaction.gas;
	}

	populatedTransaction.type = getTransactionType(populatedTransaction, options.web3Context);

	if (
		isNullish(populatedTransaction.accessList) &&
		(populatedTransaction.type === '0x1' || populatedTransaction.type === '0x2')
	) {
		populatedTransaction.accessList = [];
	}

	populatedTransaction = {
		...populatedTransaction,
		...(await getTransactionGasPricing(
			populatedTransaction,
			options.web3Context,
			ETH_DATA_FORMAT,
		)),
	};

	return populatedTransaction as ReturnType;
}

export const transactionBuilder = async <ReturnType = Record<string, unknown>>(options: {
	transaction: Transaction;
	web3Context: Web3Context<EthExecutionAPI>;
	privateKey?: HexString | Buffer;
	// eslint-disable-next-line @typescript-eslint/require-await
}) =>
	(options.web3Context.transactionBuilder ?? defaultTransactionBuilder)({
		...options,
		transaction: options.transaction as unknown as Record<string, unknown>,
	}) as unknown as ReturnType;
