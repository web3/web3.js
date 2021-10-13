/* eslint-disable @typescript-eslint/no-magic-numbers */

import { HexString, Numbers } from '../../src/types';

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
	[[9007199254740992n, 32, '0'], '0x00000000000000000020000000000000'],
	[[-9007199254740992n, 32, '0'], '-0x00000000000000000020000000000000'],
	[[-13, 10, '0'], '-0x000000000d'],
	[['9.5', 8, '0'], '000009.5'],
];

export const padInvalidData: [[any, number, string], HexString][] = [
	[[9.5, 64, 'f'], 'Invalid value given "9.5". Error: not a valid integer.'],
	[[null, 8, '0'], 'Invalid value given "null". Error: not a valid integer.'],
	[[undefined, 8, '0'], 'Invalid value given "undefined". Error: not a valid integer.'],
	[[{}, 3, 'f'], 'Invalid value given "[object Object]". Error: not a valid integer.'],
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
	[[10000n, 8, '0'], '0x27100000'],
	[[BigInt(10000), 8, '0'], '0x27100000'],
	[[BigInt(-14), 8, '0'], '-0xe0000000'],
	[[-14n, 8, '0'], '-0xe0000000'],
	[['15.5', 8, '0'], '15.50000'],
];

export const toTwosComplementData: [[Numbers, number], HexString][] = [
	[[256, 64], '0x0000000000000000000000000000000000000000000000000000000000000100'],
	[[-256, 64], '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00'],
	[[256, 56], '0x00000000000000000000000000000000000000000000000000000100'],
	[[0, 64], '0x0000000000000000000000000000000000000000000000000000000000000000'],
	[['0x1', 64], '0x0000000000000000000000000000000000000000000000000000000000000001'],
	[['-0x1', 64], '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
	[
		[BigInt('9007199254740992'), 64],
		'0x0000000000000000000000000000000000000000000000000020000000000000',
	],
	[
		[BigInt('-9007199254740992'), 64],
		'0xffffffffffffffffffffffffffffffffffffffffffffffffffe0000000000000',
	],
	[[9007199254740992n, 64], '0x0000000000000000000000000000000000000000000000000020000000000000'],
	[
		[-9007199254740992n, 64],
		'0xffffffffffffffffffffffffffffffffffffffffffffffffffe0000000000000',
	],
	[['13', 32], '0x0000000000000000000000000000000d'],
	[['-13', 32], '0xfffffffffffffffffffffffffffffff3'],
	[[-16, 2], '0xf0'],
];

export const fromTwosComplementData: [[Numbers, number], number | bigint][] = [
	[['0x0000000000000000000000000000000000000000000000000000000000000100', 64], 256],
	[['0x0000000000000000000000000000000d', 32], 13],
	[['0x00000000000000000000000000000000000000000000000000000100', 56], 256],
	[
		['0x0000000000000000000000000000000000000000000000000020000000000000', 64],
		BigInt('9007199254740992'),
	],
	[['0xfffffffffffffffffffffffffffffff3', 32], -13],
	[['0xf0', 2], -16],
	[['0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00', 64], -256],
	[
		['0xffffffffffffffffffffffffffffffffffffffffffffffffffe0000000000000', 64],
		-9007199254740992n,
	],
	[[1000, 64], 1000],
	[[-1000, 64], -1000],
	[[BigInt(9), 1], -7],
];

export const toTwosComplementInvalidData: [[Numbers, number], string][] = [
	[['ab', 32], 'Invalid value given "ab". Error: not a valid integer.'],
	[['-ab', 3], 'Invalid value given "-ab". Error: not a valid integer.'],
	[['ab0x', 2], 'Invalid value given "ab0x". Error: not a valid integer.'],
	[[25.5, 32], 'Invalid value given "25.5". Error: not a valid integer.'],
	[['-120.0', 4], 'Invalid value given "-120.0". Error: not a valid integer.'],
	[
		[-256, 2],
		'Invalid value given "value: "-256", nibbleWidth: "2"". Error: value greater than the nibble width.',
	],
	[
		['-0x1000', 3],
		'Invalid value given "value: "-0x1000", nibbleWidth: "3"". Error: value greater than the nibble width.',
	],
	[
		[-160000n, 1],
		'Invalid value given "value: "-160000", nibbleWidth: "1"". Error: value greater than the nibble width.',
	],
];

export const fromTwosComplementInvalidData: [[Numbers, number], string][] = [
	[['ab', 32], 'Invalid value given "ab". Error: not a valid integer.'],
	[['-ab', 3], 'Invalid value given "-ab". Error: not a valid integer.'],
	[['ab0x', 2], 'Invalid value given "ab0x". Error: not a valid integer.'],
	[[25.5, 32], 'Invalid value given "25.5". Error: not a valid integer.'],
	[['-120.0', 4], 'Invalid value given "-120.0". Error: not a valid integer.'],
	[
		[1000, 2],
		'Invalid value given "value: "1000", nibbleWidth: "2"". Error: value greater than the nibble width.',
	],
	[
		['0xa05', 1],
		'Invalid value given "value: "0xa05", nibbleWidth: "1"". Error: value greater than the nibble width.',
	],
];
