import { EthExecutionAPI, PromiEvent, ReceiptInfo } from 'web3-common';
import { Web3Context } from 'web3-core';
import { HexString32Bytes, numberToHex } from 'web3-utils';

import {
	TransactionMissingReceiptOrBlockHashError,
	TransactionReceiptMissingBlockNumberError,
} from '../errors';
import { SendSignedTransactionEvents, SendTransactionEvents } from '../types';
import { getBlockByNumber } from '../rpc_methods';

export function watchTransactionForConfirmations<
	PromiEventEventType extends SendTransactionEvents | SendSignedTransactionEvents,
>(
	web3Context: Web3Context<EthExecutionAPI>,
	transactionPromiEvent: PromiEvent<ReceiptInfo, PromiEventEventType>,
	transactionReceipt: ReceiptInfo,
	transactionHash: HexString32Bytes,
) {
	if (
		transactionReceipt === undefined ||
		transactionReceipt === null ||
		transactionReceipt.blockHash === undefined ||
		transactionReceipt.blockHash === null
	)
		throw new TransactionMissingReceiptOrBlockHashError({
			receipt: transactionReceipt,
			blockHash: transactionReceipt.blockHash,
			transactionHash,
		});

	if (transactionReceipt.blockNumber === undefined || transactionReceipt.blockNumber === null)
		throw new TransactionReceiptMissingBlockNumberError({ receipt: transactionReceipt });

	// TODO - Should check: (web3Context.requestManager.provider as Web3BaseProvider).supportsSubscriptions
	// so a subscription for newBlockHeaders can be made instead of polling

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

			if (nextBlock?.hash !== null) {
				confirmationNumber += 1;
				transactionPromiEvent.emit('confirmation', {
					confirmationNumber,
					receipt: transactionReceipt,
					latestBlockHash: nextBlock.hash,
				});
			}
		})() as unknown;
	}, web3Context.transactionReceiptPollingInterval ?? web3Context.transactionPollingInterval);
}
