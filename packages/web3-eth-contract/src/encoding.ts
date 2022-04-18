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

import { inputBlockNumberFormatter, LogsInput, outputLogFormatter } from 'web3-common';
import {
	AbiConstructorFragment,
	AbiEventFragment,
	AbiFunctionFragment,
	decodeLog,
	decodeParameters,
	encodeFunctionSignature,
	encodeParameter,
	encodeParameters,
	isAbiConstructorFragment,
} from 'web3-eth-abi';
import { Filter, HexString, Uint } from 'web3-utils';
import { Web3ContractError } from './errors';
import { ContractOptions } from './types';

export const encodeEventABI = (
	{ address }: ContractOptions,
	event: AbiEventFragment & { signature: string },
	options?: {
		fromBlock?: Uint;
		toBlock?: Uint;
		filter?: Filter;
		topics?: HexString | HexString[];
	},
) => {
	const opts: {
		filter: Filter;
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

				const value = opts.filter[input.name as keyof Filter];

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
	event: AbiEventFragment & { signature: string },
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
			// checks if event is anonymous
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
		returnValue: decodeLog([...event.inputs], data.data, argTopics),
		event: event.name,
		signature: event.anonymous || !data.topics[0] ? null : data.topics[0],
		raw: {
			data: data.data,
			topics: data.topics,
		},
	};
};

export const encodeMethodABI = (
	abi: AbiFunctionFragment | AbiConstructorFragment,
	args: unknown[],
	deployData?: HexString,
) => {
	const inputLength = Array.isArray(abi.inputs) ? abi.inputs.length : 0;

	if (inputLength !== args.length) {
		throw new Web3ContractError(
			`The number of arguments is not matching the methods required number. You need to pass ${inputLength} arguments.`,
		);
	}

	const params =
		(Array.isArray(abi.inputs) ? abi.inputs : []).map(i =>
			encodeParameters([i], args).replace('0x', ''),
		)[0] ?? '';

	if (isAbiConstructorFragment(abi)) {
		if (!deployData)
			throw new Web3ContractError(
				'The contract has no contract data option set. This is necessary to append the constructor parameters.',
			);

		if (!deployData.startsWith('0x')) {
			return `0x${deployData}${params}`;
		}

		return `${deployData}${params}`;
	}

	return `${encodeFunctionSignature(abi)}${params}`;
};

export const decodeMethodReturn = (abi: AbiFunctionFragment, returnValues?: HexString) => {
	// If it was constructor then we need to return contract address
	if (abi.type === 'constructor') {
		return returnValues;
	}

	if (!returnValues) {
		return null;
	}

	const value = returnValues.length >= 2 ? returnValues.slice(2) : returnValues;
	const result = decodeParameters([...abi.outputs], value);

	if (result.length === 1) {
		return result[0];
	}

	return result;
};
