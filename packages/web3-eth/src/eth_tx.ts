import { EthExecutionAPI } from 'web3-common';
import { Web3Context } from 'web3-core';
import {
	BlockTags,
	convertToValidType,
	HexString,
	Numbers,
	toHex,
	ValidReturnTypes,
	ValidTypes,
} from 'web3-utils';
import { privateKeyToAddress } from 'web3-eth-accounts';

import {
	Eip1559NotSupportedError,
	InvalidNonceOrChainIdError,
	InvalidTransactionObjectError,
	UnableToPopulateNonceError,
	UnsupportedTransactionTypeError,
} from './errors';
import { chain, hardfork, PopulatedUnsignedTransaction, Transaction } from './types';
import { getBlock, getGasPrice, getTransactionCount } from './rpc_method_wrappers';
import { validateChainInfo, validateCustomChainInfo, validateGas } from './validation';

export function formatTransaction<
	DesiredType extends ValidTypes,
	NumberType extends ValidReturnTypes[DesiredType] = ValidReturnTypes[DesiredType],
>(transaction: Transaction, desiredType: DesiredType): Transaction<NumberType> {
	// TODO - The spread operator performs a shallow copy of transaction.
	// I tried using Object.assign({}, transaction) which is supposed to perform a deep copy,
	// but format_transactions.test.ts were still failing due to original nested object properties
	// being wrongfully updated by this method.
	const formattedTransaction = {
		...transaction,
		common: {
			...transaction.common,
			customChain: { ...transaction.common?.customChain },
		},
	};

	const formattableProperties: (keyof Transaction)[] = [
		'value',
		'gas',
		'gasPrice',
		'type',
		'maxFeePerGas',
		'maxPriorityFeePerGas',
		'nonce',
		'chainId',
		'gasLimit',
		'v',
	];
	for (const transactionProperty of formattableProperties) {
		const formattedProperty = formattedTransaction[transactionProperty];
		if (
			formattedProperty !== undefined &&
			formattedProperty !== null &&
			typeof formattedProperty !== 'object' &&
			!Array.isArray(formattedProperty)
		) {
			if (transactionProperty === 'value' && formattedProperty === '0x') continue;
			(formattedTransaction[transactionProperty] as Numbers) = convertToValidType(
				formattedProperty,
				desiredType,
			);
		}
	}

	if (formattedTransaction.common?.customChain?.networkId !== undefined)
		formattedTransaction.common.customChain.networkId = convertToValidType(
			formattedTransaction.common.customChain.networkId,
			desiredType,
		);
	if (formattedTransaction.common?.customChain?.chainId !== undefined)
		formattedTransaction.common.customChain.chainId = convertToValidType(
			formattedTransaction.common.customChain.chainId,
			desiredType,
		);

	return formattedTransaction as Transaction<NumberType>;
}

export const detectTransactionType = (
	transaction: Transaction,
	overrideMethod?: (transaction: Transaction) => HexString | undefined,
): HexString | undefined => {
	// TODO - Refactor overrideMethod
	if (overrideMethod !== undefined) return overrideMethod(transaction);

	if (transaction.type !== undefined)
		return convertToValidType(transaction.type, ValidTypes.HexString) as HexString;

	if (
		transaction.maxFeePerGas !== undefined ||
		transaction.maxPriorityFeePerGas !== undefined ||
		transaction.hardfork === 'london' ||
		transaction.common?.hardfork === 'london'
	)
		return '0x2';

	if (
		transaction.accessList !== undefined ||
		transaction.hardfork === 'berlin' ||
		transaction.common?.hardfork === 'berlin'
	)
		return '0x1';

	return undefined;
};

export const validateTransactionForSigning = (
	transaction: Transaction,
	overrideMethod?: (transaction: Transaction) => void,
) => {
	if (overrideMethod !== undefined) {
		overrideMethod(transaction);
		return;
	}

	if (typeof transaction !== 'object' || transaction === null)
		throw new InvalidTransactionObjectError(transaction);

	validateCustomChainInfo(transaction);
	validateChainInfo(transaction);

	const formattedTransaction = formatTransaction(transaction, ValidTypes.HexString);
	validateGas(formattedTransaction);

	if (
		formattedTransaction.nonce === undefined ||
		formattedTransaction.chainId === undefined ||
		formattedTransaction.nonce.startsWith('-') ||
		formattedTransaction.chainId.startsWith('-')
	)
		throw new InvalidNonceOrChainIdError({
			nonce: transaction.nonce,
			chainId: transaction.chainId,
		});
};

export async function populateTransaction<
	DesiredType extends ValidTypes,
	NumberType extends ValidReturnTypes[DesiredType] = ValidReturnTypes[DesiredType],
>(
	transaction: Transaction,
	web3Context: Web3Context<EthExecutionAPI>,
	desiredType: DesiredType,
	privateKey?: HexString,
): Promise<PopulatedUnsignedTransaction<NumberType>> {
	const populatedTransaction = { ...transaction };

	if (populatedTransaction.from === undefined) {
		if (privateKey !== undefined) {
			populatedTransaction.from = privateKeyToAddress(privateKey);
		} else if (web3Context.defaultAccount !== null)
			populatedTransaction.from = web3Context.defaultAccount;
		// TODO Try to fill from using web3.eth.accounts.wallet
	}

	if (populatedTransaction.nonce === undefined) {
		if (populatedTransaction.from === undefined) throw new UnableToPopulateNonceError();
		populatedTransaction.nonce = await getTransactionCount(
			web3Context,
			populatedTransaction.from,
			BlockTags.PENDING,
		);
	}

	if (populatedTransaction.value === undefined) populatedTransaction.value = '0x';
	if (populatedTransaction.data === undefined) populatedTransaction.data = '0x';
	if (populatedTransaction.chain === undefined) {
		populatedTransaction.chain = web3Context.defaultChain as chain;
	}
	if (populatedTransaction.hardfork === undefined)
		populatedTransaction.hardfork = web3Context.defaultHardfork as hardfork;

	if (populatedTransaction.chainId === undefined) {
		if (populatedTransaction.common?.customChain.chainId === undefined) {
			// TODO - web3Eth.getChainId not implemented
			// populatedTransaction.chainId = await web3Eth.getChainId();
		}
	}

	if (populatedTransaction.gas === undefined) {
		if (populatedTransaction.gasLimit !== undefined)
			populatedTransaction.gas = populatedTransaction.gasLimit;
	}

	if (populatedTransaction.gasLimit === undefined) {
		if (populatedTransaction.gas !== undefined)
			populatedTransaction.gasLimit = populatedTransaction.gas;
	}

	populatedTransaction.type = detectTransactionType(populatedTransaction);
	if (
		populatedTransaction.type === undefined &&
		(web3Context.defaultTransactionType !== null ||
			web3Context.defaultTransactionType !== undefined)
	)
		populatedTransaction.type = convertToValidType(
			// TODO - TSC is complaining it could be null, even though we check above
			web3Context.defaultTransactionType as Numbers,
			ValidTypes.HexString,
		);

	if (populatedTransaction.type !== undefined) {
		const hexTxType = toHex(populatedTransaction.type);

		if (hexTxType.startsWith('-'))
			throw new UnsupportedTransactionTypeError(populatedTransaction.type);

		// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2718.md#transactions
		if (hexTxType < '0x0' || hexTxType > '0x7f')
			throw new UnsupportedTransactionTypeError(populatedTransaction.type);

		if (hexTxType === '0x0' || hexTxType === '0x1') {
			if (populatedTransaction.gasPrice === undefined)
				populatedTransaction.gasPrice = await getGasPrice(web3Context);
		}

		if (hexTxType === '0x1' || hexTxType === '0x2') {
			if (populatedTransaction.accessList === undefined) populatedTransaction.accessList = [];
		}

		if (hexTxType === '0x2') {
			// Unless otherwise specified by web3Context.defaultBlock, this defaults to latest
			const block = await getBlock(web3Context);

			if (block.baseFeePerGas === undefined) throw new Eip1559NotSupportedError();

			if (populatedTransaction.gasPrice !== undefined) {
				// Logic from 1.x
				populatedTransaction.maxPriorityFeePerGas = populatedTransaction.gasPrice;
				populatedTransaction.maxFeePerGas = populatedTransaction.gasPrice;
				populatedTransaction.gasPrice = undefined;
			} else {
				if (populatedTransaction.maxPriorityFeePerGas === undefined)
					populatedTransaction.maxPriorityFeePerGas = convertToValidType(
						web3Context.defaultMaxPriorityFeePerGas,
						ValidTypes.HexString,
					);
				if (populatedTransaction.maxFeePerGas === undefined)
					populatedTransaction.maxFeePerGas =
						BigInt(block.baseFeePerGas) * BigInt(2) +
						BigInt(populatedTransaction.maxPriorityFeePerGas);
			}
		}
	}

	// TODO - Types of property 'gasPrice' are incompatible
	return formatTransaction(
		populatedTransaction,
		desiredType,
	) as unknown as PopulatedUnsignedTransaction<NumberType>;
}
