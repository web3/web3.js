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

// Disabling because returnTypes must be last param to match 1.x params
/* eslint-disable default-param-last */
import {
	DataFormat,
	EthExecutionAPI,
	format,
	PromiEvent,
	FMT_BYTES,
	FMT_NUMBER,
	DEFAULT_RETURN_FORMAT,
	TransactionInfo,
	TransactionWithSender,
} from 'web3-common';
import { Web3Context } from 'web3-core';
import { Address, BlockTag, BlockNumberOrTag, Bytes, Filter, HexString, Numbers } from 'web3-utils';
import { isBlockTag, isBytes } from 'web3-validator';
import { SignatureError } from './errors';
import * as rpcMethods from './rpc_methods';
import {
	accountSchema,
	blockSchema,
	feeHistorySchema,
	logSchema,
	receiptInfoSchema,
	transactionInfoSchema,
} from './schemas';
import {
	AccountObject,
	Block,
	FeeHistory,
	Log,
	ReceiptInfo,
	SendSignedTransactionEvents,
	SendTransactionEvents,
	SendTransactionOptions,
	Transaction,
	TransactionCall,
} from './types';
import { formatTransaction } from './utils/format_transaction';
// eslint-disable-next-line import/no-cycle
import { getTransactionGasPricing } from './utils/get_transaction_gas_pricing';
// eslint-disable-next-line import/no-cycle
import { waitForTransactionReceipt } from './utils/wait_for_transaction_receipt';
import { watchTransactionForConfirmations } from './utils/watch_transaction_for_confirmations';
import { Web3EthExecutionAPI } from './web3_eth_execution_api';

export const getProtocolVersion = async (web3Context: Web3Context<EthExecutionAPI>) =>
	rpcMethods.getProtocolVersion(web3Context.requestManager);

export const isSyncing = async (web3Context: Web3Context<EthExecutionAPI>) =>
	rpcMethods.getSyncing(web3Context.requestManager);

export const getCoinbase = async (web3Context: Web3Context<EthExecutionAPI>) =>
	rpcMethods.getCoinbase(web3Context.requestManager);

export const isMining = async (web3Context: Web3Context<EthExecutionAPI>) =>
	rpcMethods.getMining(web3Context.requestManager);

export async function getHashRate<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getHashRate(web3Context.requestManager);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

export async function getGasPrice<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getGasPrice(web3Context.requestManager);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

export async function getBlockNumber<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getBlockNumber(web3Context.requestManager);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

export async function getBalance<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	address: Address,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, DEFAULT_RETURN_FORMAT);
	const response = await rpcMethods.getBalance(
		web3Context.requestManager,
		address,
		blockNumberFormatted,
	);
	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

export async function getStorageAt<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	address: Address,
	storageSlot: Numbers,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const storageSlotFormatted = format({ eth: 'uint' }, storageSlot, DEFAULT_RETURN_FORMAT);
	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, DEFAULT_RETURN_FORMAT);
	const response = await rpcMethods.getStorageAt(
		web3Context.requestManager,
		address,
		storageSlotFormatted,
		blockNumberFormatted,
	);
	return format({ eth: 'bytes' }, response, returnFormat);
}

export async function getCode<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	address: Address,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, DEFAULT_RETURN_FORMAT);
	const response = await rpcMethods.getCode(
		web3Context.requestManager,
		address,
		blockNumberFormatted,
	);
	return format({ eth: 'bytes' }, response, returnFormat);
}

export async function getBlock<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	hydrated = false,
	returnFormat: ReturnFormat,
) {
	let response;
	if (isBytes(block)) {
		const blockHashFormatted = format({ eth: 'bytes32' }, block, DEFAULT_RETURN_FORMAT);
		response = await rpcMethods.getBlockByHash(
			web3Context.requestManager,
			blockHashFormatted as HexString,
			hydrated,
		);
	} else {
		const blockNumberFormatted = isBlockTag(block as string)
			? (block as BlockTag)
			: format({ eth: 'uint' }, block as Numbers, DEFAULT_RETURN_FORMAT);
		response = await rpcMethods.getBlockByNumber(
			web3Context.requestManager,
			blockNumberFormatted,
			hydrated,
		);
	}

	return format(blockSchema, response as unknown as Block, returnFormat);
}

export async function getBlockTransactionCount<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	let response;
	if (isBytes(block)) {
		const blockHashFormatted = format({ eth: 'bytes32' }, block, DEFAULT_RETURN_FORMAT);
		response = await rpcMethods.getBlockTransactionCountByHash(
			web3Context.requestManager,
			blockHashFormatted as HexString,
		);
	} else {
		const blockNumberFormatted = isBlockTag(block as string)
			? (block as BlockTag)
			: format({ eth: 'uint' }, block as Numbers, DEFAULT_RETURN_FORMAT);
		response = await rpcMethods.getBlockTransactionCountByNumber(
			web3Context.requestManager,
			blockNumberFormatted,
		);
	}

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

export async function getBlockUncleCount<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	let response;
	if (isBytes(block)) {
		const blockHashFormatted = format({ eth: 'bytes32' }, block, DEFAULT_RETURN_FORMAT);
		response = await rpcMethods.getUncleCountByBlockHash(
			web3Context.requestManager,
			blockHashFormatted as HexString,
		);
	} else {
		const blockNumberFormatted = isBlockTag(block as string)
			? (block as BlockTag)
			: format({ eth: 'uint' }, block as Numbers, DEFAULT_RETURN_FORMAT);
		response = await rpcMethods.getUncleCountByBlockNumber(
			web3Context.requestManager,
			blockNumberFormatted,
		);
	}

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

export async function getUncle<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	uncleIndex: Numbers,
	returnFormat: ReturnFormat,
) {
	const uncleIndexFormatted = format({ eth: 'uint' }, uncleIndex, DEFAULT_RETURN_FORMAT);

	let response;
	if (isBytes(block)) {
		const blockHashFormatted = format({ eth: 'bytes32' }, block, DEFAULT_RETURN_FORMAT);
		response = await rpcMethods.getUncleByBlockHashAndIndex(
			web3Context.requestManager,
			blockHashFormatted as HexString,
			uncleIndexFormatted,
		);
	} else {
		const blockNumberFormatted = isBlockTag(block as string)
			? (block as BlockTag)
			: format({ eth: 'uint' }, block as Numbers, DEFAULT_RETURN_FORMAT);
		response = await rpcMethods.getUncleByBlockNumberAndIndex(
			web3Context.requestManager,
			blockNumberFormatted,
			uncleIndexFormatted,
		);
	}

	return format(blockSchema, response as unknown as Block, returnFormat);
}

export async function getTransaction<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transactionHash: Bytes,
	returnFormat: ReturnFormat,
) {
	const transactionHashFormatted = format(
		{ eth: 'bytes32' },
		transactionHash,
		DEFAULT_RETURN_FORMAT,
	);
	const response = await rpcMethods.getTransactionByHash(
		web3Context.requestManager,
		transactionHashFormatted,
	);

	return response === null
		? response
		: format(transactionInfoSchema, response as unknown as TransactionInfo, returnFormat);
}

export async function getPendingTransactions<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getPendingTransactions(web3Context.requestManager);

	return response.map(transaction =>
		formatTransaction(transaction as unknown as Transaction, returnFormat),
	);
}

export async function getTransactionFromBlock<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	transactionIndex: Numbers,
	returnFormat: ReturnFormat,
) {
	const transactionIndexFormatted = format(
		{ eth: 'uint' },
		transactionIndex,
		DEFAULT_RETURN_FORMAT,
	);

	let response;
	if (isBytes(block)) {
		const blockHashFormatted = format({ eth: 'bytes32' }, block, DEFAULT_RETURN_FORMAT);
		response = await rpcMethods.getTransactionByBlockHashAndIndex(
			web3Context.requestManager,
			blockHashFormatted as HexString,
			transactionIndexFormatted,
		);
	} else {
		const blockNumberFormatted = isBlockTag(block as string)
			? (block as BlockTag)
			: format({ eth: 'uint' }, block as Numbers, DEFAULT_RETURN_FORMAT);
		response = await rpcMethods.getTransactionByBlockNumberAndIndex(
			web3Context.requestManager,
			blockNumberFormatted,
			transactionIndexFormatted,
		);
	}

	return response === null
		? response
		: format(transactionInfoSchema, response as unknown as TransactionInfo, returnFormat);
}

export async function getTransactionReceipt<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transactionHash: Bytes,
	returnFormat: ReturnFormat,
) {
	const transactionHashFormatted = format(
		{ eth: 'bytes32' },
		transactionHash,
		DEFAULT_RETURN_FORMAT,
	);
	const response = await rpcMethods.getTransactionReceipt(
		web3Context.requestManager,
		transactionHashFormatted,
	);

	return response === null
		? response
		: (format(
				receiptInfoSchema,
				response as unknown as ReceiptInfo,
				returnFormat,
		  ) as ReceiptInfo);
}

export async function getTransactionCount<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	address: Address,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, DEFAULT_RETURN_FORMAT);
	const response = await rpcMethods.getTransactionCount(
		web3Context.requestManager,
		address,
		blockNumberFormatted,
	);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

export function sendTransaction<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: Transaction,
	returnFormat: ReturnFormat,
	options?: SendTransactionOptions,
): PromiEvent<ReceiptInfo, SendTransactionEvents> {
	let transactionFormatted = formatTransaction(transaction, DEFAULT_RETURN_FORMAT);

	const promiEvent = new PromiEvent<ReceiptInfo, SendTransactionEvents>(resolve => {
		setImmediate(() => {
			(async () => {
				if (
					!options?.ignoreGasPricing &&
					transaction.gasPrice === undefined &&
					(transaction.maxPriorityFeePerGas === undefined ||
						transaction.maxFeePerGas === undefined)
				) {
					transactionFormatted = {
						...transactionFormatted,
						...(await getTransactionGasPricing(
							transactionFormatted,
							web3Context,
							DEFAULT_RETURN_FORMAT,
						)),
					};
				}

				if (promiEvent.listenerCount('sending') > 0) {
					promiEvent.emit('sending', transactionFormatted);
				}

				let transactionHash: HexString;

				if (
					web3Context.wallet &&
					transaction.from &&
					web3Context.wallet.get(transaction.from)
				) {
					const wallet = web3Context.wallet.get(transaction.from);

					const signedTransaction = wallet.signTransaction(
						transactionFormatted as Record<string, unknown>,
					);
					await rpcMethods.sendRawTransaction(
						web3Context.requestManager,
						signedTransaction.rawTransaction,
					);

					transactionHash = signedTransaction.transactionHash;
				} else {
					transactionHash = await rpcMethods.sendTransaction(
						web3Context.requestManager,
						transactionFormatted as Partial<TransactionWithSender>,
					);
				}

				const transactionHashFormatted = format(
					{ eth: 'bytes32' },
					transactionHash,
					returnFormat,
				);

				if (promiEvent.listenerCount('sent') > 0) {
					promiEvent.emit('sent', transactionFormatted);
				}

				if (promiEvent.listenerCount('transactionHash') > 0) {
					promiEvent.emit('transactionHash', transactionHashFormatted);
				}

				let transactionReceipt = await getTransactionReceipt(
					web3Context,
					transactionHash,
					returnFormat,
				);

				// Transaction hasn't been included in a block yet
				if (transactionReceipt === null)
					transactionReceipt = await waitForTransactionReceipt(
						web3Context,
						transactionHash,
						returnFormat,
					);

				const transactionReceiptFormatted = format(
					receiptInfoSchema,
					transactionReceipt,
					returnFormat,
				);

				promiEvent.emit('receipt', transactionReceiptFormatted as ReceiptInfo);
				resolve(transactionReceiptFormatted as ReceiptInfo);

				if (promiEvent.listenerCount('confirmation') > 0) {
					watchTransactionForConfirmations<SendTransactionEvents, ReturnFormat>(
						web3Context,
						promiEvent,
						transactionReceiptFormatted as ReceiptInfo,
						transactionHash,
						returnFormat,
					);
				}
			})() as unknown;
		});
	});

	return promiEvent;
}

export function sendSignedTransaction<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	signedTransaction: Bytes,
	returnFormat: ReturnFormat,
): PromiEvent<ReceiptInfo, SendSignedTransactionEvents> {
	// TODO - Promise returned in function argument where a void return was expected
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	const promiEvent = new PromiEvent<ReceiptInfo, SendSignedTransactionEvents>(resolve => {
		setImmediate(() => {
			(async () => {
				// Formatting signedTransaction as per returnFormat to be returned to user
				const signedTransactionFormatted = format(
					{ eth: 'bytes' },
					signedTransaction,
					returnFormat,
				);

				promiEvent.emit('sending', signedTransactionFormatted);

				// Formatting signedTransaction to be send to RPC endpoint
				const signedTransactionFormattedHex = format(
					{ eth: 'bytes' },
					signedTransaction,
					DEFAULT_RETURN_FORMAT,
				);
				const transactionHash = await rpcMethods.sendRawTransaction(
					web3Context.requestManager,
					signedTransactionFormattedHex,
				);
				const transactionHashFormatted = format(
					{ eth: 'bytes32' },
					transactionHash,
					returnFormat,
				);

				promiEvent.emit('sent', signedTransactionFormatted);
				promiEvent.emit('transactionHash', transactionHashFormatted);

				let transactionReceipt = await getTransactionReceipt(
					web3Context,
					transactionHash,
					returnFormat,
				);

				// Transaction hasn't been included in a block yet
				if (transactionReceipt === null)
					transactionReceipt = await waitForTransactionReceipt(
						web3Context,
						transactionHash,
						returnFormat,
					);

				const transactionReceiptFormatted = format(
					receiptInfoSchema,
					transactionReceipt,
					returnFormat,
				);

				promiEvent.emit('receipt', transactionReceiptFormatted);
				resolve(transactionReceiptFormatted);

				watchTransactionForConfirmations<SendSignedTransactionEvents, ReturnFormat>(
					web3Context,
					promiEvent,
					transactionReceiptFormatted,
					transactionHash,
					returnFormat,
				);
			})() as unknown;
		});
	});

	return promiEvent;
}

export async function sign<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	message: Bytes,
	addressOrIndex: Address | number,
	returnFormat: ReturnFormat,
) {
	const messageFormatted = format({ eth: 'bytes' }, message, DEFAULT_RETURN_FORMAT);

	if (web3Context.wallet?.get(addressOrIndex)) {
		const wallet = web3Context.wallet.get(addressOrIndex);

		return wallet.sign(messageFormatted);
	}

	if (typeof addressOrIndex === 'number') {
		throw new SignatureError(
			message,
			'RPC method "eth_sign" does not support index signatures',
		);
	}

	const response = await rpcMethods.sign(
		web3Context.requestManager,
		addressOrIndex,
		messageFormatted,
	);
	return format({ eth: 'bytes' }, response, returnFormat);
}

export async function signTransaction<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: Transaction,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.signTransaction(
		web3Context.requestManager,
		formatTransaction(transaction, DEFAULT_RETURN_FORMAT),
	);
	return {
		raw: format({ eth: 'bytes' }, response, returnFormat),
		tx: formatTransaction(transaction, returnFormat),
	};
}

// TODO Decide what to do with transaction.to
// https://github.com/ChainSafe/web3.js/pull/4525#issuecomment-982330076
export async function call<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: TransactionCall,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, DEFAULT_RETURN_FORMAT);
	const response = await rpcMethods.call(
		web3Context.requestManager,
		formatTransaction(transaction, DEFAULT_RETURN_FORMAT),
		blockNumberFormatted,
	);
	return format({ eth: 'bytes' }, response, returnFormat);
}

// TODO - Investigate whether response is padded as 1.x docs suggest
export async function estimateGas<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: Transaction,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const transactionFormatted = formatTransaction(transaction, DEFAULT_RETURN_FORMAT);
	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, DEFAULT_RETURN_FORMAT);
	const response = await rpcMethods.estimateGas(
		web3Context.requestManager,
		transactionFormatted,
		blockNumberFormatted,
	);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

// TODO - Add input formatting to filter
export async function getLogs<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<Web3EthExecutionAPI>,
	filter: Filter,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getLogs(web3Context.requestManager, filter);

	const result = response.map(res => {
		if (typeof res === 'string') {
			return res;
		}

		return format(logSchema, res as unknown as Log, returnFormat);
	});

	return result;
}

export async function getChainId<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getChainId(web3Context.requestManager);

	return format(
		{ eth: 'uint' },
		// Response is number in hex formatted string
		response as unknown as number,
		returnFormat,
	);
}

export async function getProof<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<Web3EthExecutionAPI>,
	address: Address,
	storageKey: Bytes,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const storageKeyFormatted = format({ eth: 'bytes' }, storageKey, DEFAULT_RETURN_FORMAT);
	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, DEFAULT_RETURN_FORMAT);
	const response = await rpcMethods.getProof(
		web3Context.requestManager,
		address,
		storageKeyFormatted,
		blockNumberFormatted,
	);

	return format(accountSchema, response as unknown as AccountObject, returnFormat);
}

export async function getFeeHistory<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	blockCount: Numbers,
	newestBlock: BlockNumberOrTag = web3Context.defaultBlock,
	rewardPercentiles: Numbers[],
	returnFormat: ReturnFormat,
) {
	const blockCountFormatted = format({ eth: 'uint' }, blockCount, DEFAULT_RETURN_FORMAT);
	const newestBlockFormatted = isBlockTag(newestBlock as string)
		? (newestBlock as BlockTag)
		: format({ eth: 'uint' }, newestBlock as Numbers, DEFAULT_RETURN_FORMAT);
	const rewardPercentilesFormatted = format(
		{
			type: 'array',
			items: {
				eth: 'uint',
			},
		},
		rewardPercentiles,
		{
			number: FMT_NUMBER.NUMBER,
			bytes: FMT_BYTES.HEX,
		},
	);
	const response = await rpcMethods.getFeeHistory(
		web3Context.requestManager,
		blockCountFormatted,
		newestBlockFormatted,
		rewardPercentilesFormatted,
	);

	return format(feeHistorySchema, response as unknown as FeeHistory, returnFormat);
}
