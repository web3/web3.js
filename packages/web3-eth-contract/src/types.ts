import { EthExecutionAPI, PromiEvent, ReceiptInfo } from 'web3-common';
import { LogsSubscription, SupportedProviders } from 'web3-core';
import { ContractAbi, ContractEvents, ContractMethods } from 'web3-eth-abi';
import {
	Address,
	Bytes,
	Numbers,
	Uint,
	HexString,
	BlockNumberOrTag,
	ObjectValueToTuple,
	Filter,
} from 'web3-utils';

export type Callback<T> = (error: Error, result: T) => void;

export interface EventLog {
	event: string;
	address: string;
	returnValues: unknown;
	logIndex: number;
	transactionIndex: number;
	transactionHash: string;
	blockHash: string;
	blockNumber: number;
	raw?: { data: string; topics: unknown[] };
}

export interface ContractEventLog<T> extends EventLog {
	returnValues: T;
}

export interface ContactEventOptions {
	filter?: Filter;
	fromBlock?: BlockNumberOrTag;
	topics?: string[];
}

export interface ContractOptions {
	readonly gas: Uint | null;
	readonly gasPrice: Uint | null;
	readonly from?: Address;
	readonly data?: Bytes;
	jsonInterface: ContractAbi;
	address?: Address;
}

export interface ContractInitOptions {
	readonly gas?: Uint | null;
	readonly gasPrice?: Uint | null;
	readonly from?: Address;
	readonly data?: Bytes;
	readonly gasLimit?: Uint;
	readonly provider: SupportedProviders<EthExecutionAPI> | string;
}

export type TransactionReceipt = ReceiptInfo;

export interface NonPayableCallOptions {
	nonce?: Numbers;
	chainId?: Numbers;
	from?: Address;
	to?: Address;
	data?: HexString;
	gas?: string;
	maxPriorityFeePerGas?: Numbers;
	maxFeePerGas?: Numbers;
	gasPrice?: string;
}

export interface PayableCallOptions extends NonPayableCallOptions {
	value?: string;
}

export interface NonPayableMethodObject<Inputs, Outputs> {
	arguments: Array<Inputs[keyof Inputs]>;
	call(tx?: NonPayableCallOptions, block?: BlockNumberOrTag): Promise<Outputs>;
	send(tx?: NonPayableCallOptions): PromiEvent<
		TransactionReceipt,
		{
			sending: object;
			sent: object;
			transactionHash: string;
			receipt: TransactionReceipt;
			confirmation: {
				confirmations: number;
				receipt: TransactionReceipt;
				latestBlockHash: HexString;
			};
			error: Error;
		}
	>;
	estimateGas(tx?: NonPayableCallOptions): Promise<number>;
	encodeABI(): string;
}

export interface PayableMethodObject<Inputs, Outputs> {
	arguments: Array<Inputs[keyof Inputs]>;
	call(tx?: PayableCallOptions, block?: BlockNumberOrTag): Promise<Outputs>;
	send(tx?: PayableCallOptions): PromiEvent<
		TransactionReceipt,
		{
			sending: object;
			sent: object;
			transactionHash: string;
			receipt: TransactionReceipt;
			confirmation: {
				confirmations: number;
				receipt: TransactionReceipt;
				latestBlockHash: HexString;
			};
			error: Error;
		}
	>;
	estimateGas(tx?: PayableCallOptions): Promise<number>;
	encodeABI(): HexString;
}

export type ContractMethodsInterface<
	Abi extends ContractAbi,
	Methods extends ContractMethods<Abi> = ContractMethods<Abi>,
> = {
	[key: string]: (
		...args: ReadonlyArray<unknown>
	) => PayableMethodObject<unknown, unknown> | NonPayableMethodObject<unknown, unknown>;
} & {
	[Name in keyof Methods]: (
		...args: ObjectValueToTuple<Methods[Name]['Inputs']>
	) => // TODO: Debug why `Abi` object is not accessible
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	Methods[Name]['Abi']['stateMutability'] extends 'payable' | 'pure'
		? PayableMethodObject<Methods[Name]['Inputs'], Methods[Name]['Outputs']>
		: NonPayableMethodObject<Methods[Name]['Inputs'], Methods[Name]['Outputs']>;
};

export type ContractEventsInterface<
	Abi extends ContractAbi,
	Events extends ContractEvents<Abi> = ContractEvents<Abi>,
> = {
	[key: string]: (options?: ContactEventOptions) => Promise<LogsSubscription>;
} & {
	[Name in keyof Events]: (options?: ContactEventOptions) => Promise<LogsSubscription>;
};

export type ContractEventEmitterInterface<
	Abi extends ContractAbi,
	Events extends ContractEvents<Abi> = ContractEvents<Abi>,
> = {
	[Name in keyof Events]: Events[Name]['Inputs'];
};
