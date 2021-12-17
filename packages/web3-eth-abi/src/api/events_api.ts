import { AbiError } from 'web3-common';
import { sha3Raw } from 'web3-utils';
import { AbiEventFragment } from '../types';
import { jsonInterfaceMethodToString, isAbiEventFragment } from '../utils';

/**
 * Encodes the event name to its ABI signature, which are the sha3 hash of the event name including input types..
 */
export const encodeEventSignature = (functionName: string | AbiEventFragment): string => {
	if (typeof functionName !== 'string' && !isAbiEventFragment(functionName)) {
		throw new AbiError('Invalid parameter value in encodeEventSignature');
	}

	let name: string;

	if (functionName && (typeof functionName === 'function' || typeof functionName === 'object')) {
		name = jsonInterfaceMethodToString(functionName);
	} else {
		name = functionName;
	}

	return sha3Raw(name);
};
