// Disabling because returnTypes must be last param to match 1.x params
/* eslint-disable default-param-last */
import {
	DataFormat,
	EthExecutionAPI,
	format,
	PromiEvent,
	TransactionWithSender,
	FMT_BYTES,
	FMT_NUMBER,
	ReceiptInfo,
	DEFAULT_RETURN_FORMAT,
} from 'web3-common';
import { Web3Context } from 'web3-core';
import {
	Address,
	BlockNumberOrTag,
	Filter,
	HexString32Bytes,
	HexStringBytes,
	hexToNumber,
	Numbers,
	numberToHex,
	Uint,
	Uint256,
} from 'web3-utils';
import { isBlockTag, isHexString32Bytes, validator } from 'web3-validator';
import {
	TransactionMissingReceiptOrBlockHashError,
	TransactionPollingTimeoutError,
	TransactionReceiptMissingBlockNumberError,
} from './errors';
import * as rpcMethods from './rpc_methods';
import {
	accountSchema,
	blockSchema,
	feeHistorySchema,
	logSchema,
	receiptInfoSchema,
} from './schemas';
import {
	AccountObject,
	Block,
	FeeHistory,
	Log,
	SendSignedTransactionEvents,
	SendTransactionEvents,
	Transaction,
	TransactionCall,
} from './types';
import { formatTransaction } from './utils/format_transaction';
// eslint-disable-next-line import/no-cycle
import { getTransactionGasPricing } from './utils/get_transaction_gas_pricing';
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
	const response = await rpcMethods.getBalance(web3Context.requestManager, address, blockNumber);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

export const getStorageAt = async (
	web3Context: Web3Context<EthExecutionAPI>,
	address: Address,
	storageSlot: Uint256,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
) => rpcMethods.getStorageAt(web3Context.requestManager, address, storageSlot, blockNumber);

export const getCode = async (
	web3Context: Web3Context<EthExecutionAPI>,
	address: Address,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
) => rpcMethods.getCode(web3Context.requestManager, address, blockNumber);

export async function getBlock<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: HexString32Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	hydrated = false,
	returnFormat: ReturnFormat,
) {
	const response = isHexString32Bytes(block)
		? await rpcMethods.getBlockByHash(web3Context.requestManager, block, hydrated)
		: await rpcMethods.getBlockByNumber(web3Context.requestManager, block, hydrated);

	return format(blockSchema, response as unknown as Block, returnFormat);
}

export async function getBlockTransactionCount<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: HexString32Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const response = isHexString32Bytes(block)
		? await rpcMethods.getBlockTransactionCountByHash(web3Context.requestManager, block)
		: await rpcMethods.getBlockTransactionCountByNumber(web3Context.requestManager, block);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

export async function getBlockUncleCount<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: HexString32Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const response = isHexString32Bytes(block)
		? await rpcMethods.getUncleCountByBlockHash(web3Context.requestManager, block)
		: await rpcMethods.getUncleCountByBlockNumber(web3Context.requestManager, block);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

export async function getUncle<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: HexString32Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	uncleIndex: Uint,
	returnFormat: ReturnFormat,
) {
	const response = isHexString32Bytes(block)
		? await rpcMethods.getUncleByBlockHashAndIndex(
				web3Context.requestManager,
				block,
				uncleIndex,
		  )
		: await rpcMethods.getUncleByBlockNumberAndIndex(
				web3Context.requestManager,
				block,
				uncleIndex,
		  );

	return format(blockSchema, response as unknown as Block, returnFormat);
}

export async function getTransaction<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transactionHash: HexString32Bytes,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getTransactionByHash(
		web3Context.requestManager,
		transactionHash,
	);

	return response === null
		? response
		: formatTransaction(response as unknown as Transaction, returnFormat);
}

export async function getTransactionFromBlock<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: HexString32Bytes | BlockNumberOrTag | undefined,
	transactionIndex: Uint,
	returnFormat: ReturnFormat,
) {
	const blockOrDefault = block ?? web3Context.defaultBlock;
	const response = isHexString32Bytes(blockOrDefault)
		? await rpcMethods.getTransactionByBlockHashAndIndex(
				web3Context.requestManager,
				blockOrDefault,
				transactionIndex,
		  )
		: await rpcMethods.getTransactionByBlockNumberAndIndex(
				web3Context.requestManager,
				blockOrDefault,
				transactionIndex,
		  );

	return response === null
		? response
		: formatTransaction(response as unknown as Transaction, returnFormat);
}

export async function getTransactionReceipt<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transactionHash: HexString32Bytes,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getTransactionReceipt(
		web3Context.requestManager,
		transactionHash,
	);

	return response === null
		? response
		: format(receiptInfoSchema, response as unknown as ReceiptInfo, returnFormat);
}

export async function getTransactionCount<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	address: Address,
	blockNumber: BlockNumberOrTag | undefined,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getTransactionCount(
		web3Context.requestManager,
		address,
		blockNumber ?? web3Context.defaultBlock,
	);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

export async function getPendingTransactions<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	returnFormat?: ReturnFormat,
) {
	const response = await rpcMethods.getPendingTransactions(web3Context.requestManager);

	return response.map(transaction =>
		formatTransaction(transaction as unknown as Transaction, returnFormat),
	);
}

const waitForTransactionReceipt = async (
	web3Context: Web3Context<EthExecutionAPI>,
	transactionHash: HexString32Bytes,
): Promise<ReceiptInfo> =>
	new Promise(resolve => {
		let transactionPollingDuration = 0;
		// TODO - Promise returned in function argument where a void return was expected
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		const intervalId = setInterval(async () => {
			transactionPollingDuration +=
				web3Context.transactionReceiptPollingInterval ??
				web3Context.transactionPollingInterval;

			if (transactionPollingDuration >= web3Context.transactionPollingTimeout) {
				clearInterval(intervalId);
				throw new TransactionPollingTimeoutError({
					numberOfSeconds: web3Context.transactionPollingTimeout / 1000,
					transactionHash,
				});
			}

			const response = await rpcMethods.getTransactionReceipt(
				web3Context.requestManager,
				transactionHash,
			);

			if (response !== null) {
				clearInterval(intervalId);
				resolve(response);
			}
		}, web3Context.transactionReceiptPollingInterval ?? web3Context.transactionPollingInterval);
	});

function watchTransactionForConfirmations<
	PromiEventEventType extends SendTransactionEvents | SendSignedTransactionEvents,
>(
	web3Context: Web3Context<EthExecutionAPI>,
	transactionPromiEvent: PromiEvent<ReceiptInfo, PromiEventEventType>,
	transactionReceipt: ReceiptInfo,
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
		if (confirmationNumber >= web3Context.transactionConfirmationBlocks)
			clearInterval(intervalId);

		const nextBlock = await getBlock(
			web3Context,
			numberToHex(
				BigInt(hexToNumber(transactionReceipt.blockNumber)) + BigInt(confirmationNumber),
			),
			false,
			DEFAULT_RETURN_FORMAT,
		);

		if (nextBlock?.hash !== null) {
			confirmationNumber += 1;
			transactionPromiEvent.emit('confirmation', {
				confirmationNumber,
				receipt: transactionReceipt,
				latestBlockHash: nextBlock.hash,
			});
		}
	}, web3Context.transactionReceiptPollingInterval ?? web3Context.transactionPollingInterval);
}

export function sendTransaction(
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: Transaction,
	options?: {
		ignoreGasPricing: boolean;
	},
): PromiEvent<ReceiptInfo, SendTransactionEvents> {
	let _transaction = formatTransaction(transaction, {
		number: FMT_NUMBER.HEX,
		bytes: FMT_BYTES.HEX,
	});
	const promiEvent = new PromiEvent<ReceiptInfo, SendTransactionEvents>(resolve => {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		setImmediate(async () => {
			if (
				!options?.ignoreGasPricing &&
				transaction.gasPrice === undefined &&
				(transaction.maxPriorityFeePerGas === undefined ||
					transaction.maxFeePerGas === undefined)
			) {
				_transaction = {
					..._transaction,
					...(await getTransactionGasPricing(_transaction, web3Context, {
						number: FMT_NUMBER.HEX,
						bytes: FMT_BYTES.HEX,
					})),
				};
			}

			if (promiEvent.listenerCount('sending') > 0) {
				promiEvent.emit('sending', _transaction);
			}

			// TODO - If an account is available in wallet, sign transaction and call sendRawTransaction
			// https://github.com/ChainSafe/web3.js/blob/b32555cfeedde128c657dabbba201102f691f955/packages/web3-core-method/src/index.js#L720

			const transactionHash = await rpcMethods.sendTransaction(
				web3Context.requestManager,
				_transaction,
			);

			if (promiEvent.listenerCount('sent') > 0) {
				promiEvent.emit('sent', _transaction);
			}

			if (promiEvent.listenerCount('transactionHash') > 0) {
				promiEvent.emit('transactionHash', transactionHash);
			}

			let transactionReceipt = await rpcMethods.getTransactionReceipt(
				web3Context.requestManager,
				transactionHash,
			);

			// Transaction hasn't been included in a block yet
			if (transactionReceipt === null)
				transactionReceipt = await waitForTransactionReceipt(web3Context, transactionHash);

			promiEvent.emit('receipt', transactionReceipt);
			// TODO - Format receipt
			resolve(transactionReceipt);

			if (promiEvent.listenerCount('confirmation') > 0) {
				watchTransactionForConfirmations<SendTransactionEvents>(
					web3Context,
					promiEvent,
					transactionReceipt,
				);
			}
		});
	});

	return promiEvent;
}

export const sendSignedTransaction = async (
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: HexStringBytes,
) => {
	// TODO - Promise returned in function argument where a void return was expected
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	const promiEvent = new PromiEvent<ReceiptInfo, SendSignedTransactionEvents>(async resolve => {
		promiEvent.emit('sending', transaction);

		const transactionHash = await rpcMethods.sendRawTransaction(
			web3Context.requestManager,
			transaction,
		);

		promiEvent.emit('sent', transaction);
		promiEvent.emit('transactionHash', transactionHash);

		let transactionReceipt = await rpcMethods.getTransactionReceipt(
			web3Context.requestManager,
			transactionHash,
		);

		// Transaction hasn't been included in a block yet
		if (transactionReceipt === null)
			transactionReceipt = await waitForTransactionReceipt(web3Context, transactionHash);

		promiEvent.emit('receipt', transactionReceipt);
		// TODO - Format receipt
		resolve(transactionReceipt);

		watchTransactionForConfirmations<SendSignedTransactionEvents>(
			web3Context,
			promiEvent,
			transactionReceipt,
		);
	});

	return promiEvent;
};

// TODO address can be an address or the index of a local wallet in web3.eth.accounts.wallet
// https://web3js.readthedocs.io/en/v1.5.2/web3-eth.html?highlight=sendTransaction#sign
export const sign = async (
	web3Context: Web3Context<EthExecutionAPI>,
	message: HexStringBytes,
	address: Address,
) => rpcMethods.sign(web3Context.requestManager, address, message);

export const signTransaction = async (
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: Transaction,
) =>
	rpcMethods.signTransaction(
		web3Context.requestManager,
		formatTransaction(transaction, {
			number: FMT_NUMBER.HEX,
			bytes: FMT_BYTES.HEX,
		}),
	);

// TODO Decide what to do with transaction.to
// https://github.com/ChainSafe/web3.js/pull/4525#issuecomment-982330076
export const call = async (
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: TransactionCall,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
) => {
	validator.validate(['address'], [transaction.to]);

	return rpcMethods.call(
		web3Context.requestManager,
		formatTransaction(transaction, DEFAULT_RETURN_FORMAT),
		isBlockTag(blockNumber)
			? blockNumber
			: format({ eth: 'uint' }, blockNumber as Numbers, DEFAULT_RETURN_FORMAT),
	);
};

// TODO Missing param
export async function estimateGas<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: Partial<TransactionWithSender>,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.estimateGas(
		web3Context.requestManager,
		transaction,
		blockNumber,
	);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

export async function getFeeHistory<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	blockCount: Uint,
	newestBlock: BlockNumberOrTag = web3Context.defaultBlock,
	rewardPercentiles: number[],
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getFeeHistory(
		web3Context.requestManager,
		blockCount,
		newestBlock,
		rewardPercentiles,
	);

	return format(feeHistorySchema, response as unknown as FeeHistory, returnFormat);
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
	storageKey: HexString32Bytes,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getProof(
		web3Context.requestManager,
		address,
		storageKey,
		blockNumber,
	);

	return format(accountSchema, response as unknown as AccountObject, returnFormat);
}

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
