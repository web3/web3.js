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
import { assertIsArray, assertIsBuffer, assertIsHexString } from './helpers';
import { isHexPrefixed, isHexString, padToEven, stripHexPrefix } from './internal';

import type {
	NestedBufferArray,
	NestedUint8Array,
	PrefixedHexString,
	TransformableToArray,
	TransformableToBuffer,
} from './types';

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
		// eslint-disable-next-line deprecation/deprecation
		return msg.slice(0, length);
	}
	if (msg.length < length) {
		msg.copy(buf, length - msg.length);
		return buf;
	}
	// eslint-disable-next-line deprecation/deprecation
	return msg.slice(-length);
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
 * Right Pads a `Buffer` with trailing zeros till it has `length` bytes.
 * it truncates the end if it exceeds.
 * @param msg the value to pad (Buffer)
 * @param length the number of bytes the output should be
 * @return (Buffer)
 */
export const setLengthRight = function (msg: Buffer, length: number) {
	assertIsBuffer(msg);
	return setLength(msg, length, true);
};

/**
 * Trims leading zeros from a `Buffer`, `String` or `Number[]`.
 * @param a (Buffer|Array|String)
 * @return (Buffer|Array|String)
 */
const stripZeros = function (_a: any): Buffer | number[] | string {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	let a = _a;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
	let first = a[0];
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
	while (a.length > 0 && first.toString() === '0') {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
		a = a.slice(1);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, prefer-destructuring
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
 * Trims leading zeros from an `Array` (of numbers).
 * @param a (number[])
 * @return (number[])
 */
export const unpadArray = function (a: number[]): number[] {
	assertIsArray(a);
	return stripZeros(a) as number[];
};

/**
 * Trims leading zeros from a hex-prefixed `String`.
 * @param a (String)
 * @return (String)
 */
export const unpadHexString = function (_a: string): string {
	assertIsHexString(_a);
	const a = stripHexPrefix(_a);
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	return `0x${stripZeros(a)}`;
};

export type ToBufferInputTypes =
	| PrefixedHexString
	| number
	| bigint
	| Buffer
	| Uint8Array
	| number[]
	| TransformableToArray
	| TransformableToBuffer
	// eslint-disable-next-line @typescript-eslint/ban-types
	| null
	| undefined;

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
 * Converts a `Buffer` to a `Number`.
 * @param buf `Buffer` object to convert
 * @throws If the input number exceeds 53 bits.
 */
export const bufferToInt = function (buf: Buffer): number {
	const res = Number(bufferToBigInt(buf));
	if (!Number.isSafeInteger(res)) throw new Error('Number exceeds 53 bits');
	return res;
};

/**
 * Interprets a `Buffer` as a signed integer and returns a `BigInt`. Assumes 256-bit numbers.
 * @param num Signed integer value
 */
export const fromSigned = function (num: Buffer): bigint {
	return BigInt.asIntN(256, bufferToBigInt(num));
};

/**
 * Converts a `BigInt` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.
 * @param num
 */
export const toUnsigned = function (num: bigint): Buffer {
	return bigIntToBuffer(BigInt.asUintN(256, num));
};

/**
 * Adds "0x" to a given `String` if it does not already start with "0x".
 */
export const addHexPrefix = function (str: string): string {
	if (typeof str !== 'string') {
		return str;
	}

	return isHexPrefixed(str) ? str : `0x${str}`;
};

/**
 * Shortens a string  or buffer's hex string representation to maxLength (default 50).
 *
 * Examples:
 *
 * Input:  '657468657265756d000000000000000000000000000000000000000000000000'
 * Output: '657468657265756d0000000000000000000000000000000000…'
 */
export function short(buffer: Buffer | string, maxLength = 50): string {
	const bufferStr = Buffer.isBuffer(buffer) ? buffer.toString('hex') : buffer;
	if (bufferStr.length <= maxLength) {
		return bufferStr;
	}
	return `${bufferStr.slice(0, maxLength)}…`;
}

/**
 * Converts a `Buffer` or `Array` to JSON.
 * @param ba (Buffer|Array)
 * @return (Array|String|null)
 */
export const baToJSON = function (ba: any): any {
	if (Buffer.isBuffer(ba)) {
		return `0x${ba.toString('hex')}`;
	}
	if (ba instanceof Array) {
		const array = [];
		// eslint-disable-next-line @typescript-eslint/prefer-for-of
		for (let i = 0; i < ba.length; i += 1) {
			array.push(baToJSON(ba[i]));
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return array;
	}
	return undefined;
};

/**
 * Checks provided Buffers for leading zeroes and throws if found.
 *
 * Examples:
 *
 * Valid values: 0x1, 0x, 0x01, 0x1234
 * Invalid values: 0x0, 0x00, 0x001, 0x0001
 *
 * Note: This method is useful for validating that RLP encoded integers comply with the rule that all
 * integer values encoded to RLP must be in the most compact form and contain no leading zero bytes
 * @param values An object containing string keys and Buffer values
 * @throws if any provided value is found to have leading zero bytes
 */
export const validateNoLeadingZeroes = function (values: { [key: string]: Buffer | undefined }) {
	for (const [k, v] of Object.entries(values)) {
		if (v !== undefined && v.length > 0 && v[0] === 0) {
			throw new Error(`${k} cannot have leading zeroes, received: ${v.toString('hex')}`);
		}
	}
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

export function intToUnpaddedBuffer(value: number): Buffer {
	return unpadBuffer(intToBuffer(value));
}
