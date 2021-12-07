import { AbiError } from 'web3-common';
import { ParamType } from '@ethersproject/abi';
import { HexString } from 'web3-utils';
import ethersAbiCoder from '../ethers_abi_coder';
import { AbiInput } from '../types';
import { formatParam, isAbiFragment, mapTypes, modifyParams } from '../utils';

/**
 * Should be used to encode list of params
 */
export const encodeParameters = (abi: AbiInput[], params: unknown[]): string => {
	try {
		const modifiedTypes = mapTypes(Array.isArray(abi) ? abi : [abi]);
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
	} catch (err) {
		throw new AbiError(`Parameter encoding error: ${(err as Error).message}`);
	}
};

/**
 * Should be used to encode plain param
 */
export const encodeParameter = (abi: AbiInput, param: unknown): string =>
	encodeParameters([abi], [param]);

/**
 * Should be used to decode list of params
 */
export const decodeParametersWith = <ReturnType extends Record<string, unknown>>(
	abis: AbiInput[],
	bytes: HexString,
	loose: boolean,
): ReturnType & { __length__: number } => {
	try {
		if (abis.length > 0 && (!bytes || bytes === '0x' || bytes === '0X')) {
			throw new AbiError(
				"Returned values aren't valid, did it run Out of Gas? " +
					'You might also see this error if you are not using the ' +
					'correct ABI for the contract you are retrieving data from, ' +
					'requesting data from a block number that does not exist, ' +
					'or querying a node which is not fully synced.',
			);
		}

		const res = ethersAbiCoder.decode(
			mapTypes(abis).map(p => ParamType.from(p)),
			`0x${bytes.replace(/0x/i, '')}`,
			loose,
		);

		const returnValue: { [key: string]: unknown; __length__: number } = { __length__: 0 };
		returnValue.__length__ = 0;

		for (const [i, abi] of abis.entries()) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			let decodedValue = res[returnValue.__length__];
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			decodedValue = decodedValue === '0x' ? null : decodedValue;

			returnValue[i] = decodedValue;

			if ((typeof abi === 'function' || (!!abi && typeof abi === 'object')) && abi.name) {
				returnValue[abi.name as string] = decodedValue;
			}

			returnValue.__length__ += 1;
		}

		return returnValue as ReturnType & { __length__: number };
	} catch (err) {
		throw new AbiError(`Parameter decoding error: ${(err as Error).message}`);
	}
};

/**
 * Should be used to decode list of params
 */
export const decodeParameters = <ReturnType extends Record<string, unknown>>(
	abi: AbiInput[],
	bytes: HexString,
) => decodeParametersWith<ReturnType>(abi, bytes, false);

/**
 * Should be used to decode bytes to plain param
 */
export const decodeParameter = <ReturnType extends Record<string, unknown>>(
	abi: AbiInput,
	bytes: HexString,
) => decodeParameters<ReturnType>([abi], bytes)['0'];
