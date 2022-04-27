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
