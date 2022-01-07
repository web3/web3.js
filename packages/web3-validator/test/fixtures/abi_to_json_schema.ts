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
			items: [{ type: 'array', items: [{ $id: expect.any(String), eth: 'uint' }] }],
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
				},
			],
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
					},
					maxItems: undefined,
					minItems: undefined,
				},
			],
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
					},
					maxItems: 3,
					minItems: 3,
				},
			],
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
					},
					maxItems: undefined,
					minItems: undefined,
				},
			],
		},
	},
];
