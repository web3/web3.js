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
