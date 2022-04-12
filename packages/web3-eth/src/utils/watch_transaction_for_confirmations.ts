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
					confirmationNumber: format({ eth: 'uint' }, confirmationNumber, returnFormat),
					receipt: transactionReceipt,
					latestBlockHash: format({ eth: 'bytes32' }, nextBlock.hash, returnFormat),
				});
			}
		})() as unknown;
	}, web3Context.transactionReceiptPollingInterval ?? web3Context.transactionPollingInterval);
}
