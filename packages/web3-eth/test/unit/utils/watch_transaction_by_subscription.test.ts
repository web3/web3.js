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
import { Web3Context, Web3RequestManager } from 'web3-core';
import { format } from 'web3-utils';
import { DEFAULT_RETURN_FORMAT, JsonRpcResponseWithResult, Web3EthExecutionAPI } from 'web3-types';
import { ethRpcMethods } from 'web3-rpc-methods';
import { WebSocketProvider } from 'web3-providers-ws';
import * as rpcMethodWrappers from '../../../src/rpc_method_wrappers';
import * as WatchTransactionBySubscription from '../../../src/utils/watch_transaction_by_subscription';
import {
	expectedTransactionReceipt,
	expectedTransactionHash,
	testData,
} from '../rpc_method_wrappers/fixtures/send_signed_transaction';
import { transactionReceiptSchema } from '../../../src/schemas';
import { registeredSubscriptions } from '../../../src';

jest.mock('web3-rpc-methods');
jest.mock('web3-providers-ws');
jest.mock('../../../src/utils/watch_transaction_by_polling');

const testMessage =
	'Title: %s\ninputSignedTransaction: %s\nexpectedTransactionHash: %s\nexpectedTransactionReceipt: %s\n';

async function waitUntilCalled(mock: jest.Mock, timeout = 1000): Promise<jest.Mock> {
	return new Promise((resolve, reject) => {
		let timeoutId: NodeJS.Timeout | undefined;
		const intervalId = setInterval(() => {
			if (mock.mock.calls.length > 0) {
				clearInterval(intervalId);
				if (timeoutId) {
					clearTimeout(timeoutId);
				}
				resolve(mock);
			}
		}, 100);
		timeoutId = setTimeout(() => {
			clearInterval(intervalId);
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			reject(new Error('timeout'));
		}, timeout);
	});
}

describe('watchTransactionBySubscription', () => {
	describe('should revert to polling in cases where getting by subscription did not workout', () => {
		let web3Context: Web3Context<Web3EthExecutionAPI>;

		beforeEach(() => {
			jest.spyOn(Web3RequestManager.prototype, 'send').mockImplementation(async () => {
				return {} as Promise<unknown>;
			});
			jest.spyOn(WebSocketProvider.prototype, 'request').mockImplementation(async () => {
				return {} as Promise<JsonRpcResponseWithResult<unknown>>;
			});

			(ethRpcMethods.sendRawTransaction as jest.Mock).mockResolvedValue(
				expectedTransactionHash,
			);
			(ethRpcMethods.getTransactionReceipt as jest.Mock).mockResolvedValue(
				expectedTransactionHash,
			);
			web3Context = new Web3Context({
				// dummy provider that does supports subscription
				provider: new WebSocketProvider('ws://localhost:8546'),
				registeredSubscriptions,
			});
			(web3Context.provider as any).supportsSubscriptions = () => true;
		});
		afterEach(() => {
			// to clear the interval inside the subscription function:
			web3Context.transactionConfirmationBlocks = 0;
		});
		let counter = 0;
		it.each(testData)(
			`should call getBlockNumber if blockHeaderTimeout reached\n ${testMessage}`,
			async (_, inputTransaction) => {
				if (counter > 0) {
					return;
				}
				counter += 1;
				const formattedTransactionReceipt = format(
					transactionReceiptSchema,
					expectedTransactionReceipt,
					DEFAULT_RETURN_FORMAT,
				);

				web3Context.enableExperimentalFeatures.useSubscriptionWhenCheckingBlockTimeout =
					true;
				// this will case the function to revert to polling:
				web3Context.blockHeaderTimeout = 0;

				web3Context.transactionSendTimeout = 2;

				const promiEvent = rpcMethodWrappers.sendSignedTransaction(
					web3Context,
					inputTransaction,
					DEFAULT_RETURN_FORMAT,
				);
				// await promiEvent;
				WatchTransactionBySubscription.watchTransactionBySubscription({
					web3Context,
					transactionReceipt: formattedTransactionReceipt,
					transactionPromiEvent: promiEvent,
					returnFormat: DEFAULT_RETURN_FORMAT,
				});
				await waitUntilCalled(ethRpcMethods.getBlockNumber as jest.Mock, 5000);

				await promiEvent;
			},
			60000,
		);
	});
});
