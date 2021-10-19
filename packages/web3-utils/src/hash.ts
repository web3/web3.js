import { keccak256 } from 'ethereum-cryptography/keccak';
import { Numbers, typedObject, typedObject2 } from './types';
import { leftPad, rightPad } from './string_manipulation';
import { toHex, utf8ToHex, hexToBytes } from './converters';
import { isAddress, isHexStrict } from './validation';
import { InvalidStringError } from './errors';

const SHA3_NULL = 'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';

export const sha3 = (data: string): string | null => {
	if (typeof data !== 'string') throw new InvalidStringError(data);
	const newData = isHexStrict(data) ? hexToBytes(data) : data;

	const hash = keccak256(Buffer.from(newData)).toString('hex');

	// EIP-1052 if hash is equal to c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470, keccak was given empty data
	return hash === SHA3_NULL ? null : `0x${hash}`;
};

/**
 *Will calculate the sha3 of the input but does return the hash value instead of null if for example a empty string is passed.
 */
export const sha3Raw = (data: string): string => {
	const hash = sha3(data);
	if (hash === null) {
		return `0x${SHA3_NULL}`;
	}

	return hash;
};

export { keccak256 };

const getType = (arg: typedObject | typedObject2 | Numbers): [string, Numbers] => {
	if (typeof arg === 'object' && ('t' in arg || 'type' in arg)) {
		const type1 = 't' in arg ? arg.t : arg.type;
		const val = 'v' in arg ? arg.v : arg.value;
		return [type1, val];
	} // otherwise try to guess the type
	const type1 = toHex(arg, true);
	const val = toHex(arg);

	if (!type1.startsWith('int') && !type1.startsWith('uint')) {
		return ['bytes', val];
	}

	return [type1, val];
};

const parseTypeNArray = (type: string): number | null => {
	const arraySize = /^\D+\d*\[(\d+)\]$/.exec(type);
	return arraySize ? parseInt(arraySize[1], 10) : null;
};

const elementaryName = (name: string): string => {
	if (name.startsWith('int[')) {
		return `int256${name.slice(3)}`;
	}
	if (name === 'int') {
		return 'int256';
	}
	if (name.startsWith('uint[')) {
		return `uint256'${name.slice(4)}`;
	}
	if (name === 'uint') {
		return 'uint256';
	}
	if (name.startsWith('fixed[')) {
		return `fixed128x128${name.slice(5)}`;
	}
	if (name === 'fixed') {
		return 'fixed128x128';
	}
	if (name.startsWith('ufixed[')) {
		return `ufixed128x128${name.slice(6)}`;
	}
	if (name === 'ufixed') {
		return 'ufixed128x128';
	}
	return name;
};
const parseTypeN = (type: string): number => {
	const typesize = /^\D+(\d+).*$/.exec(type);
	return typesize ? parseInt(typesize[1], 10) : 0;
};

const parseNumber = (value: string): BigInt => {
	const type = typeof value;
	if (type === 'string') {
		if (isHexStrict(value)) {
			return BigInt(value.replace(/0x/i, ''));
		}
		return BigInt(value);
	}
	return BigInt(value);
};

const bitLength = (value: BigInt): number => {
	const updatedVal = value.toString(2);
	if (updatedVal === null) return 0;
	if (updatedVal.match(/1/g) === null) return 0;
	const length = updatedVal.match(/1/g)?.length;
	return length ?? 0;
};
const solidityPack = (type: string, value: string, arraySize?: number): string => {
	const name = elementaryName(type);

	if (name === 'bytes' && value === 'string') {
		if (value.replace(/^0x/i, '').length % 2 !== 0) {
			throw new Error('Invalid bytes characters ');
		}
		return value;
	}
	if (type === 'string') {
		return utf8ToHex(value);
	}
	if (type === 'bool') {
		return value ? '01' : '00';
	}

	if (type.startsWith('address')) {
		const size = arraySize ? 64 : 40;

		if (isAddress(value)) {
			throw new Error(' is not a valid address, or the checksum is invalid.');
		}

		return leftPad(value, size);
	}

	// Parse N from type<N>
	const size = parseTypeN(type);

	if (type.startsWith('bytes')) {
		if (!size) {
			throw new Error('bytes[] not yet supported in solidity');
		}

		// must be 32 byte slices when in an array
		if (arraySize) {
			// size = 32;
		}

		if (size < 1 || size > 32 || size < value.replace(/^0x/i, '').length / 2) {
			throw new Error('Invalid bytes');
		}

		return rightPad(value, size * 2);
	}

	if (type.startsWith('uint')) {
		if (size % 8 || size < 8 || size > 256) {
			throw new Error('Invalid uint');
		}
		const num = parseNumber(value);
		if (bitLength(num) > size) {
			throw new Error('Supplied uint exceeds width: ');
		}
		if (num < BigInt(0)) {
			throw new Error('Supplied uint ');
		}

		return size ? leftPad(num.toString(16), (size / 8) * 2) : num.toString(16);
	}
	throw new Error('Unsupported or invalid type: ');
};

export const processSolidityEncodePackedArgs = (
	arg: typedObject | typedObject2 | Numbers,
): string => {
	if (Array.isArray(arg)) {
		throw new Error('Autodetection of array types is not supported.');
	}

	// var type, value = '';
	// var hexArg, arraySize;

	// // if type is given
	// if (typeof arg === "object" && ('t' in arg || 'type' in arg)) {
	//     const getType = 't' in arg ? arg.t : arg.type;
	//     const value = 'v' in arg ? arg.v : arg.value;

	// // otherwise try to guess the type
	// } else {

	//     const getType = toHex(arg, true);
	//     const value = toHex(arg);

	//     if (!getType.startsWith('int') && !getType.startsWith('uint')) {
	//         const type = 'bytes';
	//     }
	// }
	const [type, val] = getType(arg);

	const updatedVal =
		(type.startsWith('int') || type.startsWith('uint')) &&
		typeof val === 'string' &&
		!/^(-)?0x/i.test(val)
			? BigInt(val)
			: val;

	// get the array size
	if (Array.isArray(updatedVal)) {
		const arraySize = parseTypeNArray(type);
		if (arraySize === null) {
			throw new Error('array has no length');
		}
		if (arraySize && updatedVal.length !== arraySize) {
			throw new Error(' is not matching the given array ');
		}
		// else {
		//     arraySize = value.length;
		// }
		const hexArg = updatedVal.map(v => solidityPack(type, v, arraySize).replace('0x', ''));
		return hexArg.join('');
	}

	const hexArg = solidityPack(type, val.toString());
	return hexArg.replace('0x', '');
};

export const soliditySha3 = (...values: any[]): string | null => {
	const args = Array.prototype.slice.call(values);

	const hexArgs = args.map(processSolidityEncodePackedArgs);

	return sha3(`0x${hexArgs.join('')}`);
};

export const soliditySha3Raw = (...values: any[]): string =>
	sha3Raw(
		`0x${Array.prototype.slice.call(values).map(processSolidityEncodePackedArgs).join('')}`,
	);
