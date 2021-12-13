import Ajv from 'ajv';
import { ethAbiToJsonSchema } from './utils';
import { ValidationSchemaInput, Web3ValidationErrorObject } from './types';
import { ethKeyword } from './keywords/eth';

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

	public validateJSONSchema(schema: object, data: object): Web3ValidationErrorObject[] {
		if (!this._validator.validate(schema, data)) {
			return this._validator.errors as Web3ValidationErrorObject[];
		}

		return [];
	}

	public validate(
		schema: ValidationSchemaInput,
		data: ReadonlyArray<unknown>,
	): Web3ValidationErrorObject[] {
		if (!this._validator.validate(ethAbiToJsonSchema(schema), data)) {
			return this._validator.errors as Web3ValidationErrorObject[];
		}

		return [];
	}
}
