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
