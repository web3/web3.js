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
