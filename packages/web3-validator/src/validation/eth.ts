import { parseBaseType } from '../utils';

export const isValidEthBaseType = (type: string): boolean => {
	const { baseType, baseTypeSize } = parseBaseType(type);

	if (!baseType) {
		return false;
	}

	if (baseType === type) {
		return true;
	}

	if ((baseType === 'int' || baseType === 'uint') && baseTypeSize) {
		if (!(baseTypeSize <= 256 && baseTypeSize % 8 === 0)) {
			return false;
		}
	}

	if (baseType === 'bytes' && baseTypeSize) {
		if (!(baseTypeSize >= 1 && baseTypeSize <= 32)) {
			return false;
		}
	}

	return true;
};
