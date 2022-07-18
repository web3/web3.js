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
import { Address, Bytes, HexString, Numbers } from 'web3-types';
import { expectTypeOf, typecheck } from '@humeris/espresso-shot';
import {
	DEFAULT_RETURN_FORMAT,
	FMT_BYTES,
	FMT_NUMBER,
	format,
	FormatType,
} from '../../src/formatter';

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

				typecheck('should format for FMT_BYTES.BUFFER', () => {
					type T = FormatType<
						Bytes,
						{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.BUFFER }
					>;

					return expectTypeOf<T>().toBe<Buffer>();
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

				typecheck('should format for FMT_BYTES.BUFFER', () => {
					type T = FormatType<
						Bytes[],
						{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.BUFFER }
					>;

					return expectTypeOf<T>().toBe<Buffer[]>();
				});
			});
		});

		describe('objects', () => {
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

			typecheck('should format correct tuple type', () => {
				type T = FormatType<
					[Buffer, number],
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

			typecheck('should format block for number as "bigint" and bytes as "buffer"', () => {
				type T = FormatType<
					TestBlockType,
					{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.BUFFER }
				>;

				return expectTypeOf<T>().toBe<{
					readonly parentHash: Buffer;
					readonly sha3Uncles: Buffer;
					readonly miner: Buffer;
					readonly stateRoot: Buffer;
					readonly transactionsRoot: Buffer;
					readonly receiptsRoot: Buffer;
					readonly logsBloom?: Buffer;
					readonly difficulty?: bigint;
					readonly number?: bigint;
					readonly gasLimit: bigint;
					readonly gasUsed: bigint;
					readonly timestamp: bigint;
					readonly extraData: Buffer;
					readonly mixHash: Buffer;
					readonly nonce?: bigint;
					readonly totalDifficulty: bigint;
					readonly baseFeePerGas?: bigint;
					readonly size: bigint;
					readonly transactions:
						| Buffer[]
						| {
								readonly blockHash?: Buffer;
								readonly blockNumber?: bigint;
								readonly from: Address;
								readonly hash: Buffer;
								readonly transactionIndex?: bigint;
						  }[];
					readonly uncles: Buffer[];
					readonly hash?: Buffer;
				}>();
			});

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
				expect(format({ eth: 'boolean' }, true, DEFAULT_RETURN_FORMAT)).toBe(true);
			});

			describe('number', () => {
				it('should format for FMT_NUMBER.BIGINT', () => {
					expect(
						format({ eth: 'uint' }, 10, {
							number: FMT_NUMBER.BIGINT,
							bytes: FMT_BYTES.HEX,
						}),
					).toEqual(BigInt(10));
				});

				it('should format for FMT_NUMBER.HEX', () => {
					expect(
						format({ eth: 'uint' }, 10, {
							number: FMT_NUMBER.HEX,
							bytes: FMT_BYTES.HEX,
						}),
					).toBe('0xa');
				});

				it('should format for FMT_NUMBER.NUMBER', () => {
					expect(
						format({ eth: 'uint' }, '0xa', {
							number: FMT_NUMBER.NUMBER,
							bytes: FMT_BYTES.HEX,
						}),
					).toBe(10);
				});

				it('should format for FMT_NUMBER.STR', () => {
					expect(
						format({ eth: 'uint' }, 10, {
							number: FMT_NUMBER.STR,
							bytes: FMT_BYTES.HEX,
						}),
					).toBe('10');
				});
			});

			describe('bytes', () => {
				it('should format for FMT_BYTES.UINT8ARRAY', () => {
					expect(
						format({ eth: 'bytes' }, '0x100bca', {
							number: FMT_NUMBER.STR,
							bytes: FMT_BYTES.UINT8ARRAY,
						}),
					).toEqual(new Uint8Array([16, 11, 202]));
				});

				it('should format for FMT_BYTES.HEX', () => {
					expect(
						format({ eth: 'bytes' }, Buffer.from('100bca', 'hex'), {
							number: FMT_NUMBER.STR,
							bytes: FMT_BYTES.HEX,
						}),
					).toBe('0x100bca');
				});

				it('should format for FMT_BYTES.BUFFER', () => {
					expect(
						format({ eth: 'bytes' }, '0x100bca', {
							number: FMT_NUMBER.STR,
							bytes: FMT_BYTES.BUFFER,
						}),
					).toEqual(Buffer.from('100bca', 'hex'));
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

				expect(
					format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX }),
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

				expect(
					format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX }),
				).toEqual(result);
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

				expect(
					format(schema, data, { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX }),
				).toEqual(result);
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

				const result = format(schema, data, {
					number: FMT_NUMBER.HEX,
					bytes: FMT_BYTES.HEX,
				});

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

				const result = format(schema, data, {
					number: FMT_NUMBER.HEX,
					bytes: FMT_BYTES.HEX,
				});

				expect(result).toEqual(expected);
			});
		});
	});
});
