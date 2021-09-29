import { sha3 } from './hash';
import { Address, Bytes, HexString, Numbers, ValueTypes } from './types';
import { isAddress, isHexStrict } from './validation';

// Ref: https://ethdocs.org/en/latest/ether.html
/** @internal */
const ethUnitMap = {
	noether: '0',
	wei: '1',
	kwei: '1000',
	Kwei: '1000',
	babbage: '1000',
	femtoether: '1000',
	mwei: '1000000',
	Mwei: '1000000',
	lovelace: '1000000',
	picoether: '1000000',
	gwei: '1000000000',
	Gwei: '1000000000',
	shannon: '1000000000',
	nanoether: '1000000000',
	nano: '1000000000',
	szabo: '1000000000000',
	microether: '1000000000000',
	micro: '1000000000000',
	finney: '1000000000000000',
	milliether: '1000000000000000',
	milli: '1000000000000000',
	ether: '1000000000000000000',
	kether: '1000000000000000000000',
	grand: '1000000000000000000000',
	mether: '1000000000000000000000000',
	gether: '1000000000000000000000000000',
	tether: '1000000000000000000000000000000',
};

export type EtherUnits = keyof typeof ethUnitMap;

/** @internal */
export const MAX_UINT64 = BigInt('18446744073709551615'); // BigInt((2 ** 64) - 1) - 1

/** @internal */
const bytesToBuffer = (data: Bytes): Buffer | never => {
	if (Buffer.isBuffer(data)) {
		return data;
	}

	if (Array.isArray(data)) {
		return Buffer.from(data);
	}

	if (typeof data === 'string' && !isHexStrict(data)) {
		throw new Error(`The parameter "${data}" must be a valid HEX string.`);
	}

	if (typeof data === 'string' && (data.startsWith('0x') || data.startsWith('0X'))) {
		return Buffer.from(data.substr(2), 'hex');
	}

	throw new Error(`Invalid byte data format for "${data.toString()}"`);
};

/** @internal */
const bufferToHexString = (data: Buffer) => `0x${data.toString('hex')}`;

/**
 * Convert a byte array to a hex string
 */
export const bytesToHex = (bytes: Bytes): string => bufferToHexString(bytesToBuffer(bytes));

/**
 * Convert a hex string to a byte array
 */
export const hexToBytes = (bytes: string): Buffer => bytesToBuffer(bytes);

/**
 * Converts value to it's number representation
 */
export const hexToNumber = (value: HexString): bigint | number => {
	if (!isHexStrict(value)) {
		throw new Error(`Given input "${value}" is not a number.`);
	}

	const [negative, hexValue] = value.startsWith('-') ? [true, value.substr(1)] : [false, value];
	const num = Number(hexValue);

	if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
		return negative ? BigInt(-1) * BigInt(num) : BigInt(num);
	}

	return negative ? -1 * num : num;
};

/**
 * Converts value to it's number representation @alias `hexToNumber`
 */
export const toDecimal = hexToNumber;

/**
 * Converts value to it's hex representation
 */
export const numberToHex = (value: Numbers): HexString => {
	if (!Number.isFinite(value)) {
		throw new Error(`Given input "${value}" is not a number.`);
	}

	if (typeof value === 'string' && !isHexStrict(value)) {
		throw new Error(`Given input "${value}" is not a number.`);
	}

	if (typeof value === 'number' || (typeof value === 'bigint' && value < 0)) {
		return `-0x${value.toString(16)}`;
	}

	if (typeof value === 'number' || (typeof value === 'bigint' && value >= 0)) {
		return `0x${value.toString(16)}`;
	}

	if (typeof value === 'string') {
		const num = hexToNumber(value);

		return num >= 0 ? `0x${num.toString(16)}` : `-0x${num.toString(16).substr(1)}`;
	}

	throw new Error('Can not parse number to hex');
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
export const utf8ToHex = (str: string): HexString =>
	`0x${Buffer.from(str, 'utf8').toString('hex')}`;

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
export const asciiToHex = (str: string): HexString =>
	`0x${Buffer.from(str, 'ascii').toString('hex')}`;

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

		if (value.startsWith('0x') || value.startsWith('0X')) {
			return returnType ? 'bytes' : value;
		}

		if (!Number.isFinite(value)) {
			return returnType ? 'string' : utf8ToHex(value);
		}
	}

	throw new Error(`Given input "${value.toString()}" can not be converted to hex.`);
};

/**
 * Auto converts any given value into it's hex representation,
 * then converts hex to number.
 */
export const toNumber = (value: Numbers): number | bigint => {
	if (typeof value === 'number' || typeof value === 'bigint') {
		return value;
	}

	return hexToNumber(toHex(value));
};

/**
 * Takes a number of wei and converts it to any other ether unit.
 */
export const fromWei = (number: Numbers, unit: EtherUnits): string => {
	if (!['number', 'bigint', 'string'].includes(typeof number)) {
		throw new Error('Please pass numbers as strings/number/bigint to avoid precision errors.');
	}

	if (
		typeof number === 'string' ||
		(typeof number === 'number' && (number.toString().split('.')[1] || '').length > 0)
	) {
		throw new Error('Wei value should not have decimal points');
	}

	const denomination = BigInt(ethUnitMap[unit]);
	const weiAmount = BigInt(toNumber(number));

	if (weiAmount > MAX_UINT64) {
		throw new Error('wei amount out of range');
	}

	const int = (weiAmount / denomination).toString();
	const fraction = BigInt(weiAmount % denomination) / denomination;

	const floatingPointsSplit = fraction
		.toLocaleString('en-US', {
			maximumFractionDigits: ethUnitMap[unit]
				.length as BigIntToLocaleStringOptions['maximumFractionDigits'],
		})
		.split('.')[1];

	return fraction !== BigInt(0) ? `${int}.${floatingPointsSplit}` : int;
};

/**
 * Takes a number of a unit and converts it to wei.
 */
export const toWei = (number: Numbers, unit: EtherUnits): string => {
	if (!['number', 'bigint', 'string'].includes(typeof number)) {
		throw new Error('Please pass numbers as strings/number/bigint to avoid precision errors.');
	}

	if (
		typeof number === 'string' ||
		(typeof number === 'number' &&
			(number.toString().split('.')[1] || '').length > ethUnitMap[unit].length)
	) {
		throw new Error(`Amount has too many decimal points for "${unit} unit."`);
	}

	const amount = number.toString();
	const denomination = BigInt(ethUnitMap[unit]);
	const splitAmount = amount.split('.');
	const intAmount = BigInt(splitAmount[0]);
	const fraction = BigInt((splitAmount[1] ?? '0').padEnd(ethUnitMap[unit].length, '0'));
	const fullAmount = intAmount * denomination + fraction;

	if (fullAmount > MAX_UINT64) {
		throw new Error('Amount out of range');
	}

	return fullAmount.toString();
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
