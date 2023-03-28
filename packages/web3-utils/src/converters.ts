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
	isHexString,
	isHexPrefixed,
	isAddress,
	isHex,
	isHexStrict,
	isNullish,
	utils as validatorUtils,
	validator,
} from 'web3-validator';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { recoverPublicKey } from 'ethereum-cryptography/secp256k1';
import {
	HexProcessingError,
	InvalidAddressError,
	InvalidBytesError,
	InvalidNumberError,
	InvalidUnitError,
} from 'web3-errors';
import {
	NestedBufferArray,
	NestedUint8Array,
	ToBufferInputTypes,
	TypeOutput,
	TypeOutputReturnType,
} from './types';

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
 * Pads a `String` to have an even length
 * @param value
 * @return output
 */
export function padToEven(value: string): string {
	let a = value;

	if (typeof a !== 'string') {
		throw new Error(`[padToEven] value must be type 'string', received ${typeof a}`);
	}

	if (a.length % 2) a = `0${a}`;

	return a;
}

/**
 * Removes '0x' from a given `String` if present
 * @param str the string value
 * @returns the string without 0x prefix
 */
export const stripHexPrefix = (str: string): string => {
	if (typeof str !== 'string')
		throw new Error(`[stripHexPrefix] input must be type 'string', received ${typeof str}`);

	return isHexPrefixed(str) ? str.slice(2) : str;
};

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

/**
 * Converts a `Number` into a hex `String`
 * @param {Number} i
 * @return {String}
 */
export const intToHex = function (i: number) {
	if (!Number.isSafeInteger(i) || i < 0) {
		throw new Error(`Received an invalid integer type: ${i}`);
	}
	return `0x${i.toString(16)}`;
};

/**
 * Converts an `Number` to a `Buffer`
 * @param {Number} i
 * @return {Buffer}
 */
export const intToBuffer = function (i: number) {
	const hex = intToHex(i);
	return Buffer.from(padToEven(hex.slice(2)), 'hex');
};

/**
 * Attempts to turn a value into a `Buffer`.
 * Inputs supported: `Buffer`, `String` (hex-prefixed), `Number`, null/undefined, `BigInt` and other objects
 * with a `toArray()` or `toBuffer()` method.
 * @param v the value
 */
export const toBuffer = function (v: ToBufferInputTypes): Buffer {
	// eslint-disable-next-line no-null/no-null
	if (v === null || v === undefined) {
		return Buffer.allocUnsafe(0);
	}

	if (Buffer.isBuffer(v)) {
		return Buffer.from(v);
	}

	if (Array.isArray(v) || v instanceof Uint8Array) {
		return Buffer.from(v as Uint8Array);
	}

	if (typeof v === 'string') {
		if (!isHexString(v)) {
			throw new Error(
				`Cannot convert string to buffer. toBuffer only supports 0x-prefixed hex strings and this string was given: ${v}`,
			);
		}
		return Buffer.from(padToEven(stripHexPrefix(v)), 'hex');
	}

	if (typeof v === 'number') {
		return intToBuffer(v);
	}

	if (typeof v === 'bigint') {
		if (v < BigInt(0)) {
			throw new Error(`Cannot convert negative bigint to buffer. Given: ${v}`);
		}
		let n = v.toString(16);
		if (n.length % 2) n = `0${n}`;
		return Buffer.from(n, 'hex');
	}

	if (v.toArray) {
		// converts a BN to a Buffer
		return Buffer.from(v.toArray());
	}

	if (v.toBuffer) {
		return Buffer.from(v.toBuffer());
	}

	throw new Error('invalid type');
};

/**
 * Converts a `Buffer` into a `0x`-prefixed hex `String`.
 * @param buf `Buffer` object to convert
 */
export const bufferToHex = function (_buf: Buffer): string {
	const buf = toBuffer(_buf);
	return `0x${buf.toString('hex')}`;
};

/**
 * Converts a {@link Buffer} to a {@link bigint}
 */
export function bufferToBigInt(buf: Buffer) {
	const hex = bufferToHex(buf);
	if (hex === '0x') {
		return BigInt(0);
	}
	return BigInt(hex);
}

/**
 * Converts a {@link bigint} to a {@link Buffer}
 */
export function bigIntToBuffer(num: bigint) {
	return toBuffer(`0x${num.toString(16)}`);
}

/**
 * Returns a buffer filled with 0s.
 * @param bytes the number of bytes the buffer should be
 */
export const zeros = function (bytes: number): Buffer {
	return Buffer.allocUnsafe(bytes).fill(0);
};

/**
 * Pads a `Buffer` with zeros till it has `length` bytes.
 * Truncates the beginning or end of input if its length exceeds `length`.
 * @param msg the value to pad (Buffer)
 * @param length the number of bytes the output should be
 * @param right whether to start padding form the left or right
 * @return (Buffer)
 */
const setLength = function (msg: Buffer, length: number, right: boolean) {
	const buf = zeros(length);
	if (right) {
		if (msg.length < length) {
			msg.copy(buf);
			return buf;
		}
		return msg.slice(0, length);
	}
	if (msg.length < length) {
		msg.copy(buf, length - msg.length);
		return buf;
	}
	return msg.slice(-length);
};

/**
 * Throws if input is not a buffer
 * @param {Buffer} input value to check
 */
export const assertIsBuffer = function (input: Buffer): void {
	if (!Buffer.isBuffer(input)) {
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		const msg = `This method only supports Buffer but input was: ${input}`;
		throw new Error(msg);
	}
};
/**
 * Left Pads a `Buffer` with leading zeros till it has `length` bytes.
 * Or it truncates the beginning if it exceeds.
 * @param msg the value to pad (Buffer)
 * @param length the number of bytes the output should be
 * @return (Buffer)
 */
export const setLengthLeft = function (msg: Buffer, length: number) {
	assertIsBuffer(msg);
	return setLength(msg, length, false);
};

/**
 * Trims leading zeros from a `Buffer`, `String` or `Number[]`.
 * @param a (Buffer|Array|String)
 * @return (Buffer|Array|String)
 */
const stripZeros = function (a: any): Buffer | number[] | string {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
	let first = a[0];
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
	while (a.length > 0 && first.toString() === '0') {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, prefer-destructuring, @typescript-eslint/no-unsafe-call, no-param-reassign
		a = a.slice(1);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, prefer-destructuring, @typescript-eslint/no-unsafe-member-access
		first = a[0];
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return a;
};

/**
 * Trims leading zeros from a `Buffer`.
 * @param a (Buffer)
 * @return (Buffer)
 */
export const unpadBuffer = function (a: Buffer): Buffer {
	assertIsBuffer(a);
	return stripZeros(a) as Buffer;
};

/**
 * Converts a {@link Uint8Array} or {@link NestedUint8Array} to {@link Buffer} or {@link NestedBufferArray}
 */
export function arrToBufArr(arr: Uint8Array): Buffer;
export function arrToBufArr(arr: NestedUint8Array): NestedBufferArray;
export function arrToBufArr(arr: Uint8Array | NestedUint8Array): Buffer | NestedBufferArray;
export function arrToBufArr(arr: Uint8Array | NestedUint8Array): Buffer | NestedBufferArray {
	if (!Array.isArray(arr)) {
		return Buffer.from(arr);
	}
	return arr.map(a => arrToBufArr(a));
}

/**
 * Converts a {@link bigint} to a `0x` prefixed hex string
 */
export const bigIntToHex = (num: bigint) => `0x${num.toString(16)}`;

/**
 * Convert value from bigint to an unpadded Buffer
 * (useful for RLP transport)
 * @param value value to convert
 */
export function bigIntToUnpaddedBuffer(value: bigint): Buffer {
	return unpadBuffer(bigIntToBuffer(value));
}

/**
 * Converts a {@link Buffer} or {@link NestedBufferArray} to {@link Uint8Array} or {@link NestedUint8Array}
 */
export function bufArrToArr(arr: Buffer): Uint8Array;
export function bufArrToArr(arr: NestedBufferArray): NestedUint8Array;
export function bufArrToArr(arr: Buffer | NestedBufferArray): Uint8Array | NestedUint8Array;
export function bufArrToArr(arr: Buffer | NestedBufferArray): Uint8Array | NestedUint8Array {
	if (!Array.isArray(arr)) {
		return Uint8Array.from(arr ?? []);
	}
	return arr.map(a => bufArrToArr(a));
}

function calculateSigRecovery(v: bigint, chainId?: bigint): bigint {
	if (v === BigInt(0) || v === BigInt(1)) return v;

	if (chainId === undefined) {
		return v - BigInt(27);
	}
	return v - (chainId * BigInt(2) + BigInt(35));
}

function isValidSigRecovery(recovery: bigint): boolean {
	return recovery === BigInt(0) || recovery === BigInt(1);
}

/**
 * ECDSA public key recovery from signature.
 * NOTE: Accepts `v === 0 | v === 1` for EIP1559 transactions
 * @returns Recovered public key
 */
export const ecrecover = function (
	msgHash: Buffer,
	v: bigint,
	r: Buffer,
	s: Buffer,
	chainId?: bigint,
): Buffer {
	const signature = Buffer.concat([setLengthLeft(r, 32), setLengthLeft(s, 32)], 64);
	const recovery = calculateSigRecovery(v, chainId);
	if (!isValidSigRecovery(recovery)) {
		throw new Error('Invalid signature v value');
	}

	const senderPubKey = recoverPublicKey(msgHash, signature, Number(recovery));
	return Buffer.from(senderPubKey.slice(1));
};

/**
 * Convert an input to a specified type.
 * Input of null/undefined returns null/undefined regardless of the output type.
 * @param input value to convert
 * @param outputType type to output
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function toType<T extends TypeOutput>(input: null, outputType: T): null;
export function toType<T extends TypeOutput>(input: undefined, outputType: T): undefined;
export function toType<T extends TypeOutput>(
	input: ToBufferInputTypes,
	outputType: T,
): TypeOutputReturnType[T];
export function toType<T extends TypeOutput>(
	input: ToBufferInputTypes,
	outputType: T,
	// eslint-disable-next-line @typescript-eslint/ban-types
): TypeOutputReturnType[T] | undefined | null {
	// eslint-disable-next-line no-null/no-null
	if (input === null) {
		// eslint-disable-next-line no-null/no-null
		return null;
	}
	if (input === undefined) {
		return undefined;
	}

	if (typeof input === 'string' && !isHexString(input)) {
		throw new Error(`A string must be provided with a 0x-prefix, given: ${input}`);
	} else if (typeof input === 'number' && !Number.isSafeInteger(input)) {
		throw new Error(
			'The provided number is greater than MAX_SAFE_INTEGER (please use an alternative input type)',
		);
	}

	const output = toBuffer(input);

	switch (outputType) {
		case TypeOutput.Buffer:
			return output as TypeOutputReturnType[T];
		case TypeOutput.BigInt:
			return bufferToBigInt(output) as TypeOutputReturnType[T];
		case TypeOutput.Number: {
			const bigInt = bufferToBigInt(output);
			if (bigInt > BigInt(Number.MAX_SAFE_INTEGER)) {
				throw new Error(
					'The provided number is greater than MAX_SAFE_INTEGER (please use an alternative output type)',
				);
			}
			return Number(bigInt) as TypeOutputReturnType[T];
		}
		case TypeOutput.PrefixedHexString:
			return bufferToHex(output) as TypeOutputReturnType[T];
		default:
			throw new Error('unknown outputType');
	}
}
