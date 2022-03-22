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
