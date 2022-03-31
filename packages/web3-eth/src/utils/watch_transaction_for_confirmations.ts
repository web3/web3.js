import { DataFormat, EthExecutionAPI, format, PromiEvent } from 'web3-common';
import { Web3Context } from 'web3-core';
import { Bytes, numberToHex } from 'web3-utils';

import {
	TransactionMissingReceiptOrBlockHashError,
	TransactionReceiptMissingBlockNumberError,
} from '../errors';
import { ReceiptInfo, SendSignedTransactionEvents, SendTransactionEvents } from '../types';
import { getBlockByNumber } from '../rpc_methods';

export function watchTransactionForConfirmations<
	PromiEventEventType extends SendTransactionEvents | SendSignedTransactionEvents,
	ReturnFormat extends DataFormat,
>(
	web3Context: Web3Context<EthExecutionAPI>,
	transactionPromiEvent: PromiEvent<ReceiptInfo, PromiEventEventType>,
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

	if (transactionReceipt.blockNumber === undefined || transactionReceipt.blockNumber === null)
		throw new TransactionReceiptMissingBlockNumberError({ receipt: transactionReceipt });

	// TODO - Should check: (web3Context.requestManager.provider as Web3BaseProvider).supportsSubscriptions
	// so a subscription for newBlockHeaders can be made instead of polling

	// Having a transactionReceipt means that the transaction has already been included
	// in at least one block, so we start with 1
	let confirmationNumber = 1;
	// TODO - Promise returned in function argument where a void return was expected
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	const intervalId = setInterval(async () => {
		if (confirmationNumber >= web3Context.transactionConfirmationBlocks) {
			clearInterval(intervalId);
		}

		const nextBlock = await getBlockByNumber(
			web3Context.requestManager,
			numberToHex(BigInt(transactionReceipt.blockNumber) + BigInt(confirmationNumber)),
			false,
		);

		if (nextBlock?.hash !== null) {
			confirmationNumber += 1;
			transactionPromiEvent.emit('confirmation', {
				confirmationNumber: format({ eth: 'uint' }, confirmationNumber, returnFormat),
				receipt: transactionReceipt,
				latestBlockHash: format({ eth: 'bytes32' }, nextBlock.hash, returnFormat),
			});
		}
	}, web3Context.transactionReceiptPollingInterval ?? web3Context.transactionPollingInterval);
}
