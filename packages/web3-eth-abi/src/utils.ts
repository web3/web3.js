import { AbiCoder, ParamType } from '@ethersproject/abi';
import { AbiError } from 'web3-common';
import { leftPad, rightPad, toHex } from 'web3-utils';
import ethersAbiCoder from './ethers_abi_coder';
import {
	AbiInput,
	JsonAbiCoderStruct,
	JsonAbiFragment,
	JsonAbiParameter,
	JsonAbiStruct,
	JsonAbiEventFragment,
	JsonAbiFunctionFragment,
} from './types';

export const isAbiFragment = (item: unknown): item is JsonAbiFragment =>
	item !== undefined &&
	item !== null &&
	typeof item === 'object' &&
	(item as { type: string }).type !== undefined &&
	['function', 'event', 'constructor'].includes((item as { type: string }).type);

export const isAbiEventFragment = (item: unknown): item is JsonAbiEventFragment =>
	item !== undefined &&
	item !== null &&
	typeof item === 'object' &&
	(item as { type: string }).type !== undefined &&
	(item as { type: string }).type === 'event';

export const isAbiFunctionFragment = (item: unknown): item is JsonAbiFunctionFragment =>
	item !== undefined &&
	item !== null &&
	typeof item === 'object' &&
	(item as { type: string }).type !== undefined &&
	(item as { type: string }).type === 'function';

/**
 * Check if type is simplified struct format
 */
export const isSimplifiedStructFormat = (
	type: string | Partial<JsonAbiParameter>,
): type is Omit<JsonAbiParameter, 'components' | 'name'> =>
	typeof type === 'object' &&
	typeof (type as { components: unknown }).components === 'undefined' &&
	typeof (type as { name: unknown }).name === 'undefined';

/**
 * Maps the correct tuple type and name when the simplified format in encode/decodeParameter is used
 */
export const mapStructNameAndType = (structName: string): JsonAbiStruct =>
	structName.includes('[]')
		? { type: 'tuple[]', name: structName.slice(0, -2) }
		: { type: 'tuple', name: structName };

/**
 * Maps the simplified format in to the expected format of the ABICoder
 */
export const mapStructToCoderFormat = (struct: JsonAbiStruct): Array<JsonAbiCoderStruct> => {
	const components: Array<JsonAbiCoderStruct> = [];

	for (const key of Object.keys(struct)) {
		const item = struct[key];

		if (typeof item === 'object') {
			components.push({
				...mapStructNameAndType(key),
				components: mapStructToCoderFormat(item as unknown as JsonAbiStruct),
			});
		} else {
			components.push({
				name: key,
				type: struct[key] as string,
			});
		}
	}
	return components;
};

/**
 * Map types if simplified format is used
 */
export const mapTypes = (
	types: AbiInput[],
): Array<string | JsonAbiParameter | Record<string, unknown>> => {
	const mappedTypes: Array<string | JsonAbiParameter | Record<string, unknown>> = [];

	for (const type of types) {
		let modifiedType = type;

		// Clone object
		if (typeof type === 'object') {
			modifiedType = { ...type };
		}

		// Remap `function` type params to bytes24 since Ethers does not
		// recognize former type. Solidity docs say `Function` is a bytes24
		// encoding the contract address followed by the function selector hash.
		if (typeof type === 'object' && type.type === 'function') {
			modifiedType = { ...type, type: 'bytes24' };
		}

		if (isSimplifiedStructFormat(modifiedType)) {
			const structName = Object.keys(modifiedType)[0] as unknown as keyof typeof modifiedType;

			mappedTypes.push({
				...mapStructNameAndType(structName),
				components: mapStructToCoderFormat(
					modifiedType[structName] as unknown as JsonAbiStruct,
				) as unknown as JsonAbiParameter[],
			});
		} else {
			mappedTypes.push(modifiedType);
		}
	}

	return mappedTypes;
};

/**
 * Handle some formatting of params for backwards compatibility with Ethers V4
 */
export const formatParam = (type: string, _param: unknown): unknown => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	let param = _param;
	const paramTypeBytes = /^bytes([0-9]*)$/;
	const paramTypeBytesArray = /^bytes([0-9]*)\[\]$/;
	const paramTypeNumber = /^(u?int)([0-9]*)$/;
	const paramTypeNumberArray = /^(u?int)([0-9]*)\[\]$/;

	// Format BN to string
	if (param instanceof BigInt) {
		return param.toString(10);
	}

	if (paramTypeBytesArray.exec(type) || paramTypeNumberArray.exec(type)) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return (param as Array<unknown>).map(p => formatParam(type.replace('[]', ''), p));
	}

	// Format correct width for u?int[0-9]*
	let match = paramTypeNumber.exec(type);
	if (match) {
		const size = parseInt(match[2] ?? '256', 10);
		if (size / 8 < (param as { length: number }).length) {
			// pad to correct bit width
			param = leftPad(param as string, size);
		}
	}

	// Format correct length for bytes[0-9]+
	match = paramTypeBytes.exec(type);
	if (match) {
		if (Buffer.isBuffer(param)) {
			param = toHex(param);
		}

		// format to correct length
		const size = parseInt(match[1], 10);
		if (size) {
			let maxSize = size * 2;

			if ((param as string).startsWith('0x')) {
				maxSize += 2;
			}
			if ((param as string).length < maxSize) {
				// pad to correct length
				param = rightPad(param as string, size * 2);
			}
		}

		// format odd-length bytes to even-length
		if ((param as string).length % 2 === 1) {
			param = `0x0${(param as string).substring(2)}`;
		}
	}

	return param;
};

// eslint-disable-next-line consistent-return
export const modifyParams = (
	coder: ReturnType<AbiCoder['_getCoder']>,
	param: unknown[],
	// eslint-disable-next-line consistent-return
): unknown => {
	if (coder.name === 'array') {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return param.map(p =>
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			modifyParams(ethersAbiCoder._getCoder(ParamType.from(coder.type.replace('[]', ''))), [
				p,
			]),
		);
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
	(coder as any).coders.forEach((c: ReturnType<AbiCoder['_getCoder']>, i: number) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (c.name === 'tuple') {
			modifyParams(c, [param[i]]);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, no-param-reassign
			param[i] = formatParam(c.name, param[i]);
		}
	});
	return [];
};

/**
 *  used to flatten json abi inputs/outputs into an array of type-representing-strings
 */

export const flattenTypes = (includeTuple: boolean, puts: JsonAbiParameter[]): string[] => {
	const types: string[] = [];

	puts.forEach(param => {
		if (typeof param.components === 'object') {
			if (!param.type.startsWith('tuple')) {
				throw new AbiError(
					`Invalid value given "${param.type}". Error: components found but type is not tuple.`,
				);
			}
			const arrayBracket = param.type.indexOf('[');
			const suffix = arrayBracket >= 0 ? param.type.substring(arrayBracket) : '';
			const result = flattenTypes(includeTuple, param.components);

			if (Array.isArray(result) && includeTuple) {
				types.push(`tuple(${result.join(',')})${suffix}`);
			} else if (!includeTuple) {
				types.push(`(${result.join(',')})${suffix}`);
			} else {
				types.push(`(${result.join()})`);
			}
		} else {
			types.push(param.type);
		}
	});

	return types;
};

/**
 * Should be used to create full function/event name from json abi
 * returns a string
 */
export const jsonInterfaceMethodToString = (json: JsonAbiFragment): string => {
	if (json.name?.includes('(')) {
		return json.name;
	}

	return `${json.name ?? ''}(${flattenTypes(false, json.inputs ?? []).join(',')})`;
};
