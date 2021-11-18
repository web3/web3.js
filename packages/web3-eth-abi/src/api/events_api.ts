import { sha3Raw } from 'web3-utils';
import { JsonAbiEventFragment } from '../types';
import { jsonInterfaceMethodToString, isAbiEventFragment } from '../utils';

/**
 * Encodes the function name to its ABI representation, which are the first 4 bytes of the sha3 of the function name including  types.
 */
export const encodeEventSignature = (functionName: string | JsonAbiEventFragment): string => {
	if (typeof functionName !== 'string' && !isAbiEventFragment(functionName)) {
		throw new Error('Invalid parameter value in encodeEventSignature');
	}

	let name: string;

	if (typeof functionName === 'function' || (typeof functionName === 'object' && functionName)) {
		name = jsonInterfaceMethodToString(functionName);
	} else {
		name = functionName;
	}

	return sha3Raw(name);
};
