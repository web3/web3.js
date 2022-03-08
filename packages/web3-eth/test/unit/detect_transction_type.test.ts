import { detectTransactionType } from '../../src/utils/detect_transaction_type';
import {
	transactionType0x0,
	transactionType0x1,
	transactionType0x2,
	transactionTypeUndefined,
} from '../fixtures/detect_transaction_type';

describe('detectTransactionType', () => {
	describe('should override detectTransactionType method', () => {
		it.skip('should call override method', () => {
			const overrideFunction = jest.fn();
			detectTransactionType(transactionTypeUndefined[0]);
			expect(overrideFunction).toHaveBeenCalledWith(transactionTypeUndefined[0]);
		});
	});

	describe('should detect transaction type 0x0', () => {
		it.each(transactionType0x0)('%s', transaction => {
			expect(detectTransactionType(transaction)).toBe('0x0');
		});
	});

	describe('should detect transaction type 0x1', () => {
		it.each(transactionType0x1)('%s', transaction => {
			expect(detectTransactionType(transaction)).toBe('0x1');
		});
	});

	describe('should detect transaction type 0x2', () => {
		it.each(transactionType0x2)('%s', transaction => {
			expect(detectTransactionType(transaction)).toBe('0x2');
		});
	});

	describe('should not be able to detect transaction type, returning undefined', () => {
		it.each(transactionTypeUndefined)('%s', transaction => {
			expect(detectTransactionType(transaction)).toBeUndefined();
		});
	});
});
