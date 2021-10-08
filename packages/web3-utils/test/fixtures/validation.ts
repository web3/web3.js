/* eslint-disable @typescript-eslint/no-magic-numbers */

import { Address, Bytes, HexString, Numbers, ValueTypes } from '../../src/types';

export const isHexData: [any, boolean][] = [
	['0x48', true],
	['0x123c', true],
    ['45', true],
    ['', true],
    ['0', true],
    [1, true],
	[BigInt(12), true],
	[12n, true],
	['-1000', true],
	[-255n, true],	
    ['I have 100£', false],
	['\u0000', false],
	[true, false],
	[false, false],
];

export const isHexInvalidData: [any, string][] = [

]