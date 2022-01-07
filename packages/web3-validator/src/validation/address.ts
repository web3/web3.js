import { keccak256 } from 'ethereum-cryptography/keccak';
import { ValidInputTypes } from '../types';
import { isHexStrict } from './string';

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
export const isAddress = (value: ValidInputTypes, checkChecksum = true) => {
	if (typeof value !== 'string' && !Buffer.isBuffer(value)) {
		return false;
	}

	let valueToCheck: string;

	if (Buffer.isBuffer(value)) {
		valueToCheck = `0x${value.toString('hex')}`;
	} else if (typeof value === 'string' && !isHexStrict(value)) {
		valueToCheck = `0x${value}`;
	} else {
		valueToCheck = value;
	}

	// check if it has the basic requirements of an address
	if (!/^(0x)?[0-9a-f]{40}$/i.test(valueToCheck)) {
		return false;
	}
	// If it's ALL lowercase or ALL upppercase
	if (
		/^(0x|0X)?[0-9a-f]{40}$/.test(valueToCheck) ||
		/^(0x|0X)?[0-9A-F]{40}$/.test(valueToCheck)
	) {
		return true;
		// Otherwise check each case
	}
	return checkChecksum ? checkAddressCheckSum(valueToCheck) : true;
};
