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
import { EthExecutionAPI, Bytes } from 'web3-types';
import { AsyncFunction, rejectIfTimeout } from 'web3-utils';

import { TransactionSendTimeoutError } from 'web3-errors';
import { NUMBER_DATA_FORMAT } from '../constants';
// eslint-disable-next-line import/no-cycle
import { rejectIfBlockTimeout } from './reject_if_block_timeout';
// eslint-disable-next-line import/no-cycle
import { getBlockNumber } from '../rpc_method_wrappers';

/**
 * An internal function to send a transaction or throws if sending did not finish during the timeout during the blocks-timeout.
 * @param web3Context the context to read the configurations from
 * @param sendTransactionFunc the function that will send the transaction (could be sendTransaction or sendRawTransaction)
 * @param transactionHash to be used inside the exception message if there will be any exceptions.
 * @returns the Promise<string> returned by the `sendTransactionFunc`.
 */
export async function trySendTransaction(
	web3Context: Web3Context<EthExecutionAPI>,
	sendTransactionFunc: AsyncFunction<string>,
	transactionHash?: Bytes,
): Promise<string> {
	const pollingInterval = web3Context.transactionPollingInterval;

	const [timeoutId, rejectOnTimeout] = rejectIfTimeout(
		web3Context.transactionSendTimeout,
		new TransactionSendTimeoutError({
			numberOfSeconds: web3Context.transactionSendTimeout / 1000,
			transactionHash,
		}),
	);

	const starterBlockNumber = await getBlockNumber(web3Context, NUMBER_DATA_FORMAT);
	const [intervalId, rejectOnBlockTimeout] = rejectIfBlockTimeout(
		web3Context,
		starterBlockNumber,
		pollingInterval,
		transactionHash,
	);

	try {
		return await Promise.race([sendTransactionFunc(), rejectOnTimeout, rejectOnBlockTimeout]);
	} finally {
		clearTimeout(timeoutId);
		clearInterval(intervalId);
	}
}
