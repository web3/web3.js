import { FormatDefinition } from 'ajv';
import { isUInt } from '../validation/numbers';

export const uint: FormatDefinition<number> = { validate: (data: number) => isUInt(data) };
