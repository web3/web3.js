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
import { isHexString } from './internal';

/**
 * Throws if a string is not hex prefixed
 * @param {string} input string to check hex prefix of
 */
export const assertIsHexString = function (input: string): void {
	if (!isHexString(input)) {
		const msg = `This method only supports 0x-prefixed hex strings but input was: ${input}`;
		throw new Error(msg);
	}
};

/**
 * Throws if input is not a buffer
 * @param {Buffer} input value to check
 */
export const assertIsBuffer = function (input: Buffer): void {
	if (!Buffer.isBuffer(input)) {
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		const msg = `This method only supports Buffer but input was: ${input}`;
		throw new Error(msg);
	}
};

/**
 * Throws if input is not an array
 * @param {number[]} input value to check
 */
export const assertIsArray = function (input: number[]): void {
	if (!Array.isArray(input)) {
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		const msg = `This method only supports number arrays but input was: ${input}`;
		throw new Error(msg);
	}
};

/**
 * Throws if input is not a string
 * @param {string} input value to check
 */
export const assertIsString = function (input: string): void {
	if (typeof input !== 'string') {
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		const msg = `This method only supports strings but input was: ${input}`;
		throw new Error(msg);
	}
};
