import {
	HighValueIntegerInByteArrayError,
	InvalidBytesError,
	InvalidHexStringError,
	InvalidIntegerError,
	InvalidIntegerInByteArrayError,
	InvalidNumberError,
	NegativeIntegersInByteArrayError,
	InvalidStringError,
} from './errors';
import { Bytes, HexString, Numbers } from './types';

// TODO: implement later
export const checkAddressChecksum = (_value: string): boolean => true;

// TODO: Implement later
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isAddress = (_value: string): boolean => {
	// check if it has the basic requirements of an address
	if (!/^(0x)?[0-9a-f]{40}$/i.test(_value)) {
		return false;
		// If it's ALL lowercase or ALL upppercase
	}
	if (/^(0x|0X)?[0-9a-f]{40}$/.test(_value) || /^(0x|0X)?[0-9A-F]{40}$/.test(_value)) {
		return true;
		// Otherwise check each case
	}
	return checkAddressChecksum(_value);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isAddressv2 = (_value: string): boolean => true;

export const isHexStrict = (hex: string) =>
	typeof hex === 'string' && /^(-)?0x[0-9a-f]*$/i.test(hex);

export const validateHexStringInput = (data: HexString) => {
	if (!isHexStrict(data)) {
		throw new InvalidHexStringError(data);
	}
};

export const validateBytesInput = (data: Bytes) => {
	if (Array.isArray(data)) {
		if (data.some(d => d < 0)) {
			throw new NegativeIntegersInByteArrayError(data);
		}

		if (data.some(d => d > 255)) {
			throw new HighValueIntegerInByteArrayError(data);
		}

		if (data.some(d => !Number.isInteger(d))) {
			throw new InvalidIntegerInByteArrayError(data);
		}
	}

	// Byte data string must be prefixed with `0x`
	if (typeof data === 'string') {
		validateHexStringInput(data);
	}

	// Hex string can prefixed with `-0x` but not valid for bytes
	if (typeof data === 'string' && data.startsWith('-')) {
		throw new InvalidBytesError(data);
	}
};

export const validateNumbersInput = (
	data: Numbers,
	{ onlyIntegers }: { onlyIntegers: boolean },
) => {
	if (!['number', 'string', 'bigint'].includes(typeof data)) {
		throw onlyIntegers ? new InvalidIntegerError(data) : new InvalidNumberError(data);
	}

	if (typeof data === 'number' && !Number.isFinite(data)) {
		throw new InvalidIntegerError(data);
	}

	// If these are full integer values given as 'number'
	if (typeof data === 'number' && Math.floor(data) !== data) {
		throw new InvalidIntegerError(data);
	}

	// If its not a hex string, then it must contain a decimal point.
	if (
		typeof data === 'string' &&
		onlyIntegers &&
		!isHexStrict(data) &&
		!/^(-)?[0-9]*$/i.test(data)
	) {
		throw new InvalidIntegerError(data);
	}

	if (
		typeof data === 'string' &&
		!onlyIntegers &&
		!isHexStrict(data) &&
		!/^[0-9]\d*(\.\d+)?$/i.test(data)
	) {
		throw new InvalidNumberError(data);
	}
};

export const validateStringInput = (data: string) => {
	if (typeof data !== 'string') {
		throw new InvalidStringError(data);
	}
};
