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

import { ValidInputTypes } from '../types';
import { parseBaseType, hexToNumber } from '../utils';
import { isHexStrict } from './string';

/**
 * Checks if a given value is a valid big int
 */
export const isBigInt = (value: ValidInputTypes): boolean => typeof value === 'bigint';

export const isUInt = (
	value: ValidInputTypes,
	options: { abiType: string; bitSize?: never } | { bitSize: number; abiType?: never } = {
		abiType: 'uint',
	},
) => {
	if (!['number', 'string', 'bigint'].includes(typeof value)) {
		return false;
	}

	let size!: number;

	if (options?.abiType) {
		const { baseTypeSize } = parseBaseType(options.abiType);

		if (baseTypeSize) {
			size = baseTypeSize;
		}
	} else if (options.bitSize) {
		size = options.bitSize;
	}

	const maxSize = BigInt(2) ** BigInt(size ?? 256) - BigInt(1);

	try {
		const valueToCheck =
			typeof value === 'string' && isHexStrict(value)
				? BigInt(hexToNumber(value))
				: BigInt(value as number);

		return valueToCheck >= 0 && valueToCheck <= maxSize;
	} catch (error) {
		// Some invalid number value given which can not be converted via BigInt
		return false;
	}
};

export const isInt = (
	value: ValidInputTypes,
	options: { abiType: string; bitSize?: never } | { bitSize: number; abiType?: never } = {
		abiType: 'int',
	},
) => {
	if (!['number', 'string', 'bigint'].includes(typeof value)) {
		return false;
	}

	let size!: number;

	if (options?.abiType) {
		const { baseTypeSize, baseType } = parseBaseType(options.abiType);

		if (baseType !== 'int') {
			return false;
		}

		if (baseTypeSize) {
			size = baseTypeSize;
		}
	} else if (options.bitSize) {
		size = options.bitSize;
	}

	const maxSize = BigInt(2) ** BigInt((size ?? 256) - 1);
	const minSize = BigInt(-1) * BigInt(2) ** BigInt((size ?? 256) - 1);

	try {
		const valueToCheck =
			typeof value === 'string' && isHexStrict(value)
				? BigInt(hexToNumber(value))
				: BigInt(value as number);

		return valueToCheck >= minSize && valueToCheck <= maxSize;
	} catch (error) {
		// Some invalid number value given which can not be converted via BigInt
		return false;
	}
};

export const isNumber = (value: ValidInputTypes) => {
	if (isInt(value)) {
		return true;
	}

	// It would be a decimal number
	if (
		typeof value === 'string' &&
		/[0-9.]/.test(value) &&
		value.indexOf('.') === value.lastIndexOf('.')
	) {
		return true;
	}

	if (typeof value === 'number') {
		return true;
	}

	return false;
};
