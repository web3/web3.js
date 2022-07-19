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

import { HexString, Numbers } from 'web3-types';

export const padLeftData: [[Numbers, number, string], HexString][] = [
	[[0, 10, '0'], '0x0000000000'],
	[['0x01', 64, 'f'], '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01'],
	[['-0x01', 64, 'f'], '-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01'],
	[['5', 32, '0'], '00000000000000000000000000000005'],
	[['-05', 32, 'f'], 'fffffffffffffffffffffffffffff-05'],
	[['abcd', 8, '0'], '0000abcd'],
	[['-abcd', 8, '0'], '000-abcd'],
	[[BigInt('9007199254740992'), 32, '0'], '0x00000000000000000020000000000000'],
	[[BigInt('-9007199254740992'), 32, '0'], '-0x00000000000000000020000000000000'],
	[[-13, 10, '0'], '-0x000000000d'],
	[['9.5', 8, '0'], '000009.5'],
];

export const padInvalidData: [[any, number, string], string][] = [
	[[9.5, 64, 'f'], 'value "9.5" at "/0" must pass "int" validation'],
	// Using "null" value intentionally for validation
	// eslint-disable-next-line no-null/no-null
	[[null, 8, '0'], 'value at "/0" must pass "int" validation'],
	[[undefined, 8, '0'], 'value at "/0" must pass "int" validation'],
	[[{}, 3, 'f'], 'value "[object Object]" at "/0" must pass "int" validation'],
];

export const padRightData: [[Numbers, number, string], HexString][] = [
	[[1, 5, '0'], '0x10000'],
	[
		[-2000, 128, '0'],
		'-0x7d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	],
	[['0x00', 5, 'f'], '0x00fff'],
	[['-0x01', 64, 'f'], '-0x01ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
	[['zxy', 11, '0'], 'zxy00000000'],
	[['-abcd', 32, '1'], '-abcd111111111111111111111111111'],
	[[BigInt(10000), 8, '0'], '0x27100000'],
	[[BigInt(-14), 8, '0'], '-0xe0000000'],
	[['15.5', 8, '0'], '15.50000'],
];

export const toTwosComplementData: [[Numbers, number], HexString][] = [
	[[13, 32], '0x0000000000000000000000000000000d'],
	[[256, 30], '0x000000000000000000000000000100'],
	[[0, 32], '0x00000000000000000000000000000000'],
	[['0x1', 32], '0x00000000000000000000000000000001'],
	[['-0x1', 32], '0xffffffffffffffffffffffffffffffff'],
	[[BigInt('9007199254740992'), 32], '0x00000000000000000020000000000000'],
	[[BigInt('-9007199254740992'), 32], '0xffffffffffffffffffe0000000000000'],
	[['13', 32], '0x0000000000000000000000000000000d'],
	[['-13', 32], '0xfffffffffffffffffffffffffffffff3'],
	[[-16, 2], '0xf0'],
];

export const fromTwosComplementData: [[Numbers, number], number | bigint][] = [
	[['0x0000000000000000000000000000000d', 32], 13],
	[['0x000000000000000000000000000100', 30], 256],
	[['0x00000000000000000020000000000000', 32], BigInt('9007199254740992')],
	[['0xfffffffffffffffffffffffffffffff3', 32], -13],
	[['0xf0', 2], -16],
	[['0xffffffffffffffffffffffffffffff00', 32], -256],
	[[1000, 64], 1000],
	[[-1000, 64], -1000],
	[[BigInt(9), 1], -7],
];

export const toTwosComplementInvalidData: [[Numbers, number], string][] = [
	// solidity only store 32 bytes numbers
	[
		['0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00', 64],
		'value "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00" at "/0" must pass "int" validation',
	],
	[['ab', 32], 'value "ab" at "/0" must pass "int" validation'],
	[['-ab', 3], 'value "-ab" at "/0" must pass "int" validation'],
	[['ab0x', 2], 'value "ab0x" at "/0" must pass "int" validation'],
	[[25.5, 32], 'value "25.5" at "/0" must pass "int" validation'],
	[['-120.0', 4], 'value "-120.0" at "/0" must pass "int" validation'],
	[
		[-256, 2],
		'Invalid value given "value: -256, nibbleWidth: 2". Error: value greater than the nibble width.',
	],
	[
		['-0x1000', 3],
		'Invalid value given "value: -0x1000, nibbleWidth: 3". Error: value greater than the nibble width.',
	],
	[
		[BigInt(-160000), 1],
		'Invalid value given "value: -160000, nibbleWidth: 1". Error: value greater than the nibble width.',
	],
];

export const fromTwosComplementInvalidData: [[Numbers, number], string][] = [
	[['ab', 32], 'value "ab" at "/0" must pass "int" validation'],
	[['-ab', 3], 'value "-ab" at "/0" must pass "int" validation'],
	[['ab0x', 2], 'value "ab0x" at "/0" must pass "int" validation'],
	[[25.5, 32], 'value "25.5" at "/0" must pass "int" validation'],
	[['-120.0', 4], 'value "-120.0" at "/0" must pass "int" validation'],
	[
		[1000, 2],
		'Invalid value given "value: 1000, nibbleWidth: 2". Error: value greater than the nibble width.',
	],
	[
		['0xa05', 1],
		'Invalid value given "value: 0xa05, nibbleWidth: 1". Error: value greater than the nibble width.',
	],
];
