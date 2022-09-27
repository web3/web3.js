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
import { EthExecutionAPI, Bytes, Web3BaseProvider, BlockHeaderOutput } from 'web3-types';
import { Web3Context } from 'web3-core';
import { rejectIfConditionAtInterval } from 'web3-utils';

import { TransactionBlockTimeoutError } from 'web3-errors';
import { NUMBER_DATA_FORMAT } from '../constants';
// eslint-disable-next-line import/no-cycle
import { getBlockNumber } from '../rpc_method_wrappers';
import { NewHeadsSubscription } from '../web3_subscriptions';

async function resolveByPolling(
	web3Context: Web3Context<EthExecutionAPI>,
	starterBlockNumber: number,
	transactionHash?: Bytes,
): Promise<[Error, () => void]> {
	const pollingInterval = web3Context.transactionPollingInterval;
	const [intervalId, promiseToError]: [NodeJS.Timer, Promise<Error>] =
		rejectIfConditionAtInterval(async () => {
			let lastBlockNumber;
			try {
				lastBlockNumber = await getBlockNumber(web3Context, NUMBER_DATA_FORMAT);
			} catch (error) {
				// console.warn('An error happen while trying to get the block number', error);
				return undefined;
			}
			const numberOfBlocks = lastBlockNumber - starterBlockNumber;
			if (numberOfBlocks >= web3Context.transactionBlockTimeout) {
				return new TransactionBlockTimeoutError({
					starterBlockNumber,
					numberOfBlocks,
					transactionHash,
				});
			}
			return undefined;
		}, pollingInterval);
	const endExecution = () => {
		clearInterval(intervalId);
	};

	return [await promiseToError, endExecution];
}

async function resolveBySubscription(
	web3Context: Web3Context<EthExecutionAPI>,
	starterBlockNumber: number,
	transactionHash?: Bytes,
): Promise<[Error, () => void]> {
	// The following variable will stay true except if the data arrived,
	//	or if watching started after an error had occurred.
	let needToWatchLater = true;
	// TODO: put in try/catch
	const subscription: NewHeadsSubscription = (await web3Context.subscriptionManager?.subscribe(
		'newHeads',
	)) as unknown as NewHeadsSubscription;
	const res: Promise<[Error, () => void]> = new Promise(resolve => {
		try {
			subscription.on('data', (lastBlockHeader: BlockHeaderOutput) => {
				needToWatchLater = false;
				if (!lastBlockHeader?.number) {
					return;
				}
				const numberOfBlocks = Number(
					BigInt(lastBlockHeader.number) - BigInt(starterBlockNumber),
				);

				if (numberOfBlocks >= web3Context.transactionBlockTimeout) {
					resolve([
						new TransactionBlockTimeoutError({
							starterBlockNumber,
							numberOfBlocks,
							transactionHash,
						}),
						async () => {
							try {
								console.warn('ending subscription');
								await subscription?.unsubscribe();
							} catch (err) {
								// do nothing
							}
						},
					]);
				}
			});
			subscription.on('error', async error => {
				console.warn('error happened at subscription revert to polling...', error);
				try {
					await subscription?.unsubscribe();
				} catch (err) {
					// do nothing
				}

				needToWatchLater = false;
				resolve(resolveByPolling(web3Context, starterBlockNumber, transactionHash));
			});
		} catch (error) {
			console.warn('error happened at subscription revert to polling...', error);
			if (subscription) {
				try {
					await subscription?.unsubscribe();
				} catch (err) {
					// do nothing
				}
			}

			needToWatchLater = false;
			resolve(resolveByPolling(web3Context, starterBlockNumber, transactionHash));
		}

		// Fallback to polling if tx receipt didn't arrived in "blockHeaderTimeout" [10 seconds]
		setTimeout(() => {
			if (needToWatchLater) {
				console.warn(
					'blockHeaderTimeout reached without getting the blocks by subscription. Try by polling',
				);
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				subscription?.unsubscribe();
				resolve(resolveByPolling(web3Context, starterBlockNumber, transactionHash));
			}
		}, web3Context.blockHeaderTimeout * 1000);
	});

	return res;
}

/* TODO: After merge, there will be constant block mining time (exactly 12 second each block, except slot missed that currently happens in <1% of slots. ) so we can optimize following function
for POS NWs, we can skip checking getBlockNumber(); after interval and calculate only based on time  that certain num of blocked are mined after that for internal double check, can do one getBlockNumber() call and timeout. 
*/
export async function resolveIfBlockTimeout(
	web3Context: Web3Context<EthExecutionAPI>,
	starterBlockNumber: number,
	transactionHash?: Bytes,
): Promise<[Error, () => void]> {
	const provider: Web3BaseProvider = web3Context.requestManager.provider as Web3BaseProvider;
	let callingRes;
	if (provider.supportsSubscriptions()) {
		callingRes = await resolveBySubscription(web3Context, starterBlockNumber, transactionHash);
	} else {
		callingRes = await resolveByPolling(web3Context, starterBlockNumber, transactionHash);
	}
	const [error, resourceReleaseFunc] = callingRes;
	resourceReleaseFunc();
	throw error;
}
