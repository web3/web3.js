import { detectTransactionType, Transaction } from '../../src/eth_tx';
import {
	transactionType0x0,
	transactionType0x1,
	transactionType0x2,
	transactionTypeUndefined,
} from '../fixtures/detect_transaction_type';

describe('should override detectTransactionType method', () => {
	it('should return 42', () => {
		// @ts-expect-error - Purposefully not using transaction here,
		// but must be present to satisfy method signature
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const overrideFunction = (transaction: Transaction) => 42;
		expect(detectTransactionType(transactionTypeUndefined[0], overrideFunction)).toBe(42);
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
