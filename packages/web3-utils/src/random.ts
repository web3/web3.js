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

import { getRandomBytesSync } from 'ethereum-cryptography/random';

/**
 * Returns a random byte array by the given bytes size
 * @param size - The size of the random byte array returned
 * @returns - random byte array
 *
 * @example
 * ```ts
 * console.log(web3.utils.randomBytes(32));
 * > <Buffer a9 a2 70 ff 00 9d 0b c9 2f 9e 5f 0e 40 a4 da 4a f9 1c 6f 23 41 59 46 a6 b5 8b 99 49 72 01 68 99>
 * ```
 */
export const randomBytes = (size: number): Buffer => Buffer.from(getRandomBytesSync(size));

/**
 * Returns a random hex string by the given bytes size
 * @param byteSize - The size of the random hex string returned
 * @returns - random hex string
 *
 * ```ts
 * console.log(web3.utils.randomHex(32));
 * > 0x139f5b88b72a25eab053d3b57fe1f8a9dbc62a526b1cb1774d0d7db1c3e7ce9e
 * ```
 */
export const randomHex = (byteSize: number): string => `0x${randomBytes(byteSize).toString('hex')}`;
