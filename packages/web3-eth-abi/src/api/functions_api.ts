import { jsonInterfaceMethodToString, sha3Raw } from 'web3-utils';
import { JsonAbiFunctionFragment } from '../types';
import { encodeParameters } from './parameters_api';

/**
 * Encodes the function name to its ABI representation, which are the first 4 bytes of the sha3 of the function name including  types.
 */
export const encodeFunctionSignature = (functionName: string | JsonAbiFunctionFragment): string => {
	let name: string;

	if (typeof functionName === 'function' || (typeof functionName === 'object' && functionName)) {
		name = jsonInterfaceMethodToString(functionName);
	} else {
		name = functionName;
	}

	return sha3Raw(name).slice(0, 10);
};

/**
 * Encodes a function call from its json interface and parameters.
 */
export const encodeFunctionCall = (
	jsonInterface: JsonAbiFunctionFragment,
	params: unknown,
): string =>
	`${encodeFunctionSignature(jsonInterface)}${encodeParameters(jsonInterface.inputs ?? [], [
		params,
	]).replace('0x', '')}`;
