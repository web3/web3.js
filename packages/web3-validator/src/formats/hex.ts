import { FormatDefinition } from 'ajv';
import { isHex, isHexStrict, isHexString32Bytes, isHexString8Bytes } from '../validation/string';

export const hex: FormatDefinition<string> = { validate: (data: string) => isHex(data) };

export const hexStrict: FormatDefinition<string> = {
	validate: (data: string) => isHexStrict(data),
};

export const hex8Bytes: FormatDefinition<string> = {
	validate: (data: string) => isHexString8Bytes(data),
};

export const hexString32Bytes: FormatDefinition<string> = {
	validate: (data: string) => isHexString32Bytes(data),
};
