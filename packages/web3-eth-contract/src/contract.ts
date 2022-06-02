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

import {
	DataFormat,
	DEFAULT_RETURN_FORMAT,
	EthExecutionAPI,
	format,
	inputAddressFormatter,
	inputLogFormatter,
	LogsInput,
	PromiEvent,
	Web3EventEmitter,
	ReceiptInfo,
} from 'web3-common';
import { Web3Context, Web3ContextObject } from 'web3-core';
import {
	call,
	estimateGas,
	getLogs,
	sendTransaction,
	SendTransactionEvents,
	NewHeadsSubscription,
} from 'web3-eth';
import {
	AbiEventFragment,
	AbiFunctionFragment,
	ContractAbi,
	ContractConstructor,
	ContractEvents,
	ContractMethod,
	ContractMethods,
	encodeEventSignature,
	encodeFunctionSignature,
	isAbiEventFragment,
	isAbiFunctionFragment,
	jsonInterfaceMethodToString,
} from 'web3-eth-abi';
import {
	Address,
	BlockNumberOrTag,
	BlockTags,
	Bytes,
	Filter,
	HexString,
	toChecksumAddress,
} from 'web3-utils';
import { validator } from 'web3-validator';
import { ALL_EVENTS_ABI } from './constants';
import { decodeEventABI, decodeMethodReturn, encodeEventABI, encodeMethodABI } from './encoding';
import { Web3ContractError } from './errors';
import { LogsSubscription } from './log_subscription';
import {
	ContractEventOptions,
	ContractInitOptions,
	ContractOptions,
	NonPayableCallOptions,
	NonPayableMethodObject,
	NonPayableTxOptions,
	PayableCallOptions,
	PayableMethodObject,
	PayableTxOptions,
} from './types';
import { getEstimateGasParams, getEthTxCallParams, getSendTxParams } from './utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContractBoundMethod<Method extends ContractMethod<any>> = (
	...args: Method['Inputs']
) => Method['Abi']['stateMutability'] extends 'payable' | 'pure'
	? PayableMethodObject<Method['Inputs'], Method['Outputs']>
	: NonPayableMethodObject<Method['Inputs'], Method['Outputs']>;

// To avoid circular dependency between types and encoding, declared these types here.
export type ContractMethodsInterface<
	Abi extends ContractAbi,
	Methods extends ContractMethods<Abi> = ContractMethods<Abi>,
> = {
	[Name in keyof Methods]: ContractBoundMethod<Methods[Name]>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
} & { [key: string]: ContractBoundMethod<any> };

type ContractBoundEvent = (options?: ContractEventOptions) => Promise<LogsSubscription>;

// To avoid circular dependency between types and encoding, declared these types here.
export type ContractEventsInterface<
	Abi extends ContractAbi,
	Events extends ContractEvents<Abi> = ContractEvents<Abi>,
> = {
	[Name in keyof Events | 'allEvents']: ContractBoundEvent;
} & {
	[key: string]: ContractBoundEvent;
};

// To avoid circular dependency between types and encoding, declared these types here.
export type ContractEventEmitterInterface<
	Abi extends ContractAbi,
	Events extends ContractEvents<Abi> = ContractEvents<Abi>,
> = {
	[Name in keyof Events]: Events[Name]['Inputs'];
};

type EventParameters = Parameters<typeof encodeEventABI>[2];

export class Contract<Abi extends ContractAbi>
	extends Web3Context<
		EthExecutionAPI,
		{
			logs: typeof LogsSubscription;
			newHeads: typeof NewHeadsSubscription;
			newBlockHeaders: typeof NewHeadsSubscription;
		}
	>
	implements Web3EventEmitter<ContractEventEmitterInterface<Abi>>
{
	public readonly options: ContractOptions;

	public static defaultAccount?: HexString;
	public static defaultBlock?: BlockNumberOrTag;
	public static defaultHardfork?: string;
	public static defaultCommon?: Record<string, unknown>;
	public static transactionBlockTimeout?: number;
	public static transactionConfirmationBlocks?: number;
	public static transactionPollingInterval?: number;
	public static transactionPollingTimeout?: number;
	public static transactionReceiptPollingInterval?: number;
	public static transactionConfirmationPollingInterval?: number;
	public static blockHeaderTimeout?: number;
	public static handleRevert?: boolean;

	private _jsonInterface!: Abi;
	private _address?: Address | null;
	private _functions: Record<
		string,
		{
			signature: string;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			method: ContractBoundMethod<any>;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			cascadeFunction?: ContractBoundMethod<any>;
		}
	> = {};

	private _methods!: ContractMethodsInterface<Abi>;
	private _events!: ContractEventsInterface<Abi>;

	public constructor(
		jsonInterface: Abi,
		address?: Address,
		options?: ContractInitOptions,
		context?: Partial<
			Web3ContextObject<
				EthExecutionAPI,
				{
					logs: typeof LogsSubscription;
					newHeads: typeof NewHeadsSubscription;
					newBlockHeaders: typeof NewHeadsSubscription;
				}
			>
		>,
	) {
		super({
			...context,
			// Pass an empty string to avoid type issue. Error will be thrown from underlying validation
			provider: options?.provider ?? context?.provider ?? Contract.givenProvider ?? '',
			registeredSubscriptions: {
				logs: LogsSubscription,
				newHeads: NewHeadsSubscription,
				newBlockHeaders: NewHeadsSubscription,
			},
		});

		this._parseAndSetAddress(address);
		this._parseAndSetJsonInterface(jsonInterface);

		this.options = {
			address: undefined,
			jsonInterface: [],
			gas: options?.gas ?? options?.gasLimit ?? null,
			gasPrice: options?.gasPrice ?? null,
			gasLimit: options?.gasLimit,
			from: options?.from,
			data: options?.data,
		};

		Object.defineProperty(this.options, 'address', {
			set: (value: Address) => this._parseAndSetAddress(value),
			get: () => this._address,
		});

		Object.defineProperty(this.options, 'jsonInterface', {
			set: (value: ContractAbi) => this._parseAndSetJsonInterface(value),
			get: () => this._jsonInterface,
		});
	}

	public get defaultAccount() {
		return (this.constructor as typeof Contract).defaultAccount ?? super.defaultAccount;
	}

	public set defaultAccount(value: Address | undefined) {
		super.defaultAccount = value;
	}

	public get defaultBlock() {
		return (this.constructor as typeof Contract).defaultBlock ?? super.defaultBlock;
	}

	public set defaultBlock(value: BlockNumberOrTag) {
		super.defaultBlock = value;
	}

	public get defaultHardfork() {
		return (this.constructor as typeof Contract).defaultHardfork ?? super.defaultHardfork;
	}

	public set defaultHardfork(value: string) {
		super.defaultHardfork = value;
	}

	public get defaultCommon() {
		return (this.constructor as typeof Contract).defaultCommon ?? super.defaultCommon;
	}

	public set defaultCommon(value: Record<string, unknown> | undefined) {
		super.defaultCommon = value;
	}

	public get transactionBlockTimeout() {
		return (
			(this.constructor as typeof Contract).transactionBlockTimeout ??
			super.transactionBlockTimeout
		);
	}

	public set transactionBlockTimeout(value: number) {
		super.transactionBlockTimeout = value;
	}

	public get transactionConfirmationBlocks() {
		return (
			(this.constructor as typeof Contract).transactionConfirmationBlocks ??
			super.transactionConfirmationBlocks
		);
	}

	public set transactionConfirmationBlocks(value: number) {
		super.transactionConfirmationBlocks = value;
	}

	public get transactionPollingInterval() {
		return (
			(this.constructor as typeof Contract).transactionPollingInterval ??
			super.transactionPollingInterval
		);
	}

	public set transactionPollingInterval(value: number) {
		super.transactionPollingInterval = value;
	}

	public get transactionPollingTimeout() {
		return (
			(this.constructor as typeof Contract).transactionPollingTimeout ??
			super.transactionPollingTimeout
		);
	}

	public set transactionPollingTimeout(value: number) {
		super.transactionPollingTimeout = value;
	}

	public get transactionReceiptPollingInterval() {
		return (
			(this.constructor as typeof Contract).transactionReceiptPollingInterval ??
			super.transactionReceiptPollingInterval
		);
	}

	public set transactionReceiptPollingInterval(value: number | undefined) {
		super.transactionReceiptPollingInterval = value;
	}

	public get transactionConfirmationPollingInterval() {
		return (
			(this.constructor as typeof Contract).transactionConfirmationPollingInterval ??
			super.transactionConfirmationPollingInterval
		);
	}

	public set transactionConfirmationPollingInterval(value: number | undefined) {
		super.transactionConfirmationPollingInterval = value;
	}

	public get blockHeaderTimeout() {
		return (this.constructor as typeof Contract).blockHeaderTimeout ?? super.blockHeaderTimeout;
	}

	public set blockHeaderTimeout(value: number) {
		super.blockHeaderTimeout = value;
	}

	public get handleRevert() {
		return (this.constructor as typeof Contract).handleRevert ?? super.handleRevert;
	}

	public set handleRevert(value: boolean) {
		super.handleRevert = value;
	}

	public get events() {
		return this._events;
	}

	public get methods() {
		return this._methods;
	}

	public clone() {
		return new Contract<Abi>(this._jsonInterface, this._address ?? undefined, {
			gas: this.options.gas,
			gasPrice: this.options.gasPrice,
			gasLimit: this.options.gasLimit,
			from: this.options.from,
			data: this.options.data,
			provider: this.currentProvider,
		});
	}

	public deploy(deployOptions?: {
		data?: HexString;
		arguments?: ContractConstructor<Abi>['Inputs'];
	}) {
		const abi = this._jsonInterface.find(j => j.type === 'constructor');

		if (!abi) {
			throw new Web3ContractError('No constructor interface found.');
		}

		const data = format(
			{ eth: 'bytes' },
			deployOptions?.data ?? this.options.data,
			DEFAULT_RETURN_FORMAT,
		);

		if (!data || data.trim() === '0x') {
			throw new Web3ContractError('No data provided.');
		}

		const args = deployOptions?.arguments ?? [];

		const contractOptions = { ...this.options, data };

		return {
			arguments: args,
			send: (
				options?: PayableTxOptions,
			): PromiEvent<Contract<Abi>, SendTransactionEvents> => {
				const modifiedOptions = { ...options };

				// Remove to address
				// modifiedOptions.to = '0x0000000000000000000000000000000000000000';
				delete modifiedOptions.to;

				return this._contractMethodDeploySend(
					abi as AbiFunctionFragment,
					args,
					modifiedOptions,
					contractOptions,
				);
			},
			estimateGas: async <ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
				options?: PayableCallOptions,
				returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
			) => {
				const modifiedOptions = { ...options };

				// Remove to address
				delete modifiedOptions.to;

				return this._contractMethodEstimateGas({
					abi: abi as AbiFunctionFragment,
					params: args,
					returnFormat,
					options: modifiedOptions,
					contractOptions,
				});
			},
			encodeABI: () =>
				encodeMethodABI(
					abi as AbiFunctionFragment,
					args,
					format({ eth: 'bytes' }, data as Bytes, DEFAULT_RETURN_FORMAT),
				),
		};
	}

	public async getPastEvents<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		eventName: keyof ContractEvents<Abi> | 'allEvents',
		filter?: Omit<Filter, 'address'>,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		const abi =
			eventName === 'allEvents'
				? ALL_EVENTS_ABI
				: (this._jsonInterface.find(
						j => 'name' in j && j.name === eventName,
				  ) as AbiEventFragment & { signature: string });

		if (!abi) {
			throw new Web3ContractError(`Event ${eventName} not found.`);
		}

		const { fromBlock, toBlock, topics, address } = inputLogFormatter(
			encodeEventABI(this.options, abi, filter ?? {}),
		);

		const logs = await getLogs(this, { fromBlock, toBlock, topics, address }, returnFormat);

		return logs.map(log =>
			typeof log === 'string' ? log : decodeEventABI(abi, log as LogsInput),
		);
	}

	private _parseAndSetAddress(value?: Address) {
		this._address = value ? toChecksumAddress(inputAddressFormatter(value)) : null;
	}

	private _parseAndSetJsonInterface(abis: ContractAbi) {
		this._functions = {};

		this._methods = {} as ContractMethodsInterface<Abi>;
		this._events = {} as ContractEventsInterface<Abi>;

		let result: ContractAbi = [];

		for (const a of abis) {
			const abi = {
				...a,
			};

			if (isAbiFunctionFragment(abi)) {
				const methodName = jsonInterfaceMethodToString(abi);
				const methodSignature = encodeFunctionSignature(methodName);

				// make constant and payable backwards compatible
				abi.constant =
					abi.stateMutability === 'view' ??
					abi.stateMutability === 'pure' ??
					abi.constant;
				abi.payable = abi.stateMutability === 'payable' ?? abi.payable;

				if (methodName in this._functions) {
					this._functions[methodName] = {
						signature: methodSignature,
						method: this._createContractMethod(abi),
						cascadeFunction: this._functions[methodName].method,
					};
				} else {
					this._functions[methodName] = {
						signature: methodSignature,
						method: this._createContractMethod(abi),
					};
				}

				// We don't know a particular type of the Abi method so can't type check
				this._methods[abi.name as keyof ContractMethodsInterface<Abi>] = this._functions[
					methodName
				].method as never;

				// We don't know a particular type of the Abi method so can't type check
				this._methods[methodName as keyof ContractMethodsInterface<Abi>] = this._functions[
					methodName
				].method as never;

				// We don't know a particular type of the Abi method so can't type check
				this._methods[methodSignature as keyof ContractMethodsInterface<Abi>] = this
					._functions[methodName].method as never;
			} else if (isAbiEventFragment(abi)) {
				const eventName = jsonInterfaceMethodToString(abi);
				const eventSignature = encodeEventSignature(eventName);
				const event = this._createContractEvent(abi);

				if (!(eventName in this._events) || abi.name === 'bound') {
					// It's a private type and we don't want to expose it and no need to check
					this._events[eventName as keyof ContractEventsInterface<Abi>] = event as never;
				}
				// It's a private type and we don't want to expose it and no need to check
				this._events[abi.name as keyof ContractEventsInterface<Abi>] = event as never;
				// It's a private type and we don't want to expose it and no need to check
				this._events[eventSignature as keyof ContractEventsInterface<Abi>] = event as never;
			}

			const event = this._createContractEvent(ALL_EVENTS_ABI);
			this._events.allEvents = event;

			result = [...result, abi];
		}

		this._jsonInterface = [...result] as unknown as Abi;
	}

	private _createContractMethod<T extends AbiFunctionFragment>(
		abi: T,
	): ContractBoundMethod<ContractMethod<T>> {
		return (...params: unknown[]) => {
			validator.validate(abi.inputs, params);

			if (abi.stateMutability === 'payable' || abi.stateMutability === 'pure') {
				return {
					arguments: params,
					call: async (options?: PayableCallOptions, block?: BlockNumberOrTag) =>
						this._contractMethodCall(abi, params, options, block),
					send: (options?: PayableTxOptions) =>
						this._contractMethodSend(abi, params, options),
					estimateGas: async <
						ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT,
					>(
						options?: PayableCallOptions,
						returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
					) => this._contractMethodEstimateGas({ abi, params, returnFormat, options }),
					encodeABI: () => encodeMethodABI(abi, params),
				} as unknown as PayableMethodObject<
					ContractMethod<T>['Inputs'],
					ContractMethod<T>['Outputs']
				>;
			}

			return {
				arguments: params,
				call: async (options?: NonPayableCallOptions, block?: BlockNumberOrTag) =>
					this._contractMethodCall(abi, params, options, block),
				send: (options?: NonPayableTxOptions) =>
					this._contractMethodSend(abi, params, options),
				estimateGas: async <ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
					options?: NonPayableCallOptions,
					returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
				) => this._contractMethodEstimateGas({ abi, params, returnFormat, options }),
				encodeABI: () => encodeMethodABI(abi, params),
			} as unknown as NonPayableMethodObject<
				ContractMethod<T>['Inputs'],
				ContractMethod<T>['Outputs']
			>;
		};
	}

	private async _contractMethodCall<Options extends PayableCallOptions | NonPayableCallOptions>(
		abi: AbiFunctionFragment,
		params: unknown[],
		options?: Options,
		block?: BlockNumberOrTag,
	) {
		const tx = getEthTxCallParams({
			abi,
			params,
			options,
			contractOptions: this.options,
		});

		return decodeMethodReturn(abi, await call(this, tx, block, DEFAULT_RETURN_FORMAT));
	}

	private _contractMethodSend<Options extends PayableCallOptions | NonPayableCallOptions>(
		abi: AbiFunctionFragment,
		params: unknown[],
		options?: Options,
		contractOptions?: ContractOptions,
	) {
		let modifiedContractOptions = contractOptions ?? this.options;
		modifiedContractOptions = {
			...modifiedContractOptions,
			from: modifiedContractOptions.from ?? this.defaultAccount ?? undefined,
		};

		const tx = getSendTxParams({
			abi,
			params,
			options,
			contractOptions: modifiedContractOptions,
		});

		return sendTransaction(this, tx, DEFAULT_RETURN_FORMAT);
	}

	private _contractMethodDeploySend<Options extends PayableCallOptions | NonPayableCallOptions>(
		abi: AbiFunctionFragment,
		params: unknown[],
		options?: Options,
		contractOptions?: ContractOptions,
	) {
		let modifiedContractOptions = contractOptions ?? this.options;
		modifiedContractOptions = {
			...modifiedContractOptions,
			from: modifiedContractOptions.from ?? this.defaultAccount ?? undefined,
		};

		const tx = getSendTxParams({
			abi,
			params,
			options,
			contractOptions: modifiedContractOptions,
		});

		return sendTransaction(this, tx, DEFAULT_RETURN_FORMAT, {
			transactionResolver: receipt => {
				if (receipt.status === '0x0') {
					throw new Web3ContractError(
						'contract deployment error',
						receipt as ReceiptInfo,
					);
				}

				const newContract = this.clone();

				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				newContract.options.address = receipt.contractAddress as HexString;

				return newContract;
			},
		});
	}

	private async _contractMethodEstimateGas<
		Options extends PayableCallOptions | NonPayableCallOptions,
		ReturnFormat extends DataFormat,
	>({
		abi,
		params,
		returnFormat,
		options,
		contractOptions,
	}: {
		abi: AbiFunctionFragment;
		params: unknown[];
		returnFormat: ReturnFormat;
		options?: Options;
		contractOptions?: ContractOptions;
	}) {
		const tx = getEstimateGasParams({
			abi,
			params,
			options,
			contractOptions: contractOptions ?? this.options,
		});

		return estimateGas(this, tx, BlockTags.LATEST, returnFormat);
	}

	// eslint-disable-next-line class-methods-use-this
	private _createContractEvent(abi: AbiEventFragment): ContractBoundEvent {
		return async (...params: unknown[]) => {
			const encodedParams = encodeEventABI(
				this.options,
				{ ...abi, signature: encodeEventSignature(jsonInterfaceMethodToString(abi)) },
				params[0] as EventParameters,
			);

			const sub = new LogsSubscription(
				{ address: this.options.address, topics: encodedParams.topics, abi },
				{ requestManager: this.requestManager },
			);

			await this.subscriptionManager?.addSubscription(sub);

			return sub;
		};
	}
}
