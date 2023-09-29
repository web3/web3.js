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
import { isHexPrefixed, isHexString } from 'web3-validator';
import { bytesToHex, hexToBytes, numberToHex } from 'web3-utils';
import { secp256k1 } from '../tx/constants.js';
import { ToBytesInputTypes } from './types.js';

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
 * Attempts to turn a value into a `Uint8Array`.
 * Inputs supported: `Uint8Array` `String` (hex-prefixed), `Number`, null/undefined, `BigInt` and other objects
 * with a `toArray()` or `toUint8Array()` method.
 * @param v the value
 */
export const toUint8Array = function (v: ToBytesInputTypes): Uint8Array {
	// eslint-disable-next-line no-null/no-null
	if (v === null || v === undefined) {
		return new Uint8Array();
	}

	if (v instanceof Uint8Array) {
		return v;
	}

	if (Array.isArray(v)) {
		return Uint8Array.from(v);
	}

	if (typeof v === 'string') {
		if (!isHexString(v)) {
			throw new Error(
				`Cannot convert string to Uint8Array. only supports 0x-prefixed hex strings and this string was given: ${v}`,
			);
		}
		return hexToBytes(padToEven(stripHexPrefix(v)));
	}

	if (typeof v === 'number') {
		return toUint8Array(numberToHex(v));
	}

	if (typeof v === 'bigint') {
		if (v < BigInt(0)) {
			throw new Error(`Cannot convert negative bigint to Uint8Array. Given: ${v}`);
		}
		let n = v.toString(16);
		if (n.length % 2) n = `0${n}`;
		return toUint8Array(`0x${n}`);
	}

	if (v.toArray) {
		// converts a BN to a Uint8Array
		return Uint8Array.from(v.toArray());
	}

	throw new Error('invalid type');
};

/**
 * Converts a {@link Uint8Array} to a {@link bigint}
 */
export function uint8ArrayToBigInt(buf: Uint8Array) {
	const hex = bytesToHex(buf);
	if (hex === '0x') {
		return BigInt(0);
	}
	return BigInt(hex);
}

/**
 * Converts a {@link int} to a {@link Uint8Array}
 */
export function intToUint8Array(num: number) {
	return toUint8Array(`0x${num.toString(16)}`);
}

/**
 * Converts a {@link bigint} to a {@link Uint8Array}
 */
export function bigIntToUint8Array(num: bigint) {
	return toUint8Array(`0x${num.toString(16)}`);
}

/**
 * Returns a Uint8Array filled with 0s.
 * @param bytes the number of bytes the Uint8Array should be
 */
export const zeros = function (bytes: number): Uint8Array {
	return new Uint8Array(bytes).fill(0);
};

/**
 * Pads a `Uint8Array` with zeros till it has `length` bytes.
 * Truncates the beginning or end of input if its length exceeds `length`.
 * @param msg the value to pad (Uint8Array)
 * @param length the number of bytes the output should be
 * @param right whether to start padding form the left or right
 * @return (Uint8Array)
 */
const setLength = function (msg: Uint8Array, length: number, right: boolean) {
	const buf = zeros(length);
	if (right) {
		if (msg.length < length) {
			buf.set(msg);
			return buf;
		}
		return msg.subarray(0, length);
	}
	if (msg.length < length) {
		buf.set(msg, length - msg.length);
		return buf;
	}
	return msg.subarray(-length);
};

/**
 * Throws if input is not a Uint8Array
 * @param {Uint8Array} input value to check
 */
export function assertIsUint8Array(input: unknown): asserts input is Uint8Array {
	if (!(input instanceof Uint8Array)) {
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		const msg = `This method only supports Uint8Array but input was: ${input}`;
		throw new Error(msg);
	}
}
/**
 * Left Pads a `Uint8Array` with leading zeros till it has `length` bytes.
 * Or it truncates the beginning if it exceeds.
 * @param msg the value to pad (Uint8Array)
 * @param length the number of bytes the output should be
 * @return (Uint8Array)
 */
export const setLengthLeft = function (msg: Uint8Array, length: number) {
	assertIsUint8Array(msg);
	return setLength(msg, length, false);
};

/**
 * Trims leading zeros from a `Uint8Array`, `String` or `Number[]`.
 * @param a (Uint8Array|Array|String)
 * @return (Uint8Array|Array|String)
 */
export function stripZeros<T extends Uint8Array | number[] | string>(a: T): T {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
	let first = a[0];
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
	while (a.length > 0 && first.toString() === '0') {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, prefer-destructuring, @typescript-eslint/no-unsafe-call, no-param-reassign
		a = a.slice(1) as T;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, prefer-destructuring, @typescript-eslint/no-unsafe-member-access
		first = a[0];
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return a;
}

/**
 * Trims leading zeros from a `Uint8Array`.
 * @param a (Uint8Array)
 * @return (Uint8Array)
 */
export const unpadUint8Array = function (a: Uint8Array): Uint8Array {
	assertIsUint8Array(a);
	return stripZeros(a);
};

/**
 * Converts a {@link bigint} to a `0x` prefixed hex string
 */
export const bigIntToHex = (num: bigint) => `0x${num.toString(16)}`;

/**
 * Convert value from bigint to an unpadded Uint8Array
 * (useful for RLP transport)
 * @param value value to convert
 */
export function bigIntToUnpaddedUint8Array(value: bigint): Uint8Array {
	return unpadUint8Array(bigIntToUint8Array(value));
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
	msgHash: Uint8Array,
	v: bigint,
	r: Uint8Array,
	s: Uint8Array,
	chainId?: bigint,
): Uint8Array {
	const recovery = calculateSigRecovery(v, chainId);
	if (!isValidSigRecovery(recovery)) {
		throw new Error('Invalid signature v value');
	}

	const senderPubKey = new secp256k1.Signature(uint8ArrayToBigInt(r), uint8ArrayToBigInt(s))
		.addRecoveryBit(Number(recovery))
		.recoverPublicKey(msgHash)
		.toRawBytes(false);
	return senderPubKey.slice(1);
};
