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

import { AbiParameter, Numbers } from 'web3-types';

export const validNumberEncoderData: [AbiParameter, Numbers, string][] = [
	[
		{ type: 'uint8', name: '' },
		1,
		'0000000000000000000000000000000000000000000000000000000000000001',
	],
	[
		{ type: 'uint8', name: '' },
		'8',
		'0000000000000000000000000000000000000000000000000000000000000008',
	],
	[
		{ type: 'int8', name: '' },
		-1,
		'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
	],
	[
		{ type: 'int8', name: '' },
		-122,
		'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff86',
	],
	[
		{ type: 'int8', name: '' },
		-128,
		'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff80',
	],
	[
		{ type: 'int8', name: '' },
		'-122',
		'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff86',
	],
	[
		{ type: 'int', name: '' },
		-122,
		'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff86',
	],
	[
		{ type: 'int', name: '' },
		BigInt(122),
		'000000000000000000000000000000000000000000000000000000000000007a',
	],
	[
		{ type: 'int32', name: '' },
		BigInt(-122),
		'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff86',
	],
	[
		{ type: 'int32', name: '' },
		'-0xa2',
		'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff5e',
	],
	[
		{ type: 'uint24', name: '' },
		'12312312',
		'0000000000000000000000000000000000000000000000000000000000bbdef8',
	],
	[
		{ type: 'int24', name: '' },
		'-123123',
		'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe1f0d',
	],
];

export const invalidNumberEncoderData: [AbiParameter, Numbers][] = [
	[{ type: 'uint8', name: '' }, 'blem'],
	[{ type: 'uint8', name: '' }, '--123'],
	[{ type: 'uint8', name: '' }, '256'],
	[{ type: 'int8', name: '' }, '128'],
	[{ type: 'int8', name: '' }, '-129'],
	[{ type: 'int17', name: '' }, '129'],
];

export const validNumberDecoderData: [AbiParameter, string, Numbers, string][] = [
	[
		{ type: 'uint8', name: '' },
		'0x0000000000000000000000000000000000000000000000000000000000000012',
		BigInt(18),
		'0x',
	],
	[
		{ type: 'uint256', name: '' },
		'0x00000000000000000000003f29a33f562a1feab357509b77f71717e78667e7c1',
		BigInt('92312312312312312312312312312312312303939393939393'),
		'0x',
	],
	[
		{ type: 'int256', name: '' },
		'0xffffffffffffffffffffffc0d65cc0a9d5e0154ca8af648808e8e8187998183f',
		BigInt('-92312312312312312312312312312312312303939393939393'),
		'0x',
	],
	[
		{ type: 'int8', name: '' },
		'0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe7',
		BigInt('-25'),
		'0x',
	],
	[
		{ type: 'uint256', name: '' },
		'0x000000000000000000000000000000000000000000000000000000000001e0f30000000000000000000000000000000000000000000000000000000000000001',
		BigInt(123123),
		'0x0000000000000000000000000000000000000000000000000000000000000001',
	],
	[
		{ type: 'uint24', name: '' },
		'0x0000000000000000000000000000000000000000000000000000000000bbdef8',
		BigInt(12312312),
		'0x',
	],
	[
		{ type: 'int24', name: '' },
		'0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe1f0d',
		-BigInt(123123),
		'0x',
	],
];

export const invalidNumberDecoderData: [AbiParameter, string][] = [
	[{ type: 'uint8', name: '' }, '0x'],
	[
		{ type: 'uint8', name: '' },
		'0x00000000000000000000003f29a33f562a1feab357509b77f71717e78667e7c1',
	],
	[
		{ type: 'int17', name: '' },
		'0xffffffffffffffffffffffc0d65cc0a9d5e0154ca8af648808e8e8187998183f',
	],
];
