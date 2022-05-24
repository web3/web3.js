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

	const indexedInputs: Record<number, AbiParameter> = {};
	const nonIndexedInputs: Record<number, AbiParameter> = {};

	for (const [i, input] of inputs.entries()) {
		if (input.indexed) {
			indexedInputs[i] = input;
		} else {
			nonIndexedInputs[i] = input;
		}
	}

	const decodedNonIndexedInputs = data
		? decodeParametersWith(Object.values(nonIndexedInputs), data, true)
		: [];

	// If topics are more than indexed inputs, that means first topic is the event signature
	const offset = clonedTopics.length - Object.keys(indexedInputs).length;

	const decodedIndexedInputs = Object.values(indexedInputs).map((input, index) =>
		STATIC_TYPES.some(s => input.type.startsWith(s))
			? (decodeParameter(input.type, clonedTopics[index + offset])[0] as unknown[])
			: clonedTopics[index + offset],
	);

	const returnValue: { [key: string]: unknown; __length__: number } = { __length__: 0 };
	returnValue.__length__ = 0;

	let indexedCounter = 0;
	let nonIndexedCounter = 0;

	for (const [i, res] of inputs.entries()) {
		returnValue[i] = res.type === 'string' ? '' : null;

		if (indexedInputs[i]) {
			returnValue[i] = decodedIndexedInputs[indexedCounter];
			indexedCounter += 1;
		}

		if (nonIndexedInputs[i]) {
			returnValue[i] = decodedNonIndexedInputs[nonIndexedCounter];
			nonIndexedCounter += 1;
		}

		if (res.name) {
			returnValue[res.name] = returnValue[i];
		}

		returnValue.__length__ += 1;
	}

	return returnValue as ReturnType & { __length__: number };
};
