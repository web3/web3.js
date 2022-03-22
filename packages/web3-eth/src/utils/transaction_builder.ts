import { EthExecutionAPI } from 'web3-common';
import { Web3Context } from 'web3-core';
import { privateKeyToAddress } from 'web3-eth-accounts';
import { Address, convertToValidType, HexString, ValidTypes } from 'web3-utils';
import { getId, Web3NetAPI } from 'web3-net';

import { TransactionDataAndInputError, UnableToPopulateNonceError } from '../errors';
// eslint-disable-next-line import/no-cycle
import { getChainId, getTransactionCount } from '../rpc_method_wrappers';
import { chain, hardfork, Transaction } from '../types';
import { detectTransactionType } from './detect_transaction_type';
// eslint-disable-next-line import/no-cycle
import { getTransactionGasPricing } from './get_transaction_gas_pricing';

export const getTransactionFromAttr = (
	web3Context: Web3Context<EthExecutionAPI>,
	privateKey?: HexString | Buffer,
) => {
	if (privateKey !== undefined) return privateKeyToAddress(privateKey);
	if (web3Context.defaultAccount !== null) return web3Context.defaultAccount;
	// TODO if (web3.eth.accounts.wallet) Try to fill using local wallet

	return undefined;
};

export const getTransactionNonce = async (
	web3Context: Web3Context<EthExecutionAPI>,
	address?: Address,
) => {
	if (address === undefined) {
		// TODO if (web3.eth.accounts.wallet) use address from local wallet
		throw new UnableToPopulateNonceError();
	}
	return getTransactionCount(web3Context, address, web3Context.defaultBlock);
};

export const getTransactionType = (
	transaction: Transaction,
	web3Context: Web3Context<EthExecutionAPI>,
) => {
	const inferredType = detectTransactionType(transaction, web3Context);

	if (inferredType !== undefined) return inferredType;
	if (
		web3Context.defaultTransactionType !== null ||
		web3Context.defaultTransactionType !== undefined
	)
		return convertToValidType(
			web3Context.defaultTransactionType,
			ValidTypes.HexString,
		) as HexString;

	return undefined;
};

// Keep in mind that the order the properties of populateTransaction get populated matters
// as some of the properties are dependent on others
export async function defaultTransactionBuilder<ReturnType = Record<string, unknown>>(options: {
	transaction: Record<string, unknown>;
	web3Context: Web3Context<EthExecutionAPI & Web3NetAPI>;
	privateKey?: HexString | Buffer;
}): Promise<ReturnType> {
	let populatedTransaction = { ...options.transaction } as unknown as Transaction;

	if (populatedTransaction.from === undefined)
		populatedTransaction.from = getTransactionFromAttr(options.web3Context, options.privateKey);

	if (populatedTransaction.nonce === undefined)
		populatedTransaction.nonce = await getTransactionNonce(
			options.web3Context,
			populatedTransaction.from,
		);

	if (populatedTransaction.value === undefined) populatedTransaction.value = '0x';

	if (populatedTransaction.data !== undefined && populatedTransaction.input !== undefined)
		throw new TransactionDataAndInputError({
			data: populatedTransaction.data,
			input: populatedTransaction.input,
		});
	else if (populatedTransaction.input !== undefined) {
		populatedTransaction.data = populatedTransaction.input;
		delete populatedTransaction.input;
	}

	if (
		populatedTransaction.data === undefined ||
		populatedTransaction.data === null ||
		populatedTransaction.data === ''
	)
		populatedTransaction.data = '0x';
	else if (!populatedTransaction.data.startsWith('0x'))
		populatedTransaction.data = `0x${populatedTransaction.data}`;

	if (populatedTransaction.common === undefined) {
		if (populatedTransaction.chain === undefined)
			populatedTransaction.chain = options.web3Context.defaultChain as chain;
		if (populatedTransaction.hardfork === undefined)
			populatedTransaction.hardfork = options.web3Context.defaultHardfork as hardfork;
	}

	if (
		populatedTransaction.chainId === undefined &&
		populatedTransaction.common?.customChain.chainId === undefined
	)
		populatedTransaction.chainId = await getChainId(
			options.web3Context,
			options.web3Context.defaultReturnType,
		);

	if (populatedTransaction.networkId === undefined)
		populatedTransaction.networkId =
			options.web3Context.defaultNetworkId ??
			(await getId(options.web3Context, options.web3Context.defaultReturnType));

	if (populatedTransaction.gasLimit === undefined && populatedTransaction.gas !== undefined)
		populatedTransaction.gasLimit = populatedTransaction.gas;

	populatedTransaction.type = getTransactionType(populatedTransaction, options.web3Context);

	if (
		populatedTransaction.accessList === undefined &&
		(populatedTransaction.type === '0x1' || populatedTransaction.type === '0x2')
	)
		populatedTransaction.accessList = [];

	populatedTransaction = {
		...populatedTransaction,
		...(await getTransactionGasPricing(populatedTransaction, options.web3Context)),
	};

	return populatedTransaction as ReturnType;
}

export const transactionBuilder = async (options: {
	transaction: Transaction;
	web3Context: Web3Context<EthExecutionAPI>;
	privateKey?: HexString | Buffer;
}) =>
	(options.web3Context.transactionBuilder ?? defaultTransactionBuilder)({
		...options,
		transaction: options.transaction as unknown as Record<string, unknown>,
	});
