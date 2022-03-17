import { expectTypeOf, typecheck } from '@humeris/espresso-shot';
import { FMT_BYTES, FMT_NUMBER, format, FormatType } from '../../src/formatter';

describe('formatter', () => {
	describe('types', () => {
		typecheck('should format correct types for simple object', () => {
			type T = FormatType<
				{
					handleRevert: boolean;
					timeout: number;
					data: Buffer;
				},
				{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.UINT8ARRAY }
			>;

			return expectTypeOf<T>().toBe<{
				handleRevert: boolean;
				timeout: bigint;
				data: Uint8Array;
			}>();
		});

		typecheck('should format correct types for array', () => {
			type T = FormatType<
				{
					handleRevert: boolean;
					timeout: number[];
					data: Buffer[];
				},
				{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.UINT8ARRAY }
			>;

			return expectTypeOf<T>().toBe<{
				handleRevert: boolean;
				timeout: bigint[];
				data: Uint8Array[];
			}>();
		});

		typecheck('should format correct types for nested object', () => {
			type T = FormatType<
				{
					nested: {
						handleRevert: boolean;
						timeout: number[];
						data: Buffer[];
					};
				},
				{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.UINT8ARRAY }
			>;

			return expectTypeOf<T>().toBe<{
				nested: { handleRevert: boolean; timeout: bigint[]; data: Uint8Array[] };
			}>();
		});

		typecheck('should format correct types for tuple', () => {
			type T = FormatType<
				{
					tuple: [Buffer, number];
				},
				{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.UINT8ARRAY }
			>;

			return expectTypeOf<T>().toBe<{
				tuple: [Uint8Array, bigint];
			}>();
		});

		typecheck('should format correct scalar type', () => {
			type T = FormatType<Buffer, { number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.UINT8ARRAY }>;

			return expectTypeOf<T>().toBe<Uint8Array>();
		});

		typecheck('should not format non=convertible scalar type', () => {
			type T = FormatType<
				boolean,
				{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.UINT8ARRAY }
			>;

			return expectTypeOf<T>().toBe<boolean>();
		});

		typecheck('should format correct array types', () => {
			type T = FormatType<
				Buffer[],
				{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.UINT8ARRAY }
			>;

			return expectTypeOf<T>().toBe<Uint8Array[]>();
		});

		typecheck('should format correct tuple type', () => {
			type T = FormatType<
				[Buffer, number],
				{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.UINT8ARRAY }
			>;

			return expectTypeOf<T>().toBe<[Uint8Array, bigint]>();
		});
	});

	describe('format', () => {
		it('should format simple object', () => {
			const schema = {
				type: 'object',
				properties: {
					handleRevert: {
						eth: 'bool',
					},
					timeout: {
						eth: 'uint',
					},
					data: {
						eth: 'bytes',
					},
				},
			};

			const data = {
				handleRevert: true,
				timeout: 10,
				data: Buffer.from('FE', 'hex'),
			};

			const expected = {
				handleRevert: true,
				timeout: '0xa',
				data: '0xfe',
			};

			const result = format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX });

			expect(result).toEqual(expected);
		});

		it('should format nested objects', () => {
			const schema = {
				type: 'object',
				properties: {
					nested: {
						type: 'object',
						properties: {
							handleRevert: {
								eth: 'bool',
							},
							timeout: {
								eth: 'uint',
							},
							data: {
								eth: 'bytes',
							},
						},
					},
				},
			};

			const data = {
				nested: {
					handleRevert: true,
					timeout: 10,
					data: Buffer.from('FE', 'hex'),
				},
			};

			const expected = {
				nested: {
					handleRevert: true,
					timeout: '0xa',
					data: '0xfe',
				},
			};

			const result = format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX });

			expect(result).toEqual(expected);
		});

		it('should format array values with single type', () => {
			const schema = {
				type: 'object',
				properties: {
					int_arr: {
						type: 'array',
						items: {
							eth: 'uint',
						},
					},
					bytes_arr: {
						type: 'array',
						items: {
							eth: 'bytes',
						},
					},
				},
			};

			const data = {
				int_arr: [10, 10, 10],
				bytes_arr: [
					Buffer.from('FF', 'hex'),
					Buffer.from('FF', 'hex'),
					Buffer.from('FF', 'hex'),
				],
			};

			const result = {
				int_arr: ['0xa', '0xa', '0xa'],
				bytes_arr: ['0xff', '0xff', '0xff'],
			};

			expect(format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX })).toEqual(
				result,
			);
		});

		it('should format array values with object type', () => {
			const schema = {
				type: 'object',
				properties: {
					arr: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								prop1: {
									eth: 'uint',
								},
								prop2: {
									eth: 'bytes',
								},
							},
						},
					},
				},
			};

			const data = {
				arr: [
					{ prop1: 10, prop2: Buffer.from('FF', 'hex') },
					{ prop1: 10, prop2: Buffer.from('FF', 'hex') },
				],
			};

			const result = {
				arr: [
					{ prop1: '0xa', prop2: '0xff' },
					{ prop1: '0xa', prop2: '0xff' },
				],
			};

			expect(format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX })).toEqual(
				result,
			);
		});

		it('should format array values with tuple type', () => {
			const schema = {
				type: 'object',
				properties: {
					tuple: {
						type: 'array',
						items: [
							{
								eth: 'uint',
							},
							{
								eth: 'bytes',
							},
						],
					},
				},
			};

			const data = {
				tuple: [10, Buffer.from('FF', 'hex')],
			};

			const result = {
				tuple: ['0xa', '0xff'],
			};

			expect(format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX })).toEqual(
				result,
			);
		});

		it('should format simple arrays', () => {
			const schema = {
				type: 'array',
				items: {
					eth: 'uint',
				},
			};

			const data = [10, 10];

			const result = ['0xa', '0xa'];

			expect(format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX })).toEqual(
				result,
			);
		});

		it('should format simple tuple', () => {
			const schema = {
				type: 'array',
				items: [
					{
						eth: 'uint',
					},
					{
						eth: 'bytes',
					},
				],
			};

			const data = [10, Buffer.from('FF', 'hex')];

			const result = ['0xa', '0xff'];

			expect(format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX })).toEqual(
				result,
			);
		});

		it('should format scalar value', () => {
			const schema = {
				eth: 'uint',
			};

			const data = 10;

			const result = '0xa';

			expect(format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX })).toEqual(
				result,
			);
		});
	});
});
