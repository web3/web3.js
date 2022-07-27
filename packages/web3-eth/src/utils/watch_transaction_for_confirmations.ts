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
import {
	Bytes,
	Numbers,
	EthExecutionAPI,
	Web3BaseProvider,
	BlockHeaderOutput,
	TransactionReceipt,
} from 'web3-types';
import { Web3Context, Web3PromiEvent } from 'web3-core';
import { DataFormat, format, numberToHex } from 'web3-utils';
import { isNullish } from 'web3-validator';

import {
	TransactionMissingReceiptOrBlockHashError,
	TransactionReceiptMissingBlockNumberError,
} from '../errors';
import { SendSignedTransactionEvents, SendTransactionEvents } from '../types';
import { getBlockByNumber } from '../rpc_methods';
import { NewHeadsSubscription } from '../web3_subscriptions';
import { transactionReceiptSchema } from '../schemas';

type Web3PromiEventEventTypeBase<ReturnFormat extends DataFormat> =
	| SendTransactionEvents<ReturnFormat>
	| SendSignedTransactionEvents<ReturnFormat>;

type WaitProps<ReturnFormat extends DataFormat, ResolveType = TransactionReceipt> = {
	web3Context: Web3Context<EthExecutionAPI>;
	transactionReceipt: TransactionReceipt;
	transactionPromiEvent: Web3PromiEvent<ResolveType, Web3PromiEventEventTypeBase<ReturnFormat>>;
	returnFormat: ReturnFormat;
};

const watchByPolling = <ReturnFormat extends DataFormat, ResolveType = TransactionReceipt>({
	web3Context,
	transactionReceipt,
	transactionPromiEvent,
	returnFormat,
}: WaitProps<ReturnFormat, ResolveType>) => {
	// Having a transactionReceipt means that the transaction has already been included
	// in at least one block, so we start with 1
	let confirmations = 1;
	const intervalId = setInterval(() => {
		(async () => {
			if (confirmations >= web3Context.transactionConfirmationBlocks)
				clearInterval(intervalId);

			const nextBlock = await getBlockByNumber(
				web3Context.requestManager,
				numberToHex(BigInt(transactionReceipt.blockNumber) + BigInt(confirmations)),
				false,
			);

			if (nextBlock?.hash) {
				confirmations += 1;

				transactionPromiEvent.emit('confirmation', {
					confirmations: format({ eth: 'uint' }, confirmations, returnFormat),
					receipt: format(transactionReceiptSchema, transactionReceipt, returnFormat),
					latestBlockHash: format(
						{ eth: 'bytes32' },
						nextBlock.hash as Bytes,
						returnFormat,
					),
				});
			}
		})() as unknown;
	}, web3Context.transactionReceiptPollingInterval ?? web3Context.transactionPollingInterval);
};

const watchBySubscription = <ReturnFormat extends DataFormat, ResolveType = TransactionReceipt>({
	web3Context,
	transactionReceipt,
	transactionPromiEvent,
	returnFormat,
}: WaitProps<ReturnFormat, ResolveType>) => {
	// The following variable will stay true except if the data arrived,
	//	or if watching started after an error had occurred.
	let needToWatchLater = true;
	setImmediate(() => {
		web3Context.subscriptionManager
			?.subscribe('newHeads')
			.then((subscription: NewHeadsSubscription) => {
				subscription.on('data', async (newBlockHeader: BlockHeaderOutput) => {
					needToWatchLater = false;
					if (!newBlockHeader?.number) {
						return;
					}
					const confirmations =
						BigInt(newBlockHeader.number) -
						BigInt(transactionReceipt.blockNumber) +
						BigInt(1);

					transactionPromiEvent.emit('confirmation', {
						confirmations: format(
							{ eth: 'uint' },
							confirmations as Numbers,
							returnFormat,
						),
						receipt: format(transactionReceiptSchema, transactionReceipt, returnFormat),
						latestBlockHash: format(
							{ eth: 'bytes32' },
							newBlockHeader.parentHash as Bytes,
							returnFormat,
						),
					});
					if (confirmations >= web3Context.transactionConfirmationBlocks) {
						await subscription.unsubscribe();
					}
				});
				subscription.on('error', async () => {
					await subscription.unsubscribe();

					needToWatchLater = false;
					watchByPolling({
						web3Context,
						transactionReceipt,
						transactionPromiEvent,
						returnFormat,
					});
				});
			})
			.catch(() => {
				needToWatchLater = false;
				watchByPolling({
					web3Context,
					transactionReceipt,
					transactionPromiEvent,
					returnFormat,
				});
			});
	});

	// Fallback to polling if tx receipt didn't arrived in "blockHeaderTimeout" [10 seconds]
	setTimeout(() => {
		if (needToWatchLater) {
			watchByPolling({
				web3Context,
				transactionReceipt,
				transactionPromiEvent,
				returnFormat,
			});
		}
	}, web3Context.blockHeaderTimeout * 1000);
};

export function watchTransactionForConfirmations<
	ReturnFormat extends DataFormat,
	Web3PromiEventEventType extends Web3PromiEventEventTypeBase<ReturnFormat>,
	ResolveType = TransactionReceipt,
>(
	web3Context: Web3Context<EthExecutionAPI>,
	transactionPromiEvent: Web3PromiEvent<ResolveType, Web3PromiEventEventType>,
	transactionReceipt: TransactionReceipt,
	transactionHash: Bytes,
	returnFormat: ReturnFormat,
) {
	if (isNullish(transactionReceipt) || isNullish(transactionReceipt.blockHash))
		throw new TransactionMissingReceiptOrBlockHashError({
			receipt: transactionReceipt,
			blockHash: format({ eth: 'bytes32' }, transactionReceipt.blockHash, returnFormat),
			transactionHash: format({ eth: 'bytes32' }, transactionHash, returnFormat),
		});

	if (!transactionReceipt.blockNumber)
		throw new TransactionReceiptMissingBlockNumberError({ receipt: transactionReceipt });

	// As we have the receipt, it's the first confirmation that tx is accepted.
	transactionPromiEvent.emit('confirmation', {
		confirmations: format({ eth: 'uint' }, 1, returnFormat),
		receipt: format(transactionReceiptSchema, transactionReceipt, returnFormat),
		latestBlockHash: format({ eth: 'bytes32' }, transactionReceipt.blockHash, returnFormat),
	});

	// so a subscription for newBlockHeaders can be made instead of polling
	const provider: Web3BaseProvider = web3Context.requestManager.provider as Web3BaseProvider;
	if (provider.supportsSubscriptions()) {
		watchBySubscription({
			web3Context,
			transactionReceipt,
			transactionPromiEvent,
			returnFormat,
		});
	} else {
		watchByPolling({
			web3Context,
			transactionReceipt,
			transactionPromiEvent,
			returnFormat,
		});
	}
}
