import { DEFAULT_RETURN_FORMAT, FMT_BYTES, FMT_NUMBER } from 'web3-common';
import { formatTransaction } from '../../src/utils/format_transaction';
import {
	bigIntTransaction,
	hexStringTransaction,
	numberStringTransaction,
	numberTransaction,
} from '../fixtures/format_transaction';

describe('formatTransaction', () => {
	it.skip('should call override method', () => {
		const overrideFunction = jest.fn();
		formatTransaction(hexStringTransaction, DEFAULT_RETURN_FORMAT);
		expect(overrideFunction).toHaveBeenCalledWith(hexStringTransaction);
	});

	describe('should convert hex string properties to expected type', () => {
		it('numbers', () => {
			expect(
				formatTransaction(hexStringTransaction, {
					number: FMT_NUMBER.NUMBER,
					bytes: FMT_BYTES.HEX,
				}),
			).toStrictEqual(numberTransaction);
		});

		it('number strings', () => {
			expect(
				formatTransaction(hexStringTransaction, {
					number: FMT_NUMBER.STR,
					bytes: FMT_BYTES.HEX,
				}),
			).toStrictEqual(numberStringTransaction);
		});

		it('BigInts', () => {
			expect(
				formatTransaction(hexStringTransaction, {
					number: FMT_NUMBER.BIGINT,
					bytes: FMT_BYTES.HEX,
				}),
			).toStrictEqual(bigIntTransaction);
		});
	});

	describe('should convert number properties to expected type', () => {
		it('hex string', () => {
			expect(
				formatTransaction(numberTransaction, {
					number: FMT_NUMBER.HEX,
					bytes: FMT_BYTES.HEX,
				}),
			).toStrictEqual(hexStringTransaction);
		});

		it('number strings', () => {
			expect(
				formatTransaction(numberTransaction, {
					number: FMT_NUMBER.STR,
					bytes: FMT_BYTES.HEX,
				}),
			).toStrictEqual(numberStringTransaction);
		});

		it('BigInts', () => {
			expect(
				formatTransaction(numberTransaction, {
					number: FMT_NUMBER.BIGINT,
					bytes: FMT_BYTES.HEX,
				}),
			).toStrictEqual(bigIntTransaction);
		});
	});

	describe('should convert number string properties to expected type', () => {
		it('hex strings', () => {
			expect(
				formatTransaction(numberStringTransaction, {
					number: FMT_NUMBER.HEX,
					bytes: FMT_BYTES.HEX,
				}),
			).toStrictEqual(hexStringTransaction);
		});

		it('numbers', () => {
			expect(
				formatTransaction(numberStringTransaction, {
					number: FMT_NUMBER.NUMBER,
					bytes: FMT_BYTES.HEX,
				}),
			).toStrictEqual(numberTransaction);
		});

		it('BigInts', () => {
			expect(
				formatTransaction(numberStringTransaction, {
					number: FMT_NUMBER.BIGINT,
					bytes: FMT_BYTES.HEX,
				}),
			).toStrictEqual(bigIntTransaction);
		});
	});

	describe('should convert bigint properties to expected type', () => {
		it('hex strings', () => {
			expect(
				formatTransaction(bigIntTransaction, {
					number: FMT_NUMBER.HEX,
					bytes: FMT_BYTES.HEX,
				}),
			).toStrictEqual(hexStringTransaction);
		});

		it('numbers', () => {
			expect(
				formatTransaction(bigIntTransaction, {
					number: FMT_NUMBER.NUMBER,
					bytes: FMT_BYTES.HEX,
				}),
			).toStrictEqual(numberTransaction);
		});

		it('number strings', () => {
			expect(
				formatTransaction(bigIntTransaction, {
					number: FMT_NUMBER.STR,
					bytes: FMT_BYTES.HEX,
				}),
			).toStrictEqual(numberStringTransaction);
		});
	});
});
