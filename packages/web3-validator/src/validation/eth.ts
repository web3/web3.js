import { parseBaseType } from '../utils';

export const isValidEthType = (type: string): boolean => {
	const { baseType, baseTypeSize } = parseBaseType(type);

	if (baseType === type) {
		return true;
	}

	if ((baseType === 'int' || baseType === 'uint') && baseTypeSize) {
		if (baseTypeSize <= 256 && baseTypeSize % 8 === 0) {
			return true;
		}

		return false;
	}

	if (baseType === 'bytes' && baseTypeSize) {
		if (baseTypeSize >= 1 && baseTypeSize <= 32) {
			return true;
		}

		return false;
	}

	return false;
};
