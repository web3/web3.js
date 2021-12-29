import { ValidInputTypes } from '../types';

/**
 * checks input if typeof data is valid string input
 */
export const isString = (value: ValidInputTypes) => typeof value === 'string';

export const isHexStrict = (hex: ValidInputTypes) =>
	typeof hex === 'string' && /^(-)?0x[0-9a-f]*$/i.test(hex);

export const isHex = (hex: ValidInputTypes): boolean =>
	typeof hex === 'number' ||
	typeof hex === 'bigint' ||
	(typeof hex === 'string' && /^(-0x|0x)?[0-9a-f]*$/i.test(hex));

export const isHexString8Bytes = (value: string, prefixed = true) =>
	prefixed ? isHexStrict(value) && value.length === 18 : isHex(value) && value.length === 16;

export const isHexString32Bytes = (value: string, prefixed = true) =>
	prefixed ? isHexStrict(value) && value.length === 66 : isHex(value) && value.length === 64;
