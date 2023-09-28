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

import { AbiParameter } from 'web3-types';

export const validEncoderData: Array<{
	components: ReadonlyArray<AbiParameter>;
	values: unknown;
	result: string;
	dynamic: boolean;
}> = [
	{
		components: [
			{ type: 'uint8', name: '' },
			{ type: 'bool', name: '' },
		],
		values: [69, true],
		dynamic: false,
		result: '00000000000000000000000000000000000000000000000000000000000000450000000000000000000000000000000000000000000000000000000000000001',
	},
	{
		components: [
			{ type: 'bool', name: '' },
			{
				type: 'tuple',
				name: '',
				components: [
					{ type: 'uint8', name: '' },
					{ type: 'bool', name: '' },
				],
			},
		],
		values: [true, [69, true]],
		dynamic: false,
		result: '000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000450000000000000000000000000000000000000000000000000000000000000001',
	},
	{
		components: [
			{ type: 'bool', name: 'y' },
			{ type: 'bool', name: 'z' },
		],
		values: { y: false, z: true },
		dynamic: false,
		result: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
	},
];

export const validDecoderData: Array<{
	components: ReadonlyArray<AbiParameter>;
	bytes: string;
	result: unknown;
	remaining: string;
}> = [
	{
		components: [
			{ type: 'uint8', name: '' },
			{ type: 'bool', name: '' },
		],
		result: { __length__: 2, 0: BigInt(69), 1: true },
		bytes: '0x00000000000000000000000000000000000000000000000000000000000000450000000000000000000000000000000000000000000000000000000000000001',
		remaining: '0x',
	},
	{
		components: [
			{ type: 'bool', name: '' },
			{
				type: 'tuple',
				name: 'subTuple',
				components: [
					{ type: 'uint8', name: '' },
					{ type: 'bool', name: '' },
				],
			},
		],
		result: {
			__length__: 2,
			0: true,
			1: { __length__: 2, 0: BigInt(69), 1: true },
			subTuple: { __length__: 2, 0: BigInt(69), 1: true },
		},
		bytes: '000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000450000000000000000000000000000000000000000000000000000000000000001',
		remaining: '0x',
	},
	{
		components: [
			{ type: 'string', name: '' },
			{ type: 'bool', name: '' },
			{
				type: 'tuple',
				name: '',
				components: [
					{ type: 'bool', name: '' },
					{ type: 'string', name: '' },
				],
			},
		],
		result: {
			__length__: 3,
			0: 'marin123123123123',
			1: true,
			2: {
				__length__: 2,
				0: true,
				1: 'web3jstestinglongstriiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiing',
			},
		},
		bytes: '0x0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000116d6172696e31323331323331323331323300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000003c776562336a7374657374696e676c6f6e6773747269696969696969696969696969696969696969696969696969696969696969696969696969696e6700000000',
		remaining: '0x',
	},
];
