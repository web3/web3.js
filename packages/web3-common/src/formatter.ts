import {
	bytesToHex,
	HexString,
	hexToBytes,
	hexToNumber,
	isHex,
	mergeDeep,
	numberToHex,
} from 'web3-utils';
import { JsonSchemaNode, utils, ValidationSchemaInput } from 'web3-validator';
import { parseBaseType } from 'web3-validator/dist/utils';

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
	number: FMT_NUMBER;
	bytes: FMT_BYTES;
};

export const DEFAULT_FORMAT: DataFormat = { number: FMT_NUMBER.NUMBER, bytes: FMT_BYTES.HEX };

export type FormatType<T, F extends DataFormat> = {
	[P in keyof T]: T[P] extends number | bigint
		? NumberTypes[F['number']]
		: T[P] extends Buffer | Uint8Array
		? ByteTypes[F['bytes']]
		: T[P] extends object
		? FormatType<T[P], F>
		: T[P];
};

const isObject = (item: unknown): item is Record<string, unknown> =>
	typeof item === 'object' && item !== null && !Array.isArray(item) && !Buffer.isBuffer(item);

const findObjectByPath = (
	schema: JsonSchemaNode,
	dataPath: string[],
): JsonSchemaNode | undefined => {
	let result: JsonSchemaNode = schema;

	// eslint-disable-next-line @typescript-eslint/prefer-for-of
	for (let i = 0; i < dataPath.length; i += 1) {
		if (!result.properties && !result.items) {
			return undefined;
		}

		if (result.properties) {
			result = result.properties[dataPath[i]];
		} else if (result.items) {
			const node = (result.items as JsonSchemaNode).properties;
			if (!node) {
				return undefined;
			}

			result = node[dataPath[i]];
		}
	}

	return result;
};

export const getNumberValue = (value: unknown): bigint => {
	if (typeof value === 'number') {
		return BigInt(value);
	}

	if (typeof value === 'bigint') {
		return value;
	}

	if (typeof value === 'string' && !isHex(value)) {
		return BigInt(value);
	}

	if (typeof value === 'string' && isHex(value)) {
		return BigInt(hexToNumber(value));
	}

	throw new Error('Invalid type');
};

export const getBytesValue = (value: unknown): Buffer => {
	if (Buffer.isBuffer(value)) {
		return value;
	}

	if (value instanceof Uint8Array) {
		return Buffer.from(value);
	}

	if (typeof value === 'string' && isHex(value)) {
		return hexToBytes(value);
	}

	throw new Error('Invalid type');
};

export const typeCastScalarValue = (value: unknown, ethType: string, format: DataFormat) => {
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

export const recursiveTypeCast = (
	data: Record<string, unknown> | unknown[],
	schema: JsonSchemaNode,
	dataPath: string[],
	format: DataFormat,
) => {
	const object = data;

	for (const [key, value] of Object.entries(object)) {
		dataPath.push(key);
		const schemaProp = findObjectByPath(schema, dataPath);

		// If value is an object, recurse into it
		if (isObject(value)) {
			// dataPath.push(key);
			recursiveTypeCast(value, schema, [], format);
			dataPath.pop();
			continue;
		}

		// If value is an array and schema for array is an object
		if (
			Array.isArray(value) &&
			!Array.isArray(schemaProp?.items) &&
			schemaProp?.items?.type === 'object'
		) {
			for (const arrObject of value) {
				recursiveTypeCast(
					arrObject as Record<string, unknown> | unknown[],
					schema,
					dataPath,
					format,
				);
			}

			continue;
		}

		// If schema for array is an array
		if (Array.isArray(value)) {
			for (let i = 0; i < value.length; i += 1) {
				if (schemaProp === undefined || schemaProp.items === undefined) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					delete object[key];
					dataPath.pop();
					continue;
				}

				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
				// (object[key] as any)[i] = mappers[mode][schemaProp.items.eth](value[i]);

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				(object[key] as unknown[])[i] = typeCastScalarValue(
					value[i],
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					(schemaProp.items as JsonSchemaNode).eth ?? '',
					format,
				);
			}

			dataPath.pop();

			continue;
		}

		// If value is a scaler value
		if (schemaProp === undefined) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			delete object[key];
			dataPath.pop();
			continue;
		}

		// object[key] = mappers[mode][schemaProp.dataType as unknown as string](value);

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		object[key] = typeCastScalarValue(value, schemaProp.eth, format);

		dataPath.pop();
	}

	return object;
};

export const format = <
	DataType extends Record<string, unknown> | unknown[],
	ReturnType extends DataFormat,
>(
	schema: ValidationSchemaInput | JsonSchemaNode,
	data: DataType,
	returnFormat: ReturnType,
): FormatType<DataType, ReturnType> => {
	let dataToParse: Record<string, unknown> | unknown[];

	if (isObject(data)) {
		dataToParse = mergeDeep({}, data);
	} else {
		dataToParse = [...data];
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const jsonSchema: JsonSchemaNode = isObject(schema) ? schema : utils.ethAbiToJsonSchema(schema);

	if (!jsonSchema.properties) {
		throw new Error('Nazar');
	}

	return recursiveTypeCast(dataToParse, jsonSchema, [], returnFormat) as unknown as FormatType<
		typeof data,
		ReturnType
	>;
};
