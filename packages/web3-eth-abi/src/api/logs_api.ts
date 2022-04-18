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

import { HexString } from 'web3-utils';
import { AbiParameter } from '../types';
import { decodeParameter, decodeParametersWith } from './parameters_api';

const STATIC_TYPES = ['bool', 'string', 'int', 'uint', 'address', 'fixed', 'ufixed'];

/**
 * Decodes ABI-encoded log data and indexed topic data
 */
export const decodeLog = <ReturnType extends Record<string, unknown>>(
	inputs: Array<AbiParameter>,
	data: HexString,
	topics: string | string[],
) => {
	const clonedTopics = Array.isArray(topics) ? topics : [topics];
	const clonedData = data ?? '';

	const notIndexedInputs: Array<string | AbiParameter> = [];
	const indexedParams: Array<string | unknown> = [];
	let topicCount = 0;
	for (const [i, input] of inputs.entries()) {
		if (input.indexed) {
			indexedParams[i] = STATIC_TYPES.some(s => input.type.startsWith(s))
				? (decodeParameter(input.type, clonedTopics[topicCount])[0] as unknown[])
				: clonedTopics[topicCount];

			topicCount += 1;
		} else {
			notIndexedInputs[i] = input as unknown as AbiParameter;
		}
	}

	const nonIndexedData = clonedData;
	const notIndexedParams = nonIndexedData
		? decodeParametersWith(notIndexedInputs, nonIndexedData, true)
		: [];

	const returnValue: { [key: string]: unknown; __length__: number } = { __length__: 0 };
	returnValue.__length__ = 0;

	for (const [i, res] of inputs.entries()) {
		returnValue[i] = res.type === 'string' ? '' : null;

		if (notIndexedParams[i]) {
			returnValue[i] = notIndexedParams[i];
		}
		if (indexedParams[i]) {
			returnValue[i] = indexedParams[i];
		}

		if (res.name) {
			returnValue[res.name] = returnValue[i];
		}

		returnValue.__length__ += 1;
	}
	return returnValue as ReturnType & { __length__: number };
};
