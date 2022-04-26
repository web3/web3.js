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
import { ParamType } from '@ethersproject/abi';
import { HexString } from 'web3-utils';
import ethersAbiCoder from '../ethers_abi_coder';
import { AbiInput } from '../types';
import { formatParam, isAbiFragment, mapTypes, modifyParams } from '../utils';

/**
 * Helper function to format the decoded object
 */
const formatDecodedObject = (
	abi: { [key: string]: unknown },
	input: { [key: string]: unknown },
): { [key: string]: unknown } => {
	const res: { [key: string]: unknown } = {};
	for (const j of Object.keys(abi)) {
		if (typeof abi[j] === 'string') {
			res[j] = input[j];
		}
		if (typeof abi[j] === 'object') {
			res[j] = formatDecodedObject(
				abi[j] as { [key: string]: unknown },
				input[j] as { [key: string]: unknown },
			);
		}
	}

	return res;
};

/**
 * Should be used to encode list of params
 */
export const encodeParameters = (abi: ReadonlyArray<AbiInput>, params: unknown[]): string => {
	try {
		const modifiedTypes = mapTypes(
			Array.isArray(abi) ? (abi as AbiInput[]) : ([abi] as unknown as AbiInput[]),
		);
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
export const decodeParametersWith = (
	abis: AbiInput[],
	bytes: HexString,
	loose: boolean,
): unknown[] => {
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
		const returnList: unknown[] = [];
		for (const [i, abi] of abis.entries()) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			let decodedValue = res[i];

			const isStringObject = typeof abi === 'object' && abi.type && abi.type === 'string';
			const isStringType = typeof abi === 'string' && abi === 'string';

			// only convert `0x` to null if it's not string value
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			decodedValue =
				decodedValue === '0x' && !isStringObject && !isStringType ? null : decodedValue;

			if (!!abi && typeof abi === 'object' && !abi.name && !Array.isArray(abi)) {
				// the length of the abi object will always be 1
				for (const j of Object.keys(abi)) {
					const abiObject: { [key: string]: unknown } = abi; // abi is readonly have to create a new const
					if (!!abiObject[j] && typeof abiObject[j] === 'object') {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
						decodedValue = formatDecodedObject(
							abiObject[j] as { [key: string]: unknown },
							decodedValue as { [key: string]: unknown },
						);
					}
				}
			}
			returnList.push(decodedValue);
		}
		return returnList;
	} catch (err) {
		throw new AbiError(`Parameter decoding error: ${(err as Error).message}`);
	}
};

/**
 * Should be used to decode list of params
 */
export const decodeParameters = (abi: AbiInput[], bytes: HexString) =>
	decodeParametersWith(abi, bytes, false);

/**
 * Should be used to decode bytes to plain param
 */
export const decodeParameter = (abi: AbiInput, bytes: HexString) => decodeParameters([abi], bytes);
