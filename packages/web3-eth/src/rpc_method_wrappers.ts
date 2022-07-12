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
	Web3PromiEvent,
	DEFAULT_RETURN_FORMAT,
	TransactionInfo,
	TransactionWithSender,
	FormatType,
	SignedTransactionInfo,
	ETH_DATA_FORMAT,
	Web3BaseWalletAccount,
} from 'web3-common';
import { Web3Context } from 'web3-core';
import {
	Address,
	BlockTag,
	BlockNumberOrTag,
	Bytes,
	Filter,
	HexString,
	Numbers,
	HexStringBytes,
} from 'web3-utils';
import { isBlockTag, isBytes, isNullish, isString } from 'web3-validator';
import { TransactionError } from 'web3-errors';
import { SignatureError } from './errors';
import * as rpcMethods from './rpc_methods';
import {
	accountSchema,
	blockSchema,
	feeHistorySchema,
	logSchema,
	transactionReceiptSchema,
	transactionInfoSchema,
} from './schemas';
import {
	AccountObject,
	Block,
	FeeHistory,
	Log,
	TransactionReceipt,
	SendSignedTransactionEvents,
	SendSignedTransactionOptions,
	SendTransactionEvents,
	SendTransactionOptions,
	Transaction,
	TransactionCall,
	TransactionWithLocalWalletIndex,
} from './types';
// eslint-disable-next-line import/no-cycle
import { getTransactionFromAttr } from './utils/transaction_builder';
import { formatTransaction } from './utils/format_transaction';
// eslint-disable-next-line import/no-cycle
import { getTransactionGasPricing } from './utils/get_transaction_gas_pricing';
// eslint-disable-next-line import/no-cycle
import { waitForTransactionReceipt } from './utils/wait_for_transaction_receipt';
import { watchTransactionForConfirmations } from './utils/watch_transaction_for_confirmations';
import { Web3EthExecutionAPI } from './web3_eth_execution_api';
import { NUMBER_DATA_FORMAT } from './constants';

export const getProtocolVersion = async (web3Context: Web3Context<EthExecutionAPI>) =>
	rpcMethods.getProtocolVersion(web3Context.requestManager);

export const isSyncing = async (web3Context: Web3Context<EthExecutionAPI>) =>
	rpcMethods.getSyncing(web3Context.requestManager);

export const getCoinbase = async (web3Context: Web3Context<EthExecutionAPI>) =>
	rpcMethods.getCoinbase(web3Context.requestManager);

export const isMining = async (web3Context: Web3Context<EthExecutionAPI>) =>
	rpcMethods.getMining(web3Context.requestManager);

/**
 *
 * @param web3Context
 * @param returnFormat
 */
export async function getHashRate<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getHashRate(web3Context.requestManager);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

/**
 *
 * @param web3Context
 * @param returnFormat
 */
export async function getGasPrice<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getGasPrice(web3Context.requestManager);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

/**
 *
 * @param web3Context
 * @param returnFormat
 */
export async function getBlockNumber<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getBlockNumber(web3Context.requestManager);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

/**
 *
 * @param web3Context
 * @param address
 * @param blockNumber
 * @param returnFormat
 */
export async function getBalance<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	address: Address,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, ETH_DATA_FORMAT);
	const response = await rpcMethods.getBalance(
		web3Context.requestManager,
		address,
		blockNumberFormatted,
	);
	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

/**
 *
 * @param web3Context
 * @param address
 * @param storageSlot
 * @param blockNumber
 * @param returnFormat
 */
export async function getStorageAt<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	address: Address,
	storageSlot: Numbers,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const storageSlotFormatted = format({ eth: 'uint' }, storageSlot, ETH_DATA_FORMAT);
	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, ETH_DATA_FORMAT);
	const response = await rpcMethods.getStorageAt(
		web3Context.requestManager,
		address,
		storageSlotFormatted,
		blockNumberFormatted,
	);
	return format({ eth: 'bytes' }, response, returnFormat);
}

/**
 *
 * @param web3Context
 * @param address
 * @param blockNumber
 * @param returnFormat
 */
export async function getCode<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	address: Address,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, ETH_DATA_FORMAT);
	const response = await rpcMethods.getCode(
		web3Context.requestManager,
		address,
		blockNumberFormatted,
	);
	return format({ eth: 'bytes' }, response, returnFormat);
}

/**
 *
 * @param web3Context
 * @param block
 * @param hydrated
 * @param returnFormat
 */
export async function getBlock<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	hydrated = false,
	returnFormat: ReturnFormat,
) {
	let response;
	if (isBytes(block)) {
		const blockHashFormatted = format({ eth: 'bytes32' }, block, ETH_DATA_FORMAT);
		response = await rpcMethods.getBlockByHash(
			web3Context.requestManager,
			blockHashFormatted as HexString,
			hydrated,
		);
	} else {
		const blockNumberFormatted = isBlockTag(block as string)
			? (block as BlockTag)
			: format({ eth: 'uint' }, block as Numbers, ETH_DATA_FORMAT);
		response = await rpcMethods.getBlockByNumber(
			web3Context.requestManager,
			blockNumberFormatted,
			hydrated,
		);
	}

	return format(blockSchema, response as unknown as Block, returnFormat);
}

/**
 *
 * @param web3Context
 * @param block
 * @param returnFormat
 */
export async function getBlockTransactionCount<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	let response;
	if (isBytes(block)) {
		const blockHashFormatted = format({ eth: 'bytes32' }, block, ETH_DATA_FORMAT);
		response = await rpcMethods.getBlockTransactionCountByHash(
			web3Context.requestManager,
			blockHashFormatted as HexString,
		);
	} else {
		const blockNumberFormatted = isBlockTag(block as string)
			? (block as BlockTag)
			: format({ eth: 'uint' }, block as Numbers, ETH_DATA_FORMAT);
		response = await rpcMethods.getBlockTransactionCountByNumber(
			web3Context.requestManager,
			blockNumberFormatted,
		);
	}

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

/**
 *
 * @param web3Context
 * @param block
 * @param returnFormat
 */
export async function getBlockUncleCount<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	let response;
	if (isBytes(block)) {
		const blockHashFormatted = format({ eth: 'bytes32' }, block, ETH_DATA_FORMAT);
		response = await rpcMethods.getUncleCountByBlockHash(
			web3Context.requestManager,
			blockHashFormatted as HexString,
		);
	} else {
		const blockNumberFormatted = isBlockTag(block as string)
			? (block as BlockTag)
			: format({ eth: 'uint' }, block as Numbers, ETH_DATA_FORMAT);
		response = await rpcMethods.getUncleCountByBlockNumber(
			web3Context.requestManager,
			blockNumberFormatted,
		);
	}

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

/**
 *
 * @param web3Context
 * @param block
 * @param uncleIndex
 * @param returnFormat
 */
export async function getUncle<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	uncleIndex: Numbers,
	returnFormat: ReturnFormat,
) {
	const uncleIndexFormatted = format({ eth: 'uint' }, uncleIndex, ETH_DATA_FORMAT);

	let response;
	if (isBytes(block)) {
		const blockHashFormatted = format({ eth: 'bytes32' }, block, ETH_DATA_FORMAT);
		response = await rpcMethods.getUncleByBlockHashAndIndex(
			web3Context.requestManager,
			blockHashFormatted as HexString,
			uncleIndexFormatted,
		);
	} else {
		const blockNumberFormatted = isBlockTag(block as string)
			? (block as BlockTag)
			: format({ eth: 'uint' }, block as Numbers, ETH_DATA_FORMAT);
		response = await rpcMethods.getUncleByBlockNumberAndIndex(
			web3Context.requestManager,
			blockNumberFormatted,
			uncleIndexFormatted,
		);
	}

	return format(blockSchema, response as unknown as Block, returnFormat);
}

/**
 *
 * @param web3Context
 * @param transactionHash
 * @param returnFormat
 */
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

	return isNullish(response)
		? response
		: format(transactionInfoSchema, response as unknown as TransactionInfo, returnFormat);
}

/**
 *
 * @param web3Context
 * @param returnFormat
 */
export async function getPendingTransactions<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getPendingTransactions(web3Context.requestManager);

	return response.map(transaction =>
		formatTransaction(transaction as unknown as Transaction, returnFormat),
	);
}

/**
 *
 * @param web3Context
 * @param block
 * @param transactionIndex
 * @param returnFormat
 */
export async function getTransactionFromBlock<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	transactionIndex: Numbers,
	returnFormat: ReturnFormat,
) {
	const transactionIndexFormatted = format({ eth: 'uint' }, transactionIndex, ETH_DATA_FORMAT);

	let response;
	if (isBytes(block)) {
		const blockHashFormatted = format({ eth: 'bytes32' }, block, ETH_DATA_FORMAT);
		response = await rpcMethods.getTransactionByBlockHashAndIndex(
			web3Context.requestManager,
			blockHashFormatted as HexString,
			transactionIndexFormatted,
		);
	} else {
		const blockNumberFormatted = isBlockTag(block as string)
			? (block as BlockTag)
			: format({ eth: 'uint' }, block as Numbers, ETH_DATA_FORMAT);
		response = await rpcMethods.getTransactionByBlockNumberAndIndex(
			web3Context.requestManager,
			blockNumberFormatted,
			transactionIndexFormatted,
		);
	}

	return isNullish(response)
		? response
		: format(transactionInfoSchema, response as unknown as TransactionInfo, returnFormat);
}

/**
 *
 * @param web3Context
 * @param transactionHash
 * @param returnFormat
 */
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

	return isNullish(response)
		? response
		: (format(
				transactionReceiptSchema,
				response as unknown as TransactionReceipt,
				returnFormat,
		  ) as TransactionReceipt);
}

/**
 *
 * @param web3Context
 * @param address
 * @param blockNumber
 * @param returnFormat
 */
export async function getTransactionCount<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	address: Address,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, ETH_DATA_FORMAT);
	const response = await rpcMethods.getTransactionCount(
		web3Context.requestManager,
		address,
		blockNumberFormatted,
	);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

/**
 *
 * @param web3Context
 * @param transaction
 * @param returnFormat
 * @param options
 */
export function sendTransaction<
	ReturnFormat extends DataFormat,
	ResolveType = FormatType<TransactionReceipt, ReturnFormat>,
>(
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: Transaction | TransactionWithLocalWalletIndex,
	returnFormat: ReturnFormat,
	options?: SendTransactionOptions<ResolveType>,
): Web3PromiEvent<ResolveType, SendTransactionEvents<ReturnFormat>> {
	const promiEvent = new Web3PromiEvent<ResolveType, SendTransactionEvents<ReturnFormat>>(
		(resolve, reject) => {
			setImmediate(() => {
				(async () => {
					try {
						let transactionFormatted = formatTransaction(
							{
								...transaction,
								from: getTransactionFromAttr(web3Context, transaction),
							},
							ETH_DATA_FORMAT,
						);

						if (
							!options?.ignoreGasPricing &&
							isNullish(transactionFormatted.gasPrice) &&
							(isNullish(transaction.maxPriorityFeePerGas) ||
								isNullish(transaction.maxFeePerGas))
						) {
							transactionFormatted = {
								...transactionFormatted,
								// TODO gasPrice, maxPriorityFeePerGas, maxFeePerGas
								// should not be included if undefined, but currently are
								...(await getTransactionGasPricing(
									transactionFormatted,
									web3Context,
									ETH_DATA_FORMAT,
								)),
							};
						}

						if (promiEvent.listenerCount('sending') > 0) {
							promiEvent.emit('sending', transactionFormatted);
						}

						let transactionHash: HexString;
						let wallet: Web3BaseWalletAccount | undefined;

						if (web3Context.wallet && !isNullish(transactionFormatted.from)) {
							wallet = web3Context.wallet.get(transactionFormatted.from);
						}

						if (wallet) {
							const signedTransaction = await wallet.signTransaction(
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
							transactionHash as Bytes,
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
						if (isNullish(transactionReceipt))
							transactionReceipt = await waitForTransactionReceipt(
								web3Context,
								transactionHash,
								returnFormat,
							);

						const transactionReceiptFormatted = format(
							transactionReceiptSchema,
							transactionReceipt,
							returnFormat,
						);

						if (promiEvent.listenerCount('receipt') > 0) {
							promiEvent.emit('receipt', transactionReceiptFormatted);
						}

						if (options?.transactionResolver) {
							resolve(
								options?.transactionResolver(
									transactionReceiptFormatted,
								) as unknown as ResolveType,
							);
						} else if (transactionReceipt.status === BigInt(0)) {
							if (promiEvent.listenerCount('error') > 0) {
								promiEvent.emit(
									'error',
									new TransactionError(
										'Transaction failed',
										transactionReceiptFormatted,
									),
								);
							}
							reject(transactionReceiptFormatted as unknown as ResolveType);
						} else {
							resolve(transactionReceiptFormatted as unknown as ResolveType);
						}

						if (promiEvent.listenerCount('confirmation') > 0) {
							watchTransactionForConfirmations<
								ReturnFormat,
								SendTransactionEvents<ReturnFormat>,
								ResolveType
							>(
								web3Context,
								promiEvent,
								transactionReceiptFormatted as TransactionReceipt,
								transactionHash,
								returnFormat,
							);
						}
					} catch (error) {
						if (promiEvent.listenerCount('error') > 0) {
							promiEvent.emit(
								'error',
								new TransactionError((error as Error).message),
							);
						}
						reject(error);
					}
				})() as unknown;
			});
		},
	);

	return promiEvent;
}

/**
 *
 * @param web3Context
 * @param signedTransaction
 * @param returnFormat
 * @param options
 */
export function sendSignedTransaction<
	ReturnFormat extends DataFormat,
	ResolveType = FormatType<TransactionReceipt, ReturnFormat>,
>(
	web3Context: Web3Context<EthExecutionAPI>,
	signedTransaction: Bytes,
	returnFormat: ReturnFormat,
	options?: SendSignedTransactionOptions<ResolveType>,
): Web3PromiEvent<ResolveType, SendSignedTransactionEvents<ReturnFormat>> {
	// TODO - Promise returned in function argument where a void return was expected
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	const promiEvent = new Web3PromiEvent<ResolveType, SendSignedTransactionEvents<ReturnFormat>>(
		(resolve, reject) => {
			setImmediate(() => {
				(async () => {
					try {
						// Formatting signedTransaction to be send to RPC endpoint
						const signedTransactionFormattedHex = format(
							{ eth: 'bytes' },
							signedTransaction,
							ETH_DATA_FORMAT,
						);

						if (promiEvent.listenerCount('sending') > 0) {
							promiEvent.emit('sending', signedTransactionFormattedHex);
						}

						const transactionHash = await rpcMethods.sendRawTransaction(
							web3Context.requestManager,
							signedTransactionFormattedHex,
						);

						if (promiEvent.listenerCount('sent') > 0) {
							promiEvent.emit('sent', signedTransactionFormattedHex);
						}

						const transactionHashFormatted = format(
							{ eth: 'bytes32' },
							transactionHash as Bytes,
							returnFormat,
						);

						if (promiEvent.listenerCount('transactionHash') > 0) {
							promiEvent.emit('transactionHash', transactionHashFormatted);
						}

						let transactionReceipt = await getTransactionReceipt(
							web3Context,
							transactionHash,
							returnFormat,
						);

						// Transaction hasn't been included in a block yet
						if (isNullish(transactionReceipt))
							transactionReceipt = await waitForTransactionReceipt(
								web3Context,
								transactionHash,
								returnFormat,
							);

						const transactionReceiptFormatted = format(
							transactionReceiptSchema,
							transactionReceipt,
							returnFormat,
						);

						if (promiEvent.listenerCount('receipt') > 0) {
							promiEvent.emit('receipt', transactionReceiptFormatted);
						}

						if (options?.transactionResolver) {
							resolve(
								options?.transactionResolver(
									transactionReceiptFormatted,
								) as unknown as ResolveType,
							);
						} else if (transactionReceipt.status === BigInt(0)) {
							if (promiEvent.listenerCount('error') > 0) {
								promiEvent.emit(
									'error',
									new TransactionError(
										'Transaction failed',
										transactionReceiptFormatted,
									),
								);
							}
							reject(transactionReceiptFormatted as unknown as ResolveType);
						} else {
							resolve(transactionReceiptFormatted as unknown as ResolveType);
						}

						if (promiEvent.listenerCount('confirmation') > 0) {
							watchTransactionForConfirmations<
								ReturnFormat,
								SendSignedTransactionEvents<ReturnFormat>,
								ResolveType
							>(
								web3Context,
								promiEvent,
								transactionReceiptFormatted as TransactionReceipt,
								transactionHash,
								returnFormat,
							);
						}
					} catch (error) {
						if (promiEvent.listenerCount('error') > 0) {
							promiEvent.emit(
								'error',
								new TransactionError((error as Error).message),
							);
						}
						reject(error);
					}
				})() as unknown;
			});
		},
	);

	return promiEvent;
}

/**
 *
 * @param web3Context
 * @param message
 * @param addressOrIndex
 * @param returnFormat
 */
export async function sign<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	message: Bytes,
	addressOrIndex: Address | number,
	returnFormat: ReturnFormat,
) {
	const messageFormatted = format({ eth: 'bytes' }, message, DEFAULT_RETURN_FORMAT);

	if (web3Context.wallet?.get(addressOrIndex)) {
		const wallet = web3Context.wallet.get(addressOrIndex) as Web3BaseWalletAccount;

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

/**
 *
 * @param web3Context
 * @param transaction
 * @param returnFormat
 */
export async function signTransaction<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: Transaction,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.signTransaction(
		web3Context.requestManager,
		formatTransaction(transaction, ETH_DATA_FORMAT),
	);

	const unformattedResponse = isString(response as HexStringBytes)
		? { raw: response, tx: transaction }
		: (response as SignedTransactionInfo);

	return {
		raw: format({ eth: 'bytes' }, unformattedResponse.raw, returnFormat),
		tx: formatTransaction(unformattedResponse.tx, returnFormat),
	};
}

// TODO Decide what to do with transaction.to
// https://github.com/ChainSafe/web3.js/pull/4525#issuecomment-982330076
/**
 *
 * @param web3Context
 * @param transaction
 * @param blockNumber
 * @param returnFormat
 */
export async function call<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: TransactionCall,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, ETH_DATA_FORMAT);

	const response = await rpcMethods.call(
		web3Context.requestManager,
		formatTransaction(transaction, ETH_DATA_FORMAT),
		blockNumberFormatted,
	);

	return format({ eth: 'bytes' }, response, returnFormat);
}

// TODO - Investigate whether response is padded as 1.x docs suggest
/**
 *
 * @param web3Context
 * @param transaction
 * @param blockNumber
 * @param returnFormat
 */
export async function estimateGas<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: Transaction,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const transactionFormatted = formatTransaction(transaction, ETH_DATA_FORMAT);

	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, ETH_DATA_FORMAT);

	const response = await rpcMethods.estimateGas(
		web3Context.requestManager,
		transactionFormatted,
		blockNumberFormatted,
	);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

// TODO - Add input formatting to filter
/**
 *
 * @param web3Context
 * @param filter
 * @param returnFormat
 */
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

/**
 *
 * @param web3Context
 * @param returnFormat
 */
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

/**
 *
 * @param web3Context
 * @param address
 * @param storageKeys
 * @param blockNumber
 * @param returnFormat
 */
export async function getProof<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<Web3EthExecutionAPI>,
	address: Address,
	storageKeys: Bytes[],
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const storageKeysFormatted = storageKeys.map(storageKey =>
		format({ eth: 'bytes' }, storageKey, ETH_DATA_FORMAT),
	);

	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, ETH_DATA_FORMAT);

	const response = await rpcMethods.getProof(
		web3Context.requestManager,
		address,
		storageKeysFormatted,
		blockNumberFormatted,
	);

	return format(accountSchema, response as unknown as AccountObject, returnFormat);
}

/**
 *
 * @param web3Context
 * @param blockCount
 * @param newestBlock
 * @param rewardPercentiles
 * @param returnFormat
 */
export async function getFeeHistory<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	blockCount: Numbers,
	newestBlock: BlockNumberOrTag = web3Context.defaultBlock,
	rewardPercentiles: Numbers[],
	returnFormat: ReturnFormat,
) {
	const blockCountFormatted = format({ eth: 'uint' }, blockCount, ETH_DATA_FORMAT);

	const newestBlockFormatted = isBlockTag(newestBlock as string)
		? (newestBlock as BlockTag)
		: format({ eth: 'uint' }, newestBlock as Numbers, ETH_DATA_FORMAT);

	const rewardPercentilesFormatted = format(
		{
			type: 'array',
			items: {
				eth: 'uint',
			},
		},
		rewardPercentiles,
		NUMBER_DATA_FORMAT,
	);

	const response = await rpcMethods.getFeeHistory(
		web3Context.requestManager,
		blockCountFormatted,
		newestBlockFormatted,
		rewardPercentilesFormatted,
	);

	return format(feeHistorySchema, response as unknown as FeeHistory, returnFormat);
}
