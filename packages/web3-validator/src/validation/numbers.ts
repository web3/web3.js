import { hexToNumber } from 'web3-utils';
import { ValidInputTypes } from '../types';
import { parseBaseType } from '../utils';
import { isHexStrict } from './string';

/**
 * Checks if a given value is a valid big int
 */
export const isBigInt = (value: ValidInputTypes): boolean => typeof value === 'bigint';

export const isUInt = (
	value: ValidInputTypes,
	options: { abiType: string; bitSize?: never } | { bitSize: number; abiType?: never } = {
		abiType: 'uint',
	},
) => {
	if (!['number', 'string', 'bigint'].includes(typeof value)) {
		return false;
	}

	let size!: number;

	if (options?.abiType) {
		const { baseTypeSize } = parseBaseType(options.abiType);

		if (baseTypeSize) {
			size = baseTypeSize;
		}
	} else if (options.bitSize) {
		size = options.bitSize;
	}

	const maxSize = BigInt(2) ** BigInt(size ?? 256) - BigInt(1);
	const valueToCheck =
		typeof value === 'string' && isHexStrict(value)
			? BigInt(hexToNumber(value))
			: BigInt(value as number);

	return valueToCheck >= 0 && valueToCheck <= maxSize;
};

export const isInt = (
	value: ValidInputTypes,
	options: { abiType: string; bitSize?: never } | { bitSize: number; abiType?: never } = {
		abiType: 'int',
	},
) => {
	if (!['number', 'string', 'bigint'].includes(typeof value)) {
		return false;
	}

	let size!: number;

	if (options?.abiType) {
		const { baseTypeSize } = parseBaseType(options.abiType);

		if (baseTypeSize) {
			size = baseTypeSize;
		}
	} else if (options.bitSize) {
		size = options.bitSize;
	}

	const maxSize = BigInt(2) ** BigInt((size ?? 256) - 1);
	const minSize = BigInt(-1) * BigInt(2) ** BigInt((size ?? 256) - 1);
	const valueToCheck =
		typeof value === 'string' && isHexStrict(value)
			? BigInt(hexToNumber(value))
			: BigInt(value as number);

	return valueToCheck >= minSize && valueToCheck <= maxSize;
};
