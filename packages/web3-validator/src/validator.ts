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

import { Validator as JsonSchemaValidator, ValidationError } from 'jsonschema';
import formats from './formats.js';
import { Web3ValidatorError } from './errors.js';
import { Json, Schema } from './types.js';

export class Validator {
	private readonly internalValidator: JsonSchemaValidator;
	private constructor() {
		JsonSchemaValidator.prototype.customFormats = formats;
		this.internalValidator = new JsonSchemaValidator();
	}
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
		const validationResult = this.internalValidator.validate(data, schema);
		if (!validationResult.valid) {
			const errors = this.convertErrors(validationResult.errors);
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
	private convertErrors(
		errors: ValidationError[] | undefined,
	): Web3ValidationErrorObject[] | undefined {
		if (errors && Array.isArray(errors) && errors.length > 0) {
			return errors.map((error: ValidationError) => {
				let message;
				let keyword;
				let params;
				let schemaPath;

				schemaPath = error.path.join('/');

				const field = error.property;
				const instancePath = error.path.join('/');
				if (error?.message.startsWith('does not meet minimum length of')) {
					if (error.argument) {
						keyword = 'minItems';
						schemaPath = `${instancePath}/minItems`;
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
						params = { limit: error.argument };
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
						message = `must NOT have fewer than ${error.argument} items`;
					}
				} else if (error?.message.startsWith('does not meet maximum length of')) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					if (error.argument) {
						keyword = 'maxItems';
						schemaPath = `${instancePath}/maxItems`;
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
						params = { limit: error.argument };
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
						message = `must NOT have more than ${error.argument} items`;
					}
				} else if (
					error?.message.startsWith('does not conform to the') &&
					error?.message.endsWith('format')
				) {
					const formatName = error?.message.split(' ')[5];
					if (formatName) {
						message = `must pass ${formatName} validation`;
					}
				}
				return {
					keyword: keyword ?? field.replace('instance', 'data'),
					instancePath: instancePath ? `/${instancePath}` : '',
					schemaPath: schemaPath ? `#${schemaPath}` : '#',
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					params: params ?? { value: error.instance },
					message: message ?? error.message,
				} as Web3ValidationErrorObject;
			});
		}
		return undefined;
	}
}
