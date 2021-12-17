/* eslint-disable no-bitwise */
import { keccak256 } from 'ethereum-cryptography/keccak';
import {
	HighValueIntegerInByteArrayError,
	InvalidBytesError,
	InvalidHexStringError,
	InvalidIntegerError,
	InvalidIntegerInByteArrayError,
	InvalidNumberError,
	NegativeIntegersInByteArrayError,
	InvalidStringError,
	InvalidBloomError,
	InvalidBlockError,
	InvalidTopicError,
	InvalidCharCodeError,
	InvalidAddressError,
	InvalidBlockNumberOrTagError,
	InvalidFilterError,
	InvalidBooleanError,
} from './errors';
import { BlockNumberOrTag, Bytes, HexString, Numbers, BlockTags, Filter, Uint } from './types';

export const isHexStrict = (hex: unknown) =>
	typeof hex === 'string' && /^(-)?0x[0-9a-f]*$/i.test(hex);

/**
 * returns true if input is a hexstring, number or bigint
 */
export const isHex = (hex: Numbers): boolean =>
	typeof hex === 'number' ||
	typeof hex === 'bigint' ||
	(typeof hex === 'string' && /^(-0x|0x)?[0-9a-f]*$/i.test(hex));

/**
 * throws InvalidHexStringError if input is not a hexstring
 */
export const validateHexStringInput = (data: HexString) => {
	if (!isHexStrict(data)) {
		throw new InvalidHexStringError(data);
	}
};

/**
 * checks for valid byte array or hexstring otherwise throws error
 */
export const validateBytesInput = (data: Bytes) => {
	if (Array.isArray(data)) {
		if (data.some(d => d < 0)) {
			throw new NegativeIntegersInByteArrayError(data);
		}

		if (data.some(d => d > 255)) {
			throw new HighValueIntegerInByteArrayError(data);
		}

		if (data.some(d => !Number.isInteger(d))) {
			throw new InvalidIntegerInByteArrayError(data);
		}
	}

	// Byte data string must be prefixed with `0x`
	if (typeof data === 'string') {
		validateHexStringInput(data);
	}

	// Hex string can prefixed with `-0x` but not valid for bytes
	if (typeof data === 'string' && data.startsWith('-')) {
		throw new InvalidBytesError(data);
	}
};

/**
 * checks input for valid number otherwise throws error
 */
export const validateNumbersInput = (
	data: Numbers,
	{ onlyIntegers }: { onlyIntegers: boolean },
) => {
	if (!['number', 'string', 'bigint'].includes(typeof data)) {
		throw onlyIntegers ? new InvalidIntegerError(data) : new InvalidNumberError(data);
	}

	if (typeof data === 'number' && !Number.isFinite(data)) {
		throw new InvalidIntegerError(data);
	}

	// If these are full integer values given as 'number'
	if (typeof data === 'number' && Math.floor(data) !== data) {
		throw new InvalidIntegerError(data);
	}

	// If its not a hex string, then it must contain a decimal point.
	if (
		typeof data === 'string' &&
		onlyIntegers &&
		!isHexStrict(data) &&
		!/^(-)?[0-9]*$/i.test(data)
	) {
		throw new InvalidIntegerError(data);
	}

	if (
		typeof data === 'string' &&
		!onlyIntegers &&
		!isHexStrict(data) &&
		!/^[0-9]\d*(\.\d+)?$/i.test(data)
	) {
		throw new InvalidNumberError(data);
	}
};

/**
 * checks input if typeof data is valid string input
 */
export const isValidString = (data: unknown) => typeof data === 'string';

/**
 * checks input if typeof data is valid buffer input
 */
export const isBuffer = (data: unknown) => Buffer.isBuffer(data);

/**
 * checks input for valid string, otherwise throws error
 */
export const validateStringInput = (data: string) => {
	if (typeof data !== 'string') {
		throw new InvalidStringError(data);
	}
};

/**
 * Compares between block A and block B
 * Returns -1 if a < b, returns 1 if a > b and returns 0 if a == b
 */
export const compareBlockNumbers = (blockA: Numbers, blockB: Numbers) => {
	// string validation
	if (
		typeof blockA === 'string' &&
		!(
			blockA === 'genesis' ||
			blockA === 'earliest' ||
			blockA === 'pending' ||
			blockA === 'latest'
		)
	)
		throw new InvalidBlockError(blockA);
	if (
		typeof blockB === 'string' &&
		!(
			blockB === 'genesis' ||
			blockB === 'earliest' ||
			blockB === 'pending' ||
			blockB === 'latest'
		)
	)
		throw new InvalidBlockError(blockB);
	if (
		blockA === blockB ||
		((blockA === 'genesis' || blockA === 'earliest' || blockA === 0) &&
			(blockB === 'genesis' || blockB === 'earliest' || blockB === 0))
	)
		return 0;

	// b !== a, thus a < b
	if (blockA === 'genesis' || blockA === 'earliest') return -1;

	// b !== a, thus a > b
	if (blockB === 'genesis' || blockB === 'earliest') return 1;

	if (blockA === 'latest') {
		if (blockB === 'pending') {
			return -1;
		} // b !== ("pending" OR "latest"), thus a > b
		return 1;
	}
	if (blockB === 'latest') {
		if (blockA === 'pending') {
			return 1;
		}
		// b !== ("pending" OR "latest"), thus a > b
		return -1;
	}
	if (blockA === 'pending') {
		// b (== OR <) "latest", thus a > b
		return 1;
	}
	if (blockB === 'pending') {
		return -1;
	}
	const bigIntA = BigInt(blockA);
	const bigIntB = BigInt(blockB);
	if (bigIntA < bigIntB) {
		return -1;
	}
	if (bigIntA === bigIntB) {
		return 0;
	}
	return 1;
};

/**
 * Checks the checksum of a given address. Will also return false on non-checksum addresses.
 */
export const checkAddressCheckSum = (data: string): boolean => {
	if (!/^(0x)?[0-9a-f]{40}$/i.test(data)) return false;
	const address = data.substr(2);
	const updatedData = Buffer.from(address.toLowerCase(), 'utf-8');

	const addressHash = Buffer.from(keccak256(updatedData) as Buffer)
		.toString('hex')
		.replace(/^0x/i, '');

	for (let i = 0; i < 40; i += 1) {
		// the nth letter should be uppercase if the nth digit of casemap is 1
		if (
			(parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
			(parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])
		) {
			return false;
		}
	}
	return true;
};

/**
 * Checks if a given string is a valid Ethereum address. It will also check the checksum, if the address has upper and lowercase letters.
 */
export const isAddress = (address: string, checkChecksum = true): boolean => {
	// check if it has the basic requirements of an address
	if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
		return false;
	}
	// If it's ALL lowercase or ALL upppercase
	if (/^(0x|0X)?[0-9a-f]{40}$/.test(address) || /^(0x|0X)?[0-9A-F]{40}$/.test(address)) {
		return true;
		// Otherwise check each case
	}
	return checkChecksum ? checkAddressCheckSum(address) : true;
};

export function validateAddress(address: string): void {
	if (!isAddress(address)) throw new InvalidAddressError(address);
}

/**
 * Checks if a given value is a valid big int
 */
export const isBigInt = (value: Numbers): boolean => typeof value === 'bigint';

/**
 * Returns true if the bloom is a valid bloom
 * https://github.com/joshstevens19/ethereum-bloom-filters/blob/fbeb47b70b46243c3963fe1c2988d7461ef17236/src/index.ts#L7
 */
export const isBloom = (bloom: string): boolean => {
	if (typeof bloom !== 'string') {
		return false;
	}

	if (!/^(0x)?[0-9a-f]{512}$/i.test(bloom)) {
		return false;
	}

	if (/^(0x)?[0-9a-f]{512}$/.test(bloom) || /^(0x)?[0-9A-F]{512}$/.test(bloom)) {
		return true;
	}

	return false;
};

/**
 * Code points to int
 */

const codePointToInt = (codePoint: number): number => {
	if (codePoint >= 48 && codePoint <= 57) {
		/* ['0'..'9'] -> [0..9] */
		return codePoint - 48;
	}

	if (codePoint >= 65 && codePoint <= 70) {
		/* ['A'..'F'] -> [10..15] */
		return codePoint - 55;
	}

	if (codePoint >= 97 && codePoint <= 102) {
		/* ['a'..'f'] -> [10..15] */
		return codePoint - 87;
	}
	throw new InvalidCharCodeError(codePoint);
};

/**
 * Returns true if the value is part of the given bloom
 * note: false positives are possible.
 */
export function isInBloom(bloom: string, value: string | Uint8Array): boolean {
	if (typeof value === 'string' && !isHexStrict(value)) throw new InvalidHexStringError(value);
	if (!isBloom(bloom)) throw new InvalidBloomError(bloom);

	const buffer = typeof value === 'string' ? Buffer.from(value.substr(2), 'hex') : value;

	const hash = Buffer.from(keccak256(buffer) as Buffer)
		.toString('hex')
		.replace(/^0x/i, '');

	for (let i = 0; i < 12; i += 4) {
		// calculate bit position in bloom filter that must be active
		const bitpos =
			((parseInt(hash.substr(i, 2), 16) << 8) + parseInt(hash.substr(i + 2, 2), 16)) & 2047;

		// test if bitpos in bloom is active
		const code = codePointToInt(bloom.charCodeAt(bloom.length - 1 - Math.floor(bitpos / 4)));

		const offset = 1 << bitpos % 4;

		if ((code & offset) !== offset) {
			return false;
		}
	}

	return true;
}

/**
 * Adding padding to string on the left
 */
const padLeft = (value: string, chars: number) => {
	const hasPrefix = /^0x/i.test(value) || typeof value === 'number';
	const updatedValue = value.toString().replace(/^0x/i, '');

	const padding = chars - updatedValue.length + 1 >= 0 ? chars - updatedValue.length + 1 : 0;

	return (hasPrefix ? '0x' : '') + new Array(padding).join('0') + updatedValue;
};

/**
 * Returns true if the ethereum users address is part of the given bloom note: false positives are possible.
 */
export function isUserEthereumAddressInBloom(bloom: string, ethereumAddress: string): boolean {
	if (!isBloom(bloom)) {
		throw new InvalidBloomError(bloom);
	}

	if (!isAddress(ethereumAddress)) {
		throw new InvalidAddressError(ethereumAddress);
	}

	// you have to pad the ethereum address to 32 bytes
	// else the bloom filter does not work
	// this is only if your matching the USERS
	// ethereum address. Contract address do not need this
	// hence why we have 2 methods
	// (0x is not in the 2nd parameter of padleft so 64 chars is fine)

	const address = padLeft(ethereumAddress, 64);

	return isInBloom(bloom, address);
}

/**
 * Returns true if the contract address is part of the given bloom.
 * note: false positives are possible.
 */
export function isContractAddressInBloom(bloom: string, contractAddress: string): boolean {
	if (!isBloom(bloom)) {
		throw new Error('Invalid bloom given');
	}

	if (!isAddress(contractAddress)) {
		throw new Error(`Invalid contract address given: "${contractAddress}"`);
	}

	return isInBloom(bloom, contractAddress);
}

/**
 * Checks if its a valid topic
 */
export function isTopic(topic: string): boolean {
	if (typeof topic !== 'string') {
		return false;
	}

	if (!/^(0x)?[0-9a-f]{64}$/i.test(topic)) {
		return false;
	}

	if (/^(0x)?[0-9a-f]{64}$/.test(topic) || /^(0x)?[0-9A-F]{64}$/.test(topic)) {
		return true;
	}

	return false;
}

/**
 * Returns true if the topic is part of the given bloom.
 * note: false positives are possible.
 */
export function isTopicInBloom(bloom: string, topic: string): boolean {
	if (!isBloom(bloom)) {
		throw new InvalidBlockError(bloom);
	}

	if (!isTopic(topic)) {
		throw new InvalidTopicError(topic);
	}

	return isInBloom(bloom, topic);
}

export const isBlockNumber = (value: Uint): boolean =>
	isHexStrict(value) && value.substr(0, 1) !== '-';

/**
 * Returns true if the given blockNumber is 'latest', 'pending', or 'earliest.
 */
export const isBlockTag = (value: string) =>
	BlockTags.LATEST === value || BlockTags.PENDING === value || BlockTags.EARLIEST === value;

/**
 * Returns true if given value is valid hex string and not negative, or is a valid BlockTag
 */
export const isBlockNumberOrTag = (value: BlockNumberOrTag) =>
	(isHexStrict(value) && !value.startsWith('-')) || isBlockTag(value);

export const validateBlockNumberOrTag = (value: BlockNumberOrTag) => {
	if (!isBlockNumberOrTag(value)) throw new InvalidBlockNumberOrTagError(value);
};

export const isHexString8Bytes = (value: unknown, prefixed = true) =>
	typeof value === 'string' &&
	(prefixed ? isHexStrict(value) && value.length === 18 : isHex(value) && value.length === 16);

export const validateHexString8Bytes = (value: unknown, prefixed = true) => {
	if (!isHexString8Bytes(value, prefixed)) throw new InvalidHexStringError(value, 8);
};

export const isHexString16Bytes = (value: unknown, prefixed = true) =>
	typeof value === 'string' &&
	(prefixed ? isHexStrict(value) && value.length === 34 : isHex(value) && value.length === 32);

export const validateHexString16Bytes = (value: unknown, prefixed = true) => {
	if (!isHexString16Bytes(value, prefixed)) throw new InvalidHexStringError(value, 16);
};

export const isHexString32Bytes = (value: unknown, prefixed = true) =>
	typeof value === 'string' &&
	(prefixed ? isHexStrict(value) && value.length === 66 : isHex(value) && value.length === 64);

export const validateHexString32Bytes = (value: unknown, prefixed = true) => {
	if (!isHexString32Bytes(value, prefixed)) throw new InvalidHexStringError(value, 32);
};

/**
 * First we check if all properties in the provided value are expected,
 * then because all Filter properties are optional, we check if the expected properties
 * are defined. If defined and they're not the expected type, we immediately return false,
 * otherwise we return true after all checks pass.
 */
export const isFilterObject = (value: Filter) => {
	const expectedFilterProperties: (keyof Filter)[] = [
		'fromBlock',
		'toBlock',
		'address',
		'topics',
	];
	if (value === null || typeof value !== 'object') return false;

	if (
		!Object.keys(value).every(property =>
			expectedFilterProperties.includes(property as keyof Filter),
		)
	)
		return false;

	if (
		(value.fromBlock !== undefined && !isBlockNumberOrTag(value.fromBlock)) ||
		(value.toBlock !== undefined && !isBlockNumberOrTag(value.toBlock))
	)
		return false;

	if (value.address !== undefined) {
		if (Array.isArray(value.address)) {
			if (!value.address.every(address => isAddress(address))) return false;
		} else if (!isAddress(value.address)) return false;
	}

	if (value.topics !== undefined) {
		if (
			!value.topics.every(topic => {
				if (topic === null) return true;

				if (Array.isArray(topic)) {
					return topic.every(nestedTopic => isTopic(nestedTopic));
				}

				if (isTopic(topic)) return true;

				return false;
			})
		)
			return false;
	}

	return true;
};

export const validateFilterObject = (value: Filter) => {
	if (!isFilterObject(value)) throw new InvalidFilterError(value);
};

export const isBoolean = (value: boolean) => typeof value === 'boolean';

export const validateBoolean = (value: boolean) => {
	if (!isBoolean(value)) throw new InvalidBooleanError(value);
};
