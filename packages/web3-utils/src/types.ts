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

/*
 * A type that represents an object that has a `toBuffer()` method.
 */
export interface TransformableToBuffer {
	toBuffer(): Buffer;
	toArray?(): Uint8Array;
}

/*
 * A type that represents a `0x`-prefixed hex string.
 */
export type PrefixedHexString = string;

/*
 * A type that represents an input that can be converted to a Buffer.
 */
export type BufferLike =
	| Buffer
	| Uint8Array
	| number[]
	| number
	| bigint
	| TransformableToBuffer
	| PrefixedHexString;

/*
 * A type that represents an input that can be converted to a BigInt.
 */
export type BigIntLike = bigint | PrefixedHexString | number | Buffer;

/*
 * A type that represents an object that has a `toArray()` method.
 */
export interface TransformableToArray {
	toArray(): Uint8Array;
	toBuffer?(): Buffer;
}

export type NestedUint8Array = Array<Uint8Array | NestedUint8Array>;
export type NestedBufferArray = Array<Buffer | NestedBufferArray>;

/**
 * Type output options
 */
export enum TypeOutput {
	Number,
	BigInt,
	Buffer,
	PrefixedHexString,
}

export type TypeOutputReturnType = {
	[TypeOutput.Number]: number;
	[TypeOutput.BigInt]: bigint;
	[TypeOutput.Buffer]: Buffer;
	[TypeOutput.PrefixedHexString]: PrefixedHexString;
};
export type ToBufferInputTypes =
	| PrefixedHexString
	| number
	| bigint
	| Buffer
	| Uint8Array
	| number[]
	| TransformableToArray
	| TransformableToBuffer
	// eslint-disable-next-line @typescript-eslint/ban-types
	| null
	| undefined;
