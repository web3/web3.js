import { ValidTypes } from 'web3-utils';
import { formatTransaction } from '../../src/eth_tx';
import {
	bigIntTransaction,
	hexStringTransaction,
	numberStringTransaction,
	numberTransaction,
} from '../fixtures/format_transaction';

describe('should convert hex string properties to expected type', () => {
	it('numbers', () => {
		const result = formatTransaction(hexStringTransaction, ValidTypes.Number);
		expect(result).toStrictEqual(numberTransaction);
	});

	it('number strings', () => {
		const result = formatTransaction(hexStringTransaction, ValidTypes.NumberString);
		expect(result).toStrictEqual(numberStringTransaction);
	});

	it('BigInts', () => {
		const result = formatTransaction(hexStringTransaction, ValidTypes.BigInt);
		expect(result).toStrictEqual(bigIntTransaction);
	});
});

describe('should convert number properties to expected type', () => {
	it('hex string', () => {
		const result = formatTransaction(numberTransaction, ValidTypes.HexString);
		expect(result).toStrictEqual(hexStringTransaction);
	});

	it('number strings', () => {
		const result = formatTransaction(numberTransaction, ValidTypes.NumberString);
		expect(result).toStrictEqual(numberStringTransaction);
	});

	it('BigInts', () => {
		const result = formatTransaction(numberTransaction, ValidTypes.BigInt);
		expect(result).toStrictEqual(bigIntTransaction);
	});
});

describe('should convert number string properties to expected type', () => {
	it('hex strings', () => {
		const result = formatTransaction(numberStringTransaction, ValidTypes.HexString);
		expect(result).toStrictEqual(hexStringTransaction);
	});

	it('numbers', () => {
		const result = formatTransaction(numberStringTransaction, ValidTypes.Number);
		expect(result).toStrictEqual(numberTransaction);
	});

	it('BigInts', () => {
		const result = formatTransaction(numberStringTransaction, ValidTypes.BigInt);
		expect(result).toStrictEqual(bigIntTransaction);
	});
});

describe('should convert bigint properties to expected type', () => {
	it('hex strings', () => {
		const result = formatTransaction(bigIntTransaction, ValidTypes.HexString);
		expect(result).toStrictEqual(hexStringTransaction);
	});

	it('numbers', () => {
		const result = formatTransaction(bigIntTransaction, ValidTypes.Number);
		expect(result).toStrictEqual(numberTransaction);
	});

	it('number strings', () => {
		const result = formatTransaction(bigIntTransaction, ValidTypes.NumberString);
		expect(result).toStrictEqual(numberStringTransaction);
	});
});
