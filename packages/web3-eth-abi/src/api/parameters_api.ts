import { ParamType } from '@ethersproject/abi';
import { HexString } from 'web3-utils';
import ethersAbiCoder from '../ethers_abi_coder';
import { JsonAbiParameter } from '../types';
import { formatParam, modifyParams, isAbiFragment, mapTypes } from '../utils';

/**
 * Should be used to encode list of params
 */
export const encodeParameters = (
	types: Array<JsonAbiParameter>,
	params: Array<unknown>,
): string => {
	const modifiedTypes = mapTypes(types);
	const modifiedParams: Array<unknown> = [];

	for (const [index, param] of params.entries()) {
		const item = modifiedTypes[index];
		let type: string;

		if (isAbiFragment(item) && item.type) {
			// We may get a named type of shape {name, type}
			type = item.type;
		} else {
			type = item as unknown as string;
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const newParam = formatParam(type, param);

		if (typeof type === 'string' && type.includes('tuple')) {
			const coder = ethersAbiCoder._getCoder(ParamType.from(type));
			modifyParams(coder, [newParam]);
		}

		modifiedParams.push(newParam);
	}

	return ethersAbiCoder.encode(
		modifiedTypes.map(p => ParamType.from(p)),
		modifiedParams,
	);
};

/**
 * Should be used to encode plain param
 */
export const encodeParameter = (type: JsonAbiParameter, param: unknown): string =>
	encodeParameters([type], [param]);

/**
 * Should be used to decode list of params
 */
export const decodeParametersWith = (
	outputs: (string | JsonAbiParameter)[],
	bytes: HexString,
	loose: boolean,
): Record<string, unknown> => {
	if (outputs.length > 0 && (!bytes || bytes === '0x' || bytes === '0X')) {
		throw new Error(
			"Returned values aren't valid, did it run Out of Gas? " +
				'You might also see this error if you are not using the ' +
				'correct ABI for the contract you are retrieving data from, ' +
				'requesting data from a block number that does not exist, ' +
				'or querying a node which is not fully synced.',
		);
	}

	const res = ethersAbiCoder.decode(
		mapTypes(outputs).map(p => ParamType.from(p)),
		`0x${bytes.replace(/0x/i, '')}`,
		loose,
	);
	const returnValue: { [key: string]: unknown; __length__: number } = { __length__: 0 };
	returnValue.__length__ = 0;

	for (const [i, output] of outputs.entries()) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		let decodedValue = res[returnValue.__length__];
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		decodedValue = decodedValue === '0x' ? null : decodedValue;

		returnValue[i] = decodedValue;

		if (
			(typeof output === 'function' || (!!output && typeof output === 'object')) &&
			output.name
		) {
			returnValue[output.name] = decodedValue;
		}

		returnValue.__length__ += 1;
	}

	return returnValue;
};

/**
 * Should be used to decode list of params
 */
export const decodeParameters = (outputs: (string | JsonAbiParameter)[], bytes: HexString) =>
	decodeParametersWith(outputs, bytes, false);

/**
 * Should be used to decode bytes to plain param
 */
export const decodeParameter = (
	type: string | JsonAbiParameter,
	bytes: HexString,
): Record<string, unknown> => decodeParameters([type], bytes);
