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
	BlockOutput,
	DataFormat,
	EthExecutionAPI,
	SubscriptionError,
	format,
	PromiEvent,
	Web3BaseProvider,
} from 'web3-common';
import { Web3Context } from 'web3-core';
import { Bytes, HexString32Bytes, numberToHex } from 'web3-utils';

import {
	TransactionMissingReceiptOrBlockHashError,
	TransactionReceiptMissingBlockNumberError,
} from '../errors';
import { ReceiptInfo, SendSignedTransactionEvents, SendTransactionEvents } from '../types';
import { getBlockByNumber } from '../rpc_methods';
import { NewHeadsSubscription } from '../web3_subscriptions';

type PromiEventEventTypeBase = SendTransactionEvents | SendSignedTransactionEvents;
type ReturnFormatBase = DataFormat;
type WaitProps<ResolveType = ReceiptInfo> = {
	web3Context: Web3Context<EthExecutionAPI>;
	transactionReceipt: ReceiptInfo;
	transactionPromiEvent: PromiEvent<ResolveType, PromiEventEventTypeBase>;
	returnFormat: ReturnFormatBase;
};

const watchByPolling = <ResolveType = ReceiptInfo>({
	web3Context,
	transactionReceipt,
	transactionPromiEvent,
	returnFormat,
}: WaitProps<ResolveType>) => {
	// Having a transactionReceipt means that the transaction has already been included
	// in at least one block, so we start with 1
	let confirmationNumber = 1;
	const intervalId = setInterval(() => {
		(async () => {
			if (confirmationNumber >= web3Context.transactionConfirmationBlocks)
				clearInterval(intervalId);

			const nextBlock = await getBlockByNumber(
				web3Context.requestManager,
				numberToHex(BigInt(transactionReceipt.blockNumber) + BigInt(confirmationNumber)),
				false,
			);

			if (nextBlock?.hash) {
				confirmationNumber += 1;
				transactionPromiEvent.emit('confirmation', {
					confirmationNumber: format({ eth: 'uint' }, confirmationNumber, returnFormat),
					receipt: transactionReceipt,
					latestBlockHash: format({ eth: 'bytes32' }, nextBlock.hash, returnFormat),
				});
			}
		})() as unknown;
	}, web3Context.transactionReceiptPollingInterval ?? web3Context.transactionPollingInterval);
};

const watchBySubscription = <ResolveType = ReceiptInfo>({
	web3Context,
	transactionReceipt,
	transactionPromiEvent,
	returnFormat,
}: WaitProps<ResolveType>) => {
	setImmediate(() => {
		web3Context.subscriptionManager
			?.subscribe('newHeads')
			.then((subscription: NewHeadsSubscription) => {
				subscription.on('data', async (data: BlockOutput) => {
					if (!data?.number) {
						return;
					}
					const confirmationNumber =
						BigInt(data.number) - BigInt(transactionReceipt.blockNumber) + BigInt(1);
					transactionPromiEvent.emit('confirmation', {
						confirmationNumber: format(
							{ eth: 'uint' },
							confirmationNumber,
							returnFormat,
						),
						receipt: transactionReceipt,
						latestBlockHash: format(
							{ eth: 'bytes32' },
							data.parentHash as HexString32Bytes,
							returnFormat,
						),
					});
					if (confirmationNumber >= web3Context.transactionConfirmationBlocks) {
						await subscription.unsubscribe();
					}
				});
				subscription.on('error', async () => {
					await subscription.unsubscribe();
					watchByPolling({
						web3Context,
						transactionReceipt,
						transactionPromiEvent,
						returnFormat,
					});
				});
			})
			.catch(() => {
				throw new SubscriptionError(
					`Failed to subscribe to new newBlockHeaders to confirmation. ${SubscriptionError.convertToString(
						transactionReceipt,
					)}`,
				);
			});
	});
};

export function watchTransactionForConfirmations<
	PromiEventEventType extends PromiEventEventTypeBase,
	ReturnFormat extends DataFormat,
	ResolveType = ReceiptInfo,
>(
	web3Context: Web3Context<EthExecutionAPI>,
	transactionPromiEvent: PromiEvent<ResolveType, PromiEventEventType>,
	transactionReceipt: ReceiptInfo,
	transactionHash: Bytes,
	returnFormat: ReturnFormat,
) {
	if (
		transactionReceipt === undefined ||
		transactionReceipt === null ||
		transactionReceipt.blockHash === undefined ||
		transactionReceipt.blockHash === null
	)
		throw new TransactionMissingReceiptOrBlockHashError({
			receipt: transactionReceipt,
			blockHash: format({ eth: 'bytes32' }, transactionReceipt.blockHash, returnFormat),
			transactionHash: format({ eth: 'bytes32' }, transactionHash, returnFormat),
		});

	if (!transactionReceipt.blockNumber)
		throw new TransactionReceiptMissingBlockNumberError({ receipt: transactionReceipt });

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
		watchByPolling({ web3Context, transactionReceipt, transactionPromiEvent, returnFormat });
	}
}
