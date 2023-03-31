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
import { isHexPrefixed } from 'web3-validator';
import { stripHexPrefix } from '../common/utils';
// Global symbols in both browsers and Node.js since v11
// See https://github.com/microsoft/TypeScript/issues/31535
declare const TextEncoder: any;
declare const TextDecoder: any;
// eslint-disable-next-line @typescript-eslint/ban-types
export type Input = string | number | bigint | Uint8Array | Array<Input> | null | undefined;
/** Transform an integer into its hexadecimal value */

const cachedHexes = Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, '0'));
export const bytesToHex = (uint8a: Uint8Array): string => {
	// Pre-caching chars with `cachedHexes` speeds this up 6x
	let hex = '';
	// eslint-disable-next-line @typescript-eslint/prefer-for-of
	for (let i = 0; i < uint8a.length; i += 1) {
		hex += cachedHexes[uint8a[i]];
	}
	return hex;
};
export const numberToHex = (integer: number | bigint): string => {
	if (integer < 0) {
		throw new Error('Invalid integer as argument, must be unsigned!');
	}
	const hex = integer.toString(16);
	return hex.length % 2 ? `0${hex}` : hex;
};
export const parseHexByte = (hexByte: string): number => {
	const byte = Number.parseInt(hexByte, 16);
	if (Number.isNaN(byte)) throw new Error('Invalid byte sequence');
	return byte;
};
export const hexToBytes = (hex: string): Uint8Array => {
	if (typeof hex !== 'string') {
		throw new TypeError(`hexToBytes: expected string, got ${typeof hex}`);
	}
	if (hex.length % 2) throw new Error('hexToBytes: received invalid unpadded hex');
	const array = new Uint8Array(hex.length / 2);
	for (let i = 0; i < array.length; i += 1) {
		const j = i * 2;
		array[i] = parseHexByte(hex.slice(j, j + 2));
	}
	return array;
};
export const encodeLength = (len: number, offset: number): Uint8Array => {
	if (len < 56) {
		return Uint8Array.from([len + offset]);
	}
	const hexLength = numberToHex(len);
	const lLength = hexLength.length / 2;
	const firstByte = numberToHex(offset + 55 + lLength);
	return Uint8Array.from(hexToBytes(firstByte + hexLength));
};
/** Concatenates two Uint8Arrays into one. */
export const concatBytes = (...arrays: Uint8Array[]): Uint8Array => {
	if (arrays.length === 1) return arrays[0];
	const length = arrays.reduce((a, arr) => a + arr.length, 0);
	const result = new Uint8Array(length);
	for (let i = 0, pad = 0; i < arrays.length; i += 1) {
		const arr = arrays[i];
		result.set(arr, pad);
		pad += arr.length;
	}
	return result;
};
export const utf8ToBytes = (utf: string): Uint8Array =>
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
	new TextEncoder().encode(utf);
/** Pad a string to be even */
export const padToEven = (a: string): string => (a.length % 2 ? `0${a}` : a);

/** Transform anything into a Uint8Array */
export const toBytes = (v: Input): Uint8Array => {
	if (v instanceof Uint8Array) {
		return v;
	}
	if (typeof v === 'string') {
		if (isHexPrefixed(v)) {
			return hexToBytes(padToEven(stripHexPrefix(v)));
		}
		return utf8ToBytes(v);
	}
	if (typeof v === 'number' || typeof v === 'bigint') {
		if (!v) {
			return Uint8Array.from([]);
		}
		return hexToBytes(numberToHex(v));
	}
	// eslint-disable-next-line no-null/no-null
	if (v === null || v === undefined) {
		return Uint8Array.from([]);
	}
	throw new Error(`toBytes: received unsupported type ${typeof v}`);
};
