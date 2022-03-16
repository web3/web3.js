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
				{ number: FMT_NUMBER.HEX; bytes: FMT_BYTES.HEX }
			>;

			return expectTypeOf<T>().toBe<{
				handleRevert: boolean;
				timeout: string;
				data: string;
			}>();
		});

		typecheck('should format correct types for array', () => {
			type T = FormatType<
				{
					handleRevert: boolean;
					timeout: number[];
					data: Buffer[];
				},
				{ number: FMT_NUMBER.HEX; bytes: FMT_BYTES.HEX }
			>;

			return expectTypeOf<T>().toBe<{
				handleRevert: boolean;
				timeout: string[];
				data: string[];
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
				{ number: FMT_NUMBER.HEX; bytes: FMT_BYTES.HEX }
			>;

			return expectTypeOf<T>().toBe<{
				nested: { handleRevert: boolean; timeout: string[]; data: string[] };
			}>();
		});

		typecheck('should format correct types for tuple', () => {
			type T = FormatType<
				{
					tuple: [Buffer, number];
				},
				{ number: FMT_NUMBER.HEX; bytes: FMT_BYTES.HEX }
			>;

			return expectTypeOf<T>().toBe<{
				tuple: [string, string];
			}>();
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

		it('should format object with array values', () => {
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
	});
});
