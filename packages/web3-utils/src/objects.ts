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

const isIterable = (item: unknown): item is Record<string, unknown> =>
	typeof item === 'object' && item !== null && !Array.isArray(item) && !Buffer.isBuffer(item);

// The following code is a derivative work of the code from the "LiskHQ/lisk-sdk" project,
// which is licensed under Apache version 2.
export const mergeDeep = (
	destination: Record<string, unknown>,
	...sources: Record<string, unknown>[]
): Record<string, unknown> => {
	const result = destination; // clone deep here
	if (!isIterable(result)) {
		return result;
	}
	for (const src of sources) {
		// eslint-disable-next-line no-restricted-syntax
		for (const key in src) {
			if (isIterable(src[key])) {
				if (!result[key]) {
					result[key] = {};
				}
				mergeDeep(
					result[key] as Record<string, unknown>,
					src[key] as Record<string, unknown>,
				);
			} else if (src[key] !== undefined && src[key] !== null) {
				result[key] = src[key];
			}
		}
	}
	return result;
};
