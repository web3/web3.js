import { ValidInputTypes } from '../types';
import { parseBaseType } from '../utils';
import { isHexStrict } from './string';

/**
 * checks input if typeof data is valid buffer input
 */
export const isBuffer = (data: ValidInputTypes) => Buffer.isBuffer(data);

export const isBytes = (value: ValidInputTypes, type: string) => {
	if (typeof value !== 'string' && !Buffer.isBuffer(value)) {
		return false;
	}

	let valueToCheck: Buffer;

	if (typeof value === 'string' && isHexStrict(value)) {
		valueToCheck = Buffer.from(value.substring(2), 'hex');
	} else if (typeof value === 'string' && !isHexStrict(value)) {
		valueToCheck = Buffer.from(value, 'hex');
	} else {
		valueToCheck = value as Buffer;
	}

	const { baseTypeSize: size } = parseBaseType(type);

	if (!size) {
		return true;
	}

	return valueToCheck.length === size;
};
