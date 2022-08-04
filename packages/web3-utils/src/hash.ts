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

import {
	InvalidStringError,
	InvalidTypeError,
	InvalidBooleanError,
	InvalidAddressError,
	InvalidSizeError,
	InvalidLargeValueError,
	InvalidUnsignedIntegerError,
	InvalidBytesError,
} from 'web3-errors';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { isAddress, isHexStrict, isNullish } from 'web3-validator';
import { Numbers, TypedObject, TypedObjectAbbreviated, EncodingTypes, Bytes } from 'web3-types';
import { leftPad, rightPad, toTwosComplement } from './string_manipulation';
import { utf8ToHex, hexToBytes, toNumber, bytesToHex, bytesToBuffer } from './converters';

const SHA3_EMPTY_BYTES = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';

/**
 * computes the Keccak-256 hash of the input and returns a hexstring
 */
export const sha3 = (data: Bytes): string | undefined => {
	const updatedData = typeof data === 'string' && isHexStrict(data) ? hexToBytes(data) : data;

	const hash = bytesToHex(keccak256(Buffer.from(updatedData as Buffer)));

	// EIP-1052 if hash is equal to c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470, keccak was given empty data
	return hash === SHA3_EMPTY_BYTES ? undefined : hash;
};

/**
 *Will calculate the sha3 of the input but does return the hash value instead of null if for example a empty string is passed.
 */
export const sha3Raw = (data: Bytes): string => {
	const hash = sha3(data);
	if (isNullish(hash)) {
		return SHA3_EMPTY_BYTES;
	}

	return hash;
};

/**
 * A wrapper for ethereum-cryptography/keccak256 to allow hashing a `string` and a `bigint` in addition to `UInt8Array`
 */
export const keccak256Wrapper = (
	data: Bytes | Numbers | string | ReadonlyArray<number>,
): string => {
	let processedData;
	if (typeof data === 'bigint' || typeof data === 'number') {
		processedData = data.toString();
	} else if (typeof data === 'string' && isHexStrict(data)) {
		processedData = bytesToBuffer(data);
	} else {
		processedData = data as Uint8Array | readonly number[];
	}

	return bytesToHex(keccak256(Buffer.from(processedData)));
};

export { keccak256Wrapper as keccak256 };

/**
 * returns type and value
 */
const getType = (arg: TypedObject | TypedObjectAbbreviated | Numbers): [string, EncodingTypes] => {
	if (
		typeof arg === 'object' &&
		('t' in arg || 'type' in arg) &&
		('v' in arg || 'value' in arg)
	) {
		const type1 = 't' in arg ? arg.t : arg.type;
		const val = 'v' in arg ? arg.v : arg.value;
		return [type1, val];
	}
	throw new InvalidTypeError(arg);
};

/**
 * returns the type with size if uint or int
 */
const elementaryName = (name: string): string => {
	if (name.startsWith('int[')) {
		return `int256${name.slice(3)}`;
	}
	if (name === 'int') {
		return 'int256';
	}
	if (name.startsWith('uint[')) {
		return `uint256'${name.slice(4)}`;
	}
	if (name === 'uint') {
		return 'uint256';
	}
	return name;
};

/**
 * returns the size of the value of type 'byte'
 */
const parseTypeN = (value: string, typeLength: number): number => {
	const typesize = /^(\d+).*$/.exec(value.slice(typeLength));
	return typesize ? parseInt(typesize[1], 10) : 0;
};

/**
 * returns the bit length of the value
 */
const bitLength = (value: bigint | number): number => {
	const updatedVal = value.toString(2);
	return updatedVal.length;
};

/**
 * Pads the value based on size and type
 * returns a string of the padded value
 */
const solidityPack = (type: string, val: EncodingTypes): string => {
	const value = val.toString();
	if (type === 'string') {
		if (typeof val === 'string') return utf8ToHex(val);
		throw new InvalidStringError(val);
	}
	if (type === 'bool' || type === 'boolean') {
		if (typeof val === 'boolean') return val ? '01' : '00';
		throw new InvalidBooleanError(val);
	}

	if (type === 'address') {
		if (!isAddress(value)) {
			throw new InvalidAddressError(value);
		}
		return value;
	}
	const name = elementaryName(type);
	if (type.startsWith('uint')) {
		const size = parseTypeN(name, 'uint'.length);

		if (size % 8 || size < 8 || size > 256) {
			throw new InvalidSizeError(value);
		}
		const num = toNumber(value);
		if (bitLength(num) > size) {
			throw new InvalidLargeValueError(value);
		}
		if (num < BigInt(0)) {
			throw new InvalidUnsignedIntegerError(value);
		}

		return size ? leftPad(num.toString(16), (size / 8) * 2) : num.toString(16);
	}

	if (type.startsWith('int')) {
		const size = parseTypeN(name, 'int'.length);
		if (size % 8 || size < 8 || size > 256) {
			throw new InvalidSizeError(type);
		}

		const num = toNumber(value);
		if (bitLength(num) > size) {
			throw new InvalidLargeValueError(value);
		}
		if (num < BigInt(0)) {
			return toTwosComplement(num.toString(), (size / 8) * 2);
		}
		return size ? leftPad(num.toString(16), size / 4) : num.toString(16);
	}

	if (name === 'bytes') {
		if (value.replace(/^0x/i, '').length % 2 !== 0) {
			throw new InvalidBytesError(value);
		}
		return value;
	}

	if (type.startsWith('bytes')) {
		if (value.replace(/^0x/i, '').length % 2 !== 0) {
			throw new InvalidBytesError(value);
		}

		const size = parseTypeN(type, 'bytes'.length);

		if (!size || size < 1 || size > 64 || size < value.replace(/^0x/i, '').length / 2) {
			throw new InvalidBytesError(value);
		}

		return rightPad(value, size * 2);
	}
	return '';
};

/**
 * returns a string of the tightly packed value given based on the type
 */
export const processSolidityEncodePackedArgs = (
	arg: TypedObject | TypedObjectAbbreviated | Numbers,
): string => {
	const [type, val] = getType(arg);

	// array case
	if (Array.isArray(val)) {
		// go through each element of the array and use map function to create new hexarg list
		const hexArg = val.map((v: Numbers | boolean) => solidityPack(type, v).replace('0x', ''));
		return hexArg.join('');
	}

	const hexArg = solidityPack(type, val);
	return hexArg.replace('0x', '');
};

/**
 * Encode packed arguments to a hexstring
 */
export const encodePacked = (...values: TypedObject[] | TypedObjectAbbreviated[]): string => {
	const args = Array.prototype.slice.call(values);

	const hexArgs = args.map(processSolidityEncodePackedArgs);

	return `0x${hexArgs.join('').toLowerCase()}`;
};

/**
 * Will tightly pack values given in the same way solidity would then hash.
 * returns a hash string, or null if input is empty
 */
export const soliditySha3 = (
	...values: TypedObject[] | TypedObjectAbbreviated[]
): string | undefined => sha3(encodePacked(...values));

/**
 * Will tightly pack values given in the same way solidity would then hash.
 * returns a hash string, if input is empty will return `0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470`
 */
export const soliditySha3Raw = (...values: TypedObject[] | TypedObjectAbbreviated[]): string =>
	sha3Raw(encodePacked(...values));

/**
 * Get slot number for storage long string in contract. Basically for getStorage method
 * returns slotNumber where will data placed
 */
export const getStorageSlotNumForLongString = (mainSlotNumber: number | string) =>
	sha3(
		`0x${(typeof mainSlotNumber === 'number'
			? mainSlotNumber.toString()
			: mainSlotNumber
		).padStart(64, '0')}`,
	);
