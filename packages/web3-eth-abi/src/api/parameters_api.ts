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

import { AbiError } from 'web3-errors';
import { ParamType, Result } from '@ethersproject/abi';
import { HexString, AbiInput, DecodedParams } from 'web3-types';
import ethersAbiCoder from '../ethers_abi_coder.js';
import { formatParam, isAbiFragment, mapTypes, modifyParams } from '../utils.js';

/**
 * Encodes a parameter based on its type to its ABI representation.
 * @param abi - An array of {@link AbiInput}. See [Solidity's documentation](https://solidity.readthedocs.io/en/v0.5.3/abi-spec.html#json) for more details.
 * @param params - The actual parameters to encode.
 * @returns - The ABI encoded parameters
 * @example
 * ```ts
 * const res = web3.eth.abi.encodeParameters(
 *    ["uint256", "string"],
 *    ["2345675643", "Hello!%"]
 *  );
 *
 *  console.log(res);
 *  > 0x000000000000000000000000000000000000000000000000000000008bd02b7b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000748656c6c6f212500000000000000000000000000000000000000000000000000
 * ```
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
		throw new AbiError(`Parameter encoding error`, err as Error);
	}
};

/**
 * Encodes a parameter based on its type to its ABI representation.
 * @param abi -  The type of the parameter. See the [Solidity documentation](https://docs.soliditylang.org/en/develop/types.html) for a list of types.
 * @param param - The actual parameter to encode.
 * @returns -  The ABI encoded parameter
 * @example
 * ```ts
 *  const res = web3.eth.abi.encodeParameter("uint256", "2345675643");
 *  console.log(res);
 *  0x000000000000000000000000000000000000000000000000000000008bd02b7b
 *
 *  const res = web3.eth.abi.encodeParameter("uint", "2345675643");
 *
 *  console.log(res);
 *  >0x000000000000000000000000000000000000000000000000000000008bd02b7b
 *
 *    const res = web3.eth.abi.encodeParameter("bytes32", "0xdf3234");
 *
 *  console.log(res);
 *  >0xdf32340000000000000000000000000000000000000000000000000000000000
 *
 *   const res = web3.eth.abi.encodeParameter("bytes", "0xdf3234");
 *
 *  console.log(res);
 *  > 0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003df32340000000000000000000000000000000000000000000000000000000000
 *
 *   const res = web3.eth.abi.encodeParameter("bytes32[]", ["0xdf3234", "0xfdfd"]);
 *
 *  console.log(res);
 *  > 0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002df32340000000000000000000000000000000000000000000000000000000000fdfd000000000000000000000000000000000000000000000000000000000000
 *
 *  const res = web3.eth.abi.encodeParameter(
 *    {
 *      ParentStruct: {
 *        propertyOne: "uint256",
 *        propertyTwo: "uint256",
 *        childStruct: {
 *          propertyOne: "uint256",
 *          propertyTwo: "uint256",
 *        },
 *      },
 *    },
 *    {
 *      propertyOne: 42,
 *      propertyTwo: 56,
 *      childStruct: {
 *        propertyOne: 45,
 *        propertyTwo: 78,
 *      },
 *    }
 *  );
 *
 *  console.log(res);
 *  > 0x000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000002d000000000000000000000000000000000000000000000000000000000000004e
 * ```
 */
export const encodeParameter = (abi: AbiInput, param: unknown): string =>
	encodeParameters([abi], [param]);

// If encoded param is an array and there are mixed on integer and string keys
const isParamRequiredToConvert = (data: Result): boolean =>
	Array.isArray(data) &&
	Object.keys(data).filter(k => Number.isInteger(+k)).length !== Object.keys(data).length;

// Ethers-Encoder return the decoded result as an array with additional string indexes for named params
// We want these to be converted to an object with named keys
const formatArrayResToObject = (data: Result): DecodedParams => {
	const returnValue: DecodedParams = {
		__length__: 0,
	};

	for (const key of Object.keys(data)) {
		returnValue[key] =
			Array.isArray(data[key]) && isParamRequiredToConvert(data[key] as Result)
				? formatArrayResToObject(data[key] as Result)
				: data[key];

		returnValue.__length__ += Number.isInteger(+key) ? 1 : 0;
	}
	return returnValue;
};

/**
 * Should be used to decode list of params
 */
export const decodeParametersWith = (
	abis: AbiInput[],
	bytes: HexString,
	loose: boolean,
): { [key: string]: unknown; __length__: number } => {
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
		return formatArrayResToObject(res);
	} catch (err) {
		throw new AbiError(`Parameter decoding error: ${(err as Error).message}`);
	}
};

/**
 * Should be used to decode list of params
 */
/**
 * Decodes ABI encoded parameters to its JavaScript types.
 * @param abi -  An array of {@link AbiInput}. See the [Solidity documentation](https://docs.soliditylang.org/en/develop/types.html) for a list of types.
 * @param bytes - The ABI byte code to decode
 * @returns - The result object containing the decoded parameters.
 * @example
 * ```ts
 * let res = web3.eth.abi.decodeParameters(
 *    ["string", "uint256"],
 *    "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000ea000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000"
 *  );
 *  console.log(res);
 *  > { '0': 'Hello!%!', '1': 234n, __length__: 2 }
 *
 * let res = web3.eth.abi.decodeParameters(
 *    [
 *      {
 *        type: "string",
 *        name: "myString",
 *      },
 *      {
 *        type: "uint256",
 *        name: "myNumber",
 *      },
 *    ],
 *    "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000ea000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000"
 *  );
 * console.log(res);
 *  > {
 *  '0': 'Hello!%!',
 *  '1': 234n,
 *  __length__: 2,
 *  myString: 'Hello!%!',
 *  myNumber: 234n
 * }
 *
 * const res = web3.eth.abi.decodeParameters(
 *    [
 *      "uint8[]",
 *      {
 *        ParentStruct: {
 *          propertyOne: "uint256",
 *          propertyTwo: "uint256",
 *          childStruct: {
 *            propertyOne: "uint256",
 *            propertyTwo: "uint256",
 *          },
 *        },
 *      },
 *    ],
 *    "0x00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000002d000000000000000000000000000000000000000000000000000000000000004e0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000018"
 *  );
 *  console.log(res);
 *  >
 *  '0': [ 42n, 24n ],
 *  '1': {
 *    '0': 42n,
 *    '1': 56n,
 *    '2': {
 *      '0': 45n,
 *      '1': 78n,
 *      __length__: 2,
 *      propertyOne: 45n,
 *      propertyTwo: 78n
 *    },
 *    __length__: 3,
 *    propertyOne: 42n,
 *    propertyTwo: 56n,
 *    childStruct: {
 *      '0': 45n,
 *      '1': 78n,
 *      __length__: 2,
 *      propertyOne: 45n,
 *      propertyTwo: 78n
 *    }
 *  },
 *  __length__: 2,
 *  ParentStruct: {
 *    '0': 42n,
 *    '1': 56n,
 *    '2': {
 *      '0': 45n,
 *      '1': 78n,
 *      __length__: 2,
 *      propertyOne: 45n,
 *      propertyTwo: 78n
 *    },
 *    __length__: 3,
 *    propertyOne: 42n,
 *    propertyTwo: 56n,
 *    childStruct: {
 *      '0': 45n,
 *      '1': 78n,
 *      __length__: 2,
 *      propertyOne: 45n,
 *      propertyTwo: 78n
 *    }
 *  }
 *}
 * ```
 */
export const decodeParameters = (
	abi: AbiInput[],
	bytes: HexString,
): { [key: string]: unknown; __length__: number } => decodeParametersWith(abi, bytes, false);

/**
 * Should be used to decode bytes to plain param
 */
/**
 * Decodes an ABI encoded parameter to its JavaScript type.
 * @param abi -  The type of the parameter. See the [Solidity documentation](https://docs.soliditylang.org/en/develop/types.html) for a list of types.
 * @param bytes - The ABI byte code to decode
 * @returns - The decoded parameter
 * @example
 * ```ts
 *   const res = web3.eth.abi.decodeParameter(
 *    "uint256",
 *    "0x0000000000000000000000000000000000000000000000000000000000000010"
 *  );
 *  console.log(res);
 * > 16n
 *
 *  const res = web3.eth.abi.decodeParameter(
 *    "string",
 *    "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000"
 *  );
 *
 *  console.log(res);
 *  > Hello!%!
 *
 *  const res = web3.eth.abi.decodeParameter(
 *    {
 *      ParentStruct: {
 *        propertyOne: "uint256",
 *        propertyTwo: "uint256",
 *        childStruct: {
 *          propertyOne: "uint256",
 *          propertyTwo: "uint256",
 *        },
 *      },
 *    },
 *    "0x000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000002d000000000000000000000000000000000000000000000000000000000000004e"
 *  );
 *
 *  console.log(res);
 *   {
 *  '0': 42n,
 *  '1': 56n,
 *  '2': {
 *    '0': 45n,
 *    '1': 78n,
 *    __length__: 2,
 *    propertyOne: 45n,
 *    propertyTwo: 78n
 *  },
 *  __length__: 3,
 *  propertyOne: 42n,
 *  propertyTwo: 56n,
 *  childStruct: {
 *    '0': 45n,
 *    '1': 78n,
 *    __length__: 2,
 *    propertyOne: 45n,
 *    propertyTwo: 78n
 *  }
 *}
 * ```
 */
export const decodeParameter = (abi: AbiInput, bytes: HexString): unknown =>
	decodeParameters([abi], bytes)['0'];
