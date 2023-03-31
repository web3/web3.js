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

import { NestedUint8Array } from '../common/types';
import { bytesToHex, concatBytes, encodeLength, Input, parseHexByte, toBytes } from './utils';

export interface Decoded {
	data: Uint8Array | NestedUint8Array;
	remainder: Uint8Array;
}

/**
 * RLP Encoding based on https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/
 * This function takes in data, converts it to Uint8Array if not,
 * and adds a length for recursion.
 * @param input Will be converted to Uint8Array
 * @returns Uint8Array of encoded data
 * */
const encode = (input: Input): Uint8Array => {
	if (Array.isArray(input)) {
		const output: Uint8Array[] = [];
		let outputLength = 0;
		// eslint-disable-next-line @typescript-eslint/prefer-for-of
		for (let i = 0; i < input.length; i += 1) {
			const encoded = encode(input[i]);
			output.push(encoded);
			outputLength += encoded.length;
		}
		return concatBytes(encodeLength(outputLength, 192), ...output);
	}
	const inputBuf = toBytes(input);
	if (inputBuf.length === 1 && inputBuf[0] < 128) {
		return inputBuf;
	}
	return concatBytes(encodeLength(inputBuf.length, 128), inputBuf);
};

/**
 * Slices a Uint8Array, throws if the slice goes out-of-bounds of the Uint8Array.
 * E.g. `safeSlice(hexToBytes('aa'), 1, 2)` will throw.
 * @param input
 * @param start
 * @param end
 */
const safeSlice = (input: Uint8Array, start: number, end: number) => {
	if (end > input.length) {
		throw new Error('invalid RLP (safeSlice): end slice of Uint8Array out-of-bounds');
	}
	return input.slice(start, end);
};

/**
 * Parse integers. Check if there is no leading zeros
 * @param v The value to parse
 */
const decodeLength = (v: Uint8Array): number => {
	if (v[0] === 0) {
		throw new Error('invalid RLP: extra zeros');
	}
	return parseHexByte(bytesToHex(v));
};

/**
 * RLP Decoding based on https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/
 * @param input Will be converted to Uint8Array
 * @param stream Is the input a stream (false by default)
 * @returns decoded Array of Uint8Arrays containing the original message
 * */
function decode(input: Input, stream?: false): Uint8Array | NestedUint8Array;
function decode(input: Input, stream?: true): Decoded;
function decode(input: Input, stream = false): Uint8Array | NestedUint8Array | Decoded {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,  @typescript-eslint/no-unsafe-member-access, no-null/no-null
	if (typeof input === 'undefined' || input === null || (input as any).length === 0) {
		return Uint8Array.from([]);
	}

	// eslint-disable-next-line no-use-before-define
	const inputBytes = toBytes(input);
	// eslint-disable-next-line no-use-before-define
	const decoded = _decode(inputBytes);

	if (stream) {
		return decoded;
	}
	if (decoded.remainder.length !== 0) {
		throw new Error('invalid RLP: remainder must be zero');
	}

	return decoded.data;
}

/** Decode an input with RLP */
const _decode = (input: Uint8Array): Decoded => {
	let length: number;
	let llength: number;
	let data: Uint8Array;
	let innerRemainder: Uint8Array;
	let d: Decoded;
	const decoded = [];
	const firstByte = input[0];

	if (firstByte <= 0x7f) {
		// a single byte whose value is in the [0x00, 0x7f] range, that byte is its own RLP encoding.
		return {
			data: input.slice(0, 1),
			remainder: input.slice(1),
		};
	}
	if (firstByte <= 0xb7) {
		// string is 0-55 bytes long. A single byte with value 0x80 plus the length of the string followed by the string
		// The range of the first byte is [0x80, 0xb7]
		length = firstByte - 0x7f;

		// set 0x80 null to 0
		if (firstByte === 0x80) {
			data = Uint8Array.from([]);
		} else {
			data = safeSlice(input, 1, length);
		}

		if (length === 2 && data[0] < 0x80) {
			throw new Error(
				'invalid RLP encoding: invalid prefix, single byte < 0x80 are not prefixed',
			);
		}

		return {
			data,
			remainder: input.slice(length),
		};
	}
	if (firstByte <= 0xbf) {
		// string is greater than 55 bytes long. A single byte with the value (0xb7 plus the length of the length),
		// followed by the length, followed by the string
		llength = firstByte - 0xb6;
		if (input.length - 1 < llength) {
			throw new Error('invalid RLP: not enough bytes for string length');
		}
		length = decodeLength(safeSlice(input, 1, llength));
		if (length <= 55) {
			throw new Error('invalid RLP: expected string length to be greater than 55');
		}
		data = safeSlice(input, llength, length + llength);

		return {
			data,
			remainder: input.slice(length + llength),
		};
	}
	if (firstByte <= 0xf7) {
		// a list between 0-55 bytes long
		length = firstByte - 0xbf;
		innerRemainder = safeSlice(input, 1, length);
		while (innerRemainder.length) {
			d = _decode(innerRemainder);
			decoded.push(d.data);
			innerRemainder = d.remainder;
		}

		return {
			data: decoded,
			remainder: input.slice(length),
		};
	}
	// a list over 55 bytes long
	llength = firstByte - 0xf6;
	length = decodeLength(safeSlice(input, 1, llength));
	if (length < 56) {
		throw new Error('invalid RLP: encoded list too short');
	}
	const totalLength = llength + length;
	if (totalLength > input.length) {
		throw new Error('invalid RLP: total length is larger than the data');
	}

	innerRemainder = safeSlice(input, llength, totalLength);

	while (innerRemainder.length) {
		d = _decode(innerRemainder);
		decoded.push(d.data);
		innerRemainder = d.remainder;
	}

	return {
		data: decoded,
		remainder: input.slice(totalLength),
	};
};

export const RLP = { encode, decode };
