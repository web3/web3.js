// TODO: Fix in next minor release
// To avoid breaking `web3-utils` API we have to avoid circular dependency
// So why have to duplicate these functions
// In next release when we introduce changes, we can remove reverse the dependency and remove this duplicate code

import { ValidInputTypes } from './types';
import { isHexStrict } from './validation/string';

/**
 * Converts value to it's number representation
 */
export const hexToNumber = (value: string): bigint | number => {
	if (!isHexStrict(value)) {
		throw new Error('Invalid hex string');
	}

	const [negative, hexValue] = value.startsWith('-') ? [true, value.substr(1)] : [false, value];
	const num = BigInt(hexValue);

	if (num > Number.MAX_SAFE_INTEGER) {
		return negative ? -num : num;
	}

	return negative ? -1 * Number(num) : Number(num);
};

/**
 * Converts value to it's hex representation
 */
export const numberToHex = (value: ValidInputTypes): string => {
	if ((typeof value === 'number' || typeof value === 'bigint') && value < 0) {
		return `-0x${value.toString(16).substr(1)}`;
	}

	if ((typeof value === 'number' || typeof value === 'bigint') && value >= 0) {
		return `0x${value.toString(16)}`;
	}

	if (typeof value === 'string' && isHexStrict(value)) {
		return numberToHex(hexToNumber(value));
	}

	if (typeof value === 'string' && !isHexStrict(value)) {
		return numberToHex(BigInt(value));
	}

	throw new Error('Invalid number value');
};

/**
 * Adds a padding on the left of a string, if value is a integer or bigInt will be converted to a hex string.
 */
export const padLeft = (value: ValidInputTypes, characterAmount: number, sign = '0'): string => {
	if (typeof value === 'string' && !isHexStrict(value)) {
		return value.padStart(characterAmount, sign);
	}

	const hex = typeof value === 'string' && isHexStrict(value) ? value : numberToHex(value);

	const [prefix, hexValue] = hex.startsWith('-') ? ['-0x', hex.substr(3)] : ['0x', hex.substr(2)];

	return `${prefix}${hexValue.padStart(characterAmount, sign)}`;
};
