import {
  AbiParameterBaseType, Writer
} from '../types';
import { writeUint } from './base_types/uint';

export const detectParameterBaseType = (
	type: string,
): {
	baseType: AbiParameterBaseType;
	size: number | null;
	isArray: boolean;
	arrayLength: number | null;
} => {
	const match = /^([a-z]*)(\d*)(?:\[(\d*)\])*$/.exec(type);
	const baseType = match && (match[1] as AbiParameterBaseType);
	const size = match?.[2] && match[2] !== '' ? parseInt(match[2], 10) : null;
	const arraySize = match?.[3] && match[3] !== '' ? parseInt(match[3], 10) : null;
	const isArray = type.endsWith(']');

	if (baseType && ['address', 'bool', 'bytes', 'string', 'uint', 'int'].includes(baseType)) {
		return {
			baseType,
			size,
			isArray,
			arrayLength: isArray && !arraySize ? -1 : arraySize,
		};
	}

	throw new Error(`Can not detect parameter base type for "${type}"`);
};

export const mergeEncodingResults = (data: ReturnType<Writer<unknown>>[]): Buffer => {
	const headers: Buffer[] = [];
	const headersRefresh: boolean[] = [];
	const tails: Buffer[] = [];

	for (const { head, refreshHead, tail } of data) {
		headersRefresh.push(refreshHead);
		headers.push(head);
		tails.push(tail);
	}

	const headSize = Buffer.concat(headers).length;

	for (const [index, refresh] of headersRefresh.entries()) {
		if (refresh) {
			headers[index] = writeUint(
				(headSize + Buffer.concat(tails.slice(0, index)).length).toString(),
				{ wordSize: 32, param: null as never },
			).head;
		}
	}

	return Buffer.concat([...headers, ...tails]);
};
