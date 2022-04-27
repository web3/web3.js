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
import {
	Bytes,
	bytesToBuffer,
	bytesToHex,
	HexString,
	mergeDeep,
	Numbers,
	numberToHex,
	toBigInt,
} from 'web3-utils';
import { isObject, JsonSchema, utils, ValidationSchemaInput } from 'web3-validator';
import { FormatterError } from './errors';

const { parseBaseType } = utils;

export enum FMT_NUMBER {
	NUMBER = 'NUMBER_NUMBER',
	HEX = 'NUMBER_HEX',
	STR = 'NUMBER_STR',
	BIGINT = 'NUMBER_BIGINT',
}

export type NumberTypes = {
	[FMT_NUMBER.NUMBER]: number;
	[FMT_NUMBER.HEX]: HexString;
	[FMT_NUMBER.STR]: string;
	[FMT_NUMBER.BIGINT]: bigint;
};

export enum FMT_BYTES {
	HEX = 'BYTES_HEX',
	BUFFER = 'BYTES_BUFFER',
	UINT8ARRAY = 'BYTES_UINT8ARRAY',
}

export type ByteTypes = {
	[FMT_BYTES.HEX]: HexString;
	[FMT_BYTES.BUFFER]: Buffer;
	[FMT_BYTES.UINT8ARRAY]: Uint8Array;
};

export type DataFormat = {
	readonly number: FMT_NUMBER;
	readonly bytes: FMT_BYTES;
};

export const DEFAULT_RETURN_FORMAT = { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX } as const;

// Added `undefined` to cover optional type
export type FormatType<T, F extends DataFormat> = number extends Extract<T, Numbers>
	? NumberTypes[F['number']] | Exclude<T, Numbers>
	: Buffer extends Extract<T, Bytes>
	? ByteTypes[F['bytes']] | Exclude<T, Bytes>
	: T extends object | undefined
	? {
			[P in keyof T]: FormatType<T[P], F>;
	  }
	: T;

const findSchemaByDataPath = (schema: JsonSchema, dataPath: string[]): JsonSchema | undefined => {
	let result: JsonSchema = { ...schema } as JsonSchema;

	for (const dataPart of dataPath) {
		if (!result.properties && !result.items) {
			return undefined;
		}

		if (result.properties) {
			result = (result.properties as Record<string, JsonSchema>)[dataPart];
		} else if (result.items && (result.items as JsonSchema).properties) {
			const node = (result.items as JsonSchema).properties as Record<string, JsonSchema>;

			if (!node) {
				return undefined;
			}

			result = node[dataPart];
		} else if (result.items && isObject(result.items)) {
			result = result.items;
		} else if (result.items && Array.isArray(result.items)) {
			result = (result.items as JsonSchema[])[parseInt(dataPart, 10)];
		}
	}

	return result;
};

export const convertScalarValue = (value: unknown, ethType: string, format: DataFormat) => {
	try {
		const { baseType } = parseBaseType(ethType);

		if (baseType === 'int' || baseType === 'uint') {
			switch (format.number) {
				case FMT_NUMBER.NUMBER:
					return Number(toBigInt(value));
				case FMT_NUMBER.HEX:
					return numberToHex(toBigInt(value));
				case FMT_NUMBER.STR:
					return toBigInt(value).toString();
				case FMT_NUMBER.BIGINT:
					return toBigInt(value);
				default:
					throw new FormatterError(`Invalid format: ${String(format.number)}`);
			}
		}

		if (baseType === 'bytes') {
			switch (format.bytes) {
				case FMT_BYTES.HEX:
					return bytesToHex(bytesToBuffer(value as Bytes));
				case FMT_BYTES.BUFFER:
					return bytesToBuffer(value as Bytes);
				case FMT_BYTES.UINT8ARRAY:
					return new Uint8Array(bytesToBuffer(value as Bytes));
				default:
					throw new FormatterError(`Invalid format: ${String(format.bytes)}`);
			}
		}
	} catch (error) {
		// If someone did't used `eth` keyword we can return original value
		// as the scope of this code is formatting not validation
		return value;
	}

	return value;
};

export const convert = (
	data: Record<string, unknown> | unknown[] | unknown,
	schema: JsonSchema,
	dataPath: string[],
	format: DataFormat,
) => {
	// If it's a scalar value
	if (!isObject(data) && !Array.isArray(data)) {
		return convertScalarValue(data, schema?.eth as string, format);
	}

	const object = data as Record<string, unknown>;

	for (const [key, value] of Object.entries(object)) {
		dataPath.push(key);
		const schemaProp = findSchemaByDataPath(schema, dataPath);

		// If value is a scaler value
		if (schemaProp === undefined) {
			delete object[key];
			dataPath.pop();

			continue;
		}

		// If value is an object, recurse into it
		if (isObject(value)) {
			convert(value, schema, dataPath, format);
			dataPath.pop();
			continue;
		}

		// If value is an array
		if (Array.isArray(value)) {
			if (schemaProp?.items === undefined) {
				// Can not find schema for array item, delete that item
				delete object[key];
				dataPath.pop();

				continue;
			}

			// If schema for array items is a single type
			if (isObject(schemaProp.items) && schemaProp.items.eth !== undefined) {
				for (let i = 0; i < value.length; i += 1) {
					(object[key] as unknown[])[i] = convertScalarValue(
						value[i],
						// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
						schemaProp?.items?.eth as string,
						format,
					);
				}

				dataPath.pop();
				continue;
			}

			// If schema for array items is an object
			if (
				!Array.isArray(schemaProp?.items) &&
				(schemaProp?.items as JsonSchema).type === 'object'
			) {
				for (const arrObject of value) {
					convert(
						arrObject as Record<string, unknown> | unknown[],
						schema,
						dataPath,
						format,
					);
				}

				dataPath.pop();
				continue;
			}

			// If schema for array is a tuple
			if (Array.isArray(schemaProp?.items)) {
				for (let i = 0; i < value.length; i += 1) {
					(object[key] as unknown[])[i] = convertScalarValue(
						value[i],
						(schemaProp.items as JsonSchema[])[i].eth as string,
						format,
					);
				}

				dataPath.pop();
				continue;
			}
		}

		object[key] = convertScalarValue(value, schemaProp.eth as string, format);

		dataPath.pop();
	}

	return object;
};

export const format = <
	DataType extends Record<string, unknown> | unknown[] | unknown,
	ReturnType extends DataFormat,
>(
	schema: ValidationSchemaInput | JsonSchema,
	data: DataType,
	returnFormat: ReturnType,
): FormatType<DataType, ReturnType> => {
	let dataToParse: Record<string, unknown> | unknown[] | unknown;

	if (isObject(data)) {
		dataToParse = mergeDeep({}, data);
	} else if (Array.isArray(data)) {
		dataToParse = [...data];
	} else {
		dataToParse = data;
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const jsonSchema: JsonSchema = isObject(schema) ? schema : utils.ethAbiToJsonSchema(schema);

	if (!jsonSchema.properties && !jsonSchema.items && !jsonSchema.eth) {
		throw new FormatterError('Invalid json schema for formatting');
	}

	return convert(dataToParse, jsonSchema, [], returnFormat) as FormatType<
		typeof data,
		ReturnType
	>;
};
