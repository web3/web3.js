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

import { validator, isAddress, isHexStrict, utils as validatorUtils } from 'web3-validator';
import { keccak256 } from 'ethereum-cryptography/keccak';

import {
	HexProcessingError,
	InvalidAddressError,
	InvalidBytesError,
	InvalidUnitError,
	InvalidTypeAbiInputError,
	InvalidNumberError,
} from './errors';
import {
	Address,
	Bytes,
	HexString,
	Numbers,
	ValueTypes,
	JsonFunctionInterface,
	JsonEventInterface,
	Components,
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

export const bytesToBuffer = (data: Bytes): Buffer | never => {
	validator.validate(['bytes'], [data]);

	if (Buffer.isBuffer(data)) {
		return data;
	}

	if (data instanceof Uint8Array || Array.isArray(data)) {
		return Buffer.from(data);
	}

	if (typeof data === 'string' && isHexStrict(data)) {
		return Buffer.from(data.slice(2), 'hex');
	}

	if (typeof data === 'string' && !isHexStrict(data)) {
		return Buffer.from(data, 'hex');
	}

	throw new InvalidBytesError(data);
};

/** @internal */
const bufferToHexString = (data: Buffer) => `0x${data.toString('hex')}`;

/**
 * Convert a byte array to a hex string
 */
export const bytesToHex = (bytes: Bytes): HexString => bufferToHexString(bytesToBuffer(bytes));

/**
 * Convert a hex string to a byte array
 */
export const hexToBytes = (bytes: HexString): Buffer => bytesToBuffer(bytes);

/**
 * Converts value to it's number representation
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
 */
export const numberToHex = (value: Numbers): HexString => {
	validator.validate(['int'], [value]);

	// To avoid duplicate code and circular dependency we will
	// use `numberToHex` implementation from `web3-validator`
	return validatorUtils.numberToHex(value);
};
/**
 * Converts value to it's hex representation @alias `numberToHex`
 */
export const fromDecimal = numberToHex;

/**
 * Converts value to it's decimal representation in string
 */
export const hexToNumberString = (data: HexString): string => hexToNumber(data).toString();

/**
 * Should be called to get hex representation (prefixed by 0x) of utf8 string
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
 * @alias `utf8ToHex`
 */

export const fromUtf8 = utf8ToHex;
/**
 * @alias `utf8ToHex`
 */
export const stringToHex = utf8ToHex;

/**
 * Should be called to get utf8 from it's hex representation
 */
export const hexToUtf8 = (str: HexString): string => bytesToBuffer(str).toString('utf8');

/**
 * @alias `hexToUtf8`
 */
export const toUtf8 = hexToUtf8;

/**
 * @alias `hexToUtf8`
 */
export const hexToString = hexToUtf8;

/**
 * Should be called to get hex representation (prefixed by 0x) of ascii string
 */
export const asciiToHex = (str: string): HexString => {
	validator.validate(['string'], [str]);

	return `0x${Buffer.from(str, 'ascii').toString('hex')}`;
};

/**
 * @alias `asciiToHex`
 */
export const fromAscii = asciiToHex;

/**
 * Should be called to get ascii from it's hex representation
 */
export const hexToAscii = (str: HexString): string => bytesToBuffer(str).toString('ascii');

/**
 * @alias `hexToAscii`
 */
export const toAscii = hexToAscii;

/**
 * Auto converts any given value into it's hex representation.
 */
export const toHex = (
	value: Numbers | Bytes | Address | boolean,
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
 * Auto converts any given value into it's hex representation,
 * then converts hex to number.
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

	return hexToNumber(numberToHex(value));
};

/**
 * Auto converts any given value into it's bigint representation
 */
export const toBigInt = (value: unknown): bigint => {
	if (typeof value === 'number') {
		return BigInt(value);
	}

	if (typeof value === 'bigint') {
		return value;
	}

	if (typeof value === 'string' && !isHexStrict(value)) {
		return BigInt(value);
	}

	if (typeof value === 'string' && isHexStrict(value)) {
		return BigInt(hexToNumber(value));
	}

	throw new InvalidNumberError(value);
};

/**
 * Takes a number of wei and converts it to any other ether unit.
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
 */
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

export const toChecksumAddress = (address: Address): string => {
	if (!isAddress(address, false)) {
		throw new InvalidAddressError(address);
	}

	const lowerCaseAddress = address.toLowerCase().replace(/^0x/i, '');

	const hash = bytesToHex(keccak256(Buffer.from(lowerCaseAddress)));

	if (
		hash === null ||
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
 *  used to flatten json abi inputs/outputs into an array of type-representing-strings
 */
export const flattenTypes = (includeTuple: boolean, puts: Components[]): string[] => {
	const types: string[] = [];

	puts.forEach(param => {
		if (typeof param.components === 'object') {
			if (!param.type.startsWith('tuple')) {
				throw new InvalidTypeAbiInputError(param.type);
			}
			const arrayBracket = param.type.indexOf('[');
			const suffix = arrayBracket >= 0 ? param.type.substring(arrayBracket) : '';
			const result = flattenTypes(includeTuple, param.components);

			if (Array.isArray(result) && includeTuple) {
				types.push(`tuple(${result.join(',')})${suffix}`);
			} else if (!includeTuple) {
				types.push(`(${result.join(',')})${suffix}`);
			} else {
				types.push(`(${result.join()})`);
			}
		} else {
			types.push(param.type);
		}
	});

	return types;
};

/**
 * Should be used to create full function/event name from json abi
 * returns a string
 */
export const jsonInterfaceMethodToString = (
	json: JsonFunctionInterface | JsonEventInterface,
): string => {
	if (json.name.includes('(')) {
		return json.name;
	}

	return `${json.name}(${flattenTypes(false, json.inputs).join(',')})`;
};
