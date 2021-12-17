import { hexToNumber } from 'web3-utils';
import { ValidInputTypes } from '../types';
import { parseBaseType } from '../utils';
import { isHexStrict } from './string';

/**
 * Checks if a given value is a valid big int
 */
export const isBigInt = (value: ValidInputTypes): boolean => typeof value === 'bigint';

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
