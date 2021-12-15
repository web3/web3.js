import { EventEmitter } from 'events';
import { EthExecutionAPI, PromiEvent, ReceiptInfo } from 'web3-common';
import { SupportedProviders } from 'web3-core';
import { ContractAbi, ContractEvents, ContractMethods } from 'web3-eth-abi';
import { Address, Bytes, Numbers, Uint, HexString, BlockNumberOrTag } from 'web3-utils';

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
	filter?: object;
	fromBlock?: BlockNumberOrTag;
	topics?: string[];
}

export interface ContractOptions {
	readonly gas: Uint | null;
	readonly gasPrice: Uint | null;
	readonly from?: Address;
	readonly data?: Bytes;
	jsonInterface: ContractAbi;
	address?: Address | null;
}

export interface ContractInitOptions {
	readonly gas: Uint | null;
	readonly gasPrice: Uint | null;
	readonly from?: Address;
	readonly data?: Bytes;
	readonly gasLimit: Uint;
	readonly provider: SupportedProviders<EthExecutionAPI> | string;
}

export type TransactionReceipt = ReceiptInfo;

export interface NonPayableTx {
	nonce?: Numbers;
	chainId?: Numbers;
	from?: Address;
	to?: Address;
	data?: HexString;
	gas?: Numbers;
	maxPriorityFeePerGas?: Numbers;
	maxFeePerGas?: Numbers;
	gasPrice?: Numbers;
}

export interface PayableTx extends NonPayableTx {
	value?: Numbers;
}

export interface NonPayableTransactionObject<Inputs, Outputs> {
	arguments: Array<Inputs[keyof Inputs]>;
	call(tx?: NonPayableTx, block?: BlockNumberOrTag): Promise<Outputs>;
	send(tx?: NonPayableTx): PromiEvent<
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
	estimateGas(tx?: NonPayableTx): Promise<number>;
	encodeABI(): string;
}

export interface PayableTransactionObject<Inputs, Outputs> {
	arguments: Array<Inputs[keyof Inputs]>;
	call(tx?: PayableTx, block?: BlockNumberOrTag): Promise<Outputs>;
	send(tx?: PayableTx): PromiEvent<
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
	estimateGas(tx?: PayableTx): Promise<number>;
	encodeABI(): string;
}

export type ContractMethodsInterface<
	Abi extends ContractAbi,
	Methods extends ContractMethods<Abi>,
> = {
	[Name in keyof Methods]: (
		...args: Array<Methods[Name]['Inputs'][keyof Methods[Name]['Inputs']]>
	) => // TODO: Debug why the `Abi` object is not accessible.
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	Methods[Name]['Abi']['stateMutability'] extends 'payable' | 'pure'
		? PayableTransactionObject<Methods[Name]['Inputs'], Methods[Name]['Outputs']>
		: NonPayableTransactionObject<Methods[Name]['Inputs'], Methods[Name]['Outputs']>;
};

export type ContractEventsInterface<Abi extends ContractAbi, Events extends ContractEvents<Abi>> = {
	[Name in keyof Events]:
		| ((cb: Callback<ContractEventLog<Events[Name]['Inputs']>>) => EventEmitter)
		| ((
				options: ContactEventOptions,
				cb: Callback<ContractEventLog<Events[Name]['Inputs']>>,
		  ) => EventEmitter);
};

export type ContractEventEmitterInterface<
	Abi extends ContractAbi,
	Events extends ContractEvents<Abi>,
> = {
	[Name in keyof Events]: Events[Name]['Inputs'];
};
