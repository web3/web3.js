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

export const removeKey = (obj: any, key: any) => {
	if (Array.isArray(obj)) {
		for (const val of obj) {
			removeKey(val, key);
		}
	} else if (typeof obj === 'object' && obj !== undefined) {
		// eslint-disable-next-line no-restricted-syntax
		for (const prop in obj) {
			if (prop === key) {
				// eslint-disable-next-line no-param-reassign
				delete obj[prop];
			} else {
				removeKey(obj[prop], key);
			}
		}
	}
};

export const deepEqualTolerateBigInt = (obj1: any, obj2: any) => {
	if (typeof obj1 === 'bigint')
		// eslint-disable-next-line no-param-reassign
		obj1 = obj1.toString();

	if (typeof obj2 === 'bigint')
		// eslint-disable-next-line no-param-reassign
		obj2 = obj2.toString();

	if (typeof obj1 !== typeof obj2) {
		return false;
	}

	if (Array.isArray(obj1) && Array.isArray(obj2)) {
		if (obj1.length !== obj2.length) {
			return false;
		}

		/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
		for (let i = 0; i < obj1.length; i++) {
			if (!deepEqualTolerateBigInt(obj1[i], obj2[i])) {
				return false;
			}
		}

		return true;
	}

	if (
		typeof obj1 === 'object' &&
		typeof obj2 === 'object' &&
		obj1 !== undefined &&
		obj2 !== undefined
	) {
		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);

		if (keys1.length !== keys2.length) {
			return false;
		}

		for (const key of keys1) {
			if (!deepEqualTolerateBigInt(obj1[key], obj2[key])) {
				return false;
			}
		}

		return true;
	}

	return obj1 === obj2;
};
