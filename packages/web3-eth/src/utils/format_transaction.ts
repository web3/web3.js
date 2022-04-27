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

import { DataFormat, DEFAULT_RETURN_FORMAT, format, FormatType } from 'web3-common';
import { bytesToBuffer, mergeDeep } from 'web3-utils';
import { TransactionDataAndInputError } from '../errors';
import { transactionSchema } from '../schemas';
import { Transaction } from '../types';

export function formatTransaction<
	ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT,
	TransactionType extends Transaction = Transaction,
>(
	transaction: TransactionType,
	returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
): FormatType<TransactionType, ReturnFormat> {
	let formattedTransaction = mergeDeep({}, transaction as Record<string, unknown>) as Transaction;
	if (transaction?.common !== undefined) {
		formattedTransaction.common = { ...transaction.common };
		if (transaction.common?.customChain !== undefined)
			formattedTransaction.common.customChain = { ...transaction.common.customChain };
	}

	formattedTransaction = format(transactionSchema, formattedTransaction, returnFormat);

	if (formattedTransaction.data !== undefined && formattedTransaction.input !== undefined)
		throw new TransactionDataAndInputError({
			data: bytesToBuffer(formattedTransaction.data).toString('hex'),
			input: bytesToBuffer(formattedTransaction.input).toString('hex'),
		});
	else if (formattedTransaction.input !== undefined) {
		formattedTransaction.data = formattedTransaction.input;
		delete formattedTransaction.input;
	}

	return formattedTransaction as FormatType<TransactionType, ReturnFormat>;
}
