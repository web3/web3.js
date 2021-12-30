import { FormatDefinition } from 'ajv';
import { isBlockNumber, isBlockNumberOrTag, isBlockTag } from '../validation/block';

export const blockNumber: FormatDefinition<string> = {
	validate: (data: string) => isBlockNumber(data),
};

export const blockTag: FormatDefinition<string> = {
	validate: (data: string) => isBlockTag(data),
};

export const blockNumberOrTag: FormatDefinition<string> = {
	validate: (data: string) => isBlockNumberOrTag(data),
};
