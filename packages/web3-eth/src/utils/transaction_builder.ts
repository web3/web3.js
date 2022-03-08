import { EthExecutionAPI } from 'web3-common';
import { Web3Context } from 'web3-core';
import { privateKeyToAddress } from 'web3-eth-accounts';
import { BlockTags, convertToValidType, HexString, ValidTypes } from 'web3-utils';
import {
	Eip1559NotSupportedError,
	TransactionDataAndInputError,
	UnableToPopulateNonceError,
	UnsupportedTransactionTypeError,
} from '../errors';
import { getBlock, getGasPrice, getTransactionCount } from '../rpc_method_wrappers';
import { chain, hardfork, Transaction } from '../types';
import { detectTransactionType } from './detect_transaction_type';

export async function defaultTransactionBuilder<ReturnType = Record<string, unknown>>(options: {
	transaction: Record<string, unknown>;
	web3Context: Web3Context<EthExecutionAPI>;
	privateKey?: HexString | Buffer;
}): Promise<ReturnType> {
	const populatedTransaction = { ...options.transaction } as unknown as Transaction;

	if (populatedTransaction.from === undefined) {
		if (options.privateKey !== undefined) {
			populatedTransaction.from = privateKeyToAddress(options.privateKey);
		} else if (options.web3Context.defaultAccount !== null)
			populatedTransaction.from = options.web3Context.defaultAccount;
		// TODO Try to fill from using web3.eth.accounts.wallet
	}

	if (populatedTransaction.nonce === undefined) {
		if (populatedTransaction.from === undefined) throw new UnableToPopulateNonceError();
		populatedTransaction.nonce = await getTransactionCount(
			options.web3Context,
			populatedTransaction.from,
			BlockTags.PENDING,
		);
	}

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

	// if (populatedTransaction.chainId === undefined && populatedTransaction.common?.customChain.chainId === undefined)
	// TODO - web3Eth.getChainId not implemented
	// populatedTransaction.chainId = await web3Eth.getChainId();

	// if (populatedTransaction.networkId === undefined) {
	// 	populatedTransaction.networkId = web3Context.defaultNetworkId ?? undefined;
	//  TODO - getNetworkId (net_version) not implemented
	// 	populatedTransaction.networkId = await getNetworkId();
	// }

	if (populatedTransaction.gasLimit === undefined && populatedTransaction.gas !== undefined)
		populatedTransaction.gasLimit = populatedTransaction.gas;

	populatedTransaction.type = detectTransactionType(populatedTransaction, options.web3Context);
	if (
		populatedTransaction.type === undefined &&
		(options.web3Context.defaultTransactionType !== null ||
			options.web3Context.defaultTransactionType !== undefined)
	)
		populatedTransaction.type = options.web3Context.defaultTransactionType as HexString;

	if (populatedTransaction.type !== undefined) {
		if (populatedTransaction.type.startsWith('-'))
			throw new UnsupportedTransactionTypeError(populatedTransaction.type);

		// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2718.md#transactions
		if (populatedTransaction.type < '0x0' || populatedTransaction.type > '0x7f')
			throw new UnsupportedTransactionTypeError(populatedTransaction.type);

		if (populatedTransaction.type === '0x0' || populatedTransaction.type === '0x1') {
			if (populatedTransaction.gasPrice === undefined)
				populatedTransaction.gasPrice = await getGasPrice(options.web3Context);
		}

		if (populatedTransaction.type === '0x1' || populatedTransaction.type === '0x2') {
			if (populatedTransaction.accessList === undefined) populatedTransaction.accessList = [];
		}

		if (populatedTransaction.type === '0x2') {
			// Unless otherwise specified by web3Context.defaultBlock, this defaults to latest
			const block = await getBlock(options.web3Context);

			if (block.baseFeePerGas === undefined) throw new Eip1559NotSupportedError();

			if (populatedTransaction.gasPrice !== undefined) {
				// Logic from 1.x
				populatedTransaction.maxPriorityFeePerGas = populatedTransaction.gasPrice;
				populatedTransaction.maxFeePerGas = populatedTransaction.gasPrice;
				populatedTransaction.gasPrice = undefined;
			} else {
				if (populatedTransaction.maxPriorityFeePerGas === undefined)
					populatedTransaction.maxPriorityFeePerGas = convertToValidType(
						options.web3Context.defaultMaxPriorityFeePerGas,
						ValidTypes.HexString,
					);
				if (populatedTransaction.maxFeePerGas === undefined)
					populatedTransaction.maxFeePerGas =
						BigInt(block.baseFeePerGas) * BigInt(2) +
						BigInt(populatedTransaction.maxPriorityFeePerGas);
			}
		}
	}

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
