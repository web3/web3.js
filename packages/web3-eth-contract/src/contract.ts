import { EthExecutionAPI, inputAddressFormatter, Web3EventEmitter } from 'web3-common';
import { Web3Context } from 'web3-core';
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
	hexToNumber,
	toChecksumAddress,
	HexString,
} from 'web3-utils';
import { validator } from 'web3-validator';
import { decodeMethodReturn, encodeEventABI, encodeMethodABI } from './encoding';
import { Web3ContractError } from './errors';
import { LogsSubscription } from './log_subscription';
import {
	ContractEventOptions,
	ContractInitOptions,
	ContractOptions,
	NonPayableCallOptions,
	NonPayableMethodObject,
	PayableCallOptions,
	PayableMethodObject,
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
	[Name in keyof Events]: ContractBoundEvent;
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
	extends Web3Context<EthExecutionAPI, { logs: typeof LogsSubscription }>
	implements Web3EventEmitter<ContractEventEmitterInterface<Abi>>
{
	public readonly options: ContractOptions;

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

	public constructor(jsonInterface: Abi, address?: Address, options?: ContractInitOptions) {
		super(options?.provider ?? '', {}, { logs: LogsSubscription });

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

		if (!deployOptions?.data) {
			throw new Web3ContractError('No data provided.');
		}
		const data = deployOptions?.data ?? this.options.data;
		const args = deployOptions?.arguments ?? [];
		validator.validate(['string'], args);

		const contractOptions = { ...this.options, data };

		return {
			arguments: args,
			// TODO: Use `web3-eth-tx` package to return `PromiEvent` instead.
			send: async (options?: PayableCallOptions) => {
				const modifiedOptions = { ...options };
				delete modifiedOptions.to;

				const txHash = await this._contractMethodSend(
					abi as AbiFunctionFragment,
					args,
					modifiedOptions,
					contractOptions,
				);

				return txHash;

				// TODO: Use eth-tx functions to
				//
				// 1. Get the transaction receipt from the above txHash
				// 2. Extract the contract address from the receipt
				// 3. Get the code from eth_getCode for the contract address
				// 4. Return the contract instance with the new address and the code
				//
				// return new Contract<Abi>(this._jsonInterface, contractAddress as HexString, {
				// 	gas: this.options.gas,
				// 	gasPrice: this.options.gasPrice,
				// 	gasLimit: this.options.gasLimit,
				// 	from: this.options.from,
				// 	data: this.options.data,
				// 	provider: this.currentProvider,
				// });
			},
			estimateGas: async (options?: PayableCallOptions, block?: BlockNumberOrTag) => {
				const modifiedOptions = { ...options };
				delete modifiedOptions.to;

				return this._contractMethodEstimateGas(
					abi as AbiFunctionFragment,
					args,
					modifiedOptions,
					block,
					contractOptions,
				);
			},
			encodeABI: () => encodeMethodABI(abi as AbiFunctionFragment, args, data),
		};
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
					// TODO: Use `web3-eth-tx` package to return `PromiEvent` instead.
					send: async (options?: PayableCallOptions) =>
						this._contractMethodSend(abi, params, options),
					estimateGas: async (options?: PayableCallOptions, block?: BlockNumberOrTag) =>
						this._contractMethodEstimateGas(abi, params, options, block),
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
				send: async (options?: NonPayableCallOptions) =>
					this._contractMethodSend(abi, params, options),
				estimateGas: async (options?: NonPayableCallOptions, block?: BlockNumberOrTag) =>
					this._contractMethodEstimateGas(abi, params, options, block),
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
		return decodeMethodReturn(
			abi,
			await this.requestManager.send({
				method: 'eth_call',
				params: [
					getEthTxCallParams({
						abi,
						params,
						options,
						contractOptions: this.options,
					}),
					block ?? BlockTags.LATEST,
				],
			}),
		);
	}

	private async _contractMethodSend<Options extends PayableCallOptions | NonPayableCallOptions>(
		abi: AbiFunctionFragment,
		params: unknown[],
		options?: Options,
		contractOptions?: ContractOptions,
	) {
		return decodeMethodReturn(
			abi,
			await this.requestManager.send({
				method: 'eth_sendTransaction',
				params: [
					getSendTxParams({
						abi,
						params,
						options,
						contractOptions: contractOptions ?? this.options,
					}),
				],
			}),
		);
	}

	private async _contractMethodEstimateGas<
		Options extends PayableCallOptions | NonPayableCallOptions,
	>(
		abi: AbiFunctionFragment,
		params: unknown[],
		options?: Options,
		block?: BlockNumberOrTag,
		contractOptions?: ContractOptions,
	) {
		return hexToNumber(
			await this.requestManager.send({
				method: 'eth_estimateGas',
				params: [
					getEstimateGasParams({
						abi,
						params,
						options,
						contractOptions: contractOptions ?? this.options,
					}),
					block ?? BlockTags.LATEST,
				],
			}),
		);
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
