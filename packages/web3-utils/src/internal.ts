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

/**
 * Returns a `Boolean` on whether or not the a `String` starts with '0x'
 * @param str the string input value
 * @return a boolean if it is or is not hex prefixed
 * @throws if the str input is not a string
 */
export function isHexPrefixed(str: string): boolean {
	if (typeof str !== 'string') {
		throw new Error(`[isHexPrefixed] input must be type 'string', received type ${typeof str}`);
	}

	return str.startsWith('0') && str[1] === 'x';
}

/**
 * Removes '0x' from a given `String` if present
 * @param str the string value
 * @returns the string without 0x prefix
 */
export const stripHexPrefix = (str: string): string => {
	if (typeof str !== 'string')
		throw new Error(`[stripHexPrefix] input must be type 'string', received ${typeof str}`);

	return isHexPrefixed(str) ? str.slice(2) : str;
};

/**
 * Pads a `String` to have an even length
 * @param value
 * @return output
 */
export function padToEven(value: string): string {
	let a = value;

	if (typeof a !== 'string') {
		throw new Error(`[padToEven] value must be type 'string', received ${typeof a}`);
	}

	if (a.length % 2) a = `0${a}`;

	return a;
}

/**
 * Get the binary size of a string
 * @param str
 * @returns the number of bytes contained within the string
 */
export function getBinarySize(str: string) {
	if (typeof str !== 'string') {
		throw new Error(
			`[getBinarySize] method requires input type 'string', received ${typeof str}`,
		);
	}

	return Buffer.byteLength(str, 'utf8');
}

/**
 * Returns TRUE if the first specified array contains all elements
 * from the second one. FALSE otherwise.
 *
 * @param superset
 * @param subset
 *
 */
export function arrayContainsArray(
	superset: unknown[],
	subset: unknown[],
	some?: boolean,
): boolean {
	if (!Array.isArray(superset)) {
		throw new Error(
			`[arrayContainsArray] method requires input 'superset' to be an array, got type '${typeof superset}'`,
		);
	}
	if (!Array.isArray(subset)) {
		throw new Error(
			`[arrayContainsArray] method requires input 'subset' to be an array, got type '${typeof subset}'`,
		);
	}

	return subset[some === true ? 'some' : 'every'](value => superset.includes(value));
}

/**
 * Returns the keys from an array of objects.
 * @example
 * ```js
 * getKeys([{a: '1', b: '2'}, {a: '3', b: '4'}], 'a') => ['1', '3']
 *````
 * @param  params
 * @param  key
 * @param  allowEmpty
 * @returns output just a simple array of output keys
 */
export function getKeys(params: Record<string, string>[], key: string, allowEmpty?: boolean) {
	if (!Array.isArray(params)) {
		throw new Error(
			`[getKeys] method expects input 'params' to be an array, got ${typeof params}`,
		);
	}
	if (typeof key !== 'string') {
		throw new Error(
			`[getKeys] method expects input 'key' to be type 'string', got ${typeof params}`,
		);
	}

	const result = [];
	// eslint-disable-next-line @typescript-eslint/prefer-for-of
	for (let i = 0; i < params.length; i += 1) {
		let value = params[i][key];
		if (allowEmpty === true && !value) {
			value = '';
		} else if (typeof value !== 'string') {
			throw new Error(`invalid abi - expected type 'string', received ${typeof value}`);
		}
		result.push(value);
	}

	return result;
}

/**
 * Is the string a hex string.
 *
 * @param  value
 * @param  length
 * @returns  output the string is a hex string
 */
export function isHexString(value: string, length?: number): boolean {
	if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) return false;

	if (typeof length !== 'undefined' && length > 0 && value.length !== 2 + 2 * length)
		return false;

	return true;
}
