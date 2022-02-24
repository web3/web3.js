import { ValidTypes } from 'web3-utils';
import { formatTransaction } from '../../src/format_transaction';
import {
	bigIntTransaction,
	hexStringTransaction,
	numberStringTransaction,
	numberTransaction,
} from '../fixtures/format_transaction';

describe('formatTransaction', () => {
	it.skip('should call override method', () => {
		// const overrideFunction = jest.fn();
		// formatTransaction(hexStringTransaction, ValidTypes.Number, overrideFunction);
		// expect(overrideFunction).toHaveBeenCalledWith(hexStringTransaction);
	});

	describe('should convert hex string properties to expected type', () => {
		it('numbers', () => {
			expect(formatTransaction(hexStringTransaction, ValidTypes.Number)).toStrictEqual(
				numberTransaction,
			);
		});

		it('number strings', () => {
			expect(formatTransaction(hexStringTransaction, ValidTypes.NumberString)).toStrictEqual(
				numberStringTransaction,
			);
		});

		it('BigInts', () => {
			expect(formatTransaction(hexStringTransaction, ValidTypes.BigInt)).toStrictEqual(
				bigIntTransaction,
			);
		});
	});

	describe('should convert number properties to expected type', () => {
		it('hex string', () => {
			expect(formatTransaction(numberTransaction, ValidTypes.HexString)).toStrictEqual(
				hexStringTransaction,
			);
		});

		it('number strings', () => {
			expect(formatTransaction(numberTransaction, ValidTypes.NumberString)).toStrictEqual(
				numberStringTransaction,
			);
		});

		it('BigInts', () => {
			expect(formatTransaction(numberTransaction, ValidTypes.BigInt)).toStrictEqual(
				bigIntTransaction,
			);
		});
	});

	describe('should convert number string properties to expected type', () => {
		it('hex strings', () => {
			expect(formatTransaction(numberStringTransaction, ValidTypes.HexString)).toStrictEqual(
				hexStringTransaction,
			);
		});

		it('numbers', () => {
			expect(formatTransaction(numberStringTransaction, ValidTypes.Number)).toStrictEqual(
				numberTransaction,
			);
		});

		it('BigInts', () => {
			expect(formatTransaction(numberStringTransaction, ValidTypes.BigInt)).toStrictEqual(
				bigIntTransaction,
			);
		});
	});

	describe('should convert bigint properties to expected type', () => {
		it('hex strings', () => {
			expect(formatTransaction(bigIntTransaction, ValidTypes.HexString)).toStrictEqual(
				hexStringTransaction,
			);
		});

		it('numbers', () => {
			expect(formatTransaction(bigIntTransaction, ValidTypes.Number)).toStrictEqual(
				numberTransaction,
			);
		});

		it('number strings', () => {
			expect(formatTransaction(bigIntTransaction, ValidTypes.NumberString)).toStrictEqual(
				numberStringTransaction,
			);
		});
	});
});
