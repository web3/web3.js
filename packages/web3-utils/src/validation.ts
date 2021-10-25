import {
	HighValueIntegerInByteArrayError,
	InvalidBytesError,
	InvalidHexStringError,
	InvalidIntegerError,
	InvalidIntegerInByteArrayError,
	InvalidNumberError,
	NegativeIntegersInByteArrayError,
	InvalidStringError,
} from './errors';
import { Bytes, HexString, Numbers } from './types';

/**
 * returns true if input is a hexstring
 */
export const isHexStrict = (hex: string) =>
	typeof hex === 'string' && /^(-)?0x[0-9a-f]*$/i.test(hex);

/**
 * returns true if input is a hexstring, number or bigint
 */
export const isHex = (hex: Numbers): boolean =>
	typeof hex === 'number' || typeof hex === 'bigint' || isHexStrict(hex);

export const validateHexStringInput = (data: HexString) => {
	if (!isHexStrict(data)) {
		throw new InvalidHexStringError(data);
	}
};

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

export const validateStringInput = (data: string) => {
	if (typeof data !== 'string') {
		throw new InvalidStringError(data);
	}
};

/**
 * Compares between block A and block B
 * Returns -1 if a < b, returns 1 if a > b and returns 0 if a == b
 */
export const compareBlockNumbers = (blockA: string, blockB: string) => {
	if (blockA === blockB) return 0;
	return 1;
};

// TODO: Implement later
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isAddress = (address: string): boolean => {
	// check if it has the basic requirements of an address
	if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
		return false;
	}
	// If it's ALL lowercase or ALL upppercase
	if (/^(0x|0X)?[0-9a-f]{40}$/.test(address) || /^(0x|0X)?[0-9A-F]{40}$/.test(address)) {
		return true;
		// Otherwise check each case
	}
	return true;
	// return checkAddressCheckSum(address);
};

/**
 * Checks the checksum of a given address. Will also return false on non-checksum addresses.
 */
// export const checkAddressCheckSum = (address: string): boolean => {
// 	const updatedAddress = address.replace(/^0x/i,'');

// const addressHash = sha3(updatedAddress.toLowerCase()).replace(/^0x/i,'');

// for (var i = 0; i < 40; i++ ) {
//     // the nth letter should be uppercase if the nth digit of casemap is 1
//     if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
//         return false;
//     }
// }
//  true;

/**
 * Returns true if the bloom is a valid bloom
 */
// export const isBloom = (bloom: string): boolean => {
// 	if (typeof bloom !== 'string') {
// 		return false;
// 	}

// 	if (!/^(0x)?[0-9a-f]{512}$/i.test(bloom)) {
// 		return false;
// 	  }

// 	  if (
// 		/^(0x)?[0-9a-f]{512}$/.test(bloom) ||
// 		/^(0x)?[0-9A-F]{512}$/.test(bloom)
// 	  ) {
// 		return true;
// 	  }

// 	  return false;
// }

/**
 * Returns true if the value is part of the given bloom
 * note: false positives are possible.
 * @param bloom encoded bloom
 * @param value The value
 */
//  export function isInBloom(bloom: string, value: string | Uint8Array): boolean {
// 	if (typeof value === 'object' && value.constructor === Uint8Array) {
// 	  value = bytesToHex(value);
// 	}

// 	const hash = keccak256(value).replace('0x', '');

// 	for (let i = 0; i < 12; i += 4) {
// 	  // calculate bit position in bloom filter that must be active
// 	  const bitpos =
// 		((parseInt(hash.substr(i, 2), 16) << 8) +
// 		  parseInt(hash.substr(i + 2, 2), 16)) &
// 		2047;

// 	  // test if bitpos in bloom is active
// 	  const code = codePointToInt(
// 		bloom.charCodeAt(bloom.length - 1 - Math.floor(bitpos / 4)),
// 	  );
// 	  const offset = 1 << bitpos % 4;

// 	  if ((code & offset) !== offset) {
// 		return false;
// 	  }
// 	}

// 	return true;
//   }
