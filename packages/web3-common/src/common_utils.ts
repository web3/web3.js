import { keccak256 } from 'ethereum-cryptography/keccak';
import { validator, isHexStrict, utils as validatorUtils, isAddress } from 'web3-validator';
import { InvalidAddressError, InvalidBytesError, InvalidNumberError } from './errors';
import { Address, Bytes, HexString, Numbers } from './types';

const SHA3_EMPTY_BYTES = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';

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
export const bufferToHexString = (data: Buffer) => `0x${data.toString('hex')}`;

/**
 * Convert a byte array to a hex string
 */
export const bytesToHex = (bytes: Bytes): HexString => bufferToHexString(bytesToBuffer(bytes));

export const isIterable = (item: unknown): item is Record<string, unknown> =>
	typeof item === 'object' && item !== null && !Array.isArray(item) && !Buffer.isBuffer(item);

// The following code is a derivative work of the code from the "LiskHQ/lisk-sdk" project,
// which is licensed under Apache version 2.
export const mergeDeep = (
	destination: Record<string, unknown>,
	...sources: Record<string, unknown>[]
): Record<string, unknown> => {
	const result = destination; // clone deep here
	if (!isIterable(result)) {
		return result;
	}
	for (const src of sources) {
		// eslint-disable-next-line no-restricted-syntax
		for (const key in src) {
			if (isIterable(src[key])) {
				if (!result[key]) {
					result[key] = {};
				}
				mergeDeep(
					result[key] as Record<string, unknown>,
					src[key] as Record<string, unknown>,
				);
			} else if (src[key] !== undefined && src[key] !== null) {
				result[key] = src[key];
			}
		}
	}
	return result;
};

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
 * Converts value to it's number representation
 */
export const hexToNumber = (value: HexString): bigint | number => {
	validator.validate(['hex'], [value]);

	if (!isHexStrict(value)) {
		throw new Error('Invalid hex string');
	}

	const [negative, hexValue] = value.startsWith('-') ? [true, value.substr(1)] : [false, value];
	const num = BigInt(hexValue);

	if (num > Number.MAX_SAFE_INTEGER) {
		return negative ? -num : num;
	}

	return negative ? -1 * Number(num) : Number(num);
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
 * Converts value to it's decimal representation in string
 */
export const hexToNumberString = (data: HexString): string => hexToNumber(data).toString();

/**
 * Convert a hex string to a byte array
 */
export const hexToBytes = (bytes: HexString): Buffer => bytesToBuffer(bytes);

/**
 *
 * computes the Keccak-256 hash of the input and returns a hexstring
 */
export const sha3 = (data: Bytes): string | null => {
	const updatedData = typeof data === 'string' && isHexStrict(data) ? hexToBytes(data) : data;

	const hash = bytesToHex(keccak256(Buffer.from(updatedData as Buffer)));

	// EIP-1052 if hash is equal to c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470, keccak was given empty data
	return hash === SHA3_EMPTY_BYTES ? null : hash;
};

/**
 *Will calculate the sha3 of the input but does return the hash value instead of null if for example a empty string is passed.
 */
export const sha3Raw = (data: Bytes): string => {
	const hash = sha3(data);
	if (hash === null) {
		return SHA3_EMPTY_BYTES;
	}

	return hash;
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
 * Should be called to get utf8 from it's hex representation
 */
export const hexToUtf8 = (str: HexString): string => bytesToBuffer(str).toString('utf8');

/**
 * @alias `hexToUtf8`
 */
export const toUtf8 = hexToUtf8;

export const isDirectIBAN = (iban: string): boolean => iban.length === 34 || iban.length === 35;

export const mod9710 = (iban: string): number => {
	let remainder = iban;
	let block;

	while (remainder.length > 2) {
		block = remainder.slice(0, 9);
		remainder = `${(parseInt(block, 10) % 97).toString()}${remainder.slice(block.length)}`;
	}
	return parseInt(remainder, 10) % 97;
};

export const iso13616Prepare = (iban: string): string => {
	const A = 'A'.charCodeAt(0);
	const Z = 'Z'.charCodeAt(0);

	const upperIban = iban.toUpperCase();
	const modifiedIban = `${upperIban.slice(4)}${upperIban.slice(0, 4)}`;

	return modifiedIban
		.split('')
		.map(n => {
			const code = n.charCodeAt(0);
			if (code >= A && code <= Z) {
				// A = 10, B = 11, ... Z = 35
				return code - A + 10;
			}
			return n;
		})
		.join('');
};

export const isValidIBAN = (iban: string): boolean =>
	/^XE[0-9]{2}(ETH[0-9A-Z]{13}|[0-9A-Z]{30,31})$/.test(iban) &&
	mod9710(iso13616Prepare(iban)) === 1;

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
 * return the bigint of the given string with the specified base
 */
export const parseIntValue = (str: string, base: number): bigint =>
	[...str].reduce((acc, curr) => BigInt(parseInt(curr, base)) + BigInt(base) * acc, 0n);

export const IBANtoAddress = (iban: string): HexString => {
	if (isDirectIBAN(iban)) {
		// check if Iban can be converted to an address
		const base36 = iban.slice(4);
		const parsedBigInt = parseIntValue(base36, 36); // convert the base36 string to a bigint
		const paddedBigInt = padLeft(parsedBigInt, 40);
		return toChecksumAddress(paddedBigInt);
	}
	throw new Error('Iban is indirect and cannot be converted. Must be length of 34 or 35');
};
