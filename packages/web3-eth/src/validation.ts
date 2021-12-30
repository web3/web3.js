import {
	AccessList,
	AccessListEntry,
	BaseTransaction,
	Transaction1559Unsigned,
	Transaction2930Unsigned,
	TransactionCall,
	TransactionLegacyUnsigned,
	TransactionWithSender,
} from 'web3-common';
import { isAddress, isHexStrict, isHexString32Bytes } from 'web3-validator';
import { InvalidTransactionCall, InvalidTransactionWithSender } from './errors';

export function isBaseTransaction(value: BaseTransaction): boolean {
	if (value.to !== undefined && value?.to !== null && !isAddress(value.to)) return false;
	if (!isHexStrict(value.type) && value.type !== undefined && value.type.length !== 2)
		return false;
	if (!isHexStrict(value.nonce)) return false;
	if (!isHexStrict(value.gas)) return false;
	if (!isHexStrict(value.value)) return false;
	if (!isHexStrict(value.input)) return false;

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
	if ((value as BaseTransaction).type !== undefined) return false;
	if (isTransaction1559Unsigned(value as Transaction1559Unsigned)) return false;
	if (isTransaction2930Unsigned(value as Transaction2930Unsigned)) return false;

	return true;
}

export function validateTransactionCall(value: TransactionCall) {
	if (!isTransactionCall(value)) throw new InvalidTransactionCall(value);
}
