import Ajv from 'ajv';
import { ethAbiToJsonSchema } from './utils';
import { ValidationSchemaInput, Web3ValidationErrorObject, Web3ValidationOptions } from './types';
import { ethKeyword } from './keywords/eth';
import { Web3ValidatorError } from './errors';

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
	}

	public validateJSONSchema(
		schema: object,
		data: object,
		options?: Web3ValidationOptions,
	): Web3ValidationErrorObject[] {
		let errors: Web3ValidationErrorObject[] = [];

		if (!this._validator.validate(schema, data)) {
			errors = this._validator.errors as Web3ValidationErrorObject[];
		}

		if (options?.silent) {
			return errors;
		}

		throw new Web3ValidatorError(errors);
	}

	public validate(
		schema: ValidationSchemaInput,
		data: ReadonlyArray<unknown>,
		options?: Web3ValidationOptions,
	): Web3ValidationErrorObject[] {
		let errors: Web3ValidationErrorObject[] = [];

		if (!this._validator.validate(ethAbiToJsonSchema(schema), data)) {
			errors = this._validator.errors as Web3ValidationErrorObject[];
		}

		if (options?.silent) {
			return errors;
		}

		throw new Web3ValidatorError(errors);
	}
}
