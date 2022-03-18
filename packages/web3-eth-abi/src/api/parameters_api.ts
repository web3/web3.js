import { AbiError } from 'web3-common';
import { ParamType } from '@ethersproject/abi';
import { HexString } from 'web3-utils';
import ethersAbiCoder from '../ethers_abi_coder';
import { AbiInput } from '../types';
import { formatParam, isAbiFragment, mapTypes, modifyParams } from '../utils';

const doStuff = (abi: {[key: string]: unknown}, input: {[key: string]: unknown}) => {
	let res:{[key: string]: unknown} = {};
	// the length of abi will always be 1, just want to grab the key value of abi

			for (const j in abi){
				// basecase its a string
				if (typeof(abi[j]) === 'string'){
					res[j] = input[j]
				} 
				if (typeof(abi[j]) === 'object'){
					res[j] = doStuff(abi[j] as {[key: string]: unknown}, input[j] as {[key: string]: unknown})
				}
			}
		
	
	return res;
}


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
		const returnValue: { [key: string]: unknown; __length__: number } = { __length__: 0 };
		returnValue.__length__ = 0;
		for (const [i, abi] of abis.entries()) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			let decodedValue = res[returnValue.__length__];
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			decodedValue = decodedValue === '0x' ? null : decodedValue;

			if(typeof(abi) === 'object'){
				// the length of abi will always be 1, just want to grab the key value of abi
				for (const i in abi) {
					// change name of abiTest
					const abiTest: {[key: string]: unknown} = abi;
					if (typeof(abiTest[i]) === 'object'){
						returnValue[i] = (doStuff(abiTest[i] as  {[key: string]: unknown}, decodedValue));
					}
				}
			}
			if ((typeof abi === 'function' || (!!abi && typeof abi === 'object')) && abi.name) {
				returnValue[abi.name as string] = decodedValue;
			}
			returnValue[i] = decodedValue;
			returnList.push(decodedValue);
			returnValue.__length__ += 1;
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

const abiEx = [
	'uint8[]',
	{
		ParentStruct: {
			propertyOne: 'uint256',
			propertyTwo: 'uint256',
			ChildStruct: {
				propertyOne: 'uint256',
				propertyTwo: 'uint256',
			},
		},
	},
];

// const input = [
// 	['34', '255'],
// 	{
// 		propertyOne: '42',
// 		propertyTwo: '56',
// 		ChildStruct: {
// 			propertyOne: '45',
// 			propertyTwo: '78',
// 		},
// 	},
// ];

const inputBytes = '0x00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000002d000000000000000000000000000000000000000000000000000000000000004e0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000ff'
decodeParameters(abiEx, inputBytes)
// encodeParameters(abiEx, input);