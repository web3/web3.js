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
		let errors: Web3ValidationErrorObject[] = [];

		if (!this._validator.validate(ethAbiToJsonSchema(schema), data)) {
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
}
