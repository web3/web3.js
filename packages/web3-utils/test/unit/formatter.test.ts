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
import {
	Address,
	Bytes,
	DEFAULT_RETURN_FORMAT,
	FMT_BYTES,
	FMT_NUMBER,
	FormatType,
	HexString,
	Numbers,
} from 'web3-types';
import { FormatterError } from 'web3-errors';
import { expectTypeOf, typecheck } from '@humeris/espresso-shot';
import { isDataFormatValid, convertScalarValueValid } from '../fixtures/formatter';
import { format, isDataFormat, convertScalarValue, convert } from '../../src/formatter';
import { hexToBytes } from '../../src/converters';

type TestTransactionInfoType = {
	readonly blockHash?: Bytes;
	readonly blockNumber?: Numbers;
	readonly from: Address;
	readonly hash: Bytes;
	readonly transactionIndex?: Numbers;
};

type TestBlockType = {
	readonly parentHash: Bytes;
	readonly sha3Uncles: Bytes;
	readonly miner: Bytes;
	readonly stateRoot: Bytes;
	readonly transactionsRoot: Bytes;
	readonly receiptsRoot: Bytes;
	readonly logsBloom?: Bytes;
	readonly difficulty?: Numbers;
	readonly number?: Numbers;
	readonly gasLimit: Numbers;
	readonly gasUsed: Numbers;
	readonly timestamp: Numbers;
	readonly extraData: Bytes;
	readonly mixHash: Bytes;
	readonly nonce?: Numbers;
	readonly totalDifficulty: Numbers;
	readonly baseFeePerGas?: Numbers;
	readonly size: Numbers;
	readonly transactions: Bytes[] | TestTransactionInfoType[];
	readonly uncles: Bytes[];
	readonly hash?: Bytes;
};

describe('formatter', () => {
	describe('types', () => {
		describe('scalar types', () => {
			typecheck('should not format non-formatable scalar type', () => {
				type T = FormatType<
					boolean,
					{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.UINT8ARRAY }
				>;

				return expectTypeOf<T>().toBe<boolean>();
			});

			describe('number', () => {
				typecheck('should format for FMT_NUMBER.BIGINT', () => {
					type T = FormatType<
						Numbers,
						{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.UINT8ARRAY }
					>;

					return expectTypeOf<T>().toBe<bigint>();
				});

				typecheck('should format for FMT_NUMBER.HEX', () => {
					type T = FormatType<
						Numbers,
						{ number: FMT_NUMBER.HEX; bytes: FMT_BYTES.UINT8ARRAY }
					>;

					return expectTypeOf<T>().toBe<string>();
				});

				typecheck('should format for FMT_NUMBER.NUMBER', () => {
					type T = FormatType<
						Numbers,
						{ number: FMT_NUMBER.NUMBER; bytes: FMT_BYTES.UINT8ARRAY }
					>;

					return expectTypeOf<T>().toBe<number>();
				});

				typecheck('should format for FMT_NUMBER.STR', () => {
					type T = FormatType<
						Numbers,
						{ number: FMT_NUMBER.STR; bytes: FMT_BYTES.UINT8ARRAY }
					>;

					return expectTypeOf<T>().toBe<string>();
				});
			});

			describe('bytes', () => {
				typecheck('should format for FMT_BYTES.UINT8ARRAY', () => {
					type T = FormatType<
						Bytes,
						{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.UINT8ARRAY }
					>;

					return expectTypeOf<T>().toBe<Uint8Array>();
				});

				typecheck('should format for FMT_BYTES.HEX', () => {
					type T = FormatType<Bytes, { number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.HEX }>;

					return expectTypeOf<T>().toBe<HexString>();
				});

				typecheck('should format for FMT_BYTES.UINT8ARRAY', () => {
					type T = FormatType<
						Bytes,
						{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.UINT8ARRAY }
					>;

					return expectTypeOf<T>().toBe<Uint8Array>();
				});
			});
		});

		describe('array types', () => {
			typecheck('should not format non-formatable array type', () => {
				type T = FormatType<
					boolean[],
					{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.UINT8ARRAY }
				>;

				return expectTypeOf<T>().toBe<boolean[]>();
			});

			describe('number', () => {
				typecheck('should format for FMT_NUMBER.BIGINT', () => {
					type T = FormatType<
						Numbers[],
						{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.UINT8ARRAY }
					>;

					return expectTypeOf<T>().toBe<bigint[]>();
				});

				typecheck('should format for FMT_NUMBER.HEX', () => {
					type T = FormatType<
						Numbers[],
						{ number: FMT_NUMBER.HEX; bytes: FMT_BYTES.UINT8ARRAY }
					>;

					return expectTypeOf<T>().toBe<HexString[]>();
				});

				typecheck('should format for FMT_NUMBER.NUMBER', () => {
					type T = FormatType<
						Numbers[],
						{ number: FMT_NUMBER.NUMBER; bytes: FMT_BYTES.UINT8ARRAY }
					>;

					return expectTypeOf<T>().toBe<number[]>();
				});

				typecheck('should format for FMT_NUMBER.STR', () => {
					type T = FormatType<
						Numbers[],
						{ number: FMT_NUMBER.STR; bytes: FMT_BYTES.UINT8ARRAY }
					>;

					return expectTypeOf<T>().toBe<string[]>();
				});
			});

			describe('bytes', () => {
				typecheck('should format for FMT_BYTES.UINT8ARRAY', () => {
					type T = FormatType<
						Bytes[],
						{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.UINT8ARRAY }
					>;

					return expectTypeOf<T>().toBe<Uint8Array[]>();
				});

				typecheck('should format for FMT_BYTES.HEX', () => {
					type T = FormatType<
						Bytes[],
						{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.HEX }
					>;

					return expectTypeOf<T>().toBe<HexString[]>();
				});

				typecheck('should format for FMT_BYTES.UINT8ARRAY', () => {
					type T = FormatType<
						Bytes[],
						{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.UINT8ARRAY }
					>;

					return expectTypeOf<T>().toBe<Uint8Array[]>();
				});
			});
		});

		describe('objects', () => {
			typecheck('should format correct types for simple object', () => {
				type T = FormatType<
					{
						handleRevert: boolean;
						timeout: number;
						data: Uint8Array;
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
						data: Uint8Array[];
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
							data: Uint8Array[];
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
						tuple: [Uint8Array, number];
					},
					{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.UINT8ARRAY }
				>;

				return expectTypeOf<T>().toBe<{
					tuple: [Uint8Array, bigint];
				}>();
			});

			typecheck('should format correct tuple type', () => {
				type T = FormatType<
					[Uint8Array, number],
					{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.UINT8ARRAY }
				>;

				return expectTypeOf<T>().toBe<[Uint8Array, bigint]>();
			});

			typecheck('should format block for number as "hex" and bytes as "hex"', () => {
				type T = FormatType<
					TestBlockType,
					{ number: FMT_NUMBER.HEX; bytes: FMT_BYTES.HEX }
				>;

				return expectTypeOf<T>().toBe<{
					readonly parentHash: string;
					readonly sha3Uncles: string;
					readonly miner: string;
					readonly stateRoot: string;
					readonly transactionsRoot: string;
					readonly receiptsRoot: string;
					readonly logsBloom?: string;
					readonly difficulty?: string;
					readonly number?: string;
					readonly gasLimit: string;
					readonly gasUsed: string;
					readonly timestamp: string;
					readonly extraData: string;
					readonly mixHash: string;
					readonly nonce?: string;
					readonly totalDifficulty: string;
					readonly baseFeePerGas?: string;
					readonly size: string;
					readonly transactions:
						| string[]
						| {
								readonly blockHash?: string;
								readonly blockNumber?: string;
								readonly from: Address;
								readonly hash: string;
								readonly transactionIndex?: string;
						  }[];
					readonly uncles: string[];
					readonly hash?: string;
				}>();
			});

			typecheck(
				'should format block for number as "bigint" and bytes as "uint8array"',
				() => {
					type T = FormatType<
						TestBlockType,
						{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.UINT8ARRAY }
					>;

					return expectTypeOf<T>().toBe<{
						readonly parentHash: Uint8Array;
						readonly sha3Uncles: Uint8Array;
						readonly miner: Uint8Array;
						readonly stateRoot: Uint8Array;
						readonly transactionsRoot: Uint8Array;
						readonly receiptsRoot: Uint8Array;
						readonly logsBloom?: Uint8Array;
						readonly difficulty?: bigint;
						readonly number?: bigint;
						readonly gasLimit: bigint;
						readonly gasUsed: bigint;
						readonly timestamp: bigint;
						readonly extraData: Uint8Array;
						readonly mixHash: Uint8Array;
						readonly nonce?: bigint;
						readonly totalDifficulty: bigint;
						readonly baseFeePerGas?: bigint;
						readonly size: bigint;
						readonly transactions:
							| Uint8Array[]
							| {
									readonly blockHash?: Uint8Array;
									readonly blockNumber?: bigint;
									readonly from: Address;
									readonly hash: Uint8Array;
									readonly transactionIndex?: bigint;
							  }[];
						readonly uncles: Uint8Array[];
						readonly hash?: Uint8Array;
					}>();
				},
			);

			typecheck(
				'should format block for number as "number" and bytes as "uint8array"',
				() => {
					type T = FormatType<
						TestBlockType,
						{ number: FMT_NUMBER.NUMBER; bytes: FMT_BYTES.UINT8ARRAY }
					>;

					return expectTypeOf<T>().toBe<{
						readonly parentHash: Uint8Array;
						readonly sha3Uncles: Uint8Array;
						readonly miner: Uint8Array;
						readonly stateRoot: Uint8Array;
						readonly transactionsRoot: Uint8Array;
						readonly receiptsRoot: Uint8Array;
						readonly logsBloom?: Uint8Array;
						readonly difficulty?: number;
						readonly number?: number;
						readonly gasLimit: number;
						readonly gasUsed: number;
						readonly timestamp: number;
						readonly extraData: Uint8Array;
						readonly mixHash: Uint8Array;
						readonly nonce?: number;
						readonly totalDifficulty: number;
						readonly baseFeePerGas?: number;
						readonly size: number;
						readonly transactions:
							| Uint8Array[]
							| {
									readonly blockHash?: Uint8Array;
									readonly blockNumber?: number;
									readonly from: Address;
									readonly hash: Uint8Array;
									readonly transactionIndex?: number;
							  }[];
						readonly uncles: Uint8Array[];
						readonly hash?: Uint8Array;
					}>();
				},
			);
		});
	});

	describe('format', () => {
		describe('scalar values', () => {
			it('should not format non-formatable scalar type', () => {
				expect(format({ format: 'boolean' }, true, DEFAULT_RETURN_FORMAT)).toBe(true);
			});

			describe('number', () => {
				it('should format for FMT_NUMBER.BIGINT', () => {
					expect(
						format({ format: 'uint' }, 10, {
							number: FMT_NUMBER.BIGINT,
							bytes: FMT_BYTES.HEX,
						}),
					).toEqual(BigInt(10));
				});

				it('should format for FMT_NUMBER.HEX', () => {
					expect(
						format({ format: 'uint' }, 10, {
							number: FMT_NUMBER.HEX,
							bytes: FMT_BYTES.HEX,
						}),
					).toBe('0xa');
				});

				it('should format for FMT_NUMBER.NUMBER', () => {
					expect(
						format({ format: 'uint' }, '0xa', {
							number: FMT_NUMBER.NUMBER,
							bytes: FMT_BYTES.HEX,
						}),
					).toBe(10);
				});

				it('should format for FMT_NUMBER.STR', () => {
					expect(
						format({ format: 'uint' }, 10, {
							number: FMT_NUMBER.STR,
							bytes: FMT_BYTES.HEX,
						}),
					).toBe('10');
				});
			});

			describe('bytes', () => {
				it('should format for FMT_BYTES.HEX', () => {
					expect(
						format({ format: 'bytes' }, new Uint8Array(hexToBytes('100bca')), {
							number: FMT_NUMBER.STR,
							bytes: FMT_BYTES.HEX,
						}),
					).toBe('0x100bca');
				});

				it('should format for FMT_BYTES.UINT8ARRAY', () => {
					expect(
						format({ format: 'bytes' }, '0x100bca', {
							number: FMT_NUMBER.STR,
							bytes: FMT_BYTES.UINT8ARRAY,
						}),
					).toEqual(new Uint8Array([16, 11, 202]));
				});
			});

			describe('string', () => {
				it('should format string for 123', () => {
					expect(
						format({ format: 'string' }, 123, {
							number: FMT_NUMBER.STR,
							bytes: FMT_BYTES.HEX,
						}),
					).toBe('123');
				});
			});
		});

		describe('array values', () => {
			it('should format array values with single type', () => {
				const schema = {
					type: 'object',
					properties: {
						int_arr: {
							type: 'array',
							items: {
								format: 'uint',
							},
						},
						bytes_arr: {
							type: 'array',
							items: {
								format: 'bytes',
							},
						},
					},
				};

				const data = {
					int_arr: [10, 10, 10],
					bytes_arr: [
						new Uint8Array(hexToBytes('FF')),
						new Uint8Array(hexToBytes('FF')),
						new Uint8Array(hexToBytes('FF')),
					],
				};

				const result = {
					int_arr: ['0xa', '0xa', '0xa'],
					bytes_arr: ['0xff', '0xff', '0xff'],
				};

				expect(
					format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX }),
				).toEqual(result);
			});

			it('should format array of objects', () => {
				const schema = {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							prop1: {
								format: 'uint',
							},
							prop2: {
								format: 'bytes',
							},
						},
					},
				};

				const data = [
					{ prop1: 10, prop2: new Uint8Array(hexToBytes('FF')) },
					{ prop1: 10, prop2: new Uint8Array(hexToBytes('FF')) },
				];

				const result = [
					{ prop1: '0xa', prop2: '0xff' },
					{ prop1: '0xa', prop2: '0xff' },
				];

				expect(
					format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX }),
				).toEqual(result);
			});

			it('should format array of objects with oneOf', () => {
				const schema = {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							prop1: {
								oneOf: [{ format: 'address' }, { type: 'string' }],
							},
							prop2: {
								format: 'bytes',
							},
						},
					},
				};

				const data = [
					{
						prop1: '0x7ed0e85b8e1e925600b4373e6d108f34ab38a401',
						prop2: new Uint8Array(hexToBytes('FF')),
					},
					{ prop1: 'some string', prop2: new Uint8Array(hexToBytes('FF')) },
				];

				const result = [
					{ prop1: '0x7ed0e85b8e1e925600b4373e6d108f34ab38a401', prop2: '0xff' },
					{ prop1: 'some string', prop2: '0xff' },
				];

				expect(
					format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX }),
				).toEqual(result);
			});

			it('should format array of different objects', () => {
				const schema = {
					type: 'array',
					items: [
						{
							type: 'object',
							properties: {
								prop1: {
									format: 'uint',
								},
								prop2: {
									format: 'bytes',
								},
							},
						},
						{
							type: 'object',
							properties: {
								prop1: {
									format: 'string',
								},
								prop2: {
									format: 'uint',
								},
							},
						},
					],
				};

				const data = [
					{ prop1: 10, prop2: new Uint8Array(hexToBytes('FF')) },
					{ prop1: 'test', prop2: 123 },
				];

				const result = [
					{ prop1: 10, prop2: '0xff' },
					{ prop1: 'test', prop2: 123 },
				];

				expect(
					format(schema, data, { number: FMT_NUMBER.NUMBER, bytes: FMT_BYTES.HEX }),
				).toEqual(result);
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
										format: 'uint',
									},
									prop2: {
										format: 'bytes',
									},
								},
							},
						},
					},
				};

				const data = {
					arr: [
						{ prop1: 10, prop2: new Uint8Array(hexToBytes('FF')) },
						{ prop1: 10, prop2: new Uint8Array(hexToBytes('FF')) },
					],
				};

				const result = {
					arr: [
						{ prop1: '0xa', prop2: '0xff' },
						{ prop1: '0xa', prop2: '0xff' },
					],
				};

				expect(
					format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX }),
				).toEqual(result);
			});

			it('should format array values with tuple type', () => {
				const schema = {
					type: 'object',
					properties: {
						tuple: {
							type: 'array',
							items: [
								{
									format: 'uint',
								},
								{
									format: 'bytes',
								},
							],
						},
					},
				};

				const data = {
					tuple: [10, new Uint8Array(hexToBytes('FF'))],
				};

				const result = {
					tuple: ['0xa', '0xff'],
				};

				expect(
					format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX }),
				).toEqual(result);
			});

			it('should format simple arrays', () => {
				const schema = {
					type: 'array',
					items: {
						format: 'uint',
					},
				};

				const data = [10, 10];

				const result = ['0xa', '0xa'];

				expect(
					format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX }),
				).toEqual(result);
			});

			it('should format simple tuple', () => {
				const schema = {
					type: 'array',
					items: [
						{
							format: 'uint',
						},
						{
							format: 'bytes',
						},
					],
				};

				const data = [10, new Uint8Array(hexToBytes('FF'))];

				const result = ['0xa', '0xff'];

				expect(
					format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX }),
				).toEqual(result);
			});
		});
		describe('object values', () => {
			it('should format simple object', () => {
				const schema = {
					type: 'object',
					properties: {
						handleRevert: {
							format: 'bool',
						},
						timeout: {
							format: 'uint',
						},
						data: {
							format: 'bytes',
						},
					},
				};

				const data = {
					handleRevert: true,
					timeout: 10,
					data: new Uint8Array(hexToBytes('FE')),
				};

				const expected = {
					handleRevert: true,
					timeout: '0xa',
					data: '0xfe',
				};

				const result = format(schema, data, {
					number: FMT_NUMBER.HEX,
					bytes: FMT_BYTES.HEX,
				});

				expect(result).toEqual(expected);
			});

			it('should throw FormatterError when jsonSchema is invalid', () => {
				const invalidSchema1 = {};
				const data = { key: 'value' };

				expect(() => format(invalidSchema1, data)).toThrow(FormatterError);
			});

			it('should format nested objects', () => {
				const schema = {
					type: 'object',
					properties: {
						nested: {
							type: 'object',
							properties: {
								handleRevert: {
									format: 'bool',
								},
								timeout: {
									format: 'uint',
								},
								data: {
									format: 'bytes',
								},
							},
						},
					},
				};

				const data = {
					nested: {
						handleRevert: true,
						timeout: 10,
						data: new Uint8Array(hexToBytes('FE')),
					},
				};

				const expected = {
					nested: {
						handleRevert: true,
						timeout: '0xa',
						data: '0xfe',
					},
				};

				const result = format(schema, data, {
					number: FMT_NUMBER.HEX,
					bytes: FMT_BYTES.HEX,
				});

				expect(result).toEqual(expected);
			});

			it('should format object with oneOf', () => {
				const schema = {
					type: 'object',
					properties: {
						from: {
							format: 'address',
						},
						to: {
							oneOf: [{ format: 'string' }, { type: 'null' }],
						},
					},
				};

				const data = {
					from: '0x7ed0e85b8e1e925600b4373e6d108f34ab38a401',
					to: 123,
				};
				const result = { from: '0x7ed0e85b8e1e925600b4373e6d108f34ab38a401', to: '123' };

				expect(
					format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX }),
				).toEqual(result);
			});

			it('should format object with oneOf when property is undefined', () => {
				const schema = {
					type: 'object',
					properties: {
						from: {
							format: 'address',
						},
						to: {
							oneOf: [{ format: 'string' }, { type: 'null' }],
						},
					},
				};

				const data = {
					from: '0x7ed0e85b8e1e925600b4373e6d108f34ab38a401',
				};

				const result = { from: '0x7ed0e85b8e1e925600b4373e6d108f34ab38a401' };

				expect(
					format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX }),
				).toEqual(result);
			});
		});
		describe('isDataFormat', () => {
			describe('valid cases', () => {
				it.each(isDataFormatValid)('%s', (input, output) => {
					expect(isDataFormat(input)).toEqual(output);
				});
			});
		});
		describe('convertScalar', () => {
			describe('valid cases', () => {
				it.each(convertScalarValueValid)('%s', (input, output) => {
					expect(convertScalarValue(...input)).toEqual(output);
				});
			});
			describe('convertScalar bigint', () => {
				it.each(convertScalarValueValid)('%s', () => {
					expect(
						convertScalarValue(100, 'int', {
							number: FMT_NUMBER.BIGINT,
							bytes: FMT_BYTES.UINT8ARRAY,
						}),
					).toBe(BigInt(100));
				});
			});
		});
	});

	describe('convert', () => {
		it('should return empty when no properties or items', () => {
			const data = { key: 'value' };
			const schema = {
				type: 'object',
			};
			const f = { number: FMT_NUMBER.NUMBER, bytes: FMT_BYTES.HEX };
			const result = convert(data, schema, [], f, []);
			expect(result).toEqual({});
		});
	});
});
