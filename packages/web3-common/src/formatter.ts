import {
	bytesToHex,
	HexString,
	hexToBytes,
	hexToNumber,
	isHex,
	isHexStrict,
	mergeDeep,
	numberToHex,
} from 'web3-utils';
import { JsonSchema, utils, ValidationSchemaInput } from 'web3-validator';

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

export const DEFAULT_RETURN_FORMAT = { number: FMT_NUMBER.NUMBER, bytes: FMT_BYTES.HEX } as const;

export type FormatType<T, F extends DataFormat> = T extends number | bigint
	? NumberTypes[F['number']]
	: T extends Buffer | Uint8Array
	? ByteTypes[F['bytes']]
	: T extends object
	? {
			[P in keyof T]: T[P] extends number | bigint
				? NumberTypes[F['number']]
				: T[P] extends Buffer | Uint8Array
				? ByteTypes[F['bytes']]
				: T[P] extends object
				? FormatType<T[P], F>
				: T[P];
	  }
	: T;

const isObject = (item: unknown): item is Record<string, unknown> =>
	typeof item === 'object' && item !== null && !Array.isArray(item) && !Buffer.isBuffer(item);

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

// To get one format value so we can convert to other format
export const getNumberValue = (value: unknown): bigint => {
	if (typeof value === 'number') {
		return BigInt(value);
	}

	if (typeof value === 'bigint') {
		return value;
	}

	if (typeof value === 'string' && !isHexStrict(value)) {
		return BigInt(value);
	}

	if (typeof value === 'string' && isHexStrict(value)) {
		return BigInt(hexToNumber(value));
	}

	throw new Error('Invalid type');
};

// To get one format value so we can convert to other format
export const getBytesValue = (value: unknown): Buffer => {
	if (Buffer.isBuffer(value)) {
		return value;
	}

	if (value instanceof Uint8Array) {
		return Buffer.from(value);
	}

	if (typeof value === 'string' && isHexStrict(value)) {
		return hexToBytes(value);
	}

	if (typeof value === 'string' && isHex(value)) {
		return Buffer.from(value, 'hex');
	}

	throw new Error('Invalid type');
};

export const convertScalarValue = (value: unknown, ethType: string, format: DataFormat) => {
	const { baseType } = parseBaseType(ethType);

	if (baseType === 'int' || baseType === 'uint') {
		switch (format.number) {
			case FMT_NUMBER.NUMBER:
				return Number(getNumberValue(value));
			case FMT_NUMBER.HEX:
				return numberToHex(getNumberValue(value));
			case FMT_NUMBER.STR:
				return getNumberValue(value).toString();
			case FMT_NUMBER.BIGINT:
				return getNumberValue(value);
			default:
				throw new Error(`Invalid format: ${String(format.number)}`);
		}
	}

	if (baseType === 'bytes') {
		switch (format.bytes) {
			case FMT_BYTES.HEX:
				return bytesToHex(getBytesValue(value));
			case FMT_BYTES.BUFFER:
				return getBytesValue(value);
			case FMT_BYTES.UINT8ARRAY:
				return new Uint8Array(getBytesValue(value));
			default:
				throw new Error(`Invalid format: ${String(format.bytes)}`);
		}
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
			// dataPath.push(key);
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
		throw new Error('Nazar');
	}

	return convert(dataToParse, jsonSchema, [], returnFormat) as FormatType<
		typeof data,
		ReturnType
	>;
};
