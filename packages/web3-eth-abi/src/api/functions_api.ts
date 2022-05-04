/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import { AbiError } from 'web3-errors';
import { sha3Raw } from 'web3-utils';
import { isAbiFunctionFragment, jsonInterfaceMethodToString } from '../utils';
import { AbiFunctionFragment } from '../types';
import { encodeParameters } from './parameters_api';

/**
 * Encodes the function name to its ABI representation, which are the first 4 bytes of the sha3 of the function name including  types.
 */
export const encodeFunctionSignature = (functionName: string | AbiFunctionFragment): string => {
	if (typeof functionName !== 'string' && !isAbiFunctionFragment(functionName)) {
		throw new AbiError('Invalid parameter value in encodeFunctionSignature');
	}

	let name: string;

	if (functionName && (typeof functionName === 'function' || typeof functionName === 'object')) {
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
	jsonInterface: AbiFunctionFragment,
	params: unknown[],
): string => {
	if (!isAbiFunctionFragment(jsonInterface)) {
		throw new AbiError('Invalid parameter value in encodeFunctionCall');
	}

	return `${encodeFunctionSignature(jsonInterface)}${encodeParameters(
		jsonInterface.inputs ?? [],
		params ?? [],
	).replace('0x', '')}`;
};
