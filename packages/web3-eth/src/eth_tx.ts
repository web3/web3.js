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

import Web3Eth from '.';
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
	UnableToPopulateNonceError,
	UnsupportedFeeMarketError,
	UnsupportedTransactionTypeError,
} from './errors';
import { PopulatedUnsignedTransaction, Transaction } from './types';

export function formatTransaction<
	DesiredType extends ValidTypes = ValidTypes,
	ReturnType = ValidReturnTypes[DesiredType],
>(
	transaction: Transaction,
	desiredType: DesiredType,
	overrideMethod?: (transaction: Transaction) => Transaction<ReturnType>,
): Transaction<ReturnType> {
	if (overrideMethod !== undefined) return overrideMethod(transaction);
	const formattedTransaction = {
		...transaction,
		value:
			transaction.value === '0x' ? '0x' : convertToValidType(transaction.value, desiredType),
		gas: convertToValidType(transaction.gas, desiredType),
		gasPrice: convertToValidType(transaction.gasPrice, desiredType),
		type: convertToValidType(transaction.type, desiredType),
		maxFeePerGas: convertToValidType(transaction.maxFeePerGas, desiredType),
		maxPriorityFeePerGas: convertToValidType(transaction.maxPriorityFeePerGas, desiredType),
		nonce: convertToValidType(transaction.nonce, desiredType),
		chainId: convertToValidType(transaction.chainId, desiredType),
		gasLimit: convertToValidType(transaction.gasLimit, desiredType),
		v: convertToValidType(transaction.v, desiredType),
		common: {
			...transaction.common,
			customChain: {
				...transaction.common?.customChain,
				networkId: convertToValidType(
					transaction.common?.customChain?.networkId,
					desiredType,
				),
				chainId: convertToValidType(transaction.common?.customChain?.chainId, desiredType),
			},
		},
	};
	// TODO - TSC is complaining that ReturnType could be instantiated with an
	// arbitrary type which could be unrelated to 'string | number | bigint | undefined'
	return formattedTransaction as unknown as Transaction<ReturnType>;
}

export const detectTransactionType = (
	transaction: Transaction,
	overrideMethod?: (transaction: Transaction) => Numbers | undefined,
): Numbers | undefined => {
	if (overrideMethod !== undefined) return overrideMethod(transaction);
	if (transaction.type !== undefined) return transaction.type;

	if (transaction.maxFeePerGas !== undefined || transaction.maxPriorityFeePerGas !== undefined)
		return '0x2';
	if (transaction.hardfork === 'london') return '0x2';
	if (transaction.common?.hardfork === 'london') return '0x2';

	if (transaction.accessList !== undefined) return '0x1';
	if (transaction.hardfork === 'berlin') return '0x1';
	if (transaction.common?.hardfork === 'berlin') return '0x1';

	return undefined;
};

const validateCustomChainInfo = (transaction: Transaction) => {
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
};

const validateChainInfo = (transaction: Transaction) => {
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

const validateGas = (transaction: Transaction<HexString>) => {
	if (
		transaction.gas === undefined &&
		transaction.gasLimit === undefined &&
		transaction.maxPriorityFeePerGas === undefined &&
		transaction.maxFeePerGas === undefined
	)
		throw new MissingGasError({
			gas: transaction.gas,
			gasLimit: transaction.gasLimit,
			maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
			maxFeePerGas: transaction.maxFeePerGas,
		});

	if (transaction.gas !== undefined || transaction.gasPrice !== undefined) {
		if (
			// TODO - Discuss requirement of gasPrice, wasn't enforced in 1.x, but
			// at this point gasPrice should've been populated by populateTransaction
			// if not provided by the user

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
	} else if (
		// TODO - Discuss requirement of maxFeePerGas and maxPriorityFeePerGas
		// wasn't enforced in 1.x, but at this point the properties should've been
		// populated by populateTransaction if not provided by the user
		transaction.maxFeePerGas === undefined ||
		transaction.maxPriorityFeePerGas === undefined ||
		transaction.maxFeePerGas.startsWith('-') ||
		transaction.maxPriorityFeePerGas.startsWith('-')
	)
		throw new InvalidMaxPriorityFeePerGasOrMaxFeePerGas({
			maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
			maxFeePerGas: transaction.maxFeePerGas,
		});

	const hasEip1559 =
		transaction.maxFeePerGas !== undefined || transaction.maxPriorityFeePerGas !== undefined;
	if (transaction.gasPrice !== undefined && (transaction.type === '0x2' || hasEip1559))
		throw new Eip1559GasPriceError(transaction.gasPrice);
	if ((transaction.type === '0x0' || transaction.type === '0x1') && hasEip1559)
		throw new UnsupportedFeeMarketError({
			maxFeePerGas: transaction.maxFeePerGas,
			maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
		});
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

	const formattedTransaction = formatTransaction(transaction, ValidTypes.HexString);

	validateCustomChainInfo(transaction);
	validateChainInfo(transaction);
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
	ReturnType = ValidReturnTypes[DesiredType],
>(
	transaction: Transaction,
	web3Context: Web3Context<EthExecutionAPI>,
	desiredType: DesiredType,
	privateKey?: HexString,
	overrideMethod?: (
		transaction: Transaction,
		web3Context: Web3Context<EthExecutionAPI>,
	) => PopulatedUnsignedTransaction<ReturnType>,
): Promise<PopulatedUnsignedTransaction<ReturnType>> {
	if (overrideMethod !== undefined) return overrideMethod(transaction, web3Context);

	const populatedTransaction = { ...transaction };
	const web3Eth = new Web3Eth(web3Context.currentProvider);

	if (populatedTransaction.from === undefined) {
		if (privateKey !== undefined) {
			populatedTransaction.from = privateKeyToAddress(privateKey);
		} else if (web3Context.defaultAccount !== null)
			populatedTransaction.from = web3Context.defaultAccount;
		// TODO Try to fill from using web3.eth.accounts.wallet
	}

	if (populatedTransaction.nonce === undefined) {
		if (populatedTransaction.from === undefined) throw new UnableToPopulateNonceError();
		populatedTransaction.nonce = await web3Eth.getTransactionCount(
			populatedTransaction.from,
			BlockTags.PENDING,
		);
	}

	if (populatedTransaction.value === undefined) populatedTransaction.value = '0x';
	if (populatedTransaction.data === undefined) populatedTransaction.data = '0x';
	// TODO - Add default to Web3Context
	if (populatedTransaction.chain === undefined) populatedTransaction.chain = 'mainnet';
	// TODO - Add default to Web3Context
	// TODO - Update default to berlin? (It's london in 1.x)
	if (populatedTransaction.hardfork === undefined) populatedTransaction.hardfork = 'london';

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

	// TODO - Discuss how this should work with default hardfork, because detectTransactionType
	// will use 0x2 for london and 0x1 for berlin, but should this be overwritten by web3Context.defaultTxType?
	// If populatedTransaction.type is already defined, no change will be made
	populatedTransaction.type = detectTransactionType(populatedTransaction);
	// TODO - After web3Context.defaultTxType is implemented
	if (populatedTransaction.type === undefined) populatedTransaction.type = '0x0'; // web3Context.defaultTxType;

	const block = await web3Eth.getBlock();
	const hexTxType = toHex(populatedTransaction.type);

	if (hexTxType < '0x0' || hexTxType > '0x2')
		throw new UnsupportedTransactionTypeError(populatedTransaction.type);

	if (hexTxType === '0x0' || hexTxType === '0x1') {
		// transaction.type not supported before Berlin hardfork
		// TODO - Maybe add check for populatedTransaction.hardfork >= Berlin before deleting
		// if (hexTxType === '0x0') populatedTransaction.type = undefined;

		if (populatedTransaction.gasPrice === undefined)
			populatedTransaction.gasPrice = await web3Eth.getGasPrice();
	}

	if (hexTxType === '0x1' || hexTxType === '0x2') {
		if (populatedTransaction.accessList === undefined) populatedTransaction.accessList = [];
	}

	if (hexTxType === '0x2') {
		// Unless otherwise specified by web3Context.defaultBlock, this defaults to latest
		if (block.baseFeePerGas === undefined) throw new Eip1559NotSupportedError();

		if (populatedTransaction.gasPrice !== undefined) {
			// Logic from 1.x
			populatedTransaction.maxPriorityFeePerGas = populatedTransaction.gasPrice;
			populatedTransaction.maxFeePerGas = populatedTransaction.gasPrice;
			populatedTransaction.gasPrice = undefined;
		} else {
			if (populatedTransaction.maxPriorityFeePerGas === undefined)
				// TODO - Add maxPriorityFeePerGas default to Web3Context
				populatedTransaction.maxPriorityFeePerGas = toHex(2500000000); // 2.5 Gwei
			if (populatedTransaction.maxFeePerGas === undefined)
				populatedTransaction.maxFeePerGas =
					BigInt(block.baseFeePerGas) * BigInt(2) +
					BigInt(populatedTransaction.maxPriorityFeePerGas);
		}
	}

	// TODO - TSC returns that as only PopulatedUnsignedBaseTransaction
	return formatTransaction(
		populatedTransaction,
		desiredType,
	) as PopulatedUnsignedTransaction<ReturnType>;
}

// TODO - Replace use of Web3Context with Web3Eth
