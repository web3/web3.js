/* eslint-disable @typescript-eslint/no-magic-numbers */

// import { Address, Bytes, HexString, Numbers, ValueTypes } from '../../src/types';

export const isHexData: [any, boolean][] = [
	['0x48', true],
	['0x123c', true],
	['45', true],
	['', true],
	['0', true],
	[1, true],
	[BigInt(12), true],
	[12n, true],
	['-1000', false],
	[-255n, true],
	['I have 100£', false],
	['\u0000', false],
	[true, false],
	[false, false],
];

export const isHexStrictData: [any, boolean][] = [
	['0x48', true],
	['0x123c', true],
	['45', false],
	['', false],
	['0', false],
	[1, false],
	[BigInt(12), false],
	[12n, false],
	['-1000', false],
	[-255n, false],
	['I have 100£', false],
	['\u0000', false],
	[true, false],
	[false, false],
];

export const isHexInvalidData: [any, boolean][] = [];
