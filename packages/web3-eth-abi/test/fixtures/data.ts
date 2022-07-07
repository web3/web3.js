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
				},
				propertyOne: '42',
				propertyTwo: '56',
				ChildStruct: {
					'0': '45',
					'1': '78',
					propertyOne: '45',
					propertyTwo: '78',
				},
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
	output: unknown[];
	outputResult: any;
}[] = [
	{
		input: [
			['uint256', 'string'],
			'0x000000000000000000000000000000000000000000000000000000008bd02b7b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000748656c6c6f212500000000000000000000000000000000000000000000000000',
		],
		output: ['2345675643', 'Hello!%'],
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
		output: [
			['34', '255'],
			'0x324567fff0000000000000000000000000000000000000000000000000000000',
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
		output: [
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
				},
				propertyOne: '42',
				propertyTwo: '56',
				ChildStruct: {
					'0': '45',
					'1': '78',
					propertyOne: '45',
					propertyTwo: '78',
				},
			},
			__length__: 2,
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
