/* eslint-disable max-classes-per-file */
import { AbiError } from 'web3-common';
import { sha3Raw } from 'web3-utils';
import {
	AbiEventFragment,
	AbiFragment,
	AbiFunctionFragment,
	AbiParameter,
	AbiParameterBaseType,
	CompiledParameter,
	Reader,
	Writer,
	AbiTypeToNativeType,
} from '../types';
import { flattenTypes, isAbiEventFragment, isAbiFunctionFragment } from '../utils';
import * as baseTypes from './base_types';
import { detectParameterBaseType, mergeEncodingResults } from './utils';

abstract class EthAbiBaseCoder {
	public readonly abi: AbiFragment;

	public constructor(abi: AbiFragment) {
		this.abi = abi;
	}

	public nameToString(): string {
		if (isAbiEventFragment(this.abi) || isAbiFunctionFragment(this.abi)) {
			if (this.abi.name.includes('(')) {
				return this.abi.name;
			}

			return `${this.abi.name ?? ''}(${flattenTypes(false, this.abi.inputs ?? []).join(
				',',
			)})`;
		}

		// Constructor fragment
		return `(${flattenTypes(false, this.abi.inputs ?? []).join(',')})`;
	}
}

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
		const { name, type } = abi;
		let path = [basePath, name].join('.');
		const { baseType, size, arrayLength, isArray } = detectParameterBaseType(type);

		if (isArray) {
			path = `${path}[#]`;

			result.push({
				name,
				path,
				type,
				dynamic: true,
				arrayLength,
				baseType: 'array',
				size,
				components: compileParameters([{ ...abi, type: `${baseType}${size ?? ''}` }], path),
				read: readerWriterMap.array.reader,
				write: readerWriterMap.array.writer,
			});
		} else if (type === 'bytes') {
			result.push({
				name,
				path,
				type,
				dynamic: true,
				arrayLength: null,
				baseType: abi.components ? 'tuple' : baseType,
				size: abi.components ? null : size,
				components: compileParameters(abi.components ?? [], path),
				read: readerWriterMap[baseType].reader,
				write: readerWriterMap[baseType].writer as Writer<unknown>,
			});
		} else {
			result.push({
				name,
				path,
				type,
				dynamic: false,
				arrayLength: null,
				baseType: abi.components ? 'tuple' : baseType,
				size: abi.components ? null : size,
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
		const results: ReturnType<Writer<unknown>>[] = [];
		for (const [index, p] of this.compiledParameters.entries()) {
			results.push(p.write(data[index], { param: p, wordSize: 32 }));
		}

		return mergeEncodingResults(results);
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
