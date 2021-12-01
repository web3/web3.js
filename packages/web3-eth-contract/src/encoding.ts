import { inputBlockNumberFormatter, LogsInput, outputLogFormatter } from 'web3-common';
import {
	decodeLog,
	decodeParameters,
	encodeParameter,
	encodeParameters,
	isAbiConstructorFragment,
	JsonAbiConstructorFragment,
	JsonAbiEventFragment,
	JsonAbiFunctionFragment,
} from 'web3-eth-abi';
import { HexString, Uint } from 'web3-utils';
import { ContractOptions } from './types';

export const encodeEventABI = (
	{ address }: ContractOptions,
	event: JsonAbiEventFragment & { signature: string },
	options?: {
		fromBlock?: Uint;
		toBlock?: Uint;
		filter: Record<string, string>;
		topics?: HexString | HexString[];
	},
) => {
	const opts: {
		filter: Record<string, string>;
		fromBlock?: string;
		toBlock?: string;
		topics?: HexString[];
		address?: HexString;
	} = {
		filter: options?.filter ?? {},
	};

	if (options?.fromBlock) {
		opts.fromBlock = inputBlockNumberFormatter(options.fromBlock);
	}

	if (options?.toBlock) {
		opts.toBlock = inputBlockNumberFormatter(options.toBlock);
	}

	if (options?.topics && Array.isArray(options.topics)) {
		opts.topics = [...options.topics];
	} else {
		opts.topics = [];

		// add event signature
		if (event && !event.anonymous && event.name !== 'ALLEVENTS') {
			opts.topics.push(event.signature);
		}

		// add event topics (indexed arguments)
		if (event.name !== 'ALLEVENTS' && event.inputs) {
			for (const input of event.inputs) {
				if (!input.indexed) {
					continue;
				}

				const value = opts.filter[input.name];

				if (!value) {
					continue;
				}

				// TODO: https://github.com/ethereum/web3.js/issues/344
				// TODO: deal properly with components
				if (Array.isArray(value)) {
					opts.topics.push(...value.map(v => encodeParameter(input.type, v)));
				}

				opts.topics.push(encodeParameter(input.type, value));
			}
		}
	}

	if (!opts.topics.length) delete opts.topics;

	if (address) {
		opts.address = address.toLowerCase();
	}

	return opts;
};

export const decodeEventABI = (
	event: JsonAbiEventFragment & { signature: string },
	data: LogsInput,
) => {
	let modifiedEvent = { ...event };
	const result = outputLogFormatter(data);

	// if allEvents get the right event
	if (event.name === 'ALLEVENTS' && event.signature === (data.topics ?? [])[0]) {
		modifiedEvent.anonymous = true;
	}

	// create empty inputs if none are present (e.g. anonymous events on allEvents)
	modifiedEvent.inputs = event.inputs ?? [];

	// Handle case where an event signature shadows the current ABI with non-identical
	// arg indexing. If # of topics doesn't match, event is anon.
	if (!event.anonymous) {
		let indexedInputs = 0;
		(event.inputs ?? []).forEach(input => {
			if (input.indexed) {
				indexedInputs += 1;
			}
		});

		if (indexedInputs > 0 && data?.topics && data?.topics.length !== indexedInputs + 1) {
			modifiedEvent = {
				...modifiedEvent,
				anonymous: true,
				inputs: [],
			};
		}
	}

	const argTopics = modifiedEvent.anonymous ? data.topics : (data.topics ?? []).slice(1);

	return {
		...result,
		returnValue: decodeLog(event.inputs ?? [], data.data, argTopics),
		event: event.name,
		signature: event.anonymous || !data.topics[0] ? null : data.topics[0],
		raw: {
			data: data.data,
			topics: data.topics,
		},
	};
};

export const encodeMethodABI = (
	abi: (JsonAbiFunctionFragment | JsonAbiConstructorFragment) & { signature?: string },
	args: unknown[],
	deployData?: HexString,
) => {
	if (abi.signature && abi.name !== abi.signature) {
		throw new Error('The ABI can not match with given signature');
	}

	const inputLength = Array.isArray(abi.inputs) ? abi.inputs.length : 0;
	if (inputLength !== args.length) {
		throw new Error(
			`The number of arguments is not matching the methods required number. You need to pass ${inputLength} arguments.`,
		);
	}

	const params =
		(Array.isArray(abi.inputs) ? abi.inputs : []).map(i =>
			encodeParameters([i], args).replace('0x', ''),
		)[0] ?? '';

	if (isAbiConstructorFragment(abi)) {
		if (!deployData)
			throw new Error(
				'The contract has no contract data option set. This is necessary to append the constructor parameters.',
			);

		if (!deployData.startsWith('0x')) {
			return `0x${deployData}${params}`;
		}

		return `${deployData}${params}`;
	}

	// return method
	const returnValue = abi.signature ? `${abi.signature}${params}` : params;

	if (!returnValue) {
		throw new Error(`Couldn't find a matching contract method named "${abi.name ?? ''}".`);
	}

	return returnValue;
};

export const decodeMethodReturn = (
	abi: (JsonAbiFunctionFragment | JsonAbiConstructorFragment) & { signature?: string },
	returnValues?: HexString,
) => {
	if (!returnValues) {
		return null;
	}

	const value = returnValues.length >= 2 ? returnValues.slice(2) : returnValues;
	const result = decodeParameters(abi.inputs ?? [], value);

	if (result.__length__ === 1) {
		return result[0];
	}

	return result;
};
