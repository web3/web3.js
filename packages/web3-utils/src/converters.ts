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

import { Address, Bytes, HexString, Numbers, ValueTypes } from 'web3-types';
import {
	validator,
	isAddress,
	isHexStrict,
	isHex,
	utils as validatorUtils,
	isNullish,
} from 'web3-validator';
import { keccak256 } from 'ethereum-cryptography/keccak';

import {
	HexProcessingError,
	InvalidAddressError,
	InvalidBytesError,
	InvalidUnitError,
	InvalidNumberError,
} from 'web3-errors';

const base = BigInt(10);
const expo10 = (expo: number) => base ** BigInt(expo);

// Ref: https://ethdocs.org/en/latest/ether.html
/** @internal */
export const ethUnitMap = {
	noether: BigInt('0'),
	wei: BigInt(1),
	kwei: expo10(3),
	Kwei: expo10(3),
	babbage: expo10(3),
	femtoether: expo10(3),
	mwei: expo10(6),
	Mwei: expo10(6),
	lovelace: expo10(6),
	picoether: expo10(6),
	gwei: expo10(9),
	Gwei: expo10(9),
	shannon: expo10(9),
	nanoether: expo10(9),
	nano: expo10(9),
	szabo: expo10(12),
	microether: expo10(12),
	micro: expo10(12),
	finney: expo10(15),
	milliether: expo10(15),
	milli: expo10(15),
	ether: expo10(18),
	kether: expo10(21),
	grand: expo10(21),
	mether: expo10(24),
	gether: expo10(27),
	tether: expo10(30),
};

export type EtherUnits = keyof typeof ethUnitMap;
/**
 * Convert a value from bytes to Buffer
 * @param data - Data to be converted
 * @returns - The Buffer representation of the input data
 *
 * @example
 * ```ts
 * console.log(web3.utils.bytesToBuffer(new Uint8Array([72, 12])));
 * > <Buffer 48 0c>
 * ```
 */
export const bytesToBuffer = (data: Bytes): Buffer | never => {
	validator.validate(['bytes'], [data]);

	if (Buffer.isBuffer(data)) {
		return data;
	}

	if (data instanceof Uint8Array || Array.isArray(data)) {
		return Buffer.from(data);
	}

	if (typeof data === 'string' && isHexStrict(data)) {
		const dataWithoutPrefix = data.toLowerCase().replace('0x', '');
		const dataLength = dataWithoutPrefix.length + (dataWithoutPrefix.length % 2);
		const finalData = dataWithoutPrefix.padStart(dataLength, '0');
		return Buffer.from(finalData, 'hex');
	}

	if (typeof data === 'string' && !isHexStrict(data)) {
		return Buffer.from(data, 'hex');
	}

	throw new InvalidBytesError(data);
};

/**
 * @internal
 */
const bufferToHexString = (data: Buffer) => `0x${data.toString('hex')}`;

/**
 * Convert a byte array to a hex string
 * @param bytes - Byte array to be converted
 * @returns - The hex string representation of the input byte array
 *
 * @example
 * ```ts
 * console.log(web3.utils.bytesToHex(new Uint8Array([72, 12])));
 * > "0x480c"
 *
 * console.log(web3.utils.bytesToHex(Buffer.from("0c12", "hex")));
 * > "0x0c12"
 */
export const bytesToHex = (bytes: Bytes): HexString => bufferToHexString(bytesToBuffer(bytes));

/**
 * Convert a hex string to a byte array
 * @param hex - Hex string to be converted
 * @returns - The byte array representation of the input hex string
 *
 * @example
 * ```ts
 * console.log(web3.utils.hexToBytes('0x74657374'));
 * > <Buffer 74 65 73 74>
 * ```
 */
export const hexToBytes = (bytes: HexString): Buffer => bytesToBuffer(bytes);

/**
 * Converts value to it's number representation
 * @param value - Hex string to be converted
 * @returns - The number representation of the input value
 *
 * @example
 * ```ts
 * conoslle.log(web3.utils.hexToNumber('0xa'));
 * > 10
 * ```
 */
export const hexToNumber = (value: HexString): bigint | number => {
	validator.validate(['hex'], [value]);

	// To avoid duplicate code and circular dependency we will
	// use `hexToNumber` implementation from `web3-validator`
	return validatorUtils.hexToNumber(value);
};

/**
 * Converts value to it's number representation @alias `hexToNumber`
 */
export const toDecimal = hexToNumber;

/**
 * Converts value to it's hex representation
 * @param value - Value to be converted
 * @returns - The hex representation of the input value
 *
 * @example
 * ```ts
 * console.log(web3.utils.numberToHex(10));
 * > "0xa"
 * ```
 */
export const numberToHex = (value: Numbers): HexString => {
	validator.validate(['int'], [value]);

	// To avoid duplicate code and circular dependency we will
	// use `numberToHex` implementation from `web3-validator`
	return validatorUtils.numberToHex(value);
};
/**
 * Converts value to it's hex representation @alias `numberToHex`
 *
 */
export const fromDecimal = numberToHex;

/**
 * Converts value to it's decimal representation in string
 * @param value - Hex string to be converted
 * @returns - The decimal representation of the input value
 *
 * @example
 * ```ts
 * console.log(web3.utils.hexToNumberString('0xa'));
 * > "10"
 * ```
 */
export const hexToNumberString = (data: HexString): string => hexToNumber(data).toString();

/**
 * Should be called to get hex representation (prefixed by 0x) of utf8 string
 * @param str - Utf8 string to be converted
 * @returns - The hex representation of the input string
 *
 * @example
 * ```ts
 * console.log(utf8ToHex('web3.js'));
 * > "0x776562332e6a73"
 *
 */
export const utf8ToHex = (str: string): HexString => {
	validator.validate(['string'], [str]);

	// To be compatible with 1.x trim null character
	// eslint-disable-next-line no-control-regex
	let strWithoutNullCharacter = str.replace(/^(?:\u0000)/, '');
	// eslint-disable-next-line no-control-regex
	strWithoutNullCharacter = strWithoutNullCharacter.replace(/(?:\u0000)$/, '');

	return `0x${Buffer.from(strWithoutNullCharacter, 'utf8').toString('hex')}`;
};

/**
 * @alias utf8ToHex
 */

export const fromUtf8 = utf8ToHex;
/**
 * @alias utf8ToHex
 */
export const stringToHex = utf8ToHex;

/**
 * Should be called to get utf8 from it's hex representation
 * @param str - Hex string to be converted
 * @returns - Utf8 string
 *
 * @example
 * ```ts
 * console.log(web3.utils.hexToUtf8('0x48656c6c6f20576f726c64'));
 * > Hello World
 * ```
 */
export const hexToUtf8 = (str: HexString): string => bytesToBuffer(str).toString('utf8');

/**
 * @alias hexToUtf8
 */
export const toUtf8 = hexToUtf8;

/**
 * @alias hexToUtf8
 */
export const hexToString = hexToUtf8;

/**
 * Should be called to get hex representation (prefixed by 0x) of ascii string
 * @param str - String to be converted to hex
 * @returns - Hex string
 *
 * @example
 * ```ts
 * console.log(web3.utils.asciiToHex('Hello World'));
 * > 0x48656c6c6f20576f726c64
 * ```
 */
export const asciiToHex = (str: string): HexString => {
	validator.validate(['string'], [str]);

	return `0x${Buffer.from(str, 'ascii').toString('hex')}`;
};

/**
 * @alias asciiToHex
 */
export const fromAscii = asciiToHex;

/**
 * Should be called to get ascii from it's hex representation
 * @param str - Hex string to be converted to ascii
 * @returns - Ascii string
 *
 * @example
 * ```ts
 * console.log(web3.utils.hexToAscii('0x48656c6c6f20576f726c64'));
 * > Hello World
 * ```
 */
export const hexToAscii = (str: HexString): string => bytesToBuffer(str).toString('ascii');

/**
 * @alias hexToAscii
 */
export const toAscii = hexToAscii;

/**
 * Auto converts any given value into it's hex representation.
 * @param value - Value to be converted to hex
 * @param returnType - If true, it will return the type of the value
 *
 * @example
 * ```ts
 * console.log(web3.utils.toHex(10));
 * > 0xa
 *
 * console.log(web3.utils.toHex('0x123', true));
 * > bytes
 *```
 */
export const toHex = (
	value: Numbers | Bytes | Address | boolean | object,
	returnType?: boolean,
): HexString | ValueTypes => {
	if (typeof value === 'string' && isAddress(value)) {
		return returnType ? 'address' : `0x${value.toLowerCase().replace(/^0x/i, '')}`;
	}

	if (typeof value === 'boolean') {
		// eslint-disable-next-line no-nested-ternary
		return returnType ? 'bool' : value ? '0x01' : '0x00';
	}

	if (typeof value === 'number') {
		// eslint-disable-next-line no-nested-ternary
		return returnType ? (value < 0 ? 'int256' : 'uint256') : numberToHex(value);
	}

	if (typeof value === 'bigint') {
		return returnType ? 'bigint' : numberToHex(value);
	}

	if (typeof value === 'object' && !!value) {
		return returnType ? 'string' : utf8ToHex(JSON.stringify(value));
	}

	if (typeof value === 'string') {
		if (value.startsWith('-0x') || value.startsWith('-0X')) {
			return returnType ? 'int256' : numberToHex(value);
		}

		if (isHexStrict(value)) {
			return returnType ? 'bytes' : value;
		}

		if (!Number.isFinite(value)) {
			return returnType ? 'string' : utf8ToHex(value);
		}
	}

	throw new HexProcessingError(value);
};

/**
 * Converts any given value into it's number representation, if possible, else into it's bigint representation.
 * @param value - The value to convert
 * @returns - Returns the value in number or bigint representation
 *
 * @example
 * ```ts
 * console.log(web3.utils.toNumber(1));
 * > 1
 * console.log(web3.utils.toNumber(Number.MAX_SAFE_INTEGER));
 * > 9007199254740991
 *
 * console.log(web3.utils.toNumber(BigInt(Number.MAX_SAFE_INTEGER)));
 * > 9007199254740991
 *
 * console.log(web3.utils.toNumber(BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1)));
 * > 9007199254740992n
 *
 * ```
 */
export const toNumber = (value: Numbers): number | bigint => {
	if (typeof value === 'number') {
		return value;
	}

	if (typeof value === 'bigint') {
		return value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER
			? Number(value)
			: value;
	}

	if (typeof value === 'string' && isHexStrict(value)) {
		return hexToNumber(value);
	}

	try {
		return toNumber(BigInt(value));
	} catch {
		throw new InvalidNumberError(value);
	}
};

/**
 * Auto converts any given value into it's bigint representation
 *
 * @param value - The value to convert
 * @returns - Returns the value in bigint representation

 * @example
 * ```ts
 * console.log(web3.utils.toBigInt(1));
 * > 1n
 * ```
 */
export const toBigInt = (value: unknown): bigint => {
	if (typeof value === 'number') {
		return BigInt(value);
	}

	if (typeof value === 'bigint') {
		return value;
	}

	// isHex passes for dec, too
	if (typeof value === 'string' && isHex(value)) {
		return BigInt(value);
	}

	throw new InvalidNumberError(value);
};

/**
 * Takes a number of wei and converts it to any other ether unit.
 * @param number - The value in wei
 * @param unit - The unit to convert to
 * @returns - Returns the converted value in the given unit
 *
 * @example
 * ```ts
 * console.log(web3.utils.fromWei("1", "ether"));
 * > 0.000000000000000001
 *
 * console.log(web3.utils.fromWei("1", "shannon"));
 * > 0.000000001
 * ```
 */
export const fromWei = (number: Numbers, unit: EtherUnits): string => {
	const denomination = ethUnitMap[unit];

	if (!denomination) {
		throw new InvalidUnitError(unit);
	}

	// value in wei would always be integer
	// 13456789, 1234
	const value = String(toNumber(number));

	// count number of zeros in denomination
	// 1000000 -> 6
	const numberOfZerosInDenomination = denomination.toString().length - 1;

	if (numberOfZerosInDenomination <= 0) {
		return value.toString();
	}

	// pad the value with required zeros
	// 13456789 -> 13456789, 1234 -> 001234
	const zeroPaddedValue = value.padStart(numberOfZerosInDenomination, '0');

	// get the integer part of value by counting number of zeros from start
	// 13456789 -> '13'
	// 001234 -> ''
	const integer = zeroPaddedValue.slice(0, -numberOfZerosInDenomination);

	// get the fraction part of value by counting number of zeros backward
	// 13456789 -> '456789'
	// 001234 -> '001234'
	const fraction = zeroPaddedValue.slice(-numberOfZerosInDenomination).replace(/\.?0+$/, '');

	if (integer === '') {
		return `0.${fraction}`;
	}

	if (fraction === '') {
		return integer;
	}

	return `${integer}.${fraction}`;
};

/**
 * Takes a number of a unit and converts it to wei.
 *
 * @param number - The number to convert.
 * @param unit - {@link EtherUnits} The unit of the number passed.
 * @returns The number converted to wei.
 *
 * @example
 * ```ts
 * console.log(web3.utils.toWei("0.001", "ether"));
 * > 1000000000000000 //(wei)
 * ```
 */
// todo in 1.x unit defaults to 'ether'
export const toWei = (number: Numbers, unit: EtherUnits): string => {
	validator.validate(['number'], [number]);

	const denomination = ethUnitMap[unit];

	if (!denomination) {
		throw new InvalidUnitError(unit);
	}

	// if value is decimal e.g. 24.56 extract `integer` and `fraction` part
	// to avoid `fraction` to be null use `concat` with empty string
	const [integer, fraction] = String(
		typeof number === 'string' && !isHexStrict(number) ? number : toNumber(number),
	)
		.split('.')
		.concat('');

	// join the value removing `.` from
	// 24.56 -> 2456
	const value = BigInt(`${integer}${fraction}`);

	// multiply value with denomination
	// 2456 * 1000000 -> 2456000000
	const updatedValue = value * denomination;

	// count number of zeros in denomination
	const numberOfZerosInDenomination = denomination.toString().length - 1;

	// check which either `fraction` or `denomination` have lower number of zeros
	const decimals = Math.min(fraction.length, numberOfZerosInDenomination);

	if (decimals === 0) {
		return updatedValue.toString();
	}

	// Add zeros to make length equal to required decimal points
	// If string is larger than decimal points required then remove last zeros
	return updatedValue.toString().padStart(decimals, '0').slice(0, -decimals);
};

/**
 * Will convert an upper or lowercase Ethereum address to a checksum address.
 * @param address - An address string
 * @returns	The checksum address
 * @example
 * ```ts
 * web3.utils.toChecksumAddress('0xc1912fee45d61c87cc5ea59dae31190fffff232d');
 * > "0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d"
 * ```
 */
export const toChecksumAddress = (address: Address): string => {
	if (!isAddress(address, false)) {
		throw new InvalidAddressError(address);
	}

	const lowerCaseAddress = address.toLowerCase().replace(/^0x/i, '');

	const hash = bytesToHex(keccak256(Buffer.from(lowerCaseAddress)));

	if (
		isNullish(hash) ||
		hash === 'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
	)
		return ''; // // EIP-1052 if hash is equal to c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470, keccak was given empty data

	const addressHash = hash.replace(/^0x/i, '');

	let checksumAddress = '0x';

	for (let i = 0; i < lowerCaseAddress.length; i += 1) {
		// If ith character is 8 to f then make it uppercase
		if (parseInt(addressHash[i], 16) > 7) {
			checksumAddress += lowerCaseAddress[i].toUpperCase();
		} else {
			checksumAddress += lowerCaseAddress[i];
		}
	}
	return checksumAddress;
};
