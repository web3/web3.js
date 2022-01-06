import { AnySchemaObject, FuncKeywordDefinition, SchemaCxt } from 'ajv';
import { Web3ValidatorError } from '../errors';
import { DataValidateFunction, ValidInputTypes, Web3ValidationErrorObject } from '../types';
import {
	isBoolean,
	isString,
	isBytes,
	isInt,
	isUInt,
	isAddress,
	isValidEthType,
	isBloom,
} from '../validation';

const createErrorObject = (
	message: string,
	value: unknown,
): Partial<Web3ValidationErrorObject> => ({
	message,
	keyword: 'eth',
	params: { value },
});

export const metaSchema = {
	title: 'Web3 Ethereum Compatible Types',
	type: 'string',
};

const compile = (
	type: string,
	parentSchema: AnySchemaObject,
	it: SchemaCxt,
): DataValidateFunction => {
	const typePropertyPresent = Object.keys(parentSchema).includes('type');

	if (typePropertyPresent) {
		throw new Web3ValidatorError([
			{
				keyword: 'eth',
				message: 'Either "eth" or "type" can be presented in schema',
				params: { eth: type },
				instancePath: '',
				schemaPath: it.schemaPath.str ?? '',
			},
		]);
	}

	if (!isValidEthType(type)) {
		throw new Web3ValidatorError([
			{
				keyword: 'eth',
				message: `Eth data type "${type}" is not valid`,
				params: { eth: type },
				instancePath: '',
				schemaPath: it.schemaPath.str ?? '',
			},
		]);
	}

	const validate: DataValidateFunction = (
		data: ValidInputTypes,
		// Second parameter `dataCxt?: DataValidationCxt` might be useful for extensive validation
	): boolean => {
		let result = false;

		switch (type) {
			case 'boolean':
				result = isBoolean(data);
				break;
			case 'bytes':
				result = isBytes(data, { abiType: type });
				break;
			case 'string':
				result = isString(data);
				break;
			case 'uint':
				result = isUInt(data, { abiType: type });
				break;
			case 'int':
				result = isInt(data, { abiType: type });
				break;
			case 'address':
				result = isAddress(data);
				break;
			case 'bloom':
				result = isBloom(data);
				break;
			default:
				validate.errors = [createErrorObject(`can not identity "${type}"`, data)];
				return false;
		}

		if (!result) {
			validate.errors = [createErrorObject(`must pass "${type}" validation`, data)];
		}

		return result;
	};

	return validate;
};

export const ethKeyword: FuncKeywordDefinition = {
	keyword: 'eth',
	compile,
	errors: true,
	modifying: false,
	metaSchema,
};
