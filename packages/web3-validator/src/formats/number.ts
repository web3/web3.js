import { FormatDefinition } from 'ajv';
import { isUInt, isNumber } from '../validation/numbers';

export const uint: FormatDefinition<string> = { validate: (data: string) => isUInt(data) };
export const int: FormatDefinition<string> = { validate: (data: string) => isUInt(data) };
export const number: FormatDefinition<string> = { validate: (data: string) => isNumber(data) };
