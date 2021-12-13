import { isHexStrict, hexToNumber, isAddress as isAddressUtil } from 'web3-utils';
import { parseBaseType } from './utils';
import { ValidInputTypes } from './types';

export const isValidEthType = (type: string): boolean => {
	const { baseType, baseTypeSize } = parseBaseType(type);

	if (baseType === type) {
		return true;
	}

	if ((baseType === 'int' || baseType === 'uint') && baseTypeSize) {
		if (baseTypeSize <= 256 && baseTypeSize % 8 === 0) {
			return true;
		}

		return false;
	}

	if (baseType === 'bytes' && baseTypeSize) {
		if (baseTypeSize >= 1 && baseTypeSize <= 32) {
			return true;
		}

		return false;
	}

	return false;
};

export const isBoolean = (value: ValidInputTypes) => {
	if (!['number', 'string', 'boolean'].includes(typeof value)) {
		return false;
	}

	if (typeof value === 'boolean') {
		return true;
	}

	if (typeof value === 'string' && !isHexStrict(value)) {
		return value === '1' || value === '0';
	}

	if (typeof value === 'string' && isHexStrict(value)) {
		return value === '0x1' || value === '0x0';
	}

	if (typeof value === 'number') {
		return value === 1;
	}

	return false;
};

export const isString = (value: ValidInputTypes) => typeof value === 'string';

export const isUInt = (value: ValidInputTypes, type: string) => {
	if (!['number', 'string', 'bigint'].includes(typeof value)) {
		return false;
	}

	const { baseTypeSize: size } = parseBaseType(type);

	if (!size) {
		return true;
	}

	const maxSize = BigInt(2) ** BigInt(size) - BigInt(1);
	const valueToCheck =
		typeof value === 'string' && isHexStrict(value)
			? BigInt(hexToNumber(value))
			: BigInt(value as number);

	return valueToCheck >= 0 && valueToCheck <= maxSize;
};

export const isInt = (value: ValidInputTypes, type: string) => {
	if (!['number', 'string', 'bigint'].includes(typeof value)) {
		return false;
	}

	const { baseTypeSize: size } = parseBaseType(type);

	if (!size) {
		return true;
	}

	const maxSize = BigInt(2) ** BigInt(size - 1);
	const minSize = BigInt(-1) * BigInt(2) ** BigInt(size - 1);
	const valueToCheck =
		typeof value === 'string' && isHexStrict(value)
			? BigInt(hexToNumber(value))
			: BigInt(value as number);

	return valueToCheck >= minSize && valueToCheck <= maxSize;
};

export const isBytes = (value: ValidInputTypes, type: string) => {
	if (typeof value !== 'string' && !Buffer.isBuffer(value)) {
		return false;
	}

	let valueToCheck: Buffer;

	if (typeof value === 'string' && isHexStrict(value)) {
		valueToCheck = Buffer.from(value.substring(2), 'hex');
	} else if (typeof value === 'string' && !isHexStrict(value)) {
		valueToCheck = Buffer.from(value, 'hex');
	} else {
		valueToCheck = value as Buffer;
	}

	const { baseTypeSize: size } = parseBaseType(type);

	if (!size) {
		return true;
	}

	return valueToCheck.length === size;
};

export const isAddress = (value: ValidInputTypes) => {
	if (typeof value !== 'string' && !Buffer.isBuffer(value)) {
		return false;
	}

	let valueToCheck: string;

	if (Buffer.isBuffer(value)) {
		valueToCheck = `0x${value.toString('hex')}`;
	} else if (typeof value === 'string' && !isHexStrict(value)) {
		valueToCheck = `0x${value}`;
	} else {
		valueToCheck = value;
	}

	return isAddressUtil(valueToCheck);
};
