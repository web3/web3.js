import { EthExecutionAPI } from 'web3-common';
import { Web3Context } from 'web3-core';
import { convertToValidType, ValidReturnTypes, ValidTypes } from 'web3-utils';
import { Eip1559NotSupportedError, UnsupportedTransactionTypeError } from '../errors';
// eslint-disable-next-line import/no-cycle
import { getBlock, getGasPrice } from '../rpc_method_wrappers';
import { Transaction } from '../types';
// eslint-disable-next-line import/no-cycle
import { getTransactionType } from './transaction_builder';

async function getEip1559GasPricing<ReturnType extends ValidTypes = ValidTypes.HexString>(
	transaction: Transaction,
	web3Context: Web3Context<EthExecutionAPI>,
	returnType?: ReturnType,
): Promise<{
	maxPriorityFeePerGas: ValidReturnTypes[ReturnType];
	maxFeePerGas: ValidReturnTypes[ReturnType];
}> {
	// Unless otherwise specified by web3Context.defaultBlock, this defaults to latest
	const block = await getBlock(web3Context);

	if (block.baseFeePerGas === undefined) throw new Eip1559NotSupportedError();

	if (transaction.gasPrice !== undefined) {
		const convertedTransactionGasPrice = convertToValidType(
			transaction.gasPrice,
			returnType ?? web3Context.defaultReturnType,
		);
		return {
			maxPriorityFeePerGas: convertedTransactionGasPrice,
			maxFeePerGas: convertedTransactionGasPrice,
		} as {
			maxPriorityFeePerGas: ValidReturnTypes[ReturnType];
			maxFeePerGas: ValidReturnTypes[ReturnType];
		};
	}
	return {
		maxPriorityFeePerGas: convertToValidType(
			transaction.maxPriorityFeePerGas ?? web3Context.defaultMaxPriorityFeePerGas,
			returnType ?? web3Context.defaultReturnType,
		),
		maxFeePerGas: convertToValidType(
			transaction.maxFeePerGas ??
				BigInt(block.baseFeePerGas) * BigInt(2) +
					BigInt(
						transaction.maxPriorityFeePerGas ?? web3Context.defaultMaxPriorityFeePerGas,
					),
			returnType ?? web3Context.defaultReturnType,
		),
	} as {
		maxPriorityFeePerGas: ValidReturnTypes[ReturnType];
		maxFeePerGas: ValidReturnTypes[ReturnType];
	};
}

export async function getTransactionGasPricing<
	ReturnType extends ValidTypes = ValidTypes.HexString,
>(transaction: Transaction, web3Context: Web3Context<EthExecutionAPI>, returnType?: ReturnType) {
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
				gasPrice: await getGasPrice(
					web3Context,
					returnType ?? web3Context.defaultReturnType,
				),
				maxPriorityFeePerGas: undefined,
				maxFeePerGas: undefined,
			} as {
				gasPrice: ValidReturnTypes[ReturnType];
				maxPriorityFeePerGas: undefined;
				maxFeePerGas: undefined;
			};

		if (transactionType === '0x2') {
			return {
				gasPrice: undefined,
				...(await getEip1559GasPricing(transaction, web3Context, returnType)),
			};
		}
	}

	return undefined;
}
