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

import { encodeParameters, decodeParameters } from '../../src/api/parameters_api';

// Because Jest does not support BigInt (https://github.com/facebook/jest/issues/12827)
// The BigInt values in this file is in a string format.
// And the following override is to convert BigInt to a string inside the Unit Tests that uses this file,
// 	i.e when serialization is needed there (because the values in this file is in a string format).
(BigInt.prototype as any).toJSON = function () {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
	return this.toString();
};

export const jsonInterfaceValidData: [any, string][] = [
	[
		{
			// testing function type
			name: 'myMethod',
			type: 'function',
			inputs: [
				{
					type: 'uint256',
					name: 'myNumber',
				},
				{
					type: 'string',
					name: 'myString',
				},
			],
		},
		'myMethod(uint256,string)',
	],
	[
		{
			name: 'f',
			type: 'function',
			inputs: [
				{
					name: 's',
					type: 'tuple',
					components: [
						{
							name: 'a',
							type: 'uint256',
						},
						{
							name: 'b',
							type: 'uint256[]',
						},
						{
							name: 'c',
							type: 'tuple[]',
							components: [
								{
									name: 'x',
									type: 'uint256',
								},
								{
									name: 'y',
									type: 'uint256',
								},
							],
						},
					],
				},
				{
					name: 't',
					type: 'tuple',
					components: [
						{
							name: 'x',
							type: 'uint256',
						},
						{
							name: 'y',
							type: 'uint256',
						},
					],
				},
				{
					name: 'a',
					type: 'uint256',
				},
			],
			outputs: [],
		},
		'f((uint256,uint256[],(uint256,uint256)[]),(uint256,uint256),uint256)',
	],
	[
		// testing event type
		{
			type: 'event',
			inputs: [
				{ name: 'a', type: 'uint256', indexed: true },
				{ name: 'b', type: 'bytes32', indexed: false },
			],
			name: 'Event',
		},
		'Event(uint256,bytes32)',
	],
	[
		{
			name: 'myEvent',
			type: 'event',
			inputs: [
				{
					type: 'uint256',
					name: 'myNumber',
				},
				{
					type: 'bytes32',
					name: 'myBytes',
				},
			],
		},
		'myEvent(uint256,bytes32)',
	],
];

export const jsonInterfaceInvalidData: [any, string][] = [
	[
		{
			name: 'f',
			type: 'function',
			inputs: [
				{
					name: 's',
					type: 'notTuple',
					components: [
						{
							name: 'a',
							type: 'uint256',
						},
						{
							name: 'b',
							type: 'uint256[]',
						},
						{
							name: 'c',
							type: 'tuple[]',
							components: [
								{
									name: 'x',
									type: 'uint256',
								},
								{
									name: 'y',
									type: 'uint256',
								},
							],
						},
					],
				},
				{
					name: 't',
					type: 'tuple',
					components: [
						{
							name: 'x',
							type: 'uint256',
						},
						{
							name: 'y',
							type: 'uint256',
						},
					],
				},
				{
					name: 'a',
					type: 'uint256',
				},
			],
			outputs: [],
		},
		'Invalid value given "notTuple". Error: components found but type is not tuple.',
	],
];

export const validFunctionsSignatures: { input: any; output: string }[] = [
	{ input: 'myMethod(uint256,string)', output: '0x24ee0097' },
	{
		input: {
			name: 'myMethod',
			type: 'function' as const,
			inputs: [
				{
					type: 'uint256',
					name: 'myNumber',
				},
				{
					type: 'string',
					name: 'myString',
				},
			],
		},
		output: '0x24ee0097',
	},
];

export const inValidFunctionsSignatures: { input: any; output: string }[] = [
	{ input: 345, output: 'Invalid parameter value in encodeFunctionSignature' },
	{ input: {}, output: 'Invalid parameter value in encodeFunctionSignature' },
	{ input: ['mystring'], output: 'Invalid parameter value in encodeFunctionSignature' },
	// Using "null" value intentionally for validation
	// eslint-disable-next-line no-null/no-null
	{ input: null, output: 'Invalid parameter value in encodeFunctionSignature' },
	{ input: undefined, output: 'Invalid parameter value in encodeFunctionSignature' },
];

export const validFunctionsCall: { input: { abi: any; params: any }; output: string }[] = [
	{
		input: {
			abi: {
				name: 'myMethod',
				type: 'function',
				inputs: [
					{
						type: 'uint256',
						name: 'myNumber',
					},
					{
						type: 'string',
						name: 'myString',
					},
				],
			},
			params: ['2345675643', 'Hello!%'],
		},
		output: '0x24ee0097000000000000000000000000000000000000000000000000000000008bd02b7b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000748656c6c6f212500000000000000000000000000000000000000000000000000',
	},
	{
		input: {
			abi: {
				type: 'function',
				name: 'pour',
				inputs: [
					{
						type: 'bytes12',
						name: 'vaultId_',
					},
					{
						type: 'address',
						name: 'to',
					},
					{
						type: 'int128',
						name: 'ink',
					},
					{
						type: 'int128',
						name: 'art',
					},
				],
			},
			params: [
				'0x000000000000000000000000',
				'0x0000000000000000000000000000000000000000',
				'170141183460469231731687303715884105727',
				'-170141183460469231731687303715884105727',
			],
		},
		output: '0x99d4294000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff80000000000000000000000000000001',
	},
];

export const inValidFunctionsCalls: { input: any; output: string }[] = [
	{ input: 345, output: 'Invalid parameter value in encodeFunctionCall' },
	{ input: {}, output: 'Invalid parameter value in encodeFunctionCall' },
	{ input: ['mystring'], output: 'Invalid parameter value in encodeFunctionCall' },
	// Using "null" value intentionally for validation
	// eslint-disable-next-line no-null/no-null
	{ input: null, output: 'Invalid parameter value in encodeFunctionCall' },
	{ input: undefined, output: 'Invalid parameter value in encodeFunctionCall' },
];

export const validEventsSignatures: { input: any; output: string }[] = [
	{
		input: 'myEvent(uint256,bytes32)',
		output: '0xf2eeb729e636a8cb783be044acf6b7b1e2c5863735b60d6daae84c366ee87d97',
	},
	{
		input: {
			name: 'myEvent',
			type: 'event' as const,
			inputs: [
				{
					type: 'uint256',
					name: 'myNumber',
				},
				{
					type: 'bytes32',
					name: 'myBytes',
				},
			],
		},
		output: '0xf2eeb729e636a8cb783be044acf6b7b1e2c5863735b60d6daae84c366ee87d97',
	},
];

export const invalidEventsSignatures: { input: any; output: string }[] = [
	{ input: 345, output: 'Invalid parameter value in encodeEventSignature' },
	{ input: {}, output: 'Invalid parameter value in encodeEventSignature' },
	{ input: ['mystring'], output: 'Invalid parameter value in encodeEventSignature' },
	// Using "null" value intentionally for validation
	// eslint-disable-next-line no-null/no-null
	{ input: null, output: 'Invalid parameter value in encodeEventSignature' },
	{ input: undefined, output: 'Invalid parameter value in encodeEventSignature' },
];

export const validErrorsSignatures: { input: any; output: string }[] = [
	{
		input: 'Unauthorized()',
		output: '0x82b4290015f7ec7256ca2a6247d3c2a89c4865c0e791456df195f40ad0a81367',
	},
	{
		input: {
			inputs: [{ internalType: 'string', name: '', type: 'string' }],
			name: 'CustomError',
			type: 'error',
		},
		output: '0x8d6ea8bed4afafaebcad40e72174583b8bf4969c5d3bc84536051f3939bf9d81',
	},
	{
		input: 'Error(string)',
		output: '0x08c379a0afcc32b1a39302f7cb8073359698411ab5fd6e3edb2c02c0b5fba8aa',
	},
];

export const invalidErrorSignatures: { input: any; output: string }[] = [
	{ input: 345, output: 'Invalid parameter value in encodeErrorSignature' },
	{ input: {}, output: 'Invalid parameter value in encodeErrorSignature' },
	{ input: ['mystring'], output: 'Invalid parameter value in encodeErrorSignature' },
	// Using "null" value intentionally for validation
	// eslint-disable-next-line no-null/no-null
	{ input: null, output: 'Invalid parameter value in encodeErrorSignature' },
	{ input: undefined, output: 'Invalid parameter value in encodeErrorSignature' },
];

export const validDecodeLogsData: {
	input: { abi: any; data: any; topics: any };
	output: Record<string, unknown>;
}[] = [
	{
		input: {
			abi: [
				{
					type: 'string',
					name: 'myString',
				},
				{
					type: 'uint256',
					name: 'myNumber',
					indexed: true,
				},
				{
					type: 'uint8',
					name: 'mySmallNumber',
					indexed: true,
				},
			],
			data: '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000748656c6c6f252100000000000000000000000000000000000000000000000000',
			topics: [
				'0x000000000000000000000000000000000000000000000000000000000000f310',
				'0x0000000000000000000000000000000000000000000000000000000000000010',
			],
		},
		output: {
			'0': 'Hello%!',
			'1': '62224',
			'2': '16',
			__length__: 3,
			myString: 'Hello%!',
			myNumber: '62224',
			mySmallNumber: '16',
		},
	},
	{
		// testing an anonymous log with 4 params
		input: {
			abi: [
				{
					name: 'myString',
					type: 'string',
				},
				{
					name: 'myNum',
					type: 'uint8',
				},
				{
					name: 'str',
					type: 'string',
				},
				{
					name: 'largerNumber',
					type: 'uint256',
				},
			],
			topics: [],
			data: '0x0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000000000000000000000000000000000000000000002307800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016200000000000000000000000000000000000000000000000000000000000000',
		},
		output: {
			'0': '0x',
			'1': '12',
			'2': 'b',
			'3': '125',
			__length__: 4,
			myString: '0x',
			myNum: '12',
			largerNumber: '125',
			str: 'b',
		},
	},
	{
		input: {
			abi: [
				{
					indexed: true,
					name: 'from',
					type: 'address',
				},
				{
					indexed: true,
					name: 'to',
					type: 'address',
				},
				{
					indexed: false,
					name: 'value',
					type: 'uint256',
				},
			],
			topics: [
				'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
				'0x0000000000000000000000006e599da0bff7a6598ac1224e4985430bf16458a4',
				'0x0000000000000000000000006f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
			],
			data: '0x00000000000000000000000000000000000000000000000000000000000186a0',
		},
		output: {
			'0': '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
			'1': '0x6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
			'2': '100000',
			__length__: 3,
			from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
			to: '0x6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
			value: '100000',
		},
	},
	{
		input: {
			abi: [
				{ indexed: true, internalType: 'address', name: 'addr', type: 'address' },
				{
					components: [
						{ internalType: 'string', name: 'name', type: 'string' },
						{ internalType: 'address', name: 'addr', type: 'address' },
						{
							components: [
								{ internalType: 'string', name: 'email', type: 'string' },
								{ internalType: 'string', name: 'phone', type: 'string' },
							],
							internalType: 'struct ABIV2UserDirectory.Contact',
							name: 'contact',
							type: 'tuple',
						},
					],
					indexed: false,
					internalType: 'struct ABIV2UserDirectory.User',
					name: 'user',
					type: 'tuple',
				},
			],
			data: '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000060000000000000000000000000cb00cde33a7a0fba30c63745534f1f7ae607076b00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000c5269636b2053616e6368657a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000157269636b2e63313337406369746164656c2e636663000000000000000000000000000000000000000000000000000000000000000000000000000000000000112b31202835353529203331342d31353933000000000000000000000000000000',
			topics: ['0x000000000000000000000000cb00cde33a7a0fba30c63745534f1f7ae607076b'],
		},
		output: {
			'0': '0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b',
			'1': {
				'0': 'Rick Sanchez',
				'1': '0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b',
				'2': {
					'0': 'rick.c137@citadel.cfc',
					'1': '+1 (555) 314-1593',
					__length__: 2,
					email: 'rick.c137@citadel.cfc',
					phone: '+1 (555) 314-1593',
				},
				__length__: 3,
				name: 'Rick Sanchez',
				addr: '0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b',
				contact: {
					'0': 'rick.c137@citadel.cfc',
					'1': '+1 (555) 314-1593',
					__length__: 2,
					email: 'rick.c137@citadel.cfc',
					phone: '+1 (555) 314-1593',
				},
			},
			__length__: 2,
			addr: '0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b',
			user: {
				'0': 'Rick Sanchez',
				'1': '0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b',
				'2': {
					'0': 'rick.c137@citadel.cfc',
					'1': '+1 (555) 314-1593',
					__length__: 2,
					email: 'rick.c137@citadel.cfc',
					phone: '+1 (555) 314-1593',
				},
				__length__: 3,
				name: 'Rick Sanchez',
				addr: '0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b',
				contact: {
					'0': 'rick.c137@citadel.cfc',
					'1': '+1 (555) 314-1593',
					__length__: 2,
					email: 'rick.c137@citadel.cfc',
					phone: '+1 (555) 314-1593',
				},
			},
		},
	},
];

export const validEncodeDecodeParametersData: {
	input: Parameters<typeof encodeParameters>;
	output: ReturnType<typeof encodeParameters>;
	outputResult: any;
}[] = [
	{
		input: [
			['uint256', 'string'],
			['2345675643', 'Hello!%'],
		],
		output: '0x000000000000000000000000000000000000000000000000000000008bd02b7b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000748656c6c6f212500000000000000000000000000000000000000000000000000',
		outputResult: {
			'0': '2345675643',
			'1': 'Hello!%',
			__length__: 2,
		},
	},
	{
		input: [
			['uint8[]', 'bytes32'],
			[['34', '255'], '0x324567fff0000000000000000000000000000000000000000000000000000000'],
		],
		output: '0x0000000000000000000000000000000000000000000000000000000000000040324567fff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000ff',
		outputResult: {
			'0': ['34', '255'],
			'1': '0x324567fff0000000000000000000000000000000000000000000000000000000',
			__length__: 2,
		},
	},
	{
		input: [
			[
				'uint8[]',
				{
					ParentStruct: {
						propertyOne: 'uint256',
						propertyTwo: 'uint256',
						ChildStruct: {
							propertyOne: 'uint256',
							propertyTwo: 'uint256',
						},
					},
				},
			],
			[
				['34', '255'],
				{
					propertyOne: '42',
					propertyTwo: '56',
					ChildStruct: {
						propertyOne: '45',
						propertyTwo: '78',
					},
				},
			],
		],
		output: '0x00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000002d000000000000000000000000000000000000000000000000000000000000004e0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000ff',
		outputResult: {
			'0': ['34', '255'],
			'1': {
				'0': '42',
				'1': '56',
				'2': {
					'0': '45',
					'1': '78',
					propertyOne: '45',
					propertyTwo: '78',
					__length__: 2,
				},
				propertyOne: '42',
				propertyTwo: '56',
				ChildStruct: {
					'0': '45',
					'1': '78',
					propertyOne: '45',
					propertyTwo: '78',
					__length__: 2,
				},
				__length__: 3,
			},
			ParentStruct: {
				'0': '42',
				'1': '56',
				'2': {
					'0': '45',
					'1': '78',
					propertyOne: '45',
					propertyTwo: '78',
					__length__: 2,
				},
				propertyOne: '42',
				propertyTwo: '56',
				ChildStruct: {
					'0': '45',
					'1': '78',
					propertyOne: '45',
					propertyTwo: '78',
					__length__: 2,
				},
				__length__: 3,
			},
			__length__: 2,
		},
	},
];

export const validEncodeDoesNotMutateData: {
	expectedInput: unknown[];
	input: Parameters<typeof encodeParameters>;
	output: ReturnType<typeof encodeParameters>;
}[] = [
	{
		expectedInput: [
			['34', '255'],
			{
				propertyOne: ['78', '124'],
				propertyTwo: '56',
				ChildStruct: {
					propertyOne: ['16'],
					propertyTwo: '78',
				},
			},
		],

		input: [
			[
				'uint8[]',
				{
					ParentStruct: {
						propertyOne: 'uint8[]',
						propertyTwo: 'uint256',
						ChildStruct: {
							propertyOne: 'uint8[]',
							propertyTwo: 'uint256',
						},
					},
				},
			],
			[
				['34', '255'],
				{
					propertyOne: ['78', '124'],
					propertyTwo: '56',
					ChildStruct: {
						propertyOne: ['16'],
						propertyTwo: '78',
					},
				},
			],
		],
		output: '0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000ff0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000003800000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004e000000000000000000000000000000000000000000000000000000000000007c0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000004e00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000010',
	},
];

export const validEncodeParametersData: {
	input: Parameters<typeof encodeParameters>;
	output: ReturnType<typeof encodeParameters>;
}[] = [
	{
		input: [
			['uint256', 'string'],
			['2345675643', 'Hello!%'],
		],
		output: '0x000000000000000000000000000000000000000000000000000000008bd02b7b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000748656c6c6f212500000000000000000000000000000000000000000000000000',
	},
	{
		input: [
			['uint8[]', 'bytes32'],
			[['34', '255'], '0x324567fff'],
		],
		output: '0x0000000000000000000000000000000000000000000000000000000000000040324567fff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000ff',
	},
	{
		input: [
			[
				'uint8[]',
				{
					ParentStruct: {
						propertyOne: 'uint256',
						propertyTwo: 'uint256',
						ChildStruct: {
							propertyOne: 'uint256',
							propertyTwo: 'uint256',
						},
					},
				},
			],
			[
				['34', '255'],
				{
					propertyOne: '42',
					propertyTwo: '56',
					ChildStruct: {
						propertyOne: '45',
						propertyTwo: '78',
					},
				},
			],
		],
		output: '0x00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000002d000000000000000000000000000000000000000000000000000000000000004e0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000ff',
	},
	{
		input: [
			['uint', 'tuple(uint256, string)'],
			[1234, [5678, 'Hello World']],
		],
		output: '0x00000000000000000000000000000000000000000000000000000000000004d20000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000162e0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000b48656c6c6f20576f726c64000000000000000000000000000000000000000000',
	},
];

export const inValidEncodeParametersData: {
	input: any[];
	output: string;
}[] = [
	{
		input: [
			['uint8[]', 'bytes32'],
			[['34', '256'], '0x324567fff'],
		],
		output: 'Parameter encoding error',
	},
	{
		input: [345, ['2345675643', 'Hello!%']],
		output: 'Parameter encoding error',
	},
	{
		input: [true, ['2345675643', 'Hello!%']],
		output: 'Parameter encoding error',
	},
	{
		input: [undefined, ['2345675643', 'Hello!%']],
		output: 'Parameter encoding error',
	},
	{
		// Using "null" value intentionally for validation
		// eslint-disable-next-line no-null/no-null
		input: [null, ['2345675643', 'Hello!%']],
		output: 'Parameter encoding error',
	},
];

export const validDecodeParametersData: {
	input: Parameters<typeof decodeParameters>;
	outputResult: any;
}[] = [
	{
		input: [
			['uint256', 'string'],
			'0x000000000000000000000000000000000000000000000000000000008bd02b7b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000748656c6c6f212500000000000000000000000000000000000000000000000000',
		],
		outputResult: {
			'0': '2345675643',
			'1': 'Hello!%',
			__length__: 2,
		},
	},
	{
		input: [
			['uint8[]', 'bytes32'],
			'0x0000000000000000000000000000000000000000000000000000000000000040324567fff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000ff',
		],
		outputResult: {
			'0': ['34', '255'],
			'1': '0x324567fff0000000000000000000000000000000000000000000000000000000',
			__length__: 2,
		},
	},
	{
		input: [
			[
				'uint8[]',
				{
					ParentStruct: {
						propertyOne: 'uint256',
						propertyTwo: 'uint256',
						ChildStruct: {
							propertyOne: 'uint256',
							propertyTwo: 'uint256',
						},
					},
				},
			],
			'0x00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000002d000000000000000000000000000000000000000000000000000000000000004e0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000ff',
		],
		outputResult: {
			'0': ['34', '255'],
			'1': {
				'0': '42',
				'1': '56',
				'2': {
					'0': '45',
					'1': '78',
					propertyOne: '45',
					propertyTwo: '78',
					__length__: 2,
				},
				propertyOne: '42',
				propertyTwo: '56',
				ChildStruct: {
					'0': '45',
					'1': '78',
					propertyOne: '45',
					propertyTwo: '78',
					__length__: 2,
				},
				__length__: 3,
			},
			ParentStruct: {
				'0': '42',
				'1': '56',
				'2': {
					'0': '45',
					'1': '78',
					propertyOne: '45',
					propertyTwo: '78',
					__length__: 2,
				},
				propertyOne: '42',
				propertyTwo: '56',
				ChildStruct: {
					'0': '45',
					'1': '78',
					propertyOne: '45',
					propertyTwo: '78',
					__length__: 2,
				},
				__length__: 3,
			},
			__length__: 2,
		},
	},
	{
		input: [
			[
				{
					components: [
						{ internalType: 'string', name: 'name', type: 'string' },
						{ internalType: 'address', name: 'addr', type: 'address' },
						{
							components: [
								{ internalType: 'string', name: 'email', type: 'string' },
								{ internalType: 'string', name: 'phone', type: 'string' },
							],
							internalType: 'struct ABIV2UserDirectory.Contact',
							name: 'contact',
							type: 'tuple',
						},
					],
					indexed: false,
					internalType: 'struct ABIV2UserDirectory.User',
					name: 'user',
					type: 'tuple',
				},
			],
			'0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000060000000000000000000000000cb00cde33a7a0fba30c63745534f1f7ae607076b00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000c5269636b2053616e6368657a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000157269636b2e63313337406369746164656c2e636663000000000000000000000000000000000000000000000000000000000000000000000000000000000000112b31202835353529203331342d31353933000000000000000000000000000000',
		],
		outputResult: {
			'0': {
				'0': 'Rick Sanchez',
				'1': '0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b',
				'2': {
					'0': 'rick.c137@citadel.cfc',
					'1': '+1 (555) 314-1593',
					__length__: 2,
					email: 'rick.c137@citadel.cfc',
					phone: '+1 (555) 314-1593',
				},
				__length__: 3,
				addr: '0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b',
				contact: {
					'0': 'rick.c137@citadel.cfc',
					'1': '+1 (555) 314-1593',
					__length__: 2,
					email: 'rick.c137@citadel.cfc',
					phone: '+1 (555) 314-1593',
				},
				name: 'Rick Sanchez',
			},
			__length__: 1,
			user: {
				'0': 'Rick Sanchez',
				'1': '0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b',
				'2': {
					'0': 'rick.c137@citadel.cfc',
					'1': '+1 (555) 314-1593',
					__length__: 2,
					email: 'rick.c137@citadel.cfc',
					phone: '+1 (555) 314-1593',
				},
				__length__: 3,
				addr: '0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b',
				contact: {
					'0': 'rick.c137@citadel.cfc',
					'1': '+1 (555) 314-1593',
					__length__: 2,
					email: 'rick.c137@citadel.cfc',
					phone: '+1 (555) 314-1593',
				},
				name: 'Rick Sanchez',
			},
		},
	},
];

export const inValidDecodeParametersData: {
	input: any[];
	output: string;
}[] = [
	{
		input: [['uint8[]', 'bytes32'], '0x000000000010'],
		output: 'Parameter decoding error',
	},
	{
		input: [345, '0x000000000010'],
		output: 'Parameter decoding error',
	},
	{
		input: [true, '0x000000000010'],
		output: 'Parameter decoding error',
	},
	{
		input: [undefined, '0x000000000010'],
		output: 'Parameter decoding error',
	},
	{
		// Using "null" value intentionally for validation
		// eslint-disable-next-line no-null/no-null
		input: [null, '0x000000000010'],
		output: 'Parameter decoding error',
	},
];

export const validDecodeContractErrorData: {
	input: any[];
	output: any;
}[] = [
	{
		input: [
			[],
			{
				code: 12,
				message: 'message',
				data: '0x08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000155468697320697320612063616c6c207265766572740000000000000000000000',
			},
		],
		output: {
			errorName: 'Error',
			errorSignature: 'Error(string)',
			errorArgs: {
				message: 'This is a call revert',
			},
		},
	},
	{
		input: [
			[],
			{
				code: 12,
				message: 'message',
				data: '0x4e487b71000000000000000000000000000000000000000000000000000000000000002a00000000000000000000000000000000000000000000000000000000000000',
			},
		],
		output: {
			errorName: 'Panic',
			errorSignature: 'Panic(uint256)',
			errorArgs: {
				code: 42,
			},
		},
	},
	{
		input: [
			[
				{ inputs: [], name: 'ErrorWithNoParams', type: 'error' },
				{
					inputs: [
						{ name: 'code', type: 'uint256' },
						{ name: 'message', type: 'string' },
					],
					name: 'ErrorWithParams',
					type: 'error',
				},
			],
			{
				code: 12,
				message: 'message',
				data: '0xc85bda60000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001c5468697320697320616e206572726f72207769746820706172616d7300000000',
			},
		],
		output: {
			errorName: 'ErrorWithParams',
			errorSignature: 'ErrorWithParams(uint256,string)',
			errorArgs: {
				code: 42,
				message: 'This is an error with params',
			},
		},
	},
	{
		input: [
			[
				{ inputs: [], name: 'ErrorWithNoParams', type: 'error' },
				{
					inputs: [
						{ name: 'code', type: 'uint256' },
						{ name: 'message', type: 'string' },
					],
					name: 'ErrorWithParams',
					type: 'error',
				},
			],
			{
				code: 12,
				message: 'message',
				data: {
					code: -32000,
					data: '0xc85bda60000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001c5468697320697320616e206572726f72207769746820706172616d7300000000',
				},
			},
		],
		output: {
			errorName: 'ErrorWithParams',
			errorSignature: 'ErrorWithParams(uint256,string)',
			errorArgs: {
				code: 42,
				message: 'This is an error with params',
			},
			cause: {
				code: -32000,
			},
		},
	},
	{
		input: [
			[
				{ inputs: [], name: 'ErrorWithNoParams', type: 'error' },
				{
					inputs: [
						{ name: 'code', type: 'uint256' },
						{ name: 'message', type: 'string' },
					],
					name: 'ErrorWithParams',
					type: 'error',
				},
			],
			{
				code: 12,
				message: 'message',
				data: {
					originalError: {
						code: 3,
						data: '0xc85bda60000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001c5468697320697320616e206572726f72207769746820706172616d7300000000',
					},
				},
			},
		],
		output: {
			errorName: 'ErrorWithParams',
			errorSignature: 'ErrorWithParams(uint256,string)',
			errorArgs: {
				code: 42,
				message: 'This is an error with params',
			},
			cause: {
				code: 3,
			},
		},
	},
];

export const invalidDecodeContractErrorData: {
	input: any[];
}[] = [
	{
		input: [
			[
				{ inputs: [], name: 'ErrorWithNoParams', type: 'error' },
				{
					inputs: [
						{ name: 'code', type: 'uint256' },
						{ name: 'message', type: 'string' },
					],
					name: 'ErrorWithParams',
					type: 'error',
				},
			],
			{
				code: 12,
				message: 'message',
				data: '0xc85bda60000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000123450000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c5468697320697320616e206572726f72207769746820706172616d7300000000',
			},
		],
	},
];

export const validIsAbiConstructorFragment: {
	input: any;
}[] = [
	{
		input: { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
	},
];
export const invalidIsAbiConstructorFragment: {
	input: any;
}[] = [
	{
		input: { inputs: [], stateMutability: 'nonpayable', type: 'function' },
	},
];

export const mapTypesValidData: [any, any][] = [
	[
		['string', 'uint256'],
		['string', 'uint256'],
	],
	[
		[
			{ type: 'string', name: 'test' },
			{ type: 'uint256', name: 'test' },
		],
		[
			{ type: 'string', name: 'test' },
			{ type: 'uint256', name: 'test' },
		],
	],
	[
		[
			{ type: 'function', name: 'test' },
			{ type: 'uint256', name: 'test' },
		],
		[
			{ type: 'bytes24', name: 'test' },
			{ type: 'uint256', name: 'test' },
		],
	],
	[
		[{ name1: ['string'] }],
		[{ components: [{ name: '0', type: 'string' }], name: 'name1', type: 'tuple' }],
	],
];

export const formatParamValidData: [[string, any], any][] = [
	[['string', { name: 'test' }], { name: 'test' }],
	[['string', [{ name: 'test' }]], [{ name: 'test' }]],
	[['string', BigInt(1)], '1'],
	[['int', 123], 123],
	[['bytes', '0x99d42941'], '0x99d42941'],
	[
		['int', '0x1234567890123456789012345678901234567890'],
		'0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001234567890123456789012345678901234567890',
	],
	[
		['bytes256[]', ['0x99d42941']],
		[
			'0x99d42941000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
		],
	],
];
