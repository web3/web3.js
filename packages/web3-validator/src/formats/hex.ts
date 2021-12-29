import { FormatDefinition } from 'ajv';
import { isHex, isHexStrict } from '../validation/string';

export const hex: FormatDefinition<string> = { validate: (data: string) => isHex(data) };
export const hexStrict: FormatDefinition<string> = {
	validate: (data: string) => isHexStrict(data),
};
