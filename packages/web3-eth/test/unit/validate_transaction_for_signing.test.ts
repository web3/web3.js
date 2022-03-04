/* eslint-disable jest/no-conditional-expect */

import { InvalidTransactionObjectError } from '../../src/errors';
import { validateTransactionForSigning } from '../../src/validation';
import {
	invalidNonceOrChainIdData,
	invalidTransactionObject,
	validateChainInfoData,
	validateCustomChainInfoData,
	validateGasData,
} from '../fixtures/validate_transaction_for_signing';

describe('validateTransactionForSigning', () => {
	describe('should override validateTransactionForSigning method', () => {
		it('should call override method', () => {
			const overrideFunction = jest.fn();
			validateTransactionForSigning(invalidTransactionObject[0], overrideFunction);
			expect(overrideFunction).toHaveBeenCalledWith(invalidTransactionObject[0]);
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
