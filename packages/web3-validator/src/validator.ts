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
import { Web3ValidationErrorObject } from 'web3-types';

import { z, ZodType, ZodIssue, ZodIssueCode, ZodTypeAny } from 'zod';

import { RawCreateParams } from 'zod/lib/types';
import { Web3ValidatorError } from './errors.js';
import { Json, Schema } from './types.js';
import formats from './formats';
// import { isAbiParameterSchema } from './validation/abi';
// import { parseBaseType } from './utils';

const convertToZod = (schema: Schema): ZodType => {
	if ((!schema?.type || schema?.type === 'object') && schema?.properties) {
		const obj: { [key: string]: ZodType } = {};
		for (const name of Object.keys(schema.properties)) {
			const zItem = convertToZod(schema.properties[name]);
			if (zItem) {
				obj[name] = zItem;
			}
		}

		if (Array.isArray(schema.required)) {
			return z
				.object(obj)
				.partial()
				.required(schema.required.reduce((acc, v: string) => ({ ...acc, [v]: true }), {}));
		}
		return z.object(obj).partial();
	}

	if (schema?.type === 'array' && schema?.items) {
		if (Array.isArray(schema.items) && schema.items.length > 0) {
			const arr: Partial<[ZodTypeAny, ...ZodTypeAny[]]> = [];
			for (const item of schema.items) {
				const zItem = convertToZod(item);
				if (zItem) {
					arr.push(zItem);
				}
			}
			return z.tuple(arr as [ZodTypeAny, ...ZodTypeAny[]]);
		}
		return z.array(convertToZod(schema.items as Schema));
	}

	if (schema.oneOf && Array.isArray(schema.oneOf)) {
		return z.union(
			schema.oneOf.map(oneOfSchema => convertToZod(oneOfSchema)) as [
				ZodTypeAny,
				ZodTypeAny,
				...ZodTypeAny[],
			],
		);
	}

	if (schema?.format) {
		return z.any().refine(formats[schema.format], (value: unknown) => ({
			params: { value, format: schema.format },
		}));
	}

	if (
		schema?.type &&
		schema?.type !== 'object' &&
		typeof (z as unknown as { [key: string]: (params?: RawCreateParams) => ZodType })[
			String(schema.type)
		] === 'function'
	) {
		return (z as unknown as { [key: string]: (params?: RawCreateParams) => ZodType })[
			String(schema.type)
		]();
	}
	return z.object({ data: z.any() }).partial();
};

// export const abiToZod = (abis: ShortValidationSchema | FullValidationSchema, level = '/0') => {
// 	for (const [index, abi] of abis.entries()) {
// 		if (isAbiParameterSchema(abi)) {
// 		}
//
// 		// eslint-disable-next-line no-nested-ternary
// 		let abiType!: string;
// 		let abiName!: string;
// 		let abiComponents: ShortValidationSchema | FullValidationSchema | undefined = [];
//
// 		// If it's a complete Abi Parameter
// 		// e.g. {name: 'a', type: 'uint'}
// 		if (isAbiParameterSchema(abi)) {
// 			z.object({[abi.name]:convertToZod(abi)}).partial();
//
// 			convertToZod({
//                 type
// 				properties: {
// 					[abi.name]: { type: parseBaseType(abiType) },
// 				},
// 			});
// 			abiType = abi.type;
// 			abiName = abi.name;
// 			abiComponents = abi.components as FullValidationSchema;
// 			// If its short form string value e.g. ['uint']
// 		} else if (typeof abi === 'string') {
// 			abiType = abi;
// 			abiName = `${level}/${index}`;
//
// 			// If it's provided in short form of tuple e.g. [['uint', 'string']]
// 		} else if (Array.isArray(abi)) {
// 			// If its custom tuple e.g. ['tuple[2]', ['uint', 'string']]
// 			if (
// 				abi[0] &&
// 				typeof abi[0] === 'string' &&
// 				abi[0].startsWith('tuple') &&
// 				!Array.isArray(abi[0]) &&
// 				abi[1] &&
// 				Array.isArray(abi[1])
// 			) {
// 				// eslint-disable-next-line prefer-destructuring
// 				abiType = abi[0];
// 				abiName = `${level}/${index}`;
// 				abiComponents = abi[1] as ReadonlyArray<ShortValidationSchema>;
// 			} else {
// 				abiType = 'tuple';
// 				abiName = `${level}/${index}`;
// 				abiComponents = abi;
// 			}
// 		}
//
// 		const { baseType, isArray, arraySizes } = parseBaseType(abiType);
//
// 		let childSchema: ZodType;
// 		let lastSchema: ZodType;
// 		for (let i = arraySizes.length - 1; i > 0; i -= 1) {
// 			childSchema = convertToZod({
// 				type: 'array',
// 				items: [],
// 				maxItems: arraySizes[i],
// 				minItems: arraySizes[i],
// 			});
//
// 			lastSchema = childSchema;
// 		}
//
// 		if (baseType === 'tuple' && !isArray) {
// 			const nestedTuple = abiToZod(abiComponents, abiName);
// 			nestedTuple.$id = abiName;
// 			(lastSchema.items as JsonSchema[]).push(nestedTuple);
// 		} else if (baseType === 'tuple' && isArray) {
// 			const arraySize = arraySizes[0];
// 			const item: JsonSchema = {
// 				$id: abiName,
// 				type: 'array',
// 				items: abiToZod(abiComponents, abiName),
// 				maxItems: arraySize,
// 				minItems: arraySize,
// 			};
//
// 			if (arraySize < 0) {
// 				delete item.maxItems;
// 				delete item.minItems;
// 			}
//
// 			(lastSchema.items as JsonSchema[]).push(item);
// 		} else if (isArray) {
// 			const arraySize = arraySizes[0];
// 			const item: JsonSchema = {
// 				type: 'array',
// 				$id: abiName,
// 				items: convertEthType(String(baseType)),
// 				minItems: arraySize,
// 				maxItems: arraySize,
// 			};
//
// 			if (arraySize < 0) {
// 				delete item.maxItems;
// 				delete item.minItems;
// 			}
//
// 			(lastSchema.items as JsonSchema[]).push(item);
// 		} else if (Array.isArray(lastSchema.items)) {
// 			// Array of non-tuple items
// 			lastSchema.items.push({ $id: abiName, ...convertEthType(abiType) });
// 		} else {
// 			// Nested object
// 			((lastSchema.items as JsonSchema).items as JsonSchema[]).push({
// 				$id: abiName,
// 				...convertEthType(abiType),
// 			});
// 		}
// 	}
//
// 	return schema;
// };

export class Validator {
	// eslint-disable-next-line no-use-before-define
	private static validatorInstance?: Validator;

	// eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
	public static factory(): Validator {
		if (!Validator.validatorInstance) {
			Validator.validatorInstance = new Validator();
		}
		return Validator.validatorInstance;
	}

	public validate(schema: Schema, data: Json, options?: { silent?: boolean }) {
		const zod = convertToZod(schema);
		const result = zod.safeParse(data);
		if (!result.success) {
			const errors = this.convertErrors(result.error?.issues ?? []);
			if (errors) {
				if (options?.silent) {
					return errors;
				}
				throw new Web3ValidatorError(errors);
			}
		}
		return undefined;
	}
	// eslint-disable-next-line class-methods-use-this
	private convertErrors(errors: ZodIssue[] | undefined): Web3ValidationErrorObject[] | undefined {
		if (errors && Array.isArray(errors) && errors.length > 0) {
			return errors.map((error: ZodIssue) => {
				let message;
				let keyword;
				let params;
				let schemaPath;

				schemaPath = error.path.join('/');

				const field = String(error.path[error.path.length - 1]);
				const instancePath = error.path.join('/');
				if (error.code === ZodIssueCode.too_big) {
					keyword = 'maxItems';
					schemaPath = `${instancePath}/maxItems`;
					params = { limit: error.maximum };
					message = `must NOT have more than ${error.maximum} items`;
				} else if (error.code === ZodIssueCode.too_small) {
					keyword = 'minItems';
					schemaPath = `${instancePath}/minItems`;
					params = { limit: error.minimum };
					message = `must NOT have fewer than ${error.minimum} items`;
				} else if (error.code === ZodIssueCode.custom) {
					const { value, format } = (error.params ?? {}) as {
						value: unknown;
						format: string;
					};

					if (typeof value === 'undefined') {
						message = `value at "/${schemaPath}" is required`;
					} else {
						message = `value "${
							// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
							typeof value === 'object' ? JSON.stringify(value) : value
						}" at "/${schemaPath}" must pass "${format}" validation`;
					}

					params = { value };
				}

				return {
					keyword: keyword ?? field,
					instancePath: instancePath ? `/${instancePath}` : '',
					schemaPath: schemaPath ? `#${schemaPath}` : '#',
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					params: params ?? { value: error.message },
					message: message ?? error.message,
				} as Web3ValidationErrorObject;
			});
		}
		return undefined;
	}
}
