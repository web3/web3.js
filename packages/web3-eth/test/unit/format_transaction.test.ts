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
import { DEFAULT_RETURN_FORMAT, FMT_BYTES, FMT_NUMBER, Transaction } from 'web3-types';
import { TransactionDataAndInputError } from 'web3-errors';

import { formatTransaction } from '../../src/utils/format_transaction';
import {
	bytesAsHexStringTransaction,
	numbersAsBigIntTransaction,
	numbersAsHexStringTransaction,
	numbersAsStringTransaction,
	numbersAsNumberTransaction,
	bytesAsUint8ArrayTransaction,
} from '../fixtures/format_transaction';

const transactionsDataForNumberTypes: Record<FMT_NUMBER, Record<string, unknown>> = {
	[FMT_NUMBER.BIGINT]: numbersAsBigIntTransaction,
	[FMT_NUMBER.HEX]: numbersAsHexStringTransaction,
	[FMT_NUMBER.NUMBER]: numbersAsNumberTransaction,
	[FMT_NUMBER.STR]: numbersAsStringTransaction,
};

const transactionsDataForByteTypes: Record<FMT_BYTES, Record<string, unknown>> = {
	[FMT_BYTES.HEX]: bytesAsHexStringTransaction,
	[FMT_BYTES.UINT8ARRAY]: bytesAsUint8ArrayTransaction,
};

describe('formatTransaction', () => {
	it.skip('should call override method', () => {
		const overrideFunction = jest.fn();
		formatTransaction(numbersAsHexStringTransaction, DEFAULT_RETURN_FORMAT);
		expect(overrideFunction).toHaveBeenCalledWith(numbersAsHexStringTransaction);
	});

	describe('numbers fields', () => {
		for (const sourceType of Object.keys(transactionsDataForNumberTypes)) {
			for (const destinationType of Object.keys(transactionsDataForNumberTypes)) {
				it(`should convert "${sourceType}" properties to "${destinationType}"`, () => {
					// formatTransaction replaces gasLimit with gas property to follow ETH spec
					// https://github.com/ethereum/execution-apis/issues/283
					const expectedFormattedTransaction =
						transactionsDataForNumberTypes[destinationType as FMT_NUMBER];
					delete expectedFormattedTransaction.gasLimit;
					// formatTransaction replaces data with input to follow ETH spec
					delete expectedFormattedTransaction.data;

					expect(
						formatTransaction(
							transactionsDataForNumberTypes[sourceType as FMT_NUMBER],
							{
								...DEFAULT_RETURN_FORMAT,
								number: destinationType as FMT_NUMBER,
							},
						),
					).toStrictEqual(expectedFormattedTransaction);
				});
			}
		}
	});

	describe('bytes fields', () => {
		for (const sourceType of Object.keys(transactionsDataForByteTypes)) {
			for (const destinationType of Object.keys(transactionsDataForByteTypes)) {
				it(`should convert "${sourceType}" properties to "${destinationType}"`, () => {
					// formatTransaction replaces gasLimit with gas property to follow ETH spec
					// https://github.com/ethereum/execution-apis/issues/283
					const expectedFormattedTransaction =
						transactionsDataForByteTypes[destinationType as FMT_BYTES];
					delete expectedFormattedTransaction.gasLimit;
					// formatTransaction replaces data with input to follow ETH spec
					delete expectedFormattedTransaction.data;

					expect(
						formatTransaction(transactionsDataForByteTypes[sourceType as FMT_BYTES], {
							...DEFAULT_RETURN_FORMAT,
							bytes: destinationType as FMT_BYTES,
						}),
					).toStrictEqual(expectedFormattedTransaction);
				});
			}
		}
	});

	it('Should throw a TransactionDataAndInputError error', () => {
		const transaction: Transaction = {
			data: '0x00',
			input: '0x01',
		};

		expect(() => formatTransaction(transaction)).toThrow(
			new TransactionDataAndInputError({
				data: transaction.data as string,
				input: transaction.input as string,
			}),
		);
	});
});
