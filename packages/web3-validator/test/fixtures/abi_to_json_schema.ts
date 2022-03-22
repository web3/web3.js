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

import { FullValidationSchema, ShortValidationSchema } from '../../src/types';

export const abiToJsonSchemaCases: {
	title: string;
	input: {
		full: FullValidationSchema;
		short: ShortValidationSchema;
	};
	output: object;
}[] = [
	{
		title: 'single param',
		input: {
			full: [{ name: 'a', type: 'uint' }],
			short: ['uint'],
		},
		output: {
			type: 'array',
			items: [{ $id: expect.any(String), eth: 'uint' }],
			minItems: 1,
			maxItems: 1,
		},
	},

	{
		title: 'multiple params',
		input: {
			full: [
				{ name: 'a', type: 'uint' },
				{ name: 'b', type: 'int' },
			],
			short: ['uint', 'int'],
		},
		output: {
			type: 'array',
			items: [
				{ $id: expect.any(String), eth: 'uint' },
				{ $id: expect.any(String), eth: 'int' },
			],
			minItems: 2,
			maxItems: 2,
		},
	},

	{
		title: 'single param array',
		input: { full: [{ name: 'a', type: 'uint[]' }], short: ['uint[]'] },
		output: {
			type: 'array',
			items: [
				{
					$id: expect.any(String),
					type: 'array',
					items: { eth: 'uint' },
					maxItems: undefined,
					minItems: undefined,
				},
			],
			minItems: 1,
			maxItems: 1,
		},
	},

	{
		title: 'single param fixed array',
		input: {
			full: [{ name: 'a', type: 'uint[3]' }],
			short: ['uint[3]'],
		},
		output: {
			type: 'array',
			items: [
				{
					$id: expect.any(String),
					type: 'array',
					items: { eth: 'uint' },
					maxItems: 3,
					minItems: 3,
				},
			],
			minItems: 1,
			maxItems: 1,
		},
	},

	{
		title: 'multiple array params',
		input: {
			full: [
				{ name: 'a', type: 'uint[3]' },
				{ name: 'b', type: 'int[]' },
				{ name: 'c', type: 'string[5]' },
			],
			short: ['uint[3]', 'int[]', 'string[5]'],
		},
		output: {
			type: 'array',
			items: [
				{
					$id: expect.any(String),
					type: 'array',
					items: { eth: 'uint' },
					maxItems: 3,
					minItems: 3,
				},
				{
					$id: expect.any(String),
					type: 'array',
					items: { eth: 'int' },
					maxItems: undefined,
					minItems: undefined,
				},
				{
					$id: expect.any(String),
					type: 'array',
					items: { eth: 'string' },
					maxItems: 5,
					minItems: 5,
				},
			],
			minItems: 3,
			maxItems: 3,
		},
	},

	{
		title: 'single tuple',
		input: {
			full: [{ name: 'a', type: 'tuple', components: [{ name: 'b', type: 'uint' }] }],
			short: [['uint']],
		},
		output: {
			type: 'array',
			items: [
				{
					type: 'array',
					items: [{ $id: expect.any(String), eth: 'uint' }],
					minItems: 1,
					maxItems: 1,
				},
			],
			minItems: 1,
			maxItems: 1,
		},
	},

	{
		title: 'multiple tuple elements',
		input: {
			full: [
				{
					name: 'a',
					type: 'tuple',
					components: [
						{ name: 'b', type: 'uint' },
						{ name: 'c', type: 'string' },
					],
				},
			],
			short: [['uint', 'string']],
		},
		output: {
			type: 'array',
			items: [
				{
					type: 'array',
					items: [
						{ $id: expect.any(String), eth: 'uint' },
						{ $id: expect.any(String), eth: 'string' },
					],
					minItems: 2,
					maxItems: 2,
				},
			],
			minItems: 1,
			maxItems: 1,
		},
	},

	{
		title: 'tuple array',
		input: {
			full: [
				{
					name: 'a',
					type: 'tuple[]',
					components: [
						{ name: 'a1', type: 'uint' },
						{ name: 'a2', type: 'string' },
					],
				},
			],
			short: [['tuple[]', ['uint', 'string']]],
		},
		output: {
			type: 'array',
			items: [
				{
					$id: expect.any(String),
					type: 'array',
					items: {
						type: 'array',
						items: [
							{ $id: expect.any(String), eth: 'uint' },
							{ $id: expect.any(String), eth: 'string' },
						],
						maxItems: 2,
						minItems: 2,
					},
					maxItems: undefined,
					minItems: undefined,
				},
			],
			minItems: 1,
			maxItems: 1,
		},
	},

	{
		title: 'fixed tuple array',
		input: {
			full: [
				{
					name: 'a',
					type: 'tuple[3]',
					components: [
						{ name: 'a1', type: 'uint' },
						{ name: 'a2', type: 'string' },
					],
				},
			],
			short: [['tuple[3]', ['uint', 'string']]],
		},
		output: {
			type: 'array',
			items: [
				{
					$id: expect.any(String),
					type: 'array',
					items: {
						type: 'array',
						items: [
							{ $id: expect.any(String), eth: 'uint' },
							{ $id: expect.any(String), eth: 'string' },
						],
						maxItems: 2,
						minItems: 2,
					},
					maxItems: 3,
					minItems: 3,
				},
			],
			maxItems: 1,
			minItems: 1,
		},
	},

	{
		title: 'multiple tuple arrays',
		input: {
			full: [
				{
					name: 'a',
					type: 'tuple[3]',
					components: [
						{ name: 'a1', type: 'uint' },
						{ name: 'a2', type: 'string' },
					],
				},

				{
					name: 'b',
					type: 'tuple[]',
					components: [
						{ name: 'b1', type: 'uint' },
						{ name: 'b2', type: 'string' },
					],
				},
			],
			short: [
				['tuple[3]', ['uint', 'string']],
				['tuple[]', ['uint', 'string']],
			],
		},
		output: {
			type: 'array',
			items: [
				{
					type: 'array',
					$id: expect.any(String),
					items: {
						type: 'array',
						items: [
							{ $id: expect.any(String), eth: 'uint' },
							{ $id: expect.any(String), eth: 'string' },
						],
						maxItems: 2,
						minItems: 2,
					},
					maxItems: 3,
					minItems: 3,
				},

				{
					type: 'array',
					$id: expect.any(String),
					items: {
						type: 'array',
						items: [
							{ $id: expect.any(String), eth: 'uint' },
							{ $id: expect.any(String), eth: 'string' },
						],
						maxItems: 2,
						minItems: 2,
					},
					maxItems: undefined,
					minItems: undefined,
				},
			],
			maxItems: 2,
			minItems: 2,
		},
	},

	{
		title: 'nested array example 1',
		input: {
			full: [
				{
					name: 'a',
					type: 'uint[2][3]',
				},
			],
			short: ['uint[2][3]'],
		},
		output: {
			type: 'array',
			items: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: expect.any(String),
						items: {
							eth: 'uint',
						},
						minItems: 2,
						maxItems: 2,
					},
				],
				maxItems: 3,
				minItems: 3,
			},
			maxItems: 1,
			minItems: 1,
		},
	},

	{
		title: 'nested array example 2',
		input: {
			full: [
				{
					name: 'a',
					type: 'uint[][3]',
				},
			],
			short: ['uint[][3]'],
		},
		output: {
			type: 'array',
			items: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: expect.any(String),
						items: {
							eth: 'uint',
						},
					},
				],
				maxItems: 3,
				minItems: 3,
			},
			maxItems: 1,
			minItems: 1,
		},
	},

	{
		title: 'nested tuple example 1',
		input: {
			full: [
				{
					name: 'a',
					type: 'tuple[][3]',
					components: [
						{
							name: 'level',
							type: 'uint',
						},
						{
							name: 'message',
							type: 'string',
						},
					],
				},
			],
			short: [['tuple[][3]', ['uint', 'string']]],
		},
		output: {
			type: 'array',
			items: {
				type: 'array',
				items: [
					{
						$id: expect.any(String),
						type: 'array',
						items: {
							type: 'array',
							items: [
								{
									$id: expect.any(String),
									eth: 'uint',
								},
								{
									$id: expect.any(String),
									eth: 'string',
								},
							],
							maxItems: 2,
							minItems: 2,
						},
					},
				],
				maxItems: 3,
				minItems: 3,
			},
			maxItems: 1,
			minItems: 1,
		},
	},

	{
		title: 'nested tuple example 2',
		input: {
			full: [
				{
					name: 'a',
					type: 'tuple[3][5]',
					components: [
						{
							name: 'level',
							type: 'uint',
						},
						{
							name: 'message',
							type: 'string',
						},
					],
				},
			],
			short: [['tuple[3][5]', ['uint', 'string']]],
		},
		output: {
			type: 'array',
			items: {
				type: 'array',
				items: [
					{
						$id: expect.any(String),
						type: 'array',
						items: {
							type: 'array',
							items: [
								{
									$id: expect.any(String),
									eth: 'uint',
								},
								{
									$id: expect.any(String),
									eth: 'string',
								},
							],
							maxItems: 2,
							minItems: 2,
						},
						maxItems: 3,
						minItems: 3,
					},
				],
				maxItems: 5,
				minItems: 5,
			},
			maxItems: 1,
			minItems: 1,
		},
	},
];
