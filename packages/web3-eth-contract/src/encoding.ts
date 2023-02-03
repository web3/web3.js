﻿/*
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

import { DataFormat, DEFAULT_RETURN_FORMAT, format, isNullish } from 'web3-utils';

import {
	AbiConstructorFragment,
	AbiErrorFragment,
	AbiEventFragment,
	AbiFunctionFragment,
	LogsInput,
	BlockNumberOrTag,
	Filter,
	HexString,
	Topic,
	Numbers,
} from 'web3-types';

import {
	decodeLog,
	decodeParameters,
	encodeErrorSignature,
	encodeEventSignature,
	encodeFunctionSignature,
	encodeParameter,
	encodeParameters,
	isAbiConstructorFragment,
	jsonInterfaceMethodToString,
} from 'web3-eth-abi';

import { blockSchema, logSchema } from 'web3-eth';

import { Eip838ExecutionError, Web3ContractError } from 'web3-errors';
// eslint-disable-next-line import/no-cycle
import { ContractAbiWithSignature, ContractOptions, EventLog } from './types';

export const encodeEventABI = (
	{ address }: ContractOptions,
	event: AbiEventFragment & { signature: string },
	options?: {
		fromBlock?: BlockNumberOrTag;
		toBlock?: BlockNumberOrTag;
		filter?: Filter;
		// Using "null" type intentionally to match specifications
		// eslint-disable-next-line @typescript-eslint/ban-types
		topics?: (null | Topic | Topic[])[];
	},
	returnFormat: DataFormat = DEFAULT_RETURN_FORMAT,
) => {
	const opts: {
		filter: Filter;
		fromBlock?: Numbers;
		toBlock?: Numbers;
		topics?: (Topic | Topic[])[];
		address?: HexString;
	} = {
		filter: options?.filter ?? {},
	};

	if (!isNullish(options?.fromBlock)) {
		opts.fromBlock = format(blockSchema.properties.number, options?.fromBlock, returnFormat);
	}

	if (!isNullish(options?.toBlock)) {
		opts.toBlock = format(blockSchema.properties.number, options?.toBlock, returnFormat);
	}

	if (options?.topics && Array.isArray(options.topics)) {
		opts.topics = [...options.topics].filter(Boolean) as Topic[];
	} else {
		opts.topics = [];

		// add event signature
		if (event && !event.anonymous && event.name !== 'ALLEVENTS') {
			opts.topics.push(
				event.signature ?? encodeEventSignature(jsonInterfaceMethodToString(event)),
			);
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
	jsonInterface: ContractAbiWithSignature,
	returnFormat: DataFormat = DEFAULT_RETURN_FORMAT,
): EventLog => {
	let modifiedEvent = { ...event };

	const result = format(logSchema, data, returnFormat);

	// if allEvents get the right event
	if (modifiedEvent.name === 'ALLEVENTS') {
		const matchedEvent = jsonInterface.find(j => j.signature === data.topics[0]);
		if (matchedEvent) {
			modifiedEvent = matchedEvent as AbiEventFragment & { signature: string };
		} else {
			modifiedEvent = { anonymous: true } as unknown as AbiEventFragment & {
				signature: string;
			};
		}
	}

	// create empty inputs if none are present (e.g. anonymous events on allEvents)
	modifiedEvent.inputs = modifiedEvent.inputs ?? event.inputs ?? [];

	// Handle case where an event signature shadows the current ABI with non-identical
	// arg indexing. If # of topics doesn't match, event is anon.
	if (!modifiedEvent.anonymous) {
		let indexedInputs = 0;
		(modifiedEvent.inputs ?? []).forEach(input => {
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
		returnValues: decodeLog([...(modifiedEvent.inputs ?? [])], data.data, argTopics),
		event: modifiedEvent.name,
		signature:
			modifiedEvent.anonymous || !data.topics || data.topics.length === 0 || !data.topics[0]
				? undefined
				: data.topics[0],

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

	const params = encodeParameters(Array.isArray(abi.inputs) ? abi.inputs : [], args).replace(
		'0x',
		'',
	);

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
		// Using "null" value intentionally to match legacy behavior
		// eslint-disable-next-line no-null/no-null
		return null;
	}

	const value = returnValues.length >= 2 ? returnValues.slice(2) : returnValues;
	if (!abi.outputs) {
		// eslint-disable-next-line no-null/no-null
		return null;
	}
	const result = decodeParameters([...abi.outputs], value);

	if (result.__length__ === 1) {
		return result[0];
	}

	return result;
};

export const decodeErrorData = (errorsAbi: AbiErrorFragment[], error: Eip838ExecutionError) => {
	if (error?.data) {
		let errorName: string | undefined;
		let errorSignature: string | undefined;
		let errorArgs: { [K in string]: unknown } | undefined;
		try {
			const errorSha = error.data.slice(0, 10);
			const errorAbi = errorsAbi.find(abi => encodeErrorSignature(abi).startsWith(errorSha));

			if (errorAbi?.inputs) {
				errorName = errorAbi.name;
				errorSignature = jsonInterfaceMethodToString(errorAbi);
				// decode abi.inputs according to EIP-838
				errorArgs = decodeParameters([...errorAbi.inputs], error.data.substring(10));
			}
		} catch (err) {
			console.error(err);
		}
		if (errorName) {
			error.setDecodedProperties(errorName, errorSignature, errorArgs);
		}
	}
};