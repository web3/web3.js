import { EthExecutionAPI, ReceiptInfo } from 'web3-common';
import { Web3Context } from 'web3-core';
import { HexString32Bytes } from 'web3-utils';

import { getTransactionReceipt } from '../rpc_methods';
import { TransactionPollingTimeoutError } from '../errors';

export const waitForTransactionReceipt = async (
	web3Context: Web3Context<EthExecutionAPI>,
	transactionHash: HexString32Bytes,
): Promise<ReceiptInfo> =>
	new Promise(resolve => {
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
					web3Context.requestManager,
					transactionHash,
				);

				if (response !== null) {
					clearInterval(intervalId);
					resolve(response);
				}
			})() as unknown;
		}, web3Context.transactionReceiptPollingInterval ?? web3Context.transactionPollingInterval);
	});
