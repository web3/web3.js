import { HexString } from 'web3-utils';
import { JsonAbiParameter } from '../types';
import { decodeParameter, decodeParametersWith } from './parameters_api';

/**
 * Decodes events non- and indexed parameters.
 */
export const decodeLog = (
	inputs: Array<JsonAbiParameter>,
	_data: HexString,
	_topics: string | string[],
) => {
	const topics = Array.isArray(_topics) ? _topics : [_topics];

	const data = _data ?? '';

	const notIndexedInputs: Array<string | JsonAbiParameter> = [];
	const indexedParams: Array<string | JsonAbiParameter> = [];
	let topicCount = 0;

	// TODO check for anonymous logs?
	for (const [i, input] of inputs.entries()) {
		if (input.indexed) {
			indexedParams[i] = ['bool', 'int', 'uint', 'address', 'fixed', 'ufixed'].includes(
				input.type,
			)
				? (decodeParameter(input.type, topics[topicCount]) as unknown as JsonAbiParameter)
				: topics[topicCount];

			topicCount += 1;
		} else {
			notIndexedInputs[i] = input as unknown as JsonAbiParameter;
		}
	}

	const nonIndexedData = data;
	const notIndexedParams = nonIndexedData
		? decodeParametersWith(notIndexedInputs, nonIndexedData, true)
		: [];

	const returnValue: { [key: string]: unknown; __length__: number } = { __length__: 0 };
	returnValue.__length__ = 0;

	for (const [i, res] of inputs.entries()) {
		returnValue[i] = res.type === 'string' ? '' : null;

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		if (notIndexedParams[i]) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
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

	return returnValue;
};
