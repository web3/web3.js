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

import {
	bytesToBuffer,
	mergeDeep,
	DataFormat,
	DEFAULT_RETURN_FORMAT,
	format,
	FormatType,
} from 'web3-utils';
import { Transaction } from 'web3-types';
import { isNullish } from 'web3-validator';
import { TransactionDataAndInputError } from '../errors';
import { transactionSchema } from '../schemas';

export function formatTransaction<
	ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT,
	TransactionType extends Transaction = Transaction,
>(
	transaction: TransactionType,
	returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
): FormatType<TransactionType, ReturnFormat> {
	let formattedTransaction = mergeDeep({}, transaction as Record<string, unknown>) as Transaction;
	if (!isNullish(transaction?.common)) {
		formattedTransaction.common = { ...transaction.common };
		if (!isNullish(transaction.common?.customChain))
			formattedTransaction.common.customChain = { ...transaction.common.customChain };
	}

	formattedTransaction = format(transactionSchema, formattedTransaction, returnFormat);

	if (!isNullish(formattedTransaction.data) && !isNullish(formattedTransaction.input))
		throw new TransactionDataAndInputError({
			data: bytesToBuffer(formattedTransaction.data).toString('hex'),
			input: bytesToBuffer(formattedTransaction.input).toString('hex'),
		});
	else if (!isNullish(formattedTransaction.input)) {
		formattedTransaction.data = formattedTransaction.input;
		delete formattedTransaction.input;
	}

	return formattedTransaction as FormatType<TransactionType, ReturnFormat>;
}
