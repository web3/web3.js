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
	InvalidResponseError,
	TransactionOutOfGasError,
	TransactionRevertError,
} from 'web3-errors';
import { EthExecutionAPI, TransactionCall, TransactionReceipt } from 'web3-types';
import { DataFormat, DEFAULT_RETURN_FORMAT } from 'web3-utils';

// eslint-disable-next-line import/no-cycle
import { call } from '../rpc_method_wrappers';

export async function getRevertReason<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: TransactionCall,
	transactionReceipt: TransactionReceipt,
	returnFormat?: ReturnFormat,
): Promise<TransactionOutOfGasError | TransactionRevertError | void> {
	try {
		await call(
			web3Context,
			transaction,
			web3Context.defaultBlock,
			returnFormat ?? DEFAULT_RETURN_FORMAT,
		);
		return;
	} catch (error) {
		const _error = (error as InvalidResponseError).innerError as Error;
		if (_error?.message.match(/out of gas/i)) {
			throw new TransactionOutOfGasError(transactionReceipt);
		}

		throw new TransactionRevertError(error as string, undefined, transactionReceipt);
	}
}
