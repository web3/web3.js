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
import { DataFormat, EthExecutionAPI } from 'web3-common';
import { Web3Context } from 'web3-core';
import { Bytes } from 'web3-utils';

import { ReceiptInfo } from '../types';
// eslint-disable-next-line import/no-cycle
import { getTransactionReceipt } from '../rpc_method_wrappers';
import { TransactionPollingTimeoutError } from '../errors';

export async function waitForTransactionReceipt<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transactionHash: Bytes,
	returnFormat: ReturnFormat,
): Promise<ReceiptInfo> {
	return new Promise(resolve => {
		let transactionPollingDuration = 0;
		const intervalId = setInterval(() => {
			(async () => {
				transactionPollingDuration +=
					web3Context.transactionReceiptPollingInterval ??
					web3Context.transactionPollingInterval;

				if (transactionPollingDuration >= web3Context.transactionPollingTimeout) {
					clearInterval(intervalId);
					throw new TransactionPollingTimeoutError({
						numberOfSeconds: web3Context.transactionPollingTimeout / 1000,
						transactionHash,
					});
				}

				const response = await getTransactionReceipt(
					web3Context,
					transactionHash,
					returnFormat,
				);

				if (response !== null) {
					clearInterval(intervalId);
					resolve(response);
				}
			})() as unknown;
		}, web3Context.transactionReceiptPollingInterval ?? web3Context.transactionPollingInterval);
	});
}
