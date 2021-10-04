import { BigDecimal } from './big_decimal';
import { sha3 } from './hash';
import { Address, Bytes, HexString, Numbers, ValueTypes } from './types';
import { isAddress, isHexStrict } from './validation';

const base = BigInt(10);
const expo10 = (expo: number) => base ** BigInt(expo);

// Ref: https://ethdocs.org/en/latest/ether.html
/** @internal */
const ethUnitMap = {
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

const errorMessage = (value: unknown, error: string) =>
	`Invalid value given "${String(value)}". Error: ${error}.`;

export type EtherUnits = keyof typeof ethUnitMap;

/** @internal */
const bytesToBuffer = (data: Bytes): Buffer | never => {
	if (Buffer.isBuffer(data)) {
		return data;
	}

	if (data instanceof Uint8Array) {
		return Buffer.from(data);
	}

	if (Array.isArray(data)) {
		if (data.some(d => d < 0)) {
			throw new Error(errorMessage(data, 'contains negative values'));
		}

		if (data.some(d => d > 255)) {
			throw new Error(errorMessage(data, 'contains numbers greater than 255'));
		}

		if (data.some(d => !Number.isInteger(d))) {
			throw new Error(errorMessage(data, 'contains invalid integer values'));
		}

		return Buffer.from(data);
	}

	if (typeof data === 'string' && !isHexStrict(data)) {
		throw new Error(errorMessage(data, 'not valid hex string'));
	}

	if (typeof data === 'string' && (data.startsWith('0x') || data.startsWith('0X'))) {
		return Buffer.from(data.substr(2), 'hex');
	}

	throw new Error(errorMessage(data, 'can not parse as byte data'));
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
	if (!isHexStrict(value)) {
		throw new Error(errorMessage(value, 'not valid hex string'));
	}

	const [negative, hexValue] = value.startsWith('-') ? [true, value.substr(1)] : [false, value];
	const num = BigInt(hexValue);

	if (num > BigInt(Number.MAX_SAFE_INTEGER) || num < BigInt(Number.MIN_SAFE_INTEGER)) {
		return negative ? BigInt(-1) * BigInt(num) : BigInt(num);
	}

	return negative ? -1 * Number(num) : Number(num);
};

/**
 * Converts value to it's number representation @alias `hexToNumber`
 */
export const toDecimal = hexToNumber;

/**
 * Converts value to it's hex representation
 */
export const numberToHex = (value: Numbers): HexString => {
	try {
		if (typeof value === 'number' && !Number.isFinite(value)) {
			throw new Error(errorMessage(value, 'contains invalid integer values'));
		}

		if ((typeof value === 'number' || typeof value === 'bigint') && BigInt(value) < BigInt(0)) {
			return `-0x${value.toString(16).substr(1)}`;
		}

		if (
			(typeof value === 'number' || typeof value === 'bigint') &&
			BigInt(value) >= BigInt(0)
		) {
			return `0x${value.toString(16)}`;
		}

		if (typeof value === 'string' && isHexStrict(value)) {
			return numberToHex(hexToNumber(value));
		}

		if (typeof value === 'string' && !isHexStrict(value)) {
			return numberToHex(BigInt(value));
		}
	} catch {
		throw new Error(errorMessage(value, 'not a valid integer'));
	}

	throw new Error(errorMessage(value, 'not a valid integer'));
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
	if (typeof str !== 'string') {
		throw new Error(errorMessage(str, 'not a valid string'));
	}

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
	if (typeof str !== 'string') {
		throw new Error(errorMessage(str, 'not a valid string'));
	}

	return `0x${Buffer.from(str, 'ascii').toString('hex')}`;
};

/**
 * @alias `asciiToHex`
 */
export const fromAscii = utf8ToHex;

/**
 * Should be called to get ascii from it's hex representation
 */
export const hexToAscii = (str: HexString): string => bytesToBuffer(str).toString('ascii');

/**
 * @alias `hexToAscii`
 */
export const toAscii = hexToUtf8;

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

	throw new Error(errorMessage(value, 'can not be converted to hex'));
};

/**
 * Auto converts any given value into it's hex representation,
 * then converts hex to number.
 */
export const toNumber = (value: Numbers): number | bigint => {
	if (typeof value === 'number' || typeof value === 'bigint') {
		return value;
	}

	return hexToNumber(numberToHex(value));
};

/**
 * Takes a number of wei and converts it to any other ether unit.
 */
export const fromWei = (number: Numbers, unit: EtherUnits): string => {
	const denomination = ethUnitMap[unit];

	if (!denomination) {
		throw new Error(errorMessage(unit, 'invalid unit'));
	}

	const weiAmount = BigInt(toNumber(number));

	return new BigDecimal(weiAmount).divide(new BigDecimal(denomination)).toString();
};

/**
 * Takes a number of a unit and converts it to wei.
 */
export const toWei = (number: Numbers, unit: EtherUnits): string => {
	const denomination = ethUnitMap[unit];

	if (!denomination) {
		throw new Error(errorMessage(unit, 'invalid unit'));
	}

	let amount: BigDecimal;

	if (typeof number === 'string') {
		amount = new BigDecimal(number);
	} else {
		amount = new BigDecimal(BigInt(toNumber(number)));
	}

	return amount.mul(new BigDecimal(denomination)).toString();
};

export const toChecksumAddress = (address: Address): string => {
	if (typeof address === 'undefined') return '';

	if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
		throw new Error(`Given address "${address}" is not a valid Ethereum address.`);
	}

	const lowerCaseAddress = address.toLowerCase().replace(/^0x/i, '');
	const addressHash = sha3(lowerCaseAddress).replace(/^0x/i, '');
	let checksumAddress = '0x';

	for (let i = 0; i < address.length; i += 1) {
		// If ith character is 8 to f then make it uppercase
		if (parseInt(addressHash[i], 16) > 7) {
			checksumAddress += address[i].toUpperCase();
		} else {
			checksumAddress += address[i];
		}
	}
	return checksumAddress;
};
