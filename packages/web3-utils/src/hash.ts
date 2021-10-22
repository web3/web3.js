import { keccak256 } from 'ethereum-cryptography/keccak';
import { Numbers, typedObject, typedObject2, EncodingTypes } from './types';
import { leftPad, rightPad, toTwosComplement } from './string_manipulation';
import { utf8ToHex, hexToBytes, toNumber } from './converters';
import { isAddress, isHexStrict } from './validation';
import { InvalidStringError, InvalidType } from './errors';

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

/**
 * returns type and value
 */
const getType = (arg: typedObject | typedObject2 | Numbers): [string, EncodingTypes] => {
	if (typeof arg === 'object' && ('t' in arg || 'type' in arg)) {
		const type1 = 't' in arg ? arg.t : arg.type;
		const val = 'v' in arg ? arg.v : arg.value;
		return [type1, val];
	}
	throw new InvalidType(arg);
};

/**
 * get the array size
 */
const parseTypeNArray = (type: string): number | null => {
	const arraySize = /^\D+\d*\[(\d+)\]$/.exec(type);
	return arraySize ? parseInt(arraySize[1], 10) : null;
};

/**
 * returns the type with size if uint or int
 */
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
	// need to work on fixed case/ add testcases for fixed
	// if (name.startsWith('fixed[')) {
	// 	return `fixed128x128${name.slice(5)}`;
	// }
	// if (name === 'fixed') {
	// 	return 'fixed128x128';
	// }
	// if (name.startsWith('ufixed[')) {
	// 	return `ufixed128x128${name.slice(6)}`;
	// }
	// if (name === 'ufixed') {
	// 	return 'ufixed128x128';
	// }
	return name;
};

/**
 * returns the size of the value of type 'byte'
 */
const parseTypeN = (value: string): number => {
	const typesize = /^\D+(\d+).*$/.exec(value);
	return typesize ? parseInt(typesize[1], 10) : 0;
};

/**
 * returns the bit length of the value
 */
const bitLength = (value: BigInt | number): number => {
	const updatedVal = value.toString(2);
	if (updatedVal === null) return 0;
	if (updatedVal.match(/1/g) === null) return 0;
	const length = updatedVal.match(/1/g)?.length;
	return length ?? 0;
};

/**
 * Pads the value based on size and type
 * returns a string of the padded value
 */
const solidityPack = (type: string, val: EncodingTypes, arraySize?: number): string => {
	const value = val.toString();
	if (type === 'string') {
		return utf8ToHex(value);
	}
	if (type === 'bool') {
		return value === 'true' ? '01' : '00';
	}

	if (type.startsWith('address')) {
		const size = arraySize ? 64 : 40;

		if (isAddress(value)) {
			throw new Error(' is not a valid address, or the checksum is invalid.');
		}
		return leftPad(value, size);
	}
	const name = elementaryName(type);

	if (type.startsWith('uint')) {
		const size = Number(name.slice(4));
		if (size % 8 || size < 8 || size > 256) {
			throw new Error('Invalid uint');
		}
		const num = toNumber(value);
		if (bitLength(num) > size) {
			throw new Error('Supplied uint exceeds width: ');
		}
		if (num < BigInt(0)) {
			throw new Error('Supplied uint ');
		}

		return size ? leftPad(num.toString(16), (size / 8) * 2) : num.toString(16);
	}

	if (type.startsWith('int')) {
		const size = Number(name.slice(3));
		if (size % 8 || size < 8 || size > 256) {
			throw new Error('Invalid int');
		}

		const num = toNumber(value);
		if (bitLength(num) > size) {
			throw new Error('Supplied int exceeds width: ');
		}

		if (num < BigInt(0)) {
			return toTwosComplement(num.toString(), (size / 8) * 2);
		}
		return size ? leftPad(num.toString(16), size / 4) : num.toString(16);
	}

	if (name === 'bytes') {
		if (value.replace(/^0x/i, '').length % 2 !== 0) {
			throw new Error('Invalid bytes characters ');
		}
		return value;
	}

	if (type.startsWith('bytes')) {
		// must be 32 byte slices when in an array
		const size = arraySize ? 32 : parseTypeN(type);
		if (!size) {
			throw new Error('bytes[] not yet supported in solidity');
		}

		if (size < 1 || size > 64 || size < value.replace(/^0x/i, '').length / 2) {
			throw new Error('Invalid bytes');
		}

		return rightPad(value, size * 2);
	}
	return '';
};

/**
 * returns a string of the tightly packed value given based on the type
 */
export const processSolidityEncodePackedArgs = (
	arg: typedObject | typedObject2 | Numbers,
): string => {
	const [type, val] = getType(arg);

	const updatedVal =
		(type.startsWith('int') || type.startsWith('uint')) &&
		typeof val === 'string' &&
		!/^(-)?0x/i.test(val)
			? BigInt(val)
			: val;

	// array case
	if (Array.isArray(updatedVal)) {
		// get the array size
		const arraySize = parseTypeNArray(type);
		if (arraySize === null) {
			throw new Error('array has no length');
		}
		if (arraySize && updatedVal.length !== arraySize) {
			throw new Error(' is not matching the given array ');
		}

		const hexArg = updatedVal.map(v => solidityPack(type, v, arraySize).replace('0x', ''));
		return hexArg.join('');
	}

	const hexArg = solidityPack(type, val.toString());
	return hexArg.replace('0x', '');
};

/**
 * Encode packed args to hex
 */
export const encodePacked = (...values: typedObject[] | typedObject2[]): string => {
	const args = Array.prototype.slice.call(values);

	const hexArgs = args.map(processSolidityEncodePackedArgs);

	return `0x${hexArgs.join('').toLowerCase()}`;
};

/**
 * Will tightly pack values given in the same way solidity would then hash.
 * returns a hash string, or null if input is empty
 */
export const soliditySha3 = (...values: typedObject[] | typedObject2[]): string | null =>
	sha3(encodePacked(...values));

/**
 * Will tightly pack values given in the same way solidity would then hash.
 * returns a hash string, if input is empty will return `0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470`
 */
export const soliditySha3Raw = (...values: typedObject[] | typedObject2[]): string =>
	sha3Raw(encodePacked(...values));

// console.log(encodePacked({v: [-12, 243], t: 'int256[]'}))
