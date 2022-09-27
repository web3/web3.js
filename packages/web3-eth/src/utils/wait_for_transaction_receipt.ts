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
import { TransactionPollingTimeoutError } from 'web3-errors';
import { EthExecutionAPI, Bytes, TransactionReceipt } from 'web3-types';
import { DataFormat, rejectIfTimeout, pollTillDefined } from 'web3-utils';

import { NUMBER_DATA_FORMAT } from '../constants';
// eslint-disable-next-line import/no-cycle
import { resolveIfBlockTimeout } from './resolve_if_block_timeout';
// eslint-disable-next-line import/no-cycle
import { getBlockNumber, getTransactionReceipt } from '../rpc_method_wrappers';

export async function waitForTransactionReceipt<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transactionHash: Bytes,
	returnFormat: ReturnFormat,
): Promise<TransactionReceipt> {
	const pollingInterval =
		web3Context.transactionReceiptPollingInterval ?? web3Context.transactionPollingInterval;

	const awaitableTransactionReceipt: Promise<TransactionReceipt> = pollTillDefined(async () => {
		try {
			return getTransactionReceipt(web3Context, transactionHash, returnFormat);
		} catch (error) {
			console.warn('An error happen while trying to get the transaction receipt', error);
			return undefined;
		}
	}, pollingInterval);

	const [timeoutId, rejectOnTimeout]: [NodeJS.Timer, Promise<never>] = rejectIfTimeout(
		web3Context.transactionPollingTimeout,
		new TransactionPollingTimeoutError({
			numberOfSeconds: web3Context.transactionPollingTimeout / 1000,
			transactionHash,
		}),
	);

	const starterBlockNumber = await getBlockNumber(web3Context, NUMBER_DATA_FORMAT);
	const rejectOnBlockTimeout = resolveIfBlockTimeout(
		web3Context,
		starterBlockNumber,
		transactionHash,
	);

	try {
		const res = await Promise.race([
			awaitableTransactionReceipt,
			rejectOnTimeout,
			rejectOnBlockTimeout,
		]);
		if (res instanceof Array) {
			const [error, endExecutionFunc] = res;
			endExecutionFunc();
			throw error;
		} else {
			return res;
		}
	} finally {
		clearTimeout(timeoutId);
		// TODO: Refactor to call endExecutionFunc()
	}
}
