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
		// TODO - Promise returned in function argument where a void return was expected
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		const intervalId = setInterval(async () => {
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
		}, web3Context.transactionReceiptPollingInterval ?? web3Context.transactionPollingInterval);
	});
}
