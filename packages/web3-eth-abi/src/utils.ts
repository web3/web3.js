import { AbiCoder, ParamType } from '@ethersproject/abi';
import { leftPad, rightPad, toHex } from 'web3-utils';
import ethersAbiCoder from './ethers_abi_coder';
import { JsonAbiCoderStruct, JsonAbiFragment, JsonAbiParameter, JsonAbiStruct } from './types';

export const isAbiFragment = (item: unknown): item is JsonAbiFragment =>
	typeof item === 'object' &&
	(item as { type: string }).type !== undefined &&
	['function', 'event', 'constructor'].includes((item as { type: string }).type);

/**
 * Check if type is simplified struct format
 */
export const isSimplifiedStructFormat = (
	type: Partial<JsonAbiParameter>,
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

		if (isAbiFragment(item)) {
			components.push({
				...mapStructNameAndType(key),
				components: mapStructToCoderFormat(item),
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
	types: Array<string | JsonAbiParameter>,
): Array<string | JsonAbiParameter> => {
	const mappedTypes: Array<string | JsonAbiParameter> = [];

	for (const type of types) {
		let modifiedType = type;

		if (typeof type === 'object') {
			modifiedType = { ...type };
		}

		// Remap `function` type params to bytes24 since Ethers does not
		// recognize former type. Solidity docs say `Function` is a bytes24
		// encoding the contract address followed by the function selector hash.
		if (typeof type === 'object' && type.type === 'function') {
			modifiedType = { ...type, type: 'bytes24' };
		}

		if (typeof modifiedType === 'object' && isSimplifiedStructFormat(modifiedType)) {
			const structName = Object.keys(modifiedType)[0] as unknown as keyof typeof modifiedType;
			const { name, type: structType } = mapStructNameAndType(structName);

			mappedTypes.push({
				...modifiedType,
				name: name ?? '',
				type: structType,
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
 * Handle some formatting of params for backwards compatability with Ethers V4
 */
export const formatParam = (type: string, _param: unknown): unknown => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	let param = _param;
	const paramTypeBytes = new RegExp(/^bytes([0-9]*)$/);
	const paramTypeBytesArray = new RegExp(/^bytes([0-9]*)\[\]$/);
	const paramTypeNumber = new RegExp(/^(u?int)([0-9]*)$/);
	const paramTypeNumberArray = new RegExp(/^(u?int)([0-9]*)\[\]$/);

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

	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
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
