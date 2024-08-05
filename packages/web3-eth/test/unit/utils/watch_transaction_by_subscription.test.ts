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
import { DEFAULT_RETURN_FORMAT, Web3EthExecutionAPI } from 'web3-types';
import WebSocketProvider from 'web3-providers-ws';

import * as rpcMethodWrappers from '../../../src/rpc_method_wrappers';
import {
	expectedTransactionReceipt,
	expectedTransactionHash,
	testData,
} from '../rpc_method_wrappers/fixtures/send_signed_transaction';
import { blockMockResult } from '../../fixtures/transactions_data';

jest.mock('web3-providers-ws');

const testMessage =
	'Title: %s\ninputSignedTransaction: %s\nexpectedTransactionHash: %s\nexpectedTransactionReceipt: %s\n';

describe('watchTransactionBySubscription', () => {
	const CONFIRMATION_BLOCKS = 5;
	describe('should revert to polling in cases where getting by subscription did not workout', () => {
		let web3Context: Web3Context<Web3EthExecutionAPI>;

		beforeEach(() => {
			web3Context = new Web3Context({
				provider: new WebSocketProvider('wss://localhost:8546'),
			});

			(web3Context.provider as any).supportsSubscriptions = () => true;
			web3Context.transactionConfirmationBlocks = CONFIRMATION_BLOCKS;
			web3Context.enableExperimentalFeatures.useSubscriptionWhenCheckingBlockTimeout = true;
		});

		it.each(testData)(
			`should call getBlockByNumber if blockHeaderTimeout reached\n ${testMessage}`,
			async (_, inputTransaction) => {
				let blockNum = 100;
				let ethGetBlockByNumberCount = 0;
				web3Context.requestManager.send = jest.fn(async request => {
					if (request.method === 'eth_getBlockByNumber') {
						ethGetBlockByNumberCount += 1;
						return Promise.resolve({
							...blockMockResult.result,
							number: (request as any).params[0],
						});
					}
					if (request.method === 'eth_call') {
						return Promise.resolve('0x');
					}
					if (request.method === 'eth_blockNumber') {
						blockNum += 1;
						return Promise.resolve(blockNum.toString(16));
					}
					if (request.method === 'eth_sendRawTransaction') {
						return Promise.resolve(expectedTransactionHash);
					}
					if (request.method === 'eth_getTransactionReceipt') {
						return Promise.resolve(expectedTransactionReceipt);
					}

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.reject(new Error('Unknown Request')) as any;
				});

				const promiEvent = rpcMethodWrappers.sendSignedTransaction(
					web3Context,
					inputTransaction,
					DEFAULT_RETURN_FORMAT,
				);

				let confirmationsCount = 0;
				const confirmationPromise = new Promise<void>((resolve, reject) => {
					const handleConfirmation = (confirmation: { confirmations: bigint }) => {
						confirmationsCount += 1;

						if (confirmation.confirmations >= CONFIRMATION_BLOCKS) {
							resolve();
						}
					};

					const handleError = (_error: any) => {
						reject();
					};

					promiEvent
						.on('confirmation', handleConfirmation)
						.on('error', handleError)
						.then(res => {
							// eslint-disable-next-line jest/no-conditional-expect
							expect(res).toBeDefined();
						})
						.catch(reject);
				});

				// Wait for the confirmationPromise to resolve or timeout after 5 seconds
				let timeoutId;
				const timeout = new Promise((_res, reject) => {
					timeoutId = setTimeout(
						() => reject(new Error('Timeout waiting for confirmations')),
						500000,
					);
				});

				await Promise.race([confirmationPromise, timeout]);

				clearTimeout(timeoutId);

				expect(confirmationsCount).toBe(CONFIRMATION_BLOCKS);
				expect(ethGetBlockByNumberCount).toBe(CONFIRMATION_BLOCKS - 1); // means polling called getblock 4 times as first confirmation is receipt it self
			},
		);
	});
});
