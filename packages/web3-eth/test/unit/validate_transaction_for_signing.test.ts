/* eslint-disable jest/no-conditional-expect */

import { InvalidTransactionObjectError } from '../../src/errors';
import { Transaction, validateTransactionForSigning } from '../../src/eth_tx';
import {
	invalidNonceOrChainIdData,
	invalidTransactionObject,
	validateChainInfoData,
	validateCustomChainInfoData,
	validateGasData,
} from '../fixtures/validate_transaction_for_signing';

describe('validateTransactionForSigning', () => {
	describe('should override validateTransactionForSigning method', () => {
		it('should return 42', () => {
			// @ts-expect-error - Purposefully not using transaction here,
			// but must be present to satisfy method signature
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const overrideFunction = (transaction: Transaction) => 42;
			expect(
				validateTransactionForSigning(invalidTransactionObject[0], overrideFunction),
			).toBe(42);
		});
	});

	describe('should throw InvalidTransactionObjectError', () => {
		it.each(invalidTransactionObject)('%s', transaction => {
			expect(() => validateTransactionForSigning(transaction)).toThrow(
				new InvalidTransactionObjectError(transaction),
			);
		});
	});

	describe('validateCustomChainInfo', () => {
		it.each(validateCustomChainInfoData)('%s should return %s', (transaction, output) => {
			if (output instanceof Error) {
				expect(() => validateTransactionForSigning(transaction)).toThrow(output);
			} else {
				expect(validateTransactionForSigning(transaction)).toBeUndefined();
			}
		});
	});

	describe('validateChainInfo', () => {
		it.each(validateChainInfoData)('%s should return %s', (transaction, output) => {
			if (output instanceof Error) {
				expect(() => validateTransactionForSigning(transaction)).toThrow(output);
			} else {
				expect(validateTransactionForSigning(transaction)).toBeUndefined();
			}
		});
	});

	describe('validateGas', () => {
		it.each(validateGasData)('%s should return %s', (transaction, output) => {
			if (output instanceof Error) {
				expect(() => validateTransactionForSigning(transaction)).toThrow(output);
			} else {
				expect(validateTransactionForSigning(transaction)).toBeUndefined();
			}
		});
	});

	describe('should throw InvalidNonceOrChainIdError', () => {
		it.each(invalidNonceOrChainIdData)('%s', (transaction, output) => {
			if (output instanceof Error) {
				expect(() => validateTransactionForSigning(transaction)).toThrow(output);
			} else {
				expect(validateTransactionForSigning(transaction)).toBeUndefined();
			}
		});
	});
});
