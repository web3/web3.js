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

import { Transaction, DataFormat, DEFAULT_RETURN_FORMAT, FormatType } from 'web3-types';
import { isNullish, ValidationSchemaInput } from 'web3-validator';
import { TransactionDataAndInputError } from 'web3-errors';
import { mergeDeep, bytesToHex, format } from 'web3-utils';
import { transactionSchema } from '../schemas.js';

export function formatTransaction<
	ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT,
	TransactionType extends Transaction = Transaction,
>(
	transaction: TransactionType,
	returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	options: { transactionSchema: ValidationSchemaInput | typeof transactionSchema } = {
		transactionSchema,
	},
): FormatType<TransactionType, ReturnFormat> {
	let formattedTransaction = mergeDeep({}, transaction as Record<string, unknown>) as Transaction;
	if (!isNullish(transaction?.common)) {
		formattedTransaction.common = { ...transaction.common };
		if (!isNullish(transaction.common?.customChain))
			formattedTransaction.common.customChain = { ...transaction.common.customChain };
	}

	formattedTransaction = format(options.transactionSchema, formattedTransaction, returnFormat);

	if (!isNullish(formattedTransaction.data)) {
		if (
			!isNullish(formattedTransaction.input) &&
			formattedTransaction.data !== formattedTransaction.input
		)
			throw new TransactionDataAndInputError({
				data: bytesToHex(formattedTransaction.data),
				input: bytesToHex(formattedTransaction.input),
			});

		formattedTransaction.input = formattedTransaction.data;
	} else if (!isNullish(formattedTransaction.input)) {
		formattedTransaction.data = formattedTransaction.input;
	}

	if (!isNullish(formattedTransaction.gasLimit)) {
		formattedTransaction.gas = formattedTransaction.gasLimit;
		delete formattedTransaction.gasLimit;
	}

	return formattedTransaction as FormatType<TransactionType, ReturnFormat>;
}
