/* eslint-disable max-classes-per-file */
import { AbiError } from 'web3-common';
import { sha3Raw } from 'web3-utils';
import { AbiParameter } from '..';
import {
	AbiEventFragment,
	AbiFragment,
	AbiFunctionFragment,
	AbiParameterBaseType,
	AbiTypeToNativeType,
	CompiledParameter,
	Reader,
	Writer
} from '../types';
import { detectParameterBaseType, flattenTypes, isAbiEventFragment, isAbiFunctionFragment } from '../utils';
import * as baseTypes from './base_types';

abstract class EthAbiBaseCoder {
	public readonly abi: AbiFragment;

	public constructor(abi: AbiFragment) {
		this.abi = abi;
	}

	public nameToString(): string {
		if (this.abi.name?.includes('(')) {
			return this.abi.name;
		}

		return `${this.abi.name ?? ''}(${flattenTypes(false, [...(this.abi.inputs ?? [])]).join(
			',',
		)})`;
	}
}

const regexParamTypeArray = new RegExp(/^(.*)\[([0-9]*)\]$/);

const readerWriterMap: {
	[K in AbiParameterBaseType]: {
		reader: Reader<AbiTypeToNativeType<K>>;
		writer: Writer<AbiTypeToNativeType<K>>;
	};
} = {
	bool: { reader: baseTypes.readBoolean, writer: baseTypes.writeBoolean },
	string: { reader: baseTypes.readString, writer: baseTypes.writeString },
	address: { reader: baseTypes.readBytes, writer: baseTypes.writeBytes },
	uint: { reader: baseTypes.readUint, writer: baseTypes.writeUint },
	int: { reader: baseTypes.readInt, writer: baseTypes.writeInt },
	bytes: { reader: baseTypes.readBytes, writer: baseTypes.writeBytes },
	array: { reader: baseTypes.readArray, writer: baseTypes.writeArray },
	tuple: { reader: baseTypes.readBoolean, writer: baseTypes.writeBoolean },
};

// const readerWriterMap: {
// 	[K in AbiParameterBaseType]: new () => Coder<AbiTypeToNativeType<K>>;
// } = {
// 	bool: BooleanCoder,
// };

export const compileParameters = (
	parameters: ReadonlyArray<AbiParameter>,
	basePath = '',
): ReadonlyArray<CompiledParameter> => {
	const result: CompiledParameter[] = [];

	for (const abi of parameters) {
		const { name, type, internalType } = abi;
		let path = [basePath, name].join('.');
		const match = regexParamTypeArray.exec(type);

		if (match) {
			const arrayLength = parseInt(match[2] || '-1', 10);
			path = `${path}[#]`;

			result.push({
				name,
				path,
				type,
				internalType: internalType ?? '',
				baseType: 'array',
				arrayLength,
				components: compileParameters([{...abi, type: detectParameterBaseType(type)}], path),
				read: readerWriterMap.array.reader,
				write: readerWriterMap.array.writer,
			});
		} else {
			const baseType = abi.components != null ? 'tuple' : detectParameterBaseType(type);

			result.push({
				name,
				path,
				type,
				internalType: internalType ?? '',
				baseType,
				arrayLength: null,
				components: compileParameters(abi.components ?? [], path),
				read: readerWriterMap[baseType].reader,
				write: readerWriterMap[baseType].writer as Writer<unknown>,
			});
		}
	}

	return result;
};

export class EthAbiParameterCoder {
	public readonly wordSize: number = 32;
	public readonly abi: ReadonlyArray<AbiParameter>;
	public readonly compiledParameters: ReadonlyArray<CompiledParameter>;

	public constructor(abi: ReadonlyArray<AbiParameter>) {
		this.abi = abi;
		this.compiledParameters = EthAbiParameterCoder.compile(this.abi);
	}

	public static compile(abi: ReadonlyArray<AbiParameter>): ReadonlyArray<CompiledParameter> {
		return compileParameters(abi);
	}

	public encode(data: ReadonlyArray<unknown>): Buffer {
		const headers: Buffer[] = [];
		const headersRefresh: boolean[] = [];
		const tails: Buffer[] = [];

		for (const [index, p] of this.compiledParameters.entries()) {
			const { head, tail, refreshHead } = p.write(data[index], { param: p, wordSize: 32 });

			headersRefresh.push(refreshHead);
			headers.push(head);
			tails.push(tail);
		}

		for (const [index, h] of headers.entries()) {
			console.log(`${headersRefresh[index] ? 'R' : '-'} ${h.toString('hex')}`);
		}

		console.log(tails.map(h => h.toString('hex')).join('\n'));

		return Buffer.concat([...headers, ...tails]);
	}
}

export class EthAbiFunctionCoder extends EthAbiBaseCoder {
	public paramCoder: EthAbiParameterCoder;

	public constructor(abi: AbiFunctionFragment) {
		super(abi);

		if (!isAbiFunctionFragment(abi)) {
			throw new AbiError('Parameter is not function fragment');
		}

		this.paramCoder = new EthAbiParameterCoder(abi.inputs ?? []);
	}

	public signature(): string {
		return sha3Raw(this.nameToString()).slice(0, 10);
	}
}

export class EthAbiEventCoder extends EthAbiBaseCoder {
	public constructor(abi: AbiEventFragment) {
		super(abi);

		if (!isAbiEventFragment(abi)) {
			throw new AbiError('Parameter is not event fragment');
		}
	}

	public signature(): string {
		return sha3Raw(this.nameToString());
	}
}
