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
	ChainIdMismatchError,
	CommonOrChainAndHardforkError,
	Eip1559GasPriceError,
	Eip1559NotSupportedError,
	InvalidGasOrGasPrice,
	InvalidMaxPriorityFeePerGasOrMaxFeePerGas,
	InvalidNonceOrChainIdError,
	InvalidTransactionObjectError,
	MissingChainOrHardforkError,
	MissingCustomChainError,
	MissingCustomChainIdError,
	MissingGasError,
	TransactionGasMismatchError,
	UnableToPopulateNonceError,
	UnsupportedFeeMarketError,
	UnsupportedTransactionTypeError,
} from './errors';
import { chain, hardfork, PopulatedUnsignedTransaction, Transaction } from './types';
import { getBlock, getGasPrice, getTransactionCount } from './rpc_method_wrappers';

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

const _validateCustomChainInfo = (transaction: Transaction) => {
	if (transaction.common !== undefined) {
		if (transaction.common.customChain === undefined) throw new MissingCustomChainError();
		if (transaction.common.customChain.chainId === undefined)
			throw new MissingCustomChainIdError();
		if (
			transaction.chainId !== undefined &&
			transaction.chainId !== transaction.common.customChain.chainId
		)
			throw new ChainIdMismatchError({
				txChainId: transaction.chainId,
				customChainId: transaction.common.customChain.chainId,
			});
	}

	// TODO - Should throw error?
};

const _validateChainInfo = (transaction: Transaction) => {
	if (
		transaction.common !== undefined &&
		transaction.chain !== undefined &&
		transaction.hardfork !== undefined
	)
		throw new CommonOrChainAndHardforkError();
	if (
		(transaction.chain !== undefined && transaction.hardfork === undefined) ||
		(transaction.hardfork !== undefined && transaction.chain === undefined)
	)
		throw new MissingChainOrHardforkError({
			chain: transaction.chain,
			hardfork: transaction.hardfork,
		});
};

const _validateLegacyGas = (transaction: Transaction<HexString>) => {
	if (
		// This check is verifying gas and gasPrice aren't less than 0.
		// transaction's number properties have been converted to HexStrings.
		// JavaScript doesn't handle negative hex strings e.g. -0x1, but our
		// numberToHex method does. -0x1 < 0 would result in false, so we must check if
		// hex string is negative via the inclusion of -
		transaction.gas === undefined ||
		transaction.gasPrice === undefined ||
		transaction.gas.startsWith('-') ||
		transaction.gasPrice.startsWith('-')
	)
		throw new InvalidGasOrGasPrice({
			gas: transaction.gas,
			gasPrice: transaction.gasPrice,
		});
	if (transaction.maxFeePerGas !== undefined || transaction.maxPriorityFeePerGas !== undefined)
		throw new UnsupportedFeeMarketError({
			maxFeePerGas: transaction.maxFeePerGas,
			maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
		});
};

const _validateFeeMarketGas = (transaction: Transaction<HexString>) => {
	// These errors come from 1.x, so they must be checked before
	// InvalidMaxPriorityFeePerGasOrMaxFeePerGas to throw the same error
	// for the same code executing in 1.x
	if (transaction.gasPrice !== undefined && transaction.type === '0x2')
		throw new Eip1559GasPriceError(transaction.gasPrice);
	if (transaction.type === '0x0' || transaction.type === '0x1')
		throw new UnsupportedFeeMarketError({
			maxFeePerGas: transaction.maxFeePerGas,
			maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
		});

	if (
		transaction.maxFeePerGas === undefined ||
		transaction.maxPriorityFeePerGas === undefined ||
		transaction.maxFeePerGas.startsWith('-') ||
		transaction.maxPriorityFeePerGas.startsWith('-')
	)
		throw new InvalidMaxPriorityFeePerGasOrMaxFeePerGas({
			maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
			maxFeePerGas: transaction.maxFeePerGas,
		});
};

/**
 * This method checks if all required gas properties are present for either
 * legacy gas (type 0x0 and 0x1) OR fee market transactions (0x2)
 */
const _validateGas = (transaction: Transaction<HexString>) => {
	const gasPresent = transaction.gas !== undefined || transaction.gasLimit !== undefined;
	const legacyGasPresent = gasPresent && transaction.gasPrice !== undefined;
	const feeMarketGasPresent =
		gasPresent &&
		transaction.maxPriorityFeePerGas !== undefined &&
		transaction.maxFeePerGas !== undefined;

	if (!legacyGasPresent && !feeMarketGasPresent)
		throw new MissingGasError({
			gas: transaction.gas,
			gasLimit: transaction.gasLimit,
			gasPrice: transaction.gasPrice,
			maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
			maxFeePerGas: transaction.maxFeePerGas,
		});

	if (legacyGasPresent && feeMarketGasPresent)
		throw new TransactionGasMismatchError({
			gas: transaction.gas,
			gasLimit: transaction.gasLimit,
			gasPrice: transaction.gasPrice,
			maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
			maxFeePerGas: transaction.maxFeePerGas,
		});

	(legacyGasPresent ? _validateLegacyGas : _validateFeeMarketGas)(transaction);
	(transaction.type !== undefined && transaction.type < '0x1'
		? _validateLegacyGas
		: _validateFeeMarketGas)(transaction);
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

	_validateCustomChainInfo(transaction);
	_validateChainInfo(transaction);

	const formattedTransaction = formatTransaction(transaction, ValidTypes.HexString);
	_validateGas(formattedTransaction);

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
