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

import { Web3Context } from 'web3-core';
import {
	TransactionRevertedWithoutReasonError,
	TransactionRevertInstructionError,
	TransactionRevertWithCustomError,
} from 'web3-errors';
import { ContractAbi, TransactionCall, TransactionReceipt } from 'web3-types';
import { DataFormat, FormatType } from 'web3-utils';
import { RevertReason, RevertReasonWithCustomError } from '../types';
// eslint-disable-next-line import/no-cycle
import { getRevertReason, parseTransactionError } from './get_revert_reason';

export async function getTransactionError<ReturnFormat extends DataFormat>(
	web3Context: Web3Context,
	transactionFormatted?: TransactionCall,
	transactionReceiptFormatted?: FormatType<TransactionReceipt, ReturnFormat>,
	receivedError?: unknown,
	contractAbi?: ContractAbi,
) {
	let reason: string | RevertReason | RevertReasonWithCustomError | undefined;

	if (receivedError !== undefined) {
		reason = parseTransactionError(receivedError);
	} else if (web3Context.handleRevert && transactionFormatted !== undefined) {
		reason = await getRevertReason(web3Context, transactionFormatted, contractAbi);
	}

	let error:
		| TransactionRevertedWithoutReasonError<FormatType<TransactionReceipt, ReturnFormat>>
		| TransactionRevertInstructionError<FormatType<TransactionReceipt, ReturnFormat>>
		| TransactionRevertWithCustomError<FormatType<TransactionReceipt, ReturnFormat>>;
	if (reason === undefined) {
		error = new TransactionRevertedWithoutReasonError<
			FormatType<TransactionReceipt, ReturnFormat>
		>(transactionReceiptFormatted);
	} else if (typeof reason === 'string') {
		error = new TransactionRevertInstructionError<FormatType<TransactionReceipt, ReturnFormat>>(
			reason,
			undefined,
			transactionReceiptFormatted,
		);
	} else if (
		(reason as RevertReasonWithCustomError).customErrorName !== undefined &&
		(reason as RevertReasonWithCustomError).customErrorDecodedSignature !== undefined &&
		(reason as RevertReasonWithCustomError).customErrorArguments !== undefined
	) {
		const _reason: RevertReasonWithCustomError = reason as RevertReasonWithCustomError;
		error = new TransactionRevertWithCustomError<FormatType<TransactionReceipt, ReturnFormat>>(
			_reason.reason,
			_reason.customErrorName,
			_reason.customErrorDecodedSignature,
			_reason.customErrorArguments,
			_reason.signature,
			transactionReceiptFormatted,
			_reason.data,
		);
	} else {
		error = new TransactionRevertInstructionError<FormatType<TransactionReceipt, ReturnFormat>>(
			reason.reason,
			reason.signature,
			transactionReceiptFormatted,
			reason.data,
		);
	}

	return error;
}
