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

import { VALID_ETH_BASE_TYPES } from './constants';
import {
	FullValidationSchema,
	JsonSchema,
	ShortValidationSchema,
	ValidationSchemaInput,
	ValidInputTypes,
} from './types';
import { isAbiParameterSchema } from './validation/abi';
import { isHexStrict } from './validation/string';

export const parseBaseType = <T = typeof VALID_ETH_BASE_TYPES[number]>(
	type: string,
): {
	baseType?: T;
	baseTypeSize: number | undefined;
	arraySizes: number[];
	isArray: boolean;
} => {
	// Remove all empty spaces to avoid any parsing issue.
	let strippedType = type.replace(/ /, '');
	let baseTypeSize: number | undefined;
	let isArray = false;
	let arraySizes: number[] = [];

	if (type.includes('[')) {
		// Extract the array type
		strippedType = strippedType.slice(0, strippedType.indexOf('['));
		// Extract array indexes
		arraySizes = [...type.matchAll(/(?:\[(\d*)\])/g)]
			.map(match => parseInt(match[1], 10))
			.map(size => (Number.isNaN(size) ? -1 : size));

		isArray = arraySizes.length > 0;
	}

	if (VALID_ETH_BASE_TYPES.includes(strippedType)) {
		return { baseType: strippedType as unknown as T, isArray, baseTypeSize, arraySizes };
	}

	if (strippedType.startsWith('int')) {
		baseTypeSize = parseInt(strippedType.substring(3), 10);
		strippedType = 'int';
	} else if (strippedType.startsWith('uint')) {
		baseTypeSize = parseInt(type.substring(4), 10);
		strippedType = 'uint';
	} else if (strippedType.startsWith('bytes')) {
		baseTypeSize = parseInt(strippedType.substring(5), 10);
		strippedType = 'bytes';
	} else {
		return { baseType: undefined, isArray: false, baseTypeSize: undefined, arraySizes };
	}

	return { baseType: strippedType as unknown as T, isArray, baseTypeSize, arraySizes };
};

export const abiSchemaToJsonSchema = (
	abis: ShortValidationSchema | FullValidationSchema,
	level?: number,
) => {
	const schema: JsonSchema = {
		type: 'array',
		items: [],
		maxItems: abis.length,
		minItems: abis.length,
	};

	for (const [index, abi] of abis.entries()) {
		// eslint-disable-next-line no-nested-ternary
		let abiType!: string;
		let abiName!: string;
		let abiComponents: ShortValidationSchema | FullValidationSchema | undefined = [];

		// If its a complete Abi Parameter
		// e.g. {name: 'a', type: 'uint'}
		if (isAbiParameterSchema(abi)) {
			abiType = abi.type;
			abiName = abi.name;
			abiComponents = abi.components as FullValidationSchema;
			// If its short form string value e.g. ['uint']
		} else if (typeof abi === 'string') {
			abiType = abi;
			abiName = `${level ?? ''}/${index}`;

			// If its provided in short form of tuple e.g. [['uint', 'string']]
		} else if (Array.isArray(abi)) {
			// If its custom tuple e.g. ['tuple[2]', ['uint', 'string']]
			if (abi[1] && Array.isArray(abi[1])) {
				abiType = abi[0] as string;
				abiName = `${level ?? ''}/${index}`;
				abiComponents = abi[1] as ReadonlyArray<ShortValidationSchema>;
			} else {
				abiType = 'tuple';
				abiName = `${level ?? ''}/${index}`;
				abiComponents = abi;
			}
		}

		const { baseType, isArray, arraySizes } = parseBaseType(abiType);

		let childSchema: JsonSchema;
		let lastSchema = schema;
		for (let i = arraySizes.length - 1; i > 0; i -= 1) {
			childSchema = {
				type: 'array',
				items: [],
				maxItems: arraySizes[i],
				minItems: arraySizes[i],
			};

			if (arraySizes[i] < 0) {
				delete childSchema.maxItems;
				delete childSchema.minItems;
			}

			lastSchema.items = childSchema;
			lastSchema = childSchema;
		}

		if (baseType === 'tuple' && !isArray) {
			(lastSchema.items as JsonSchema[]).push(abiSchemaToJsonSchema(abiComponents, index));
		} else if (baseType === 'tuple' && isArray) {
			const arraySize = arraySizes[0];
			const item: JsonSchema = {
				$id: abiName,
				type: 'array',
				items: abiSchemaToJsonSchema(abiComponents, index),
				maxItems: arraySize,
				minItems: arraySize,
			};

			if (arraySize < 0) {
				delete item.maxItems;
				delete item.minItems;
			}

			(lastSchema.items as JsonSchema[]).push(item);
		} else if (isArray) {
			const arraySize = arraySizes[0];
			const item: JsonSchema = {
				type: 'array',
				$id: abiName,
				items: {
					eth: baseType,
				},
				minItems: arraySize,
				maxItems: arraySize,
			};

			if (arraySize < 0) {
				delete item.maxItems;
				delete item.minItems;
			}

			(lastSchema.items as JsonSchema[]).push(item);
		} else {
			(lastSchema.items as JsonSchema[]).push({ $id: abiName, eth: abiType });
		}
	}

	return schema;
};

export const ethAbiToJsonSchema = (abis: ValidationSchemaInput) => abiSchemaToJsonSchema(abis);

/**
 * Code points to int
 */

export const codePointToInt = (codePoint: number): number => {
	if (codePoint >= 48 && codePoint <= 57) {
		/* ['0'..'9'] -> [0..9] */
		return codePoint - 48;
	}

	if (codePoint >= 65 && codePoint <= 70) {
		/* ['A'..'F'] -> [10..15] */
		return codePoint - 55;
	}

	if (codePoint >= 97 && codePoint <= 102) {
		/* ['a'..'f'] -> [10..15] */
		return codePoint - 87;
	}

	throw new Error(`Invalid code point: ${codePoint}`);
};

/**
 * Converts value to it's number representation
 */
export const hexToNumber = (value: string): bigint | number => {
	if (!isHexStrict(value)) {
		throw new Error('Invalid hex string');
	}

	const [negative, hexValue] = value.startsWith('-') ? [true, value.substr(1)] : [false, value];
	const num = BigInt(hexValue);

	if (num > Number.MAX_SAFE_INTEGER) {
		return negative ? -num : num;
	}

	return negative ? -1 * Number(num) : Number(num);
};

/**
 * Converts value to it's hex representation
 */
export const numberToHex = (value: ValidInputTypes): string => {
	if ((typeof value === 'number' || typeof value === 'bigint') && value < 0) {
		return `-0x${value.toString(16).substr(1)}`;
	}

	if ((typeof value === 'number' || typeof value === 'bigint') && value >= 0) {
		return `0x${value.toString(16)}`;
	}

	if (typeof value === 'string' && isHexStrict(value)) {
		return numberToHex(hexToNumber(value));
	}

	if (typeof value === 'string' && !isHexStrict(value)) {
		return numberToHex(BigInt(value));
	}

	throw new Error('Invalid number value');
};

/**
 * Adds a padding on the left of a string, if value is a integer or bigInt will be converted to a hex string.
 */
export const padLeft = (value: ValidInputTypes, characterAmount: number, sign = '0'): string => {
	if (typeof value === 'string' && !isHexStrict(value)) {
		return value.padStart(characterAmount, sign);
	}

	const hex = typeof value === 'string' && isHexStrict(value) ? value : numberToHex(value);

	const [prefix, hexValue] = hex.startsWith('-') ? ['-0x', hex.substr(3)] : ['0x', hex.substr(2)];

	return `${prefix}${hexValue.padStart(characterAmount, sign)}`;
};
