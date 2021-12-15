import { AnySchemaObject, FuncKeywordDefinition, SchemaCxt } from 'ajv';
import { Web3ValidatorError } from '../errors';
import { DataValidateFunction, DataValidationCxt, ValidInputTypes } from '../types';
import {
	isBoolean,
	isString,
	isBytes,
	isInt,
	isUInt,
	isAddress,
	isValidEthType,
} from '../validation';

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
		// TODO: Could be useful in future
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_dataCxt?: DataValidationCxt,
	): boolean => {
		if (type === 'boolean') {
			return isBoolean(data);
		}

		if (type === 'bytes') {
			return isBytes(data, type);
		}

		if (type === 'string') {
			return isString(data);
		}

		if (type === 'uint') {
			return isUInt(data, type);
		}

		if (type === 'int') {
			return isInt(data, type);
		}

		if (type === 'address') {
			return isAddress(data);
		}

		return false;
	};

	return validate;
};

export const ethKeyword: FuncKeywordDefinition = {
	keyword: 'eth',
	compile,
	errors: 'full',
	modifying: false,
	metaSchema,
};
