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
import { Web3Context } from 'web3-core';
import { TransactionDataAndInputError } from 'web3-errors';
import { ethRpcMethods, netRpcMethods } from 'web3-rpc-methods';
import {
	Common,
	EthExecutionAPI,
	Hardfork,
	HexString,
	Transaction,
	ValidChains,
	Web3APISpec,
	Web3EthExecutionAPI,
	Web3NetAPI,
} from 'web3-types';
import { DEFAULT_RETURN_FORMAT, ETH_DATA_FORMAT, format } from 'web3-utils';
import { isNullish } from 'web3-validator';

import { transactionSchema } from '../schemas';
import { InternalTransaction } from '../types';
import { getTransactionFromAttr } from './get_transaction_from_attr';
import { getTransactionGasPricing } from './get_transaction_gas_pricing';
import { getTransactionNonce } from './get_transaction_nonce';
import { getTransactionType } from './get_transaction_type';

// Keep in mind that the order the properties of populateTransaction get populated matters
// as some of the properties are dependent on others
export async function defaultTransactionBuilder<ReturnType = Record<string, unknown>>(options: {
	transaction: Record<string, unknown>;
	web3Context: Web3Context<Web3EthExecutionAPI & Web3NetAPI>;
	privateKey?: HexString | Buffer;
}): Promise<ReturnType> {
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

	if (isNullish(populatedTransaction.nonce)) {
		populatedTransaction.nonce = await getTransactionNonce(
			options.web3Context,
			populatedTransaction.from,
			undefined,
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
		if (options.web3Context.defaultCommon) {
			const common = options.web3Context.defaultCommon as unknown as Common;
			const chainId = common.customChain.chainId as string;
			const networkId = common.customChain.networkId as string;
			const name = common.customChain.name as string;
			populatedTransaction.common = {
				...common,
				customChain: { chainId, networkId, name },
			};
		}

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
		populatedTransaction.chainId = format(
			{ eth: 'uint' },
			await ethRpcMethods.getChainId(options.web3Context.requestManager),
			ETH_DATA_FORMAT,
		);
	}

	if (isNullish(populatedTransaction.networkId)) {
		populatedTransaction.networkId =
			(options.web3Context.defaultNetworkId as string) ??
			format(
				{ eth: 'uint' },
				await netRpcMethods.getId(options.web3Context.requestManager),
				ETH_DATA_FORMAT,
			);
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

export const transactionBuilder = async <
	ReturnType = Record<string, unknown>,
	API extends Web3APISpec = EthExecutionAPI,
>(options: {
	transaction: Transaction;
	web3Context: Web3Context<API>;
	privateKey?: HexString | Buffer;
	// eslint-disable-next-line @typescript-eslint/require-await
}) =>
	(options.web3Context.transactionBuilder ?? defaultTransactionBuilder)({
		...options,
		transaction: options.transaction as unknown as Record<string, unknown>,
	}) as unknown as ReturnType;
