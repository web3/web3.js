import { isHexStrict, validator, utils as validatorUtils } from 'web3-validator';
import { numberToHex, toHex, toNumber } from './converters';
import { Numbers } from './types';
import { NibbleWidthError } from './errors';

/**
 * Adds a padding on the left of a string, if value is a integer or bigInt will be converted to a hex string.
 */
export const padLeft = (value: Numbers, characterAmount: number, sign = '0'): string => {
	// To avoid duplicate code and circular dependency we will
	// use `padLeft` implementation from `web3-validator`

	if (typeof value === 'string' && !isHexStrict(value)) {
		return value.padStart(characterAmount, sign);
	}

	validator.validate(['int'], [value]);

	return validatorUtils.padLeft(value, characterAmount, sign);
};

/**
 * Adds a padding on the right of a string, if value is a integer or bigInt will be converted to a hex string.
 */
export const padRight = (value: Numbers, characterAmount: number, sign = '0'): string => {
	if (typeof value === 'string' && !isHexStrict(value)) {
		return value.padEnd(characterAmount, sign);
	}

	validator.validate(['int'], [value]);

	const hexString = typeof value === 'string' && isHexStrict(value) ? value : numberToHex(value);

	const prefixLength = hexString.startsWith('-') ? 3 : 2;
	return hexString.padEnd(characterAmount + prefixLength, sign);
};

/**
 * Adds a padding on the right of a string, if value is a integer or bigInt will be converted to a hex string. @alias `padRight`
 */
export const rightPad = padRight;

/**
 * Adds a padding on the left of a string, if value is a integer or bigInt will be converted to a hex string. @alias `padLeft`
 */
export const leftPad = padLeft;

/**
 * Converts a negative number into the two’s complement and return a hexstring of 64 nibbles.
 */
export const toTwosComplement = (value: Numbers, nibbleWidth = 64): string => {
	validator.validate(['int'], [value]);

	const val = toNumber(value);

	if (val >= 0) return padLeft(toHex(val), nibbleWidth);

	const largestBit = 2n ** BigInt(nibbleWidth * 4);
	if (-val >= largestBit) {
		throw new NibbleWidthError(`value: "${value}", nibbleWidth: "${nibbleWidth}"`);
	}
	const updatedVal = BigInt(val);

	const complement = updatedVal + largestBit;

	return padLeft(numberToHex(complement), nibbleWidth);
};

/**
 * Converts the twos complement into a decimal number or big int.
 */
export const fromTwosComplement = (value: Numbers, nibbleWidth = 64): number | bigint => {
	validator.validate(['int'], [value]);

	const val = toNumber(value);

	if (val < 0) return val;

	const largestBit = Math.ceil(Math.log(Number(val)) / Math.log(2));

	if (largestBit > nibbleWidth * 4)
		throw new NibbleWidthError(`value: "${value}", nibbleWidth: "${nibbleWidth}"`);

	// check the largest bit to see if negative
	if (nibbleWidth * 4 !== largestBit) return val;

	const complement = 2n ** (BigInt(nibbleWidth) * 4n);

	return toNumber(BigInt(val) - complement);
};
