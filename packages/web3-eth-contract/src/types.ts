import { EventEmitter } from 'events';
import { BlockNumberOrTag, EthExecutionAPI } from 'web3-common';
import { SupportedProviders } from 'web3-core';
import { ContractAbi, ContractEvents, ContractMethods } from 'web3-eth-abi';
import { Address, Bytes, Numbers, Uint, HexString } from 'web3-utils';

type Callback<T> = (error: Error, result: T) => void;

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

// TODO: Add correct type
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TransactionReceipt {}

// TODO: Add correct type
// eslint-disable-next-line
export interface PromiEvent<T> {
	T: T;
}

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

export interface NonPayableTransactionObject<T> {
	arguments: T;
	call(tx?: NonPayableTx, block?: BlockNumberOrTag): Promise<T>;
	send(tx?: NonPayableTx): PromiEvent<TransactionReceipt>;
	estimateGas(tx?: NonPayableTx): Promise<number>;
	encodeABI(): string;
}

export interface PayableTransactionObject<T> {
	arguments: T;
	call(tx?: PayableTx, block?: BlockNumberOrTag): Promise<T>;
	send(tx?: PayableTx): PromiEvent<TransactionReceipt>;
	estimateGas(tx?: PayableTx): Promise<number>;
	encodeABI(): string;
}

export type ContractMethodsInterface<
	Abi extends ContractAbi,
	Methods extends ContractMethods<Abi>,
> = {
	[Name in keyof Methods]: {
		call: (
			args: Methods[Name]['Inputs'],
			// TODO: Debug why the `Abi` object is not accessible.
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
		) => Methods[Name]['Abi']['stateMutability'] extends 'payable' | 'pure'
			? PayableTransactionObject<Methods[Name]['Outputs']>
			: NonPayableTransactionObject<Methods[Name]['Outputs']>;
	};
};

export type ContractEventsInterface<Abi extends ContractAbi, Events extends ContractEvents<Abi>> = {
	[Name in keyof Events]: (cb?: Callback<Events[Name]['Inputs']>) => EventEmitter;
};

export type ContractEventEmitterInterface<
	Abi extends ContractAbi,
	Events extends ContractEvents<Abi>,
> = {
	[Name in keyof Events]: Events[Name]['Inputs'];
};
