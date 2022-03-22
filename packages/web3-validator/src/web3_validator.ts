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

import Ajv from 'ajv';
import { ethAbiToJsonSchema } from './utils';
import { ValidationSchemaInput, Web3ValidationErrorObject, Web3ValidationOptions } from './types';
import { ethKeyword } from './keywords/eth';
import { Web3ValidatorError } from './errors';
import * as formats from './formats';

export class Web3Validator {
	private readonly _validator: Ajv;

	public constructor() {
		this._validator = new Ajv({
			strict: true,
			strictSchema: true,
			allErrors: true,
			useDefaults: false,
			// To avoid warnings for not defining `type` for each property
			strictTypes: false,

			// To avoid strict mode error for minItems or maxItems/additionalItems
			strictTuples: false,
		});

		this._validator.addKeyword(ethKeyword);

		for (const formatName of Object.keys(formats)) {
			// eslint-disable-next-line import/namespace
			this._validator.addFormat(formatName, formats[formatName as keyof typeof formats]);
		}
	}

	public validateJSONSchema(
		schema: object,
		data: object,
		options?: Web3ValidationOptions,
	): Web3ValidationErrorObject[] | undefined {
		let errors: Web3ValidationErrorObject[] = [];

		if (!this._validator.validate(schema, data)) {
			errors = this._validator.errors as Web3ValidationErrorObject[];
		}

		if (options?.silent) {
			return errors;
		}

		if (errors.length && !options?.silent) {
			throw new Web3ValidatorError(errors);
		}

		return undefined;
	}

	public validate(
		schema: ValidationSchemaInput,
		data: ReadonlyArray<unknown>,
		options: Web3ValidationOptions = { silent: false },
	): Web3ValidationErrorObject[] | undefined {
		const jsonSchema = ethAbiToJsonSchema(schema);

		if (
			Array.isArray(jsonSchema.items) &&
			jsonSchema.items?.length === 0 &&
			data.length === 0
		) {
			return undefined;
		}

		if (
			Array.isArray(jsonSchema.items) &&
			jsonSchema.items?.length === 0 &&
			data.length !== 0
		) {
			throw new Web3ValidatorError([
				{
					instancePath: '/0',
					schemaPath: '/',
					keyword: 'required',
					message: 'empty schema against data can not be validated',
					params: data,
				},
			]);
		}

		if (!this._validator.validate(jsonSchema, data)) {
			const errors = this._validator.errors as Web3ValidationErrorObject[];

			if (options?.silent) {
				return errors;
			}

			if (errors.length && !options?.silent) {
				throw new Web3ValidatorError(errors);
			}
		}

		return undefined;
	}
}
