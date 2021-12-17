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
