import { ValidInputTypes } from '../types';
import { parseBaseType } from '../utils';
import { isHexStrict } from './string';

/**
 * checks input if typeof data is valid buffer input
 */
export const isBuffer = (data: ValidInputTypes) => Buffer.isBuffer(data);

export const isBytes = (
	value: ValidInputTypes | Uint8Array | number[],
	options: { abiType: string; size?: never } | { size: number; abiType?: never } = {
		abiType: 'bytes',
	},
) => {
	if (
		typeof value !== 'string' &&
		!Buffer.isBuffer(value) &&
		!Array.isArray(value) &&
		!(value instanceof Uint8Array)
	) {
		return false;
	}

	// isHexStrict also accepts - prefix which can not exists in bytes
	if (typeof value === 'string' && isHexStrict(value) && value.startsWith('-')) {
		return false;
	}

	if (typeof value === 'string' && !isHexStrict(value)) {
		return false;
	}

	let valueToCheck: Buffer;

	if (typeof value === 'string' && isHexStrict(value)) {
		valueToCheck = Buffer.from(value.substring(2), 'hex');
	} else if (Array.isArray(value)) {
		if (value.some(d => d < 0)) {
			return false;
		}

		if (value.some(d => d > 255)) {
			return false;
		}

		if (value.some(d => !Number.isInteger(d))) {
			return false;
		}
		valueToCheck = Buffer.from(value);
	} else if (value instanceof Uint8Array) {
		valueToCheck = Buffer.from(value);
	} else {
		valueToCheck = value as unknown as Buffer;
	}

	if (options?.abiType) {
		const { baseTypeSize } = parseBaseType(options.abiType);

		return baseTypeSize ? valueToCheck.length === baseTypeSize : true;
	}

	if (options?.size) {
		return valueToCheck.length === options?.size;
	}

	return true;
};
