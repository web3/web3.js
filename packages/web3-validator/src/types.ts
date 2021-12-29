import { ErrorObject } from 'ajv';
import { AbiParameter } from './private_types';

export { JSONSchemaType } from 'ajv';
export { DataValidateFunction, DataValidationCxt } from 'ajv/dist/types';

export type Web3ValidationErrorObject = ErrorObject;
export type ValidInputTypes = Buffer | bigint | string | number | boolean;

export type FullValidationSchema = ReadonlyArray<AbiParameter>;
export type ShortValidationSchema = ReadonlyArray<string | ShortValidationSchema>;
export type ValidationSchemaInput = FullValidationSchema | ShortValidationSchema;

export type Web3ValidationOptions = {
	readonly silent: boolean;
};

// Some duplicate types introduced to avoid circular dependency to avoid
// breaking changes in "web3-utils" package.
export enum BlockTags {
	EARLIEST = 'earliest',
	LATEST = 'latest',
	PENDING = 'pending',
}

export type BlockTag = 'earliest' | 'latest' | 'pending';

export type BlockNumberOrTag = string | BlockTag;

export interface Filter {
	readonly fromBlock?: BlockNumberOrTag;
	readonly toBlock?: BlockNumberOrTag;
	readonly address?: string | string[];
	readonly topics?: (string | string[] | null)[];
}
