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
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';
import { blake2b } from 'ethereum-cryptography/blake2b';
import { Filter } from 'web3-types';
import { Web3ValidatorError } from './errors';
import {
	Web3ValidationErrorObject,
	Validate,
	Json,
	Schema,
	RawValidationError,
	ValidInputTypes,
} from './types';
import {
	isAddress,
	isBlockNumber,
	isBlockNumberOrTag,
	isBlockTag,
	isBloom,
	isBoolean,
	isBytes,
	isFilterObject,
	isHexStrict,
	isInt,
	isNumber,
	isString,
	isUInt,
} from './validation';

const formats: { [key: string]: (data: unknown) => boolean } = {
	address: (data: unknown) => isAddress(data as ValidInputTypes),
	bloom: (data: unknown) => isBloom(data as ValidInputTypes),
	blockNumber: (data: unknown) => isBlockNumber(data as string | number | bigint),
	blockTag: (data: unknown) => isBlockTag(data as string),
	blockNumberOrTag: (data: unknown) => isBlockNumberOrTag(data as string | number | bigint),
	bool: (data: unknown) => isBoolean(data as ValidInputTypes),
	bytes: (data: unknown) => isBytes(data as ValidInputTypes | Uint8Array | number[]),
	filter: (data: unknown) => isFilterObject(data as Filter),
	hex: (data: unknown) => isHexStrict(data as ValidInputTypes),
	uint: (data: unknown) => isUInt(data as ValidInputTypes),
	int: (data: unknown) => isInt(data as ValidInputTypes),
	number: (data: unknown) => isNumber(data as ValidInputTypes),
	string: (data: unknown) => isString(data as ValidInputTypes),
};
// generate formats for all numbers types
for (let i = 3; i <= 8; i += 1) {
	const bitSize = 2 ** i;
	formats[`int${bitSize}`] = data => isInt(data as ValidInputTypes, { bitSize });
	formats[`uint${bitSize}`] = data => isUInt(data as ValidInputTypes, { bitSize });
}
// generate bytes
for (let i = 1; i <= 32; i += 1) {
	const size = 2 ** i;
	formats[`bytes${size}`] = data =>
		isBytes(data as ValidInputTypes | Uint8Array | number[], { size });
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const validator = require('is-my-json-valid');

export class Validator {
	private readonly _schemas: Map<string, Validate> = new Map();
	public getSchema(key: string) {
		return this._schemas.get(key);
	}

	public addSchema(key: string, schema: Schema) {
		this._schemas.set(key, this.createValidator(schema));
	}

	// eslint-disable-next-line  class-methods-use-this
	private createValidator(schema: Schema): Validate {
		// eslint-disable-next-line  @typescript-eslint/no-unsafe-call
		return validator(schema, {
			formats,
			greedy: true,
			verbose: true,
			additionalProperties: false,
		}) as Validate;
	}

	public validate(schema: Schema, data: Json, options?: { silent?: boolean }) {
		const localValidate = this.getOrCreateValidator(schema);
		if (!localValidate(data)) {
			const errors = this.convertErrors(
				localValidate.errors as RawValidationError[],
				schema,
				data,
			);
			if (errors) {
				if (options?.silent) {
					return errors;
				}
				throw new Web3ValidatorError(errors);
			}
		}
		return undefined;
	}
	private convertErrors(
		errors: RawValidationError[] | undefined,
		schema: Schema,
		data: Json,
	): Web3ValidationErrorObject[] | undefined {
		if (errors && Array.isArray(errors) && errors.length > 0) {
			return errors.map((error: RawValidationError) => {
				let message;
				let keyword;
				let params;
				let schemaPath;

				schemaPath = Array.isArray(error.schemaPath)
					? error.schemaPath.slice(1).join('/')
					: '';

				const { field } = error;
				const _instancePath =
					// eslint-disable-next-line no-useless-escape
					field?.length >= 4 ? `${field.slice(4).replace(/\"|\[|\]/g, '')}` : '/';
				const instancePath = _instancePath ? `/${_instancePath}` : '';
				if (error?.message === 'has less items than allowed') {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					const schemaData = this.getObjectValueByPath(schema, schemaPath);
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					if (schemaData.minItems) {
						keyword = 'minItems';
						schemaPath = `${schemaPath}/minItems`;
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
						params = { limit: schemaData.minItems };
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
						message = `must NOT have fewer than ${schemaData.minItems} items`;
					}
				} else if (error?.message === 'has more items than allowed') {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					const schemaData = this.getObjectValueByPath(schema, schemaPath);
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					if (schemaData.maxItems) {
						keyword = 'maxItems';
						schemaPath = `${schemaPath}/maxItems`;
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
						params = { limit: schemaData.maxItems };
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
						message = `must NOT have more than ${schemaData.maxItems} items`;
					}
				} else if (
					error?.message.startsWith('must be') &&
					error?.message.endsWith('format')
				) {
					const formatName = error?.message.split(' ')[2];
					if (formatName) {
						message = `must pass "${formatName}" validation`;
					}
				}
				// eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment
				const dataValue = this.getObjectValueByPath(data as object, instancePath);
				return {
					keyword: keyword ?? error.field,
					instancePath,
					schemaPath: `#${schemaPath}`,
					// eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment
					params: params ?? { value: dataValue },
					message: message ?? error.message,
				} as Web3ValidationErrorObject;
			});
		}
		return undefined;
	}

	public getOrCreateValidator(schema: Schema): Validate {
		const key = Validator.getKey(schema);
		let _validator = this.getSchema(key);
		if (!_validator) {
			this.addSchema(key, schema);
			_validator = this.getSchema(key);
		}
		return _validator!;
	}

	public static getKey(schema: Schema) {
		return toHex(blake2b(utf8ToBytes(JSON.stringify(schema))));
	}
	private getObjectValueByPath(obj: object, pointer: string, objpath?: object[]) {
		try {
			if (typeof obj !== 'object') throw new Error('Invalid input object');
			if (typeof pointer !== 'string') throw new Error('Invalid JSON pointer');
			const parts = pointer.split('/');
			if (!['', '#'].includes(parts.shift() as string))
				throw new Error('Invalid JSON pointer');
			if (parts.length === 0) return obj;

			let curr: any = obj;
			for (const part of parts) {
				if (typeof part !== 'string') throw new Error('Invalid JSON pointer');
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
				if (objpath) objpath.push(curr); // does not include target itself, but includes head
				const prop = this.untilde(part);
				if (typeof curr !== 'object') return undefined;
				if (!Object.prototype.hasOwnProperty.call(curr, prop)) return undefined;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				curr = curr[prop];
			}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return curr;
		} catch (e) {
			return '';
		}
	}
	// eslint-disable-next-line class-methods-use-this
	private untilde(string: string) {
		if (!string.includes('~')) return string;
		return string.replace(/~[01]/g, match => {
			switch (match) {
				case '~1':
					return '/';
				case '~0':
					return '~';
				default:
					throw new Error('Unreachable');
			}
		});
	}
}
