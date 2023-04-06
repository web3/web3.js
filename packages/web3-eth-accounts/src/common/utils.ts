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
import { isHexPrefixed, isHexString } from 'web3-validator';
import { recoverPublicKey } from 'ethereum-cryptography/secp256k1';
import { Hardfork } from './enums';
import {
	NestedBufferArray,
	ToBufferInputTypes,
	TypeOutput,
	TypeOutputReturnType,
	NestedUint8Array,
} from './types';

type ConfigHardfork =
	// eslint-disable-next-line @typescript-eslint/ban-types
	| { name: string; block: null; timestamp: number }
	| { name: string; block: number; timestamp?: number };

/**
 * Removes '0x' from a given `String` if present
 * @param str the string value
 * @returns the string without 0x prefix
 */
export const stripHexPrefix = (str: string): string => {
	if (typeof str !== 'string')
		throw new Error(`[stripHexPrefix] input must be type 'string', received ${typeof str}`);

	return isHexPrefixed(str) ? str.slice(2) : str;
};
/**
 * Transforms Geth formatted nonce (i.e. hex string) to 8 byte 0x-prefixed string used internally
 * @param nonce string parsed from the Geth genesis file
 * @returns nonce as a 0x-prefixed 8 byte string
 */
function formatNonce(nonce: string): string {
	if (!nonce || nonce === '0x0') {
		return '0x0000000000000000';
	}
	if (isHexPrefixed(nonce)) {
		return `0x${stripHexPrefix(nonce).padStart(16, '0')}`;
	}
	return `0x${nonce.padStart(16, '0')}`;
}

/**
 * Converts a `Number` into a hex `String`
 * @param {Number} i
 * @return {String}
 */
const intToHex = function (i: number) {
	if (!Number.isSafeInteger(i) || i < 0) {
		throw new Error(`Received an invalid integer type: ${i}`);
	}
	return `0x${i.toString(16)}`;
};

/**
 * Converts Geth genesis parameters to an EthereumJS compatible `CommonOpts` object
 * @param json object representing the Geth genesis file
 * @param optional mergeForkIdPostMerge which clarifies the placement of MergeForkIdTransition
 * hardfork, which by default is post merge as with the merged eth networks but could also come
 * before merge like in kiln genesis
 * @returns genesis parameters in a `CommonOpts` compliant object
 */
function parseGethParams(json: any, mergeForkIdPostMerge = true) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const {
		name,
		config,
		difficulty,
		mixHash,
		gasLimit,
		coinbase,
		baseFeePerGas,
	}: {
		name: string;
		config: any;
		difficulty: string;
		mixHash: string;
		gasLimit: string;
		coinbase: string;
		baseFeePerGas: string;
	} = json;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	let { extraData, timestamp, nonce }: { extraData: string; timestamp: string; nonce: string } =
		json;
	const genesisTimestamp = Number(timestamp);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { chainId }: { chainId: number } = config;

	// geth is not strictly putting empty fields with a 0x prefix
	if (extraData === '') {
		extraData = '0x';
	}
	// geth may use number for timestamp
	if (!isHexPrefixed(timestamp)) {
		// eslint-disable-next-line radix
		timestamp = intToHex(parseInt(timestamp));
	}
	// geth may not give us a nonce strictly formatted to an 8 byte hex string
	if (nonce.length !== 18) {
		nonce = formatNonce(nonce);
	}

	// EIP155 and EIP158 are both part of Spurious Dragon hardfork and must occur at the same time
	// but have different configuration parameters in geth genesis parameters
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	if (config.eip155Block !== config.eip158Block) {
		throw new Error(
			'EIP155 block number must equal EIP 158 block number since both are part of SpuriousDragon hardfork and the client only supports activating the full hardfork',
		);
	}

	const params = {
		name,
		chainId,
		networkId: chainId,
		genesis: {
			timestamp,
			// eslint-disable-next-line radix
			gasLimit: parseInt(gasLimit), // geth gasLimit and difficulty are hex strings while ours are `number`s
			// eslint-disable-next-line radix
			difficulty: parseInt(difficulty),
			nonce,
			extraData,
			mixHash,
			coinbase,
			baseFeePerGas,
		},
		hardfork: undefined as string | undefined,
		hardforks: [] as ConfigHardfork[],
		bootstrapNodes: [],
		consensus:
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			config.clique !== undefined
				? {
						type: 'poa',
						algorithm: 'clique',
						clique: {
							// The recent geth genesis seems to be using blockperiodseconds
							// and epochlength for clique specification
							// see: https://hackmd.io/PqZgMpnkSWCWv5joJoFymQ
							// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
							period: config.clique.period ?? config.clique.blockperiodseconds,
							// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,  @typescript-eslint/no-unsafe-assignment
							epoch: config.clique.epoch ?? config.clique.epochlength,
						},
				  }
				: {
						type: 'pow',
						algorithm: 'ethash',
						ethash: {},
				  },
	};

	const forkMap: { [key: string]: { name: string; postMerge?: boolean; isTimestamp?: boolean } } =
		{
			[Hardfork.Homestead]: { name: 'homesteadBlock' },
			[Hardfork.Dao]: { name: 'daoForkBlock' },
			[Hardfork.TangerineWhistle]: { name: 'eip150Block' },
			[Hardfork.SpuriousDragon]: { name: 'eip155Block' },
			[Hardfork.Byzantium]: { name: 'byzantiumBlock' },
			[Hardfork.Constantinople]: { name: 'constantinopleBlock' },
			[Hardfork.Petersburg]: { name: 'petersburgBlock' },
			[Hardfork.Istanbul]: { name: 'istanbulBlock' },
			[Hardfork.MuirGlacier]: { name: 'muirGlacierBlock' },
			[Hardfork.Berlin]: { name: 'berlinBlock' },
			[Hardfork.London]: { name: 'londonBlock' },
			[Hardfork.MergeForkIdTransition]: {
				name: 'mergeForkBlock',
				postMerge: mergeForkIdPostMerge,
			},
			[Hardfork.Shanghai]: { name: 'shanghaiTime', postMerge: true, isTimestamp: true },
			[Hardfork.ShardingForkDev]: {
				name: 'shardingForkTime',
				postMerge: true,
				isTimestamp: true,
			},
		};

	// forkMapRev is the map from config field name to Hardfork
	const forkMapRev = Object.keys(forkMap).reduce<{ [key: string]: string }>((acc, elem) => {
		acc[forkMap[elem].name] = elem;
		return acc;
	}, {});
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const configHardforkNames = Object.keys(config).filter(
		// eslint-disable-next-line no-null/no-null, @typescript-eslint/no-unsafe-member-access
		key => forkMapRev[key] !== undefined && config[key] !== undefined && config[key] !== null,
	);

	params.hardforks = configHardforkNames
		.map(nameBlock => ({
			name: forkMapRev[nameBlock],
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			block:
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				forkMap[forkMapRev[nameBlock]].isTimestamp === true ||
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				typeof config[nameBlock] !== 'number'
					? // eslint-disable-next-line no-null/no-null
					  null
					: // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					  config[nameBlock],
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			timestamp:
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				forkMap[forkMapRev[nameBlock]].isTimestamp === true &&
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				typeof config[nameBlock] === 'number'
					? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					  config[nameBlock]
					: undefined,
		}))
		// eslint-disable-next-line no-null/no-null
		.filter(fork => fork.block !== null || fork.timestamp !== undefined) as ConfigHardfork[];

	params.hardforks.sort(
		(a: ConfigHardfork, b: ConfigHardfork) => (a.block ?? Infinity) - (b.block ?? Infinity),
	);

	params.hardforks.sort(
		(a: ConfigHardfork, b: ConfigHardfork) =>
			(a.timestamp ?? genesisTimestamp) - (b.timestamp ?? genesisTimestamp),
	);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	if (config.terminalTotalDifficulty !== undefined) {
		// Following points need to be considered for placement of merge hf
		// - Merge hardfork can't be placed at genesis
		// - Place merge hf before any hardforks that require CL participation for e.g. withdrawals
		// - Merge hardfork has to be placed just after genesis if any of the genesis hardforks make CL
		//   necessary for e.g. withdrawals
		const mergeConfig = {
			name: Hardfork.Merge,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			ttd: config.terminalTotalDifficulty,
			// eslint-disable-next-line no-null/no-null
			block: null,
		};

		// Merge hardfork has to be placed before first hardfork that is dependent on merge
		const postMergeIndex = params.hardforks.findIndex(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			(hf: any) => forkMap[hf.name]?.postMerge === true,
		);
		if (postMergeIndex !== -1) {
			params.hardforks.splice(postMergeIndex, 0, mergeConfig as unknown as ConfigHardfork);
		} else {
			params.hardforks.push(mergeConfig as unknown as ConfigHardfork);
		}
	}

	const latestHardfork = params.hardforks.length > 0 ? params.hardforks.slice(-1)[0] : undefined;
	params.hardfork = latestHardfork?.name;
	params.hardforks.unshift({ name: Hardfork.Chainstart, block: 0 });

	return params;
}

/**
 * Parses a genesis.json exported from Geth into parameters for Common instance
 * @param json representing the Geth genesis file
 * @param name optional chain name
 * @returns parsed params
 */
export function parseGethGenesis(json: any, name?: string, mergeForkIdPostMerge?: boolean) {
	try {
		if (['config', 'difficulty', 'gasLimit', 'alloc'].some(field => !(field in json))) {
			throw new Error('Invalid format, expected geth genesis fields missing');
		}
		if (name !== undefined) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-param-reassign
			json.name = name;
		}
		return parseGethParams(json, mergeForkIdPostMerge);
	} catch (e: any) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
		throw new Error(`Error parsing parameters file: ${e.message}`);
	}
}

/**
 * Pads a `String` to have an even length
 * @param value
 * @return output
 */
export function padToEven(value: string): string {
	let a = value;

	if (typeof a !== 'string') {
		throw new Error(`[padToEven] value must be type 'string', received ${typeof a}`);
	}

	if (a.length % 2) a = `0${a}`;

	return a;
}

/**
 * Converts an `Number` to a `Buffer`
 * @param {Number} i
 * @return {Buffer}
 */
export const intToBuffer = function (i: number) {
	const hex = intToHex(i);
	return Buffer.from(padToEven(hex.slice(2)), 'hex');
};

/**
 * Attempts to turn a value into a `Buffer`.
 * Inputs supported: `Buffer`, `String` (hex-prefixed), `Number`, null/undefined, `BigInt` and other objects
 * with a `toArray()` or `toBuffer()` method.
 * @param v the value
 */
export const toBuffer = function (v: ToBufferInputTypes): Buffer {
	// eslint-disable-next-line no-null/no-null
	if (v === null || v === undefined) {
		return Buffer.allocUnsafe(0);
	}

	if (Buffer.isBuffer(v)) {
		return Buffer.from(v);
	}

	if (Array.isArray(v) || v instanceof Uint8Array) {
		return Buffer.from(v as Uint8Array);
	}

	if (typeof v === 'string') {
		if (!isHexString(v)) {
			throw new Error(
				`Cannot convert string to buffer. toBuffer only supports 0x-prefixed hex strings and this string was given: ${v}`,
			);
		}
		return Buffer.from(padToEven(stripHexPrefix(v)), 'hex');
	}

	if (typeof v === 'number') {
		return intToBuffer(v);
	}

	if (typeof v === 'bigint') {
		if (v < BigInt(0)) {
			throw new Error(`Cannot convert negative bigint to buffer. Given: ${v}`);
		}
		let n = v.toString(16);
		if (n.length % 2) n = `0${n}`;
		return Buffer.from(n, 'hex');
	}

	if (v.toArray) {
		// converts a BN to a Buffer
		return Buffer.from(v.toArray());
	}

	if (v.toBuffer) {
		return Buffer.from(v.toBuffer());
	}

	throw new Error('invalid type');
};

/**
 * Converts a `Buffer` into a `0x`-prefixed hex `String`.
 * @param buf `Buffer` object to convert
 */
export const bufferToHex = function (_buf: Buffer): string {
	const buf = toBuffer(_buf);
	return `0x${buf.toString('hex')}`;
};

/**
 * Converts a {@link Buffer} to a {@link bigint}
 */
export function bufferToBigInt(buf: Buffer) {
	const hex = bufferToHex(buf);
	if (hex === '0x') {
		return BigInt(0);
	}
	return BigInt(hex);
}

/**
 * Converts a {@link bigint} to a {@link Buffer}
 */
export function bigIntToBuffer(num: bigint) {
	return toBuffer(`0x${num.toString(16)}`);
}

/**
 * Returns a buffer filled with 0s.
 * @param bytes the number of bytes the buffer should be
 */
export const zeros = function (bytes: number): Buffer {
	return Buffer.allocUnsafe(bytes).fill(0);
};

/**
 * Pads a `Buffer` with zeros till it has `length` bytes.
 * Truncates the beginning or end of input if its length exceeds `length`.
 * @param msg the value to pad (Buffer)
 * @param length the number of bytes the output should be
 * @param right whether to start padding form the left or right
 * @return (Buffer)
 */
const setLength = function (msg: Buffer, length: number, right: boolean) {
	const buf = zeros(length);
	if (right) {
		if (msg.length < length) {
			msg.copy(buf);
			return buf;
		}
		return msg.subarray(0, length);
	}
	if (msg.length < length) {
		msg.copy(buf, length - msg.length);
		return buf;
	}
	return msg.subarray(-length);
};

/**
 * Throws if input is not a buffer
 * @param {Buffer} input value to check
 */
export const assertIsBuffer = function (input: Buffer): void {
	if (!Buffer.isBuffer(input)) {
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		const msg = `This method only supports Buffer but input was: ${input}`;
		throw new Error(msg);
	}
};
/**
 * Left Pads a `Buffer` with leading zeros till it has `length` bytes.
 * Or it truncates the beginning if it exceeds.
 * @param msg the value to pad (Buffer)
 * @param length the number of bytes the output should be
 * @return (Buffer)
 */
export const setLengthLeft = function (msg: Buffer, length: number) {
	assertIsBuffer(msg);
	return setLength(msg, length, false);
};

/**
 * Trims leading zeros from a `Buffer`, `String` or `Number[]`.
 * @param a (Buffer|Array|String)
 * @return (Buffer|Array|String)
 */
const stripZeros = function (a: any): Buffer | number[] | string {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
	let first = a[0];
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
	while (a.length > 0 && first.toString() === '0') {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, prefer-destructuring, @typescript-eslint/no-unsafe-call, no-param-reassign
		a = a.slice(1);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, prefer-destructuring, @typescript-eslint/no-unsafe-member-access
		first = a[0];
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return a;
};

/**
 * Trims leading zeros from a `Buffer`.
 * @param a (Buffer)
 * @return (Buffer)
 */
export const unpadBuffer = function (a: Buffer): Buffer {
	assertIsBuffer(a);
	return stripZeros(a) as Buffer;
};

/**
 * Converts a {@link Uint8Array} or {@link NestedUint8Array} to {@link Buffer} or {@link NestedBufferArray}
 */
export function arrToBufArr(arr: Uint8Array): Buffer;
export function arrToBufArr(arr: NestedUint8Array): NestedBufferArray;
export function arrToBufArr(arr: Uint8Array | NestedUint8Array): Buffer | NestedBufferArray;
export function arrToBufArr(arr: Uint8Array | NestedUint8Array): Buffer | NestedBufferArray {
	if (!Array.isArray(arr)) {
		return Buffer.from(arr);
	}
	return arr.map(a => arrToBufArr(a));
}

/**
 * Converts a {@link bigint} to a `0x` prefixed hex string
 */
export const bigIntToHex = (num: bigint) => `0x${num.toString(16)}`;

/**
 * Convert value from bigint to an unpadded Buffer
 * (useful for RLP transport)
 * @param value value to convert
 */
export function bigIntToUnpaddedBuffer(value: bigint): Buffer {
	return unpadBuffer(bigIntToBuffer(value));
}

/**
 * Converts a {@link Buffer} or {@link NestedBufferArray} to {@link Uint8Array} or {@link NestedUint8Array}
 */
export function bufArrToArr(arr: Buffer): Uint8Array;
export function bufArrToArr(arr: NestedBufferArray): NestedUint8Array;
export function bufArrToArr(arr: Buffer | NestedBufferArray): Uint8Array | NestedUint8Array;
export function bufArrToArr(arr: Buffer | NestedBufferArray): Uint8Array | NestedUint8Array {
	if (!Array.isArray(arr)) {
		return Uint8Array.from(arr ?? []);
	}
	return arr.map(a => bufArrToArr(a));
}

function calculateSigRecovery(v: bigint, chainId?: bigint): bigint {
	if (v === BigInt(0) || v === BigInt(1)) return v;

	if (chainId === undefined) {
		return v - BigInt(27);
	}
	return v - (chainId * BigInt(2) + BigInt(35));
}

function isValidSigRecovery(recovery: bigint): boolean {
	return recovery === BigInt(0) || recovery === BigInt(1);
}

/**
 * ECDSA public key recovery from signature.
 * NOTE: Accepts `v === 0 | v === 1` for EIP1559 transactions
 * @returns Recovered public key
 */
export const ecrecover = function (
	msgHash: Buffer,
	v: bigint,
	r: Buffer,
	s: Buffer,
	chainId?: bigint,
): Buffer {
	const signature = Buffer.concat([setLengthLeft(r, 32), setLengthLeft(s, 32)], 64);
	const recovery = calculateSigRecovery(v, chainId);
	if (!isValidSigRecovery(recovery)) {
		throw new Error('Invalid signature v value');
	}

	const senderPubKey = recoverPublicKey(msgHash, signature, Number(recovery));
	return Buffer.from(senderPubKey.slice(1));
};

/**
 * Convert an input to a specified type.
 * Input of null/undefined returns null/undefined regardless of the output type.
 * @param input value to convert
 * @param outputType type to output
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function toType<T extends TypeOutput>(input: null, outputType: T): null;
export function toType<T extends TypeOutput>(input: undefined, outputType: T): undefined;
export function toType<T extends TypeOutput>(
	input: ToBufferInputTypes,
	outputType: T,
): TypeOutputReturnType[T];
export function toType<T extends TypeOutput>(
	input: ToBufferInputTypes,
	outputType: T,
	// eslint-disable-next-line @typescript-eslint/ban-types
): TypeOutputReturnType[T] | undefined | null {
	// eslint-disable-next-line no-null/no-null
	if (input === null) {
		// eslint-disable-next-line no-null/no-null
		return null;
	}
	if (input === undefined) {
		return undefined;
	}

	if (typeof input === 'string' && !isHexString(input)) {
		throw new Error(`A string must be provided with a 0x-prefix, given: ${input}`);
	} else if (typeof input === 'number' && !Number.isSafeInteger(input)) {
		throw new Error(
			'The provided number is greater than MAX_SAFE_INTEGER (please use an alternative input type)',
		);
	}

	const output = toBuffer(input);

	switch (outputType) {
		case TypeOutput.Buffer:
			return output as TypeOutputReturnType[T];
		case TypeOutput.BigInt:
			return bufferToBigInt(output) as TypeOutputReturnType[T];
		case TypeOutput.Number: {
			const bigInt = bufferToBigInt(output);
			if (bigInt > BigInt(Number.MAX_SAFE_INTEGER)) {
				throw new Error(
					'The provided number is greater than MAX_SAFE_INTEGER (please use an alternative output type)',
				);
			}
			return Number(bigInt) as TypeOutputReturnType[T];
		}
		case TypeOutput.PrefixedHexString:
			return bufferToHex(output) as TypeOutputReturnType[T];
		default:
			throw new Error('unknown outputType');
	}
}
