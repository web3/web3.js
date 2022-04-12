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
	AccessList,
	AccessListEntry,
	BaseTransaction,
	FMT_BYTES,
	FMT_NUMBER,
	Transaction1559Unsigned,
	Transaction2930Unsigned,
	TransactionCall,
	TransactionLegacyUnsigned,
	TransactionWithSender,
} from 'web3-common';
import { isAddress, isHexStrict, isHexString32Bytes, isUInt } from 'web3-validator';
import {
	ChainIdMismatchError,
	CommonOrChainAndHardforkError,
	Eip1559GasPriceError,
	InvalidGasOrGasPrice,
	InvalidMaxPriorityFeePerGasOrMaxFeePerGas,
	InvalidNonceOrChainIdError,
	InvalidTransactionCall,
	InvalidTransactionObjectError,
	InvalidTransactionWithSender,
	MissingChainOrHardforkError,
	MissingCustomChainError,
	MissingCustomChainIdError,
	MissingGasError,
	TransactionGasMismatchError,
	UnsupportedFeeMarketError,
} from './errors';
import { formatTransaction } from './utils/format_transaction';
import { InternalTransaction, Transaction } from './types';

export function isBaseTransaction(value: BaseTransaction): boolean {
	if (value.to !== undefined && value?.to !== null && !isAddress(value.to)) return false;
	if (!isHexStrict(value.type) && value.type !== undefined && value.type.length !== 2)
		return false;
	if (!isHexStrict(value.nonce)) return false;
	if (!isHexStrict(value.gas)) return false;
	if (!isHexStrict(value.value)) return false;
	if (!isHexStrict(value.input)) return false;
	if (value.chainId && !isHexStrict(value.chainId)) return false;

	return true;
}

export function isAccessListEntry(value: AccessListEntry): boolean {
	if (value.address !== undefined && !isAddress(value.address)) return false;
	if (
		value.storageKeys !== undefined &&
		!value.storageKeys.every(storageKey => isHexString32Bytes(storageKey))
	)
		return false;

	return true;
}

export function isAccessList(value: AccessList): boolean {
	if (
		!Array.isArray(value) ||
		!value.every(accessListEntry => isAccessListEntry(accessListEntry))
	)
		return false;

	return true;
}

export function isTransaction1559Unsigned(value: Transaction1559Unsigned): boolean {
	if (!isBaseTransaction(value)) return false;
	if (!isHexStrict(value.maxFeePerGas)) return false;
	if (!isHexStrict(value.maxPriorityFeePerGas)) return false;
	if (!isAccessList(value.accessList)) return false;

	return true;
}

export function isTransaction2930Unsigned(value: Transaction2930Unsigned): boolean {
	if (!isBaseTransaction(value)) return false;
	if (!isHexStrict(value.gasPrice)) return false;
	if (!isAccessList(value.accessList)) return false;

	return true;
}

export function isTransactionLegacyUnsigned(value: TransactionLegacyUnsigned): boolean {
	if (!isBaseTransaction(value)) return false;
	if (!isHexStrict(value.gasPrice)) return false;

	return true;
}

export function isTransactionWithSender(value: TransactionWithSender): boolean {
	if (!isAddress(value.from)) return false;
	if (!isBaseTransaction(value)) return false;
	if (
		!isTransaction1559Unsigned(value as Transaction1559Unsigned) &&
		!isTransaction2930Unsigned(value as Transaction2930Unsigned) &&
		!isTransactionLegacyUnsigned(value as TransactionLegacyUnsigned)
	)
		return false;

	return true;
}

export function validateTransactionWithSender(value: TransactionWithSender) {
	if (!isTransactionWithSender(value)) throw new InvalidTransactionWithSender(value);
}

export function isTransactionCall(value: TransactionCall): boolean {
	if (value.from !== undefined && !isAddress(value.from)) return false;
	if (!isAddress(value.to)) return false;
	if (value.gas !== undefined && !isHexStrict(value.gas)) return false;
	if (value.gasPrice !== undefined && !isHexStrict(value.gasPrice)) return false;
	if (value.value !== undefined && !isHexStrict(value.value)) return false;
	if (value.data !== undefined && !isHexStrict(value.data)) return false;
	if (value.type !== undefined) return false;
	if (isTransaction1559Unsigned(value as Transaction1559Unsigned)) return false;
	if (isTransaction2930Unsigned(value as Transaction2930Unsigned)) return false;

	return true;
}

export function validateTransactionCall(value: TransactionCall) {
	if (!isTransactionCall(value)) throw new InvalidTransactionCall(value);
}

export const validateCustomChainInfo = (transaction: InternalTransaction) => {
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

export const validateChainInfo = (transaction: InternalTransaction) => {
	if (
		transaction.common !== undefined &&
		transaction.chain !== undefined &&
		transaction.hardfork !== undefined
	) {
		throw new CommonOrChainAndHardforkError();
	}
	if (
		(transaction.chain !== undefined && transaction.hardfork === undefined) ||
		(transaction.hardfork !== undefined && transaction.chain === undefined)
	)
		throw new MissingChainOrHardforkError({
			chain: transaction.chain,
			hardfork: transaction.hardfork,
		});
};

export const validateLegacyGas = (transaction: InternalTransaction) => {
	if (
		// This check is verifying gas and gasPrice aren't less than 0.
		transaction.gas === undefined ||
		!isUInt(transaction.gas) ||
		transaction.gasPrice === undefined ||
		!isUInt(transaction.gasPrice)
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

export const validateFeeMarketGas = (transaction: InternalTransaction) => {
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
		!isUInt(transaction.maxFeePerGas) ||
		transaction.maxPriorityFeePerGas === undefined ||
		!isUInt(transaction.maxPriorityFeePerGas)
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
export const validateGas = (transaction: InternalTransaction) => {
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

	(legacyGasPresent ? validateLegacyGas : validateFeeMarketGas)(transaction);
	(transaction.type !== undefined && transaction.type > '0x1'
		? validateFeeMarketGas
		: validateLegacyGas)(transaction);
};

export const validateTransactionForSigning = (
	transaction: InternalTransaction,
	overrideMethod?: (transaction: InternalTransaction) => void,
) => {
	if (overrideMethod !== undefined) {
		overrideMethod(transaction);
		return;
	}

	if (typeof transaction !== 'object' || transaction === null)
		throw new InvalidTransactionObjectError(transaction);

	validateCustomChainInfo(transaction);
	validateChainInfo(transaction);

	const formattedTransaction = formatTransaction(transaction as Transaction, {
		number: FMT_NUMBER.HEX,
		bytes: FMT_BYTES.HEX,
	});
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
