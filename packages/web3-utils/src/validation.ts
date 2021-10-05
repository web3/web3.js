import {
	errorHigherValueIntegers,
	errorInvalidBytesData,
	errorInvalidHexString,
	errorInvalidIntegersValues,
	errorNegativeIntegers,
	errorInvalidInteger,
	errorInvalidString,
	errorInvalidNumber,
} from './errors';
import { Bytes, HexString, Numbers } from './types';

// TODO: Implement later
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isAddress = (_value: string): boolean => false;

export const isHexStrict = (hex: string) =>
	typeof hex === 'string' && /^(-)?0x[0-9a-f]*$/i.test(hex);

export const validateHexStringInput = (data: HexString) => {
	if (!isHexStrict(data)) {
		throw new Error(errorInvalidHexString(data));
	}
};

export const validateBytesInput = (data: Bytes) => {
	if (Array.isArray(data)) {
		if (data.some(d => d < 0)) {
			throw new Error(errorNegativeIntegers(data));
		}

		if (data.some(d => d > 255)) {
			throw new Error(errorHigherValueIntegers(data));
		}

		if (data.some(d => !Number.isInteger(d))) {
			throw new Error(errorInvalidIntegersValues(data));
		}
	}

	// Byte data string must be prefixed with `0x`
	if (typeof data === 'string') {
		validateHexStringInput(data);
	}

	// Hex string can prefixed with `-0x` but not valid for bytes
	if (typeof data === 'string' && data.startsWith('-')) {
		throw new Error(errorInvalidBytesData(data));
	}
};

export const validateNumbersInput = (
	data: Numbers,
	{ onlyIntegers }: { onlyIntegers: boolean },
) => {
	if (!['number', 'string', 'bigint'].includes(typeof data)) {
		throw new Error(onlyIntegers ? errorInvalidInteger(data) : errorInvalidNumber(data));
	}

	if (typeof data === 'number' && !Number.isFinite(data)) {
		throw new Error(errorInvalidInteger(data));
	}

	// If these are full integer values given as 'number'
	if (typeof data === 'number' && Math.floor(data) !== data) {
		throw new Error(errorInvalidInteger(data));
	}

	// If its not a hex string, then it must contain a decimal point.
	if (
		typeof data === 'string' &&
		onlyIntegers &&
		!isHexStrict(data) &&
		!/^(-)?[0-9]*$/i.test(data)
	) {
		throw new Error(errorInvalidInteger(data));
	}

	if (
		typeof data === 'string' &&
		!onlyIntegers &&
		!isHexStrict(data) &&
		!/^[0-9]\d*(\.\d+)?$/i.test(data)
	) {
		throw new Error(errorInvalidNumber(data));
	}
};

export const validateStringInput = (data: string) => {
	if (typeof data !== 'string') {
		throw new Error(errorInvalidString(data));
	}
};
