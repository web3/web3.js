/* eslint-disable max-classes-per-file */

import { Web3Error } from 'web3-utils';

export class InvalidTransactionWithSender extends Web3Error {
	public constructor(value: unknown) {
		super(JSON.stringify(value), 'invalid transaction with sender');
	}
}

export class InvalidTransactionCall extends Web3Error {
	public constructor(value: unknown) {
		super(JSON.stringify(value), 'invalid transaction call');
	}
}

export class MissingCustomChainError extends Web3Error {
	public constructor(value: undefined) {
		super(value, 'If tx.common is provided it must have tx.common.customChain');
	}
}

export class MissingCustomChainIdError extends Web3Error {
	public constructor(value: undefined) {
		super(
			value,
			'If tx.common is provided it must have tx.common.customChain and tx.common.customChain.chainId',
		);
	}
}

export class ChainIdMismatchError extends Web3Error {
	public constructor(value: { txChainId: unknown; customChainId: unknown }) {
		super(
			JSON.stringify(value),
			'Chain Id doesnt match in tx.chainId tx.common.customChain.chainId',
		);
	}
}

export class CommonOrChainAndHardforkError extends Web3Error {
	public constructor() {
		// TODO - Discuss what to pass as value, would it make sense to pass common, chain, and hardfork for error message here?
		super(
			'N/A',
			'Please provide the @ethereumjs/common object or the chain and hardfork property but not all together.',
		);
	}
}

export class MissingChainOrHardforkError extends Web3Error {
	public constructor(value: { chain: string | undefined; hardfork: string | undefined }) {
		// TODO - Discuss what to pass as value
		super(
			'N/A',
			`When specifying chain and hardfork, both values must be defined. Received "chain": ${
				value.chain ?? 'undefined'
			}, "hardfork": ${value.hardfork ?? 'undefined'}`,
		);
	}
}

export class MissingGasError extends Web3Error {
	public constructor(value: unknown) {
		super(value, '"gas" is missing');
	}
}

export class InvalidGasOrGasPrice extends Web3Error {
	public constructor(value: { gas: unknown; gasPrice: unknown }) {
		super(JSON.stringify(value), 'Gas or gasPrice is lower than 0');
	}
}

export class InvalidMaxPriorityFeePerGasOrMaxFeePerGas extends Web3Error {
	public constructor(value: { maxPriorityFeePerGas: unknown; maxFeePerGas: unknown }) {
		super(JSON.stringify(value), 'maxPriorityFeePerGas or maxFeePerGas is lower than 0');
	}
}

export class Eip1559GasPriceError extends Web3Error {
	public constructor(value: unknown) {
		super(value, "eip-1559 transactions don't support gasPrice");
	}
}

export class UnsupportedFeeMarketError extends Web3Error {
	public constructor(value: { maxPriorityFeePerGas: unknown; maxFeePerGas: unknown }) {
		super(
			JSON.stringify(value),
			"pre-eip-1559 transaction don't support maxFeePerGas/maxPriorityFeePerGas",
		);
	}
}

export class InvalidTransactionObjectError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'invalid transaction obejct');
	}
}

export class InvalidNonceOrChainIdError extends Web3Error {
	public constructor(value: { nonce: unknown; chainId: unknown }) {
		super(JSON.stringify(value), 'Nonce or chainId is lower than 0');
	}
}

export class UnableToPopulateNonceError extends Web3Error {
	public constructor() {
		// TODO - Discuss what to pass as value
		super('N/A', 'unable to populate nonce, no from address available');
	}
}

export class Eip1559NotSupportedError extends Web3Error {
	public constructor() {
		// TODO - Discuss what to pass as value
		super('N/A', "Network doesn't support eip-1559");
	}
}

export class UnsupportedTransactionTypeError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'unsupported transaction type');
	}
}
