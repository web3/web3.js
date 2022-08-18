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
import { EthExecutionAPI, Bytes, TransactionReceipt } from 'web3-types';
import { Web3Context } from 'web3-core';
import { DataFormat, isNullish, waitWithTimeout } from 'web3-utils';

// eslint-disable-next-line import/no-cycle
import { getTransactionReceipt } from '../rpc_method_wrappers';
import { TransactionPollingTimeoutError } from '../errors';

export async function waitForTransactionReceipt<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transactionHash: Bytes,
	returnFormat: ReturnFormat,
): Promise<TransactionReceipt> {
	const pollingInterval =
		web3Context.transactionReceiptPollingInterval ?? web3Context.transactionPollingInterval;

	const awaitableTransactionReceipt: Promise<TransactionReceipt | undefined> = waitWithTimeout(
		getTransactionReceipt(web3Context, transactionHash, returnFormat),
		pollingInterval,
	);

	let intervalId: NodeJS.Timer | undefined;
	const polledTransactionReceipt = new Promise<TransactionReceipt>((resolve, reject) => {
		let transactionPollingDuration = 0;
		intervalId = setInterval(() => {
			(async () => {
				transactionPollingDuration += pollingInterval;

				if (transactionPollingDuration >= web3Context.transactionPollingTimeout) {
					clearInterval(intervalId);
					reject(
						new TransactionPollingTimeoutError({
							numberOfSeconds: web3Context.transactionPollingTimeout / 1000,
							transactionHash,
						}),
					);
					return;
				}

				const transactionReceipt: TransactionReceipt | undefined = await waitWithTimeout(
					getTransactionReceipt(web3Context, transactionHash, returnFormat),
					pollingInterval,
				);

				if (!isNullish(transactionReceipt)) {
					clearInterval(intervalId);
					resolve(transactionReceipt);
				}
			})() as unknown;
		}, pollingInterval);
	});

	// If the first call to ´getTransactionReceipt´ got the Transaction Receipt, return it
	const transactionReceipt = await awaitableTransactionReceipt;
	if (!isNullish(transactionReceipt)) {
		if (intervalId) {
			clearInterval(intervalId);
		}
		return transactionReceipt;
	}

	// Otherwise, try getting the Transaction Receipt by polling
	return polledTransactionReceipt;
}
