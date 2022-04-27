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

/* eslint-disable max-classes-per-file */
import {
	ERR_TX_CHAIN_ID_MISMATCH,
	ERR_TX_INVALID_CALL,
	ERR_TX_INVALID_CHAIN_INFO,
	ERR_TX_INVALID_SENDER,
	ERR_TX_MISSING_CHAIN_INFO,
	ERR_TX_MISSING_CUSTOM_CHAIN,
	ERR_TX_MISSING_CUSTOM_CHAIN_ID,
	ERR_TX_MISSING_GAS,
	ERR_TX_INVALID_FEE_MARKET_GAS,
	ERR_TX_INVALID_LEGACY_FEE_MARKET,
	ERR_TX_INVALID_NONCE_OR_CHAIN_ID,
	ERR_TX_UNSUPPORTED_EIP_1559,
	ERR_TX_UNSUPPORTED_TYPE,
	ERR_TX_UNABLE_TO_POPULATE_NONCE,
	ERR_TX_INVALID_OBJECT,
	ERR_TX_INVALID_FEE_MARKET_GAS_PRICE,
	ERR_TX_INVALID_LEGACY_GAS,
	ERR_TX_DATA_AND_INPUT,
	ERR_TX_POLLING_TIMEOUT,
	ERR_TX_RECEIPT_MISSING_OR_BLOCKHASH_NULL,
	ERR_TX_RECEIPT_MISSING_BLOCK_NUMBER,
	ERR_SIGNATURE_FAILED,
} from 'web3-common';
import { Bytes, HexString, Numbers, Web3Error } from 'web3-utils';

import { ReceiptInfo } from './types';

export class InvalidTransactionWithSender extends Web3Error {
	public code = ERR_TX_INVALID_SENDER;

	public constructor(value: unknown) {
		super(value, 'invalid transaction with sender');
	}
}

export class InvalidTransactionCall extends Web3Error {
	public code = ERR_TX_INVALID_CALL;

	public constructor(value: unknown) {
		super(value, 'invalid transaction call');
	}
}

export class MissingCustomChainError extends Web3Error {
	public code = ERR_TX_MISSING_CUSTOM_CHAIN;

	public constructor() {
		super(
			'MissingCustomChainError',
			'If tx.common is provided it must have tx.common.customChain',
		);
	}
}

export class MissingCustomChainIdError extends Web3Error {
	public code = ERR_TX_MISSING_CUSTOM_CHAIN_ID;

	public constructor() {
		super(
			'MissingCustomChainIdError',
			'If tx.common is provided it must have tx.common.customChain and tx.common.customChain.chainId',
		);
	}
}

export class ChainIdMismatchError extends Web3Error {
	public code = ERR_TX_CHAIN_ID_MISMATCH;

	public constructor(value: { txChainId: unknown; customChainId: unknown }) {
		super(
			JSON.stringify(value),
			// https://github.com/ChainSafe/web3.js/blob/8783f4d64e424456bdc53b34ef1142d0a7cee4d7/packages/web3-eth-accounts/src/index.js#L176
			'Chain Id doesnt match in tx.chainId tx.common.customChain.chainId',
		);
	}
}

export class CommonOrChainAndHardforkError extends Web3Error {
	public code = ERR_TX_INVALID_CHAIN_INFO;

	public constructor() {
		super(
			'CommonOrChainAndHardforkError',
			'Please provide the @ethereumjs/common object or the chain and hardfork property but not all together.',
		);
	}
}

export class MissingChainOrHardforkError extends Web3Error {
	public code = ERR_TX_MISSING_CHAIN_INFO;

	public constructor(value: { chain: string | undefined; hardfork: string | undefined }) {
		super(
			'MissingChainOrHardforkError',
			`When specifying chain and hardfork, both values must be defined. Received "chain": ${
				value.chain ?? 'undefined'
			}, "hardfork": ${value.hardfork ?? 'undefined'}`,
		);
	}
}

export class MissingGasError extends Web3Error {
	public code = ERR_TX_MISSING_GAS;

	public constructor(value: {
		gas: Numbers | undefined;
		gasLimit: Numbers | undefined;
		gasPrice: Numbers | undefined;
		maxPriorityFeePerGas: Numbers | undefined;
		maxFeePerGas: Numbers | undefined;
	}) {
		super(
			`gas: ${value.gas ?? 'undefined'}, gasLimit: ${
				value.gasLimit ?? 'undefined'
			}, gasPrice: ${value.gasPrice ?? 'undefined'}, maxPriorityFeePerGas: ${
				value.maxPriorityFeePerGas ?? 'undefined'
			}, maxFeePerGas: ${value.maxFeePerGas ?? 'undefined'}`,
			'"gas" is missing',
		);
	}
}

export class TransactionGasMismatchError extends Web3Error {
	public code = ERR_TX_MISSING_GAS;

	public constructor(value: {
		gas: Numbers | undefined;
		gasLimit: Numbers | undefined;
		gasPrice: Numbers | undefined;
		maxPriorityFeePerGas: Numbers | undefined;
		maxFeePerGas: Numbers | undefined;
	}) {
		super(
			`gas: ${value.gas ?? 'undefined'}, gasLimit: ${
				value.gasLimit ?? 'undefined'
			}, gasPrice: ${value.gasPrice ?? 'undefined'}, maxPriorityFeePerGas: ${
				value.maxPriorityFeePerGas ?? 'undefined'
			}, maxFeePerGas: ${value.maxFeePerGas ?? 'undefined'}`,
			'transaction must specify legacy or fee market gas properties, not both',
		);
	}
}

export class InvalidGasOrGasPrice extends Web3Error {
	public code = ERR_TX_INVALID_LEGACY_GAS;

	public constructor(value: { gas: Numbers | undefined; gasPrice: Numbers | undefined }) {
		super(
			`gas: ${value.gas ?? 'undefined'}, gasPrice: ${value.gasPrice ?? 'undefined'}`,
			'Gas or gasPrice is lower than 0',
		);
	}
}

export class InvalidMaxPriorityFeePerGasOrMaxFeePerGas extends Web3Error {
	public code = ERR_TX_INVALID_FEE_MARKET_GAS;

	public constructor(value: {
		maxPriorityFeePerGas: Numbers | undefined;
		maxFeePerGas: Numbers | undefined;
	}) {
		super(
			`maxPriorityFeePerGas: ${value.maxPriorityFeePerGas ?? 'undefined'}, maxFeePerGas: ${
				value.maxFeePerGas ?? 'undefined'
			}`,
			'maxPriorityFeePerGas or maxFeePerGas is lower than 0',
		);
	}
}

export class Eip1559GasPriceError extends Web3Error {
	public code = ERR_TX_INVALID_FEE_MARKET_GAS_PRICE;

	public constructor(value: unknown) {
		super(value, "eip-1559 transactions don't support gasPrice");
	}
}

export class UnsupportedFeeMarketError extends Web3Error {
	public code = ERR_TX_INVALID_LEGACY_FEE_MARKET;

	public constructor(value: {
		maxPriorityFeePerGas: Numbers | undefined;
		maxFeePerGas: Numbers | undefined;
	}) {
		super(
			`maxPriorityFeePerGas: ${value.maxPriorityFeePerGas ?? 'undefined'}, maxFeePerGas: ${
				value.maxFeePerGas ?? 'undefined'
			}`,
			"pre-eip-1559 transaction don't support maxFeePerGas/maxPriorityFeePerGas",
		);
	}
}

export class InvalidTransactionObjectError extends Web3Error {
	public code = ERR_TX_INVALID_OBJECT;

	public constructor(value: unknown) {
		super(value, 'invalid transaction object');
	}
}

export class InvalidNonceOrChainIdError extends Web3Error {
	public code = ERR_TX_INVALID_NONCE_OR_CHAIN_ID;

	public constructor(value: { nonce: Numbers | undefined; chainId: Numbers | undefined }) {
		super(
			`nonce: ${value.nonce ?? 'undefined'}, chainId: ${value.chainId ?? 'undefined'}`,
			'Nonce or chainId is lower than 0',
		);
	}
}

export class UnableToPopulateNonceError extends Web3Error {
	public code = ERR_TX_UNABLE_TO_POPULATE_NONCE;

	public constructor() {
		super('UnableToPopulateNonceError', 'unable to populate nonce, no from address available');
	}
}

export class Eip1559NotSupportedError extends Web3Error {
	public code = ERR_TX_UNSUPPORTED_EIP_1559;

	public constructor() {
		super('Eip1559NotSupportedError', "Network doesn't support eip-1559");
	}
}

export class UnsupportedTransactionTypeError extends Web3Error {
	public code = ERR_TX_UNSUPPORTED_TYPE;

	public constructor(value: unknown) {
		super(value, 'unsupported transaction type');
	}
}

export class TransactionDataAndInputError extends Web3Error {
	public code = ERR_TX_DATA_AND_INPUT;

	public constructor(value: { data: HexString | undefined; input: HexString | undefined }) {
		super(
			`data: ${value.data ?? 'undefined'}, input: ${value.input ?? 'undefined'}`,
			'You can\'t have "data" and "input" as properties of transactions at the same time, please use either "data" or "input" instead.',
		);
	}
}

export class TransactionPollingTimeoutError extends Web3Error {
	public code = ERR_TX_POLLING_TIMEOUT;

	public constructor(value: { numberOfSeconds: number; transactionHash: Bytes }) {
		super(
			`transactionHash: ${value.transactionHash.toString()}`,
			`Transaction was not mined within ${value.numberOfSeconds} seconds, please make sure your transaction was properly sent. Be aware that it might still be mined!`,
		);
	}
}

export class TransactionMissingReceiptOrBlockHashError extends Web3Error {
	public code = ERR_TX_RECEIPT_MISSING_OR_BLOCKHASH_NULL;

	public constructor(value: { receipt: ReceiptInfo; blockHash: Bytes; transactionHash: Bytes }) {
		super(
			`receipt: ${JSON.stringify(
				value.receipt,
			)}, blockHash: ${value.blockHash.toString()}, transactionHash: ${value.transactionHash.toString()}`,
			`Receipt missing or blockHash null`,
		);
	}
}

export class TransactionReceiptMissingBlockNumberError extends Web3Error {
	public code = ERR_TX_RECEIPT_MISSING_BLOCK_NUMBER;

	public constructor(value: { receipt: ReceiptInfo }) {
		super(`receipt: ${JSON.stringify(value.receipt)}`, `Receipt missing block number`);
	}
}

export class SignatureError extends Web3Error {
	public code = ERR_SIGNATURE_FAILED;
}
