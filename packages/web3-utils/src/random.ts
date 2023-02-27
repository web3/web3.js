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

import { randomBytes as cryptoRandomBytes } from 'crypto';

/**
 * Returns a random byte array by the given bytes size
 */
export const randomBytes = (byteSize: number): Buffer => {
	const randomValues =
		typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues
			? window.crypto.getRandomValues(new Uint8Array(byteSize))
			: cryptoRandomBytes(byteSize);
	return Buffer.from(randomValues);
};

/**
 * Returns a random hex string by the given bytes size
 */
export const randomHex = (byteSize: number): string => `0x${randomBytes(byteSize).toString('hex')}`;
