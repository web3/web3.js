// Disabling because returnTypes must be last param to match 1.x params
/* eslint-disable default-param-last */

import {
	// TransactionWithSender,
	Block,
	FeeHistoryResult,
	TransactionInfo,
	ReceiptInfo,
} from 'web3-common';
import { Web3Context } from 'web3-core';
import {
	BlockNumberOrTag,
	ValidTypes,
	ValidReturnTypes,
	convertToValidType,
	Address,
	Uint256,
	HexString32Bytes,
	HexStringBytes,
	Uint,
	HexString8Bytes,
	convertObjectPropertiesToValidType,
	isHexString32Bytes,
	Filter,
	toChecksumAddress,
	// isNumbers,
	// numberToHex,
} from 'web3-utils';

import {
	// Transaction,
	BlockFormatted,
	FeeHistoryResultFormatted,
	GetProofResultFormatted,
	ReceiptInfoFormatted,
	TransactionInfoFormatted,
	// ChainNames,
	// HardForks
} from './types';
import {
	convertibleBlockProperties,
	convertibleFeeHistoryResultProperties,
	convertibleProofProperties,
	// convertibleReceiptInfoProperties,
	// convertibleTransactionCustomChainProperties,
	convertibleTransactionInfoProperties,
	// convertibleTransactionProperties,
} from './convertible_properties';

import * as rpcMethods from './rpc_methods';
import { Proof, Web3EthExecutionApi } from './web3_eth_execution_api';

export default class Web3Eth extends Web3Context<Web3EthExecutionApi> {
	public async getProtocolVersion() {
		return rpcMethods.getProtocolVersion(this.requestManager);
	}

	public async isSyncing() {
		return rpcMethods.getSyncing(this.requestManager);
	}

	public async getCoinbase() {
		return rpcMethods.getCoinbase(this.requestManager);
	}

	public async isMining() {
		return rpcMethods.getMining(this.requestManager);
	}

	public async getHashRate<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getHashRate(this.requestManager);

		return convertToValidType(
			response,
			returnType ?? this.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getGasPrice<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getGasPrice(this.requestManager);

		return convertToValidType(
			response,
			returnType ?? this.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getFeeHistory<ReturnType extends ValidTypes = ValidTypes.HexString>(
		blockCount: Uint,
		newestBlock: BlockNumberOrTag = this.defaultBlock,
		rewardPercentiles: number[],
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getFeeHistory(
			this.requestManager,
			blockCount,
			newestBlock,
			rewardPercentiles,
		);

		return convertObjectPropertiesToValidType<
			FeeHistoryResultFormatted<ReturnType>,
			FeeHistoryResult,
			(keyof FeeHistoryResult)[],
			ReturnType
		>(
			response,
			convertibleFeeHistoryResultProperties,
			returnType ?? (this.defaultReturnType as ReturnType),
		);
	}

	public async getAccounts() {
		return rpcMethods.getAccounts(this.requestManager);
	}

	public async getBlockNumber<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getBlockNumber(this.requestManager);

		return convertToValidType(
			response,
			returnType ?? this.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getBalance<ReturnType extends ValidTypes = ValidTypes.HexString>(
		address: Address,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getBalance(this.requestManager, address, blockNumber);

		return convertToValidType(
			response,
			returnType ?? this.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getStorageAt(
		address: Address,
		storageSlot: Uint256,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
	) {
		return rpcMethods.getStorageAt(this.requestManager, address, storageSlot, blockNumber);
	}

	public async getCode(address: Address, blockNumber: BlockNumberOrTag = this.defaultBlock) {
		return rpcMethods.getCode(this.requestManager, address, blockNumber);
	}

	public async getBlock<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		hydrated = false,
		returnType?: ReturnType,
	) {
		const response = isHexString32Bytes(block)
			? await rpcMethods.getBlockByHash(this.requestManager, block, hydrated)
			: await rpcMethods.getBlockByNumber(this.requestManager, block, hydrated);

		return convertObjectPropertiesToValidType<
			BlockFormatted<ReturnType>,
			Block,
			(keyof Block)[],
			ReturnType
		>(
			response,
			convertibleBlockProperties,
			returnType ?? (this.defaultReturnType as ReturnType),
		);
	}

	public async getBlockTransactionCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		returnType?: ReturnType,
	) {
		const response = isHexString32Bytes(block)
			? await rpcMethods.getBlockTransactionCountByHash(this.requestManager, block)
			: await rpcMethods.getBlockTransactionCountByNumber(this.requestManager, block);

		return convertToValidType(
			response,
			returnType ?? this.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getBlockUncleCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		returnType?: ReturnType,
	) {
		const response = isHexString32Bytes(block)
			? await rpcMethods.getUncleCountByBlockHash(this.requestManager, block)
			: await rpcMethods.getUncleCountByBlockNumber(this.requestManager, block);

		return convertToValidType(
			response,
			returnType ?? this.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getUncle<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		uncleIndex: Uint,
		returnType?: ReturnType,
	) {
		const response = isHexString32Bytes(block)
			? await rpcMethods.getUncleByBlockHashAndIndex(this.requestManager, block, uncleIndex)
			: await rpcMethods.getUncleByBlockNumberAndIndex(
					this.requestManager,
					block,
					uncleIndex,
			  );

		return convertObjectPropertiesToValidType<
			BlockFormatted<ReturnType>,
			Block,
			(keyof Block)[],
			ReturnType
		>(
			response,
			convertibleBlockProperties,
			returnType ?? (this.defaultReturnType as ReturnType),
		);
	}

	public async getTransaction<ReturnType extends ValidTypes = ValidTypes.HexString>(
		transactionHash: HexString32Bytes,
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getTransactionByHash(
			this.requestManager,
			transactionHash,
		);

		return response === null
			? response
			: convertObjectPropertiesToValidType<
					TransactionInfoFormatted<ReturnType>,
					TransactionInfo,
					(keyof TransactionInfo)[],
					ReturnType
			  >(
					response,
					// TODO
					// @ts-expect-error TSC is complaining about different properties being
					// available by various tx types
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					convertibleTransactionInfoProperties,
					returnType ?? (this.defaultReturnType as ReturnType),
			  );
	}

	public async getPendingTransactions<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getPendingTransactions(this.requestManager);

		const formattedResponse: TransactionInfoFormatted<ReturnType>[] = [];
		for (const transaction of response) {
			formattedResponse.push(
				convertObjectPropertiesToValidType<
					TransactionInfoFormatted<ReturnType>,
					TransactionInfo,
					(keyof TransactionInfo)[],
					ReturnType
				>(
					transaction,
					// TODO
					// @ts-expect-error TSC is complaining about different properties being
					// available by various tx types
					convertibleTransactionInfoProperties,
					returnType ?? (this.defaultReturnType as ReturnType),
				),
			);
		}
		return formattedResponse;
	}

	public async getTransactionFromBlock<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		transactionIndex: Uint,
		returnType?: ReturnType,
	) {
		const response = isHexString32Bytes(block)
			? await rpcMethods.getTransactionByBlockHashAndIndex(
					this.requestManager,
					block,
					transactionIndex,
			  )
			: await rpcMethods.getTransactionByBlockNumberAndIndex(
					this.requestManager,
					block,
					transactionIndex,
			  );

		return response === null
			? response
			: convertObjectPropertiesToValidType<
					TransactionInfoFormatted<ReturnType>,
					TransactionInfo,
					(keyof TransactionInfo)[],
					ReturnType
			  >(
					response,
					// TODO
					// @ts-expect-error TSC is complaining about different properties being
					// available by various tx types
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					convertibleTransactionInfoProperties,
					returnType ?? this.defaultReturnType,
			  );
	}

	public async getTransactionReceipt<ReturnType extends ValidTypes = ValidTypes.HexString>(
		transactionHash: HexString32Bytes,
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getTransactionReceipt(
			this.requestManager,
			transactionHash,
		);

		return response === null
			? response
			: convertObjectPropertiesToValidType<
					ReceiptInfoFormatted<ReturnType>,
					ReceiptInfo,
					(keyof ReceiptInfo)[],
					ReturnType
			  >(
					response,
					// TODO
					// @ts-expect-error TSC is complaining about different properties being
					// available by various tx types
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					convertibleReceiptInfoProperties,
					returnType ?? (this.defaultReturnType as ReturnType),
			  );
	}

	public async getTransactionCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
		address: Address,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getTransactionCount(
			this.requestManager,
			address,
			blockNumber,
		);

		return convertToValidType(
			response,
			returnType ?? this.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	// public async sendTransaction(transaction: Transaction) {
	// 	return rpcMethods.sendTransaction(
	// 		this.requestManager,
	// 		transaction,
	// 	);
	// }

	public async sendSignedTransaction(transaction: HexStringBytes) {
		return rpcMethods.sendRawTransaction(this.requestManager, transaction);
	}

	// TODO address can be an address or the index of a local wallet in web3.eth.accounts.wallet
	// https://web3js.readthedocs.io/en/v1.5.2/web3-eth.html?highlight=sendTransaction#sign
	public async sign(message: HexStringBytes, address: Address) {
		return rpcMethods.sign(this.requestManager, address, message);
	}

	// public async signTransaction(transaction: Transaction) {
	// 	return rpcMethods.signTransaction(
	// 		this.requestManager,
	// 		transaction,
	// 	);
	// }

	// TODO Decide what to do with transaction.to
	// https://github.com/ChainSafe/web3.js/pull/4525#issuecomment-982330076
	// public async call(
	// 	transaction: Transaction & { to: Address },
	// 	blockNumber: BlockNumberOrTag = this.defaultBlock,
	// ) {
	// 	return rpcMethods.call(this.requestManager, transaction, blockNumber);
	// }

	// TODO Missing param
	// public async estimateGas<ReturnType extends ValidTypes = ValidTypes.HexString>(
	// 	transaction: Transaction,
	// 	blockNumber: BlockNumberOrTag = this.defaultBlock,
	// 	returnType?: ReturnType,
	// ) {
	// 	const response = await rpcMethods.estimateGas(
	// 		this.requestManager,
	// 		transaction,
	// 		blockNumber,
	// 	);

	// 	return convertToValidType(
	// 		response,
	// 		returnType ?? this.defaultReturnType,
	// 	) as ValidReturnTypes[ReturnType];
	// }

	public async getPastLogs(filter: Filter) {
		return rpcMethods.getLogs(this.requestManager, {
			...filter,
			// These defaults are carried over from 1.x
			// https://web3js.readthedocs.io/en/v1.5.2/web3-eth.html?highlight=sendTransaction#getpastlogs
			fromBlock: filter.fromBlock ?? this.defaultBlock,
			toBlock: filter.toBlock ?? this.defaultBlock,
		});
	}

	public async getWork() {
		return rpcMethods.getWork(this.requestManager);
	}

	public async submitWork(
		nonce: HexString8Bytes,
		seedHash: HexString32Bytes,
		difficulty: HexString32Bytes,
	) {
		return rpcMethods.submitWork(this.requestManager, nonce, seedHash, difficulty);
	}

	public async requestAccounts() {
		const response = await rpcMethods.requestAccounts(this.requestManager);
		response.map(address => toChecksumAddress(address));
		return response;
	}

	public async getChainId<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getChainId(this.requestManager);

		return convertToValidType(
			response,
			returnType ?? this.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getNodeInfo() {
		return rpcMethods.clientVersion(this.requestManager);
	}

	public async getProof<ReturnType extends ValidTypes = ValidTypes.HexString>(
		address: Address,
		storageKeys: HexString32Bytes[],
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getProof(
			this.requestManager,
			address,
			storageKeys,
			blockNumber,
		);

		return convertObjectPropertiesToValidType<
			GetProofResultFormatted<ReturnType>,
			Proof,
			(keyof Proof)[],
			ReturnType
		>(
			response,
			convertibleProofProperties,
			returnType ?? (this.defaultReturnType as ReturnType),
		);
	}
}
