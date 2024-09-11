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

import { FullValidationSchema, JsonSchema, ShortValidationSchema } from '../../src/types';

export type AbiToJsonSchemaCase = {
	title: string;
	abi: {
		fullSchema: FullValidationSchema;
		shortSchema: ShortValidationSchema;
		data: Array<unknown>;
	};
	json: {
		fullSchema: JsonSchema;
		shortSchema: JsonSchema;
		data: Record<string, unknown> | Array<unknown>;
	};
};
const abiToJsonSchemaCases: AbiToJsonSchemaCase[] = [
	{
		title: 'single param uint',
		abi: {
			fullSchema: [{ name: 'a', type: 'uint' }],
			shortSchema: ['uint'],
			data: [12],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [{ $id: 'a', format: 'uint', required: true }],
				minItems: 1,
				maxItems: 1,
			},
			shortSchema: {
				type: 'array',
				items: [{ $id: '/0/0', format: 'uint', required: true }],
				minItems: 1,
				maxItems: 1,
			},
			data: [12],
		},
	},
	{
		title: 'single param address',
		abi: {
			fullSchema: [{ name: 'a', type: 'address' }],
			shortSchema: ['address'],
			data: ['0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b'],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [{ $id: 'a', format: 'address', required: true }],
				minItems: 1,
				maxItems: 1,
			},
			shortSchema: {
				type: 'array',
				items: [{ $id: '/0/0', format: 'address', required: true }],
				minItems: 1,
				maxItems: 1,
			},
			data: ['0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b'],
		},
	},
	{
		title: 'single param bool',
		abi: {
			fullSchema: [{ name: 'a', type: 'bool' }],
			shortSchema: ['bool'],
			data: [true],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [{ $id: 'a', format: 'bool', required: true }],
				minItems: 1,
				maxItems: 1,
			},
			shortSchema: {
				type: 'array',
				items: [{ $id: '/0/0', format: 'bool', required: true }],
				minItems: 1,
				maxItems: 1,
			},
			data: [true],
		},
	},
	{
		title: 'single param bytes',
		abi: {
			fullSchema: [{ name: 'a', type: 'bytes' }],
			shortSchema: ['bytes'],
			data: ['0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b'],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [{ $id: 'a', format: 'bytes', required: true }],
				minItems: 1,
				maxItems: 1,
			},
			shortSchema: {
				type: 'array',
				items: [{ $id: '/0/0', format: 'bytes', required: true }],
				minItems: 1,
				maxItems: 1,
			},
			data: ['0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b'],
		},
	},

	{
		title: 'multiple params',
		abi: {
			fullSchema: [
				{ name: 'a', type: 'uint' },
				{ name: 'b', type: 'int' },
			],
			shortSchema: ['uint', 'int'],
			data: [12, -1],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [
					{ $id: 'a', format: 'uint', required: true },
					{ $id: 'b', format: 'int', required: true },
				],
				minItems: 2,
				maxItems: 2,
			},
			shortSchema: {
				type: 'array',
				items: [
					{ $id: '/0/0', format: 'uint', required: true },
					{ $id: '/0/1', format: 'int', required: true },
				],
				minItems: 2,
				maxItems: 2,
			},
			data: [12, -1],
		},
	},

	// this is for public mappings case where the abi has no name
	{
		title: 'multiple params of different types without name',
		abi: {
			fullSchema: [
				{ name: '', type: 'uint' },
				{ name: '', type: 'int' },
			],
			shortSchema: ['uint', 'int'],
			data: [12, -1],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [
					{ $id: '/0/0', format: 'uint', required: true },
					{ $id: '/0/1', format: 'int', required: true },
				],
				minItems: 2,
				maxItems: 2,
			},
			shortSchema: {
				type: 'array',
				items: [
					{ $id: '/0/0', format: 'uint', required: true },
					{ $id: '/0/1', format: 'int', required: true },
				],
				minItems: 2,
				maxItems: 2,
			},
			data: [12, -1],
		},
	},

	{
		title: 'single param array',
		abi: {
			fullSchema: [{ name: 'a', type: 'uint[]' }],
			shortSchema: ['uint[]'],
			data: [[12, 456]],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [
					{
						$id: 'a',
						type: 'array',
						items: { format: 'uint', required: true },
						maxItems: undefined,
						minItems: undefined,
					},
				],
				minItems: 1,
				maxItems: 1,
			},
			shortSchema: {
				type: 'array',
				items: [
					{
						$id: '/0/0',
						type: 'array',
						items: { format: 'uint', required: true },
					},
				],
				minItems: 1,
				maxItems: 1,
			},
			data: [[12, 456]],
		},
	},

	{
		title: 'single param fixed array',
		abi: {
			fullSchema: [{ name: 'a', type: 'uint[3]' }],
			shortSchema: ['uint[3]'],
			data: [[12, 456, 789]],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [
					{
						$id: 'a',
						type: 'array',
						items: { format: 'uint', required: true },
						maxItems: 3,
						minItems: 3,
					},
				],
				minItems: 1,
				maxItems: 1,
			},
			shortSchema: {
				type: 'array',
				items: [
					{
						$id: '/0/0',
						type: 'array',
						items: { format: 'uint', required: true },
						maxItems: 3,
						minItems: 3,
					},
				],
				minItems: 1,
				maxItems: 1,
			},
			data: [[12, 456, 789]],
		},
	},

	{
		title: 'multiple array params',
		abi: {
			fullSchema: [
				{ name: 'a', type: 'uint[3]' },
				{ name: 'b', type: 'int[]' },
				{ name: 'c', type: 'string[5]' },
			],
			shortSchema: ['uint[3]', 'int[]', 'string[5]'],
			data: [
				[12, 456, 789],
				[-1, -2, -3, -4, -5],
				['a', 'b', 'c', 'd', 'e'],
			],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [
					{
						$id: 'a',
						type: 'array',
						items: { format: 'uint', required: true },
						maxItems: 3,
						minItems: 3,
					},
					{
						$id: 'b',
						type: 'array',
						items: { format: 'int', required: true },
						maxItems: undefined,
						minItems: undefined,
					},
					{
						$id: 'c',
						type: 'array',
						items: { format: 'string', required: true },
						maxItems: 5,
						minItems: 5,
					},
				],
				minItems: 3,
				maxItems: 3,
			},
			shortSchema: {
				type: 'array',
				items: [
					{
						$id: '/0/0',
						type: 'array',
						items: { format: 'uint', required: true },
						maxItems: 3,
						minItems: 3,
					},
					{
						$id: '/0/1',
						type: 'array',
						items: { format: 'int', required: true },
						maxItems: undefined,
						minItems: undefined,
					},
					{
						$id: '/0/2',
						type: 'array',
						items: { format: 'string', required: true },
						maxItems: 5,
						minItems: 5,
					},
				],
				minItems: 3,
				maxItems: 3,
			},
			data: [
				[12, 456, 789],
				[-1, -2, -3, -4, -5],
				['a', 'b', 'c', 'd', 'e'],
			],
		},
	},

	{
		title: 'single tuple',
		abi: {
			fullSchema: [{ name: 'a', type: 'tuple', components: [{ name: 'b', type: 'uint' }] }],
			shortSchema: [['uint']],
			data: [[12]],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: 'a',
						items: [{ $id: 'b', format: 'uint', required: true }],
						minItems: 1,
						maxItems: 1,
					},
				],
				minItems: 1,
				maxItems: 1,
			},
			shortSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: '/0/0',
						items: [{ $id: '/0/0/0', format: 'uint', required: true }],
						minItems: 1,
						maxItems: 1,
					},
				],
				minItems: 1,
				maxItems: 1,
			},
			data: [{ b: 12 }],
		},
	},

	{
		title: 'multiple tuple elements',
		abi: {
			fullSchema: [
				{
					name: 'a',
					type: 'tuple',
					components: [
						{ name: 'b', type: 'uint' },
						{ name: 'c', type: 'string' },
					],
				},
			],
			shortSchema: [['uint', 'string']],
			data: [[12, 'a']],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: 'a',
						items: [
							{ $id: 'b', format: 'uint', required: true },
							{ $id: 'c', format: 'string', required: true },
						],
						minItems: 2,
						maxItems: 2,
					},
				],
				minItems: 1,
				maxItems: 1,
			},
			shortSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: '/0/0',
						items: [
							{ $id: '/0/0/0', format: 'uint', required: true },
							{ $id: '/0/0/1', format: 'string', required: true },
						],
						minItems: 2,
						maxItems: 2,
					},
				],
				minItems: 1,
				maxItems: 1,
			},
			data: [{ b: 12, c: 'a' }],
		},
	},

	{
		title: 'tuple array',
		abi: {
			fullSchema: [
				{
					name: 'a',
					type: 'tuple[]',
					components: [
						{ name: 'a1', type: 'uint' },
						{ name: 'a2', type: 'string' },
					],
				},
			],
			shortSchema: [['tuple[]', ['uint', 'string']]],
			data: [
				[
					[12, 'a'],
					[456, 'b'],
				],
			],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [
					{
						$id: 'a',
						type: 'array',
						items: {
							type: 'array',
							items: [
								{ $id: 'a1', format: 'uint', required: true },
								{ $id: 'a2', format: 'string', required: true },
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
			shortSchema: {
				type: 'array',
				items: [
					{
						$id: '/0/0',
						type: 'array',
						items: {
							type: 'array',
							items: [
								{ $id: '/0/0/0', format: 'uint', required: true },
								{ $id: '/0/0/1', format: 'string', required: true },
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
			data: [
				[
					{ a1: 12, a2: 'a' },
					{ a1: 456, a2: 'b' },
				],
			],
		},
	},

	{
		title: 'fixed tuple array',
		abi: {
			fullSchema: [
				{
					name: 'a',
					type: 'tuple[3]',
					components: [
						{ name: 'a1', type: 'uint' },
						{ name: 'a2', type: 'string' },
					],
				},
			],
			shortSchema: [['tuple[3]', ['uint', 'string']]],
			data: [
				[
					[12, 'a'],
					[456, 'b'],
					[789, 'c'],
				],
			],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [
					{
						$id: 'a',
						type: 'array',
						items: {
							type: 'array',
							items: [
								{ $id: 'a1', format: 'uint', required: true },
								{ $id: 'a2', format: 'string', required: true },
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
			shortSchema: {
				type: 'array',
				items: [
					{
						$id: '/0/0',
						type: 'array',
						items: {
							type: 'array',
							items: [
								{ $id: '/0/0/0', format: 'uint', required: true },
								{ $id: '/0/0/1', format: 'string', required: true },
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
			data: [
				[
					{ a1: 12, a2: 'a' },
					{ a1: 456, a2: 'b' },
					{ a1: 789, a2: 'c' },
				],
			],
		},
	},

	{
		title: 'multiple tuple arrays',
		abi: {
			fullSchema: [
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
			shortSchema: [
				['tuple[3]', ['uint', 'string']],
				['tuple[]', ['uint', 'string']],
			],
			data: [
				[
					[12, 'a1'],
					[456, 'a2'],
					[789, 'a3'],
				],
				[
					[12, 'b1'],
					[456, 'b2'],
					[789, 'b3'],
					[489, 'b4'],
				],
			],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: 'a',
						items: {
							type: 'array',
							items: [
								{ $id: 'a1', format: 'uint', required: true },
								{ $id: 'a2', format: 'string', required: true },
							],
							maxItems: 2,
							minItems: 2,
						},
						maxItems: 3,
						minItems: 3,
					},

					{
						type: 'array',
						$id: 'b',
						items: {
							type: 'array',
							items: [
								{ $id: 'b1', format: 'uint', required: true },
								{ $id: 'b2', format: 'string', required: true },
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
			shortSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: '/0/0',
						items: {
							type: 'array',
							items: [
								{ $id: '/0/0/0', format: 'uint', required: true },
								{ $id: '/0/0/1', format: 'string', required: true },
							],
							maxItems: 2,
							minItems: 2,
						},
						maxItems: 3,
						minItems: 3,
					},
					{
						type: 'array',
						$id: '/0/1',
						items: {
							type: 'array',
							items: [
								{ $id: '/0/1/0', format: 'uint', required: true },
								{ $id: '/0/1/1', format: 'string', required: true },
							],
							maxItems: 2,
							minItems: 2,
						},
					},
				],
				maxItems: 2,
				minItems: 2,
			},
			data: [
				[
					{ a1: 12, a2: 'a1' },
					{ a1: 456, a2: 'a2' },
					{ a1: 789, a2: 'a3' },
				],
				[
					{ b1: 12, b2: 'b1' },
					{ b1: 456, b2: 'b2' },
					{ b1: 789, b2: 'b3' },
					{ b1: 489, b2: 'b4' },
				],
			],
		},
	},

	{
		title: 'nested array example 1',
		abi: {
			fullSchema: [
				{
					name: 'a',
					type: 'uint[2][3]',
				},
			],
			shortSchema: ['uint[2][3]'],
			data: [
				[
					[1, 1],
					[2, 2],
					[3, 3],
				],
			],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: 'a',
						items: [
							{
								type: 'array',
								$id: 'a',
								items: {
									format: 'uint',
									required: true,
								},
								minItems: 2,
								maxItems: 2,
							},
						],
						maxItems: 3,
						minItems: 3,
					},
				],
				maxItems: 1,
				minItems: 1,
			},
			shortSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: '/0/0',
						items: [
							{
								type: 'array',
								$id: '/0/0',
								items: {
									format: 'uint',
									required: true,
								},
								minItems: 2,
								maxItems: 2,
							},
						],
						maxItems: 3,
						minItems: 3,
					},
				],
				maxItems: 1,
				minItems: 1,
			},
			data: [
				[
					[1, 1],
					[2, 2],
					[3, 3],
				],
			],
		},
	},

	{
		title: 'nested array example 2',
		abi: {
			fullSchema: [
				{
					name: 'a',
					type: 'uint[][3]',
				},
			],
			shortSchema: ['uint[][3]'],
			data: [
				[
					[1, 1],
					[1, 2, 3],
					[1, 2, 3, 4, 5, 6],
				],
			],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: 'a',
						items: [
							{
								type: 'array',
								$id: 'a',
								items: {
									format: 'uint',
									required: true,
								},
							},
						],
						maxItems: 3,
						minItems: 3,
					},
				],
				maxItems: 1,
				minItems: 1,
			},
			shortSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: '/0/0',
						items: [
							{
								type: 'array',
								$id: '/0/0',
								items: {
									format: 'uint',
									required: true,
								},
							},
						],
						maxItems: 3,
						minItems: 3,
					},
				],
				maxItems: 1,
				minItems: 1,
			},
			data: [
				[
					[1, 1],
					[1, 2, 3],
					[1, 2, 3, 4, 5, 6],
				],
			],
		},
	},

	{
		title: 'nested tuple example 1',
		abi: {
			fullSchema: [
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
			shortSchema: [['tuple[][3]', ['uint', 'string']]],
			data: [
				[
					[
						[1, '1'],
						[2, '2'],
						[3, '3'],
					],
					[
						[1, '1'],
						[2, '2'],
						[3, '3'],
						[4, '4'],
						[5, '5'],
						[6, '6'],
					],
					[
						[1, '1'],
						[2, '2'],
					],
				],
			],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: 'a',
						items: [
							{
								type: 'array',
								$id: 'a',
								items: {
									type: 'array',
									items: [
										{
											$id: 'level',
											format: 'uint',
											required: true,
										},
										{
											$id: 'message',
											format: 'string',
											required: true,
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
				],
				maxItems: 1,
				minItems: 1,
			},
			shortSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: '/0/0',
						items: [
							{
								type: 'array',
								$id: '/0/0',
								items: {
									type: 'array',
									items: [
										{
											$id: '/0/0/0',
											format: 'uint',
											required: true,
										},
										{
											$id: '/0/0/1',
											format: 'string',
											required: true,
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
				],
				maxItems: 1,
				minItems: 1,
			},
			data: [
				[
					[
						{ level: 1, message: '1' },
						{ level: 2, message: '2' },
						{ level: 3, message: '3' },
					],
					[
						{ level: 1, message: '1' },
						{ level: 2, message: '2' },
						{ level: 3, message: '3' },
						{ level: 4, message: '4' },
						{ level: 5, message: '5' },
						{ level: 6, message: '6' },
					],
					[
						{ level: 1, message: '1' },
						{ level: 2, message: '2' },
					],
				],
			],
		},
	},

	{
		title: 'nested tuple example 2',
		abi: {
			fullSchema: [
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
			shortSchema: [['tuple[3][5]', ['uint', 'string']]],
			data: [
				[
					[
						[1, 'a'],
						[2, 'b'],
						[3, 'c'],
					],
					[
						[1, 'a'],
						[2, 'b'],
						[3, 'c'],
					],
					[
						[1, 'a'],
						[2, 'b'],
						[3, 'c'],
					],
					[
						[1, 'a'],
						[2, 'b'],
						[3, 'c'],
					],
					[
						[1, 'a'],
						[2, 'b'],
						[3, 'c'],
					],
				],
			],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: 'a',
						items: [
							{
								type: 'array',
								$id: 'a',
								items: {
									type: 'array',
									items: [
										{
											$id: 'level',
											format: 'uint',
											required: true,
										},
										{
											$id: 'message',
											format: 'string',
											required: true,
										},
									],
									maxItems: 2,
									minItems: 2,
								},
								minItems: 3,
								maxItems: 3,
							},
						],
						maxItems: 5,
						minItems: 5,
					},
				],
				maxItems: 1,
				minItems: 1,
			},
			shortSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: '/0/0',
						items: [
							{
								type: 'array',
								$id: '/0/0',
								items: {
									type: 'array',
									items: [
										{
											$id: '/0/0/0',
											format: 'uint',
											required: true,
										},
										{
											$id: '/0/0/1',
											format: 'string',
											required: true,
										},
									],
									maxItems: 2,
									minItems: 2,
								},
								minItems: 3,
								maxItems: 3,
							},
						],
						maxItems: 5,
						minItems: 5,
					},
				],
				maxItems: 1,
				minItems: 1,
			},
			data: [
				[
					[
						{ level: 1, message: 'a' },
						{ level: 2, message: 'b' },
						{ level: 3, message: 'c' },
					],
					[
						{ level: 1, message: 'a' },
						{ level: 2, message: 'b' },
						{ level: 3, message: 'c' },
					],
					[
						{ level: 1, message: 'a' },
						{ level: 2, message: 'b' },
						{ level: 3, message: 'c' },
					],
					[
						{ level: 1, message: 'a' },
						{ level: 2, message: 'b' },
						{ level: 3, message: 'c' },
					],
					[
						{ level: 1, message: 'a' },
						{ level: 2, message: 'b' },
						{ level: 3, message: 'c' },
					],
				],
			],
		},
	},

	{
		title: 'a user object example from truffle',
		abi: {
			fullSchema: [
				{
					components: [
						{ name: 'name', type: 'string' },
						{ name: 'addr', type: 'address' },
						{
							components: [
								{ name: 'email', type: 'string' },
								{ name: 'phone', type: 'string' },
							],
							name: 'contact',
							type: 'tuple',
						},
					],
					name: 'user',
					type: 'tuple',
				},
			],
			shortSchema: [['tuple', ['string', 'address', ['tuple', ['string', 'string']]]]],
			data: [
				[
					'Rick Sanchez',
					'0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b',
					['rick.c137@citadel.cfc', '+1 (555) 314-1593'],
				],
			],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: 'user',
						items: [
							{ $id: 'name', format: 'string', required: true },
							{ $id: 'addr', format: 'address', required: true },
							{
								type: 'array',
								$id: 'contact',
								items: [
									{ $id: 'email', format: 'string', required: true },
									{ $id: 'phone', format: 'string', required: true },
								],
								maxItems: 2,
								minItems: 2,
							},
						],
						maxItems: 3,
						minItems: 3,
					},
				],
				maxItems: 1,
				minItems: 1,
			},
			shortSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: '/0/0',
						items: [
							{ $id: '/0/0/0', format: 'string', required: true },
							{ $id: '/0/0/1', format: 'address', required: true },
							{
								type: 'array',
								$id: '/0/0/2',
								items: [
									{ $id: '/0/0/2/0', format: 'string', required: true },
									{ $id: '/0/0/2/1', format: 'string', required: true },
								],
								maxItems: 2,
								minItems: 2,
							},
						],
						maxItems: 3,
						minItems: 3,
					},
				],
				maxItems: 1,
				minItems: 1,
			},
			data: [
				{
					name: 'Rick Sanchez',
					addr: '0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b',
					contact: {
						email: 'rick.c137@citadel.cfc',
						phone: '+1 (555) 314-1593',
					},
				},
			],
		},
	},

	{
		title: 'a user object example from truffle',
		abi: {
			fullSchema: [
				{
					components: [
						{ name: 'name', type: 'string' },
						{ name: 'addr', type: 'address' },
						{
							components: [
								{ name: 'email', type: 'string' },
								{ name: 'phone', type: 'string' },
							],
							name: 'contact',
							type: 'tuple',
						},
					],
					name: 'user',
					type: 'tuple',
				},
			],
			shortSchema: [['tuple', ['string', 'address', ['tuple', ['string', 'string']]]]],
			data: [
				[
					'Rick Sanchez',
					'0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b',
					['rick.c137@citadel.cfc', '+1 (555) 314-1593'],
				],
			],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: 'user',
						items: [
							{ $id: 'name', format: 'string', required: true },
							{ $id: 'addr', format: 'address', required: true },
							{
								type: 'array',
								$id: 'contact',
								items: [
									{ $id: 'email', format: 'string', required: true },
									{ $id: 'phone', format: 'string', required: true },
								],
								maxItems: 2,
								minItems: 2,
							},
						],
						maxItems: 3,
						minItems: 3,
					},
				],
				maxItems: 1,
				minItems: 1,
			},
			shortSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: '/0/0',
						items: [
							{ $id: '/0/0/0', format: 'string', required: true },
							{ $id: '/0/0/1', format: 'address', required: true },
							{
								type: 'array',
								$id: '/0/0/2',
								items: [
									{ $id: '/0/0/2/0', format: 'string', required: true },
									{ $id: '/0/0/2/1', format: 'string', required: true },
								],
								maxItems: 2,
								minItems: 2,
							},
						],
						maxItems: 3,
						minItems: 3,
					},
				],
				maxItems: 1,
				minItems: 1,
			},
			data: [
				{
					name: 'Rick Sanchez',
					addr: '0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b',
					contact: {
						email: 'rick.c137@citadel.cfc',
						phone: '+1 (555) 314-1593',
					},
				},
			],
		},
	},

	{
		title: 'nested tuple object in nested array',
		abi: {
			fullSchema: [
				{
					components: [
						{
							components: [
								{
									name: 'x',
									type: 'int256',
								},
								{
									name: 'y',
									type: 'int256',
								},
							],
							name: 'start',
							type: 'tuple',
						},
						{
							components: [
								{
									name: 'x',
									type: 'int256',
								},
								{
									name: 'y',
									type: 'int256',
								},
							],
							name: 'end',
							type: 'tuple',
						},
					],
					name: 'rects',
					type: 'tuple[][3]',
				},
				{
					name: 'numberValue',
					type: 'uint256',
				},
				{
					name: 'boolValue',
					type: 'bool',
				},
			],
			shortSchema: [
				[
					'tuple[][3]',
					[
						['int256', 'int256'],
						['int256', 'int256'],
					],
				],
				'uint256',
				'bool',
			],
			data: [
				[
					[
						[
							[0, 0],
							[1, 1],
						],
						[
							[2, 2],
							[3, 3],
						],
					],
					[
						[
							[0, 0],
							[-1, -1],
						],
						[
							[-2, -2],
							[-3, -3],
						],
						[
							[-4, -4],
							[-5, -5],
						],
					],
					[
						[
							[4, 4],
							[5, 5],
						],
					],
				],
				123,
				true,
			],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: 'rects',
						items: [
							{
								type: 'array',
								$id: 'rects',
								items: {
									type: 'array',
									items: [
										{
											type: 'array',
											items: [
												{
													$id: 'x',
													format: 'int256',
													required: true,
												},
												{
													$id: 'y',
													format: 'int256',
													required: true,
												},
											],
											maxItems: 2,
											minItems: 2,
											$id: 'start',
										},
										{
											type: 'array',
											items: [
												{
													$id: 'x',
													format: 'int256',
													required: true,
												},
												{
													$id: 'y',
													format: 'int256',
													required: true,
												},
											],
											maxItems: 2,
											minItems: 2,
											$id: 'end',
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
					{
						$id: 'numberValue',
						format: 'uint256',
						required: true,
					},
					{
						$id: 'boolValue',
						format: 'bool',
						required: true,
					},
				],
				maxItems: 3,
				minItems: 3,
			},
			shortSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: '/0/0',
						items: [
							{
								type: 'array',
								$id: '/0/0',
								items: {
									type: 'array',
									items: [
										{
											type: 'array',
											items: [
												{
													$id: '/0/0/0/0',
													format: 'int256',
													required: true,
												},
												{
													$id: '/0/0/0/1',
													format: 'int256',
													required: true,
												},
											],
											maxItems: 2,
											minItems: 2,
											$id: '/0/0/0',
										},
										{
											type: 'array',
											items: [
												{
													$id: '/0/0/1/0',
													format: 'int256',
													required: true,
												},
												{
													$id: '/0/0/1/1',
													format: 'int256',
													required: true,
												},
											],
											maxItems: 2,
											minItems: 2,
											$id: '/0/0/1',
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
					{
						$id: '/0/1',
						format: 'uint256',
						required: true,
					},
					{
						$id: '/0/2',
						format: 'bool',
						required: true,
					},
				],
				maxItems: 3,
				minItems: 3,
			},
			data: [
				[
					[
						[
							{ x: 0, y: 0 },
							{ x: 1, y: 1 },
						],
						[
							{ x: 2, y: 2 },
							{ x: 3, y: 3 },
						],
					],
					[
						[
							{ x: 0, y: 0 },
							{ x: -1, y: -1 },
						],
						[
							{ x: -2, y: -2 },
							{ x: -3, y: -3 },
						],
						[
							{ x: -4, y: -4 },
							{ x: -5, y: -5 },
						],
					],
					[
						[
							{ x: 4, y: 4 },
							{ x: 5, y: 5 },
						],
					],
				],
				123,
				true,
			],
		},
	},
	{
		title: 'multi-dimensional array',
		abi: {
			fullSchema: [
				{
					name: 'x1',
					type: 'uint256[][]',
				},
				{
					name: 'x2',
					type: 'uint256[][]',
				},
				{
					name: 'x3',
					type: 'uint256',
				},
			],
			shortSchema: ['uint256[][]', 'uint256[][]', 'uint256'],
			data: [
				[
					[1, 1],
					[2, 2],
				],
				[
					[1, 1, 1],
					[2, 2, 2],
					[3, 3, 3],
				],
				42,
			],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [
					{
						type: 'array',
						$id: 'x1',
						items: [
							{
								type: 'array',
								$id: 'x1',
								items: {
									format: 'uint256',
									required: true,
								},
							},
						],
					},
					{
						type: 'array',
						$id: 'x2',
						items: [
							{
								type: 'array',
								$id: 'x2',
								items: {
									format: 'uint256',
									required: true,
								},
							},
						],
					},
					{
						$id: 'x3',
						format: 'uint256',
						required: true,
					},
				],
				maxItems: 3,
				minItems: 3,
			},
			shortSchema: {
				type: 'array',
				items: [
					{
						$id: '/0/0',
						type: 'array',
						items: [
							{
								type: 'array',
								$id: '/0/0',
								items: {
									format: 'uint256',
									required: true,
								},
							},
						],
					},
					{
						$id: '/0/1',
						type: 'array',
						items: [
							{
								type: 'array',
								$id: '/0/1',
								items: {
									format: 'uint256',
									required: true,
								},
							},
						],
					},
					{
						$id: '/0/2',
						format: 'uint256',
						required: true,
					},
				],
				maxItems: 3,
				minItems: 3,
			},
			data: {
				x1: [
					[1, 1],
					[2, 2],
				],
				x2: [
					[1, 1, 1],
					[2, 2, 2],
					[3, 3, 3],
				],
				x3: 42,
			},
		},
	},
];

function generateSingleParamNumericCase(type: string, bitSize: number) {
	return {
		title: `single param ${type}${bitSize}`,
		abi: {
			fullSchema: [{ name: 'a', type: `${type}${bitSize}` }],
			shortSchema: [`${type}${bitSize}`],
			data: [12],
		},
		json: {
			fullSchema: {
				type: 'array',
				items: [{ $id: 'a', format: `${type}${bitSize}`, required: true }],
				minItems: 1,
				maxItems: 1,
			},
			shortSchema: {
				type: 'array',
				items: [{ $id: '/0/0', format: `${type}${bitSize}`, required: true }],
				minItems: 1,
				maxItems: 1,
			},
			data: [12],
		},
	};
}

for (let i = 256; i >= 8; i -= 8) {
	abiToJsonSchemaCases.unshift(generateSingleParamNumericCase('int', i));
	abiToJsonSchemaCases.unshift(generateSingleParamNumericCase('uint', i));
}

export { abiToJsonSchemaCases };
