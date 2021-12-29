import { ValidInputTypes } from '../types';
import { isHexStrict } from './string';

export const isBoolean = (value: ValidInputTypes) => {
	if (!['number', 'string', 'boolean'].includes(typeof value)) {
		return false;
	}

	if (typeof value === 'boolean') {
		return true;
	}

	if (typeof value === 'string' && !isHexStrict(value)) {
		return value === '1' || value === '0';
	}

	if (typeof value === 'string' && isHexStrict(value)) {
		return value === '0x1' || value === '0x0';
	}

	if (typeof value === 'number') {
		return value === 1 || value === 0;
	}

	return false;
};
