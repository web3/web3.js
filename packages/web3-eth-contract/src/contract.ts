﻿/*
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

import { Web3Context, Web3EventEmitter, Web3PromiEvent } from 'web3-core';
import { ContractExecutionError, SubscriptionError, Web3ContractError } from 'web3-errors';
import {
	createAccessList,
	call,
	estimateGas,
	getLogs,
	NewHeadsSubscription,
	sendTransaction,
	SendTransactionEvents,
} from 'web3-eth';
import {
	encodeEventSignature,
	encodeFunctionSignature,
	isAbiErrorFragment,
	isAbiEventFragment,
	isAbiFunctionFragment,
	jsonInterfaceMethodToString,
} from 'web3-eth-abi';
import {
	AbiConstructorFragment,
	AbiErrorFragment,
	AbiEventFragment,
	AbiFragment,
	AbiFunctionFragment,
	ContractAbi,
	ContractConstructorArgs,
	ContractEvent,
	ContractEvents,
	ContractMethod,
	ContractMethodInputParameters,
	ContractMethodOutputParameters,
	Address,
	BlockNumberOrTag,
	BlockTags,
	Bytes,
	EthExecutionAPI,
	Filter,
	FilterAbis,
	HexString,
	LogsInput,
	Mutable,
	Common,
} from 'web3-types';
import {
	DataFormat,
	DEFAULT_RETURN_FORMAT,
	format,
	isDataFormat,
	toChecksumAddress,
} from 'web3-utils';
import {
	isNullish,
	validator,
	utils as validatorUtils,
	ValidationSchemaInput,
	Web3ValidatorError,
	Web3ValidationErrorObject,
} from 'web3-validator';
import { ALL_EVENTS_ABI } from './constants';
import {
	decodeEventABI,
	decodeMethodReturn,
	encodeEventABI,
	encodeMethodABI,
	decodeErrorData,
} from './encoding';
import { LogsSubscription } from './log_subscription';
import {
	ContractAbiWithSignature,
	ContractEventOptions,
	ContractInitOptions,
	ContractOptions,
	EventLog,
	NonPayableCallOptions,
	NonPayableMethodObject,
	NonPayableTxOptions,
	PayableCallOptions,
	PayableMethodObject,
	PayableTxOptions,
	Web3ContractContext,
} from './types';
import {
	getCreateAccessListParams,
	getEstimateGasParams,
	getEthTxCallParams,
	getSendTxParams,
	isContractInitOptions,
	isWeb3ContractContext,
} from './utils';

type ContractBoundMethod<
	Abi extends AbiFunctionFragment,
	Method extends ContractMethod<Abi> = ContractMethod<Abi>,
> = (
	...args: Method['Inputs']
) => Method['Abi']['stateMutability'] extends 'payable' | 'pure'
	? PayableMethodObject<Method['Inputs'], Method['Outputs']>
	: NonPayableMethodObject<Method['Inputs'], Method['Outputs']>;

export type ContractOverloadedMethodInputs<AbiArr extends ReadonlyArray<unknown>> = NonNullable<
	AbiArr extends readonly []
		? undefined
		: AbiArr extends readonly [infer A, ...infer R]
		? A extends AbiFunctionFragment
			? ContractMethodInputParameters<A['inputs']> | ContractOverloadedMethodInputs<R>
			: undefined
		: undefined
>;

export type ContractOverloadedMethodOutputs<AbiArr extends ReadonlyArray<unknown>> = NonNullable<
	AbiArr extends readonly []
		? undefined
		: AbiArr extends readonly [infer A, ...infer R]
		? A extends AbiFunctionFragment
			? ContractMethodOutputParameters<A['outputs']> | ContractOverloadedMethodOutputs<R>
			: undefined
		: undefined
>;

// To avoid circular dependency between types and encoding, declared these types here.
export type ContractMethodsInterface<Abi extends ContractAbi> = {
	[MethodAbi in FilterAbis<
		Abi,
		AbiFunctionFragment & { type: 'function' }
	> as MethodAbi['name']]: ContractBoundMethod<MethodAbi>;
	// To allow users to use method signatures
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
} & { [key: string]: ContractBoundMethod<any> };

/**
 * The event object can be accessed from `myContract.events.myEvent`.
 *
 * \> Remember: To subscribe to an event, your provider must have support for subscriptions.
 *
 * ```ts
 * const subscription = await myContract.events.MyEvent([options])
 * ```
 *
 * @param options - The options used to subscribe for the event
 * @returns - A Promise resolved with {@link LogsSubscription} object
 */
export type ContractBoundEvent = (options?: ContractEventOptions) => LogsSubscription;

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
export type ContractEventEmitterInterface<Abi extends ContractAbi> = {
	[EventAbi in FilterAbis<
		Abi,
		AbiFunctionFragment & { type: 'event' }
	> as EventAbi['name']]: ContractEvent<EventAbi>['Inputs'];
};

type EventParameters = Parameters<typeof encodeEventABI>[2];

const contractSubscriptions = {
	logs: LogsSubscription,
	newHeads: NewHeadsSubscription,
	newBlockHeaders: NewHeadsSubscription,
};

/**
 * The class designed to interact with smart contracts on the Ethereum blockchain.
 */
export class Contract<Abi extends ContractAbi>
	extends Web3Context<EthExecutionAPI, typeof contractSubscriptions>
	implements Web3EventEmitter<ContractEventEmitterInterface<Abi>>
{
	/**
	 * The options `object` for the contract instance. `from`, `gas` and `gasPrice` are used as fallback values when sending transactions.
	 *
	 * ```ts
	 * myContract.options;
	 * > {
	 *     address: '0x1234567890123456789012345678901234567891',
	 *     jsonInterface: [...],
	 *     from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
	 *     gasPrice: '10000000000000',
	 *     gas: 1000000
	 * }
	 *
	 * myContract.options.from = '0x1234567890123456789012345678901234567891'; // default from address
	 * myContract.options.gasPrice = '20000000000000'; // default gas price in wei
	 * myContract.options.gas = 5000000; // provide as fallback always 5M gas
	 * ```
	 */
	public readonly options: ContractOptions;

	/**
	 * Can be used to set {@link Contract.defaultAccount} for all contracts.
	 */
	public static defaultAccount?: HexString;

	/**
	 * Can be used to set {@link Contract.defaultBlock} for all contracts.
	 */
	public static defaultBlock?: BlockNumberOrTag;

	/**
	 * Can be used to set {@link Contract.defaultHardfork} for all contracts.
	 */
	public static defaultHardfork?: string;

	/**
	 * Can be used to set {@link Contract.defaultCommon} for all contracts.
	 */
	public static defaultCommon?: Common;

	/**
	 * Can be used to set {@link Contract.transactionSendTimeout} for all contracts.
	 */
	public static transactionSendTimeout?: number;

	/**
	 * Can be used to set {@link Contract.transactionBlockTimeout} for all contracts.
	 */
	public static transactionBlockTimeout?: number;

	/**
	 * Can be used to set {@link Contract.transactionConfirmationBlocks} for all contracts.
	 */
	public static transactionConfirmationBlocks?: number;

	/**
	 * Can be used to set {@link Contract.transactionPollingInterval} for all contracts.
	 */
	public static transactionPollingInterval?: number;

	/**
	 * Can be used to set {@link Contract.transactionPollingTimeout} for all contracts.
	 */
	public static transactionPollingTimeout?: number;

	/**
	 * Can be used to set {@link Contract.transactionReceiptPollingInterval} for all contracts.
	 */
	public static transactionReceiptPollingInterval?: number;

	/**
	 * Can be used to set {@link Contract.transactionConfirmationPollingInterval} for all contracts.
	 */
	public static transactionConfirmationPollingInterval?: number;

	/**
	 * Can be used to set {@link Contract.blockHeaderTimeout} for all contracts.
	 */
	public static blockHeaderTimeout?: number;

	/**
	 * Can be used to set {@link Contract.handleRevert} for all contracts.
	 */
	public static handleRevert?: boolean;

	private _errorsInterface!: AbiErrorFragment[];
	private _jsonInterface!: ContractAbiWithSignature;
	private _address?: Address;
	private _functions: Record<
		string,
		{
			signature: string;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			method: ContractBoundMethod<any>;
		}
	> = {};
	private readonly _overloadedMethodAbis: Map<string, AbiFunctionFragment[]>;
	private _methods!: ContractMethodsInterface<Abi>;
	private _events!: ContractEventsInterface<Abi>;

	/**
	 * Creates a new contract instance with all its methods and events defined in its {@doclink glossary/json_interface | json interface} object.
	 *
	 * ```ts
	 * new web3.eth.Contract(jsonInterface[, address][, options])
	 * ```
	 *
	 * @param jsonInterface - The JSON interface for the contract to instantiate.
	 * @param address - The address of the smart contract to call.
	 * @param options - The options of the contract. Some are used as fallbacks for calls and transactions.
	 * @param context - The context of the contract used for customizing the behavior of the contract.
	 * @returns - The contract instance with all its methods and events.
	 *
	 * ```ts title="Example"
	 * var myContract = new web3.eth.Contract([...], '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', {
	 *   from: '0x1234567890123456789012345678901234567891', // default from address
	 *   gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
	 * });
	 * ```
	 *
	 * To use the type safe interface for these contracts you have to include the ABI definitions in your Typescript project and then declare these as `const`.
	 *
	 * ```ts title="Example"
	 * const myContractAbi = [....] as const; // ABI definitions
	 * const myContract = new web3.eth.Contract(myContractAbi, '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe');
	 * ```
	 */
	public constructor(
		jsonInterface: Abi,
		context?: Web3ContractContext,
		returnFormat?: DataFormat,
	);
	public constructor(
		jsonInterface: Abi,
		address: Address,
		contextOrReturnFormat?: Web3ContractContext | DataFormat,
		returnFormat?: DataFormat,
	);
	public constructor(
		jsonInterface: Abi,
		options?: ContractInitOptions,
		contextOrReturnFormat?: Web3ContractContext | DataFormat,
		returnFormat?: DataFormat,
	);
	public constructor(
		jsonInterface: Abi,
		address: Address,
		options: ContractInitOptions,
		contextOrReturnFormat?: Web3ContractContext | DataFormat,
		returnFormat?: DataFormat,
	);
	public constructor(
		jsonInterface: Abi,
		addressOrOptionsOrContext?: Address | ContractInitOptions | Web3ContractContext,
		optionsOrContextOrReturnFormat?: ContractInitOptions | Web3ContractContext | DataFormat,
		contextOrReturnFormat?: Web3ContractContext | DataFormat,
		returnFormat?: DataFormat,
	) {
		let contractContext;
		if (isWeb3ContractContext(addressOrOptionsOrContext)) {
			contractContext = addressOrOptionsOrContext;
		} else if (isWeb3ContractContext(optionsOrContextOrReturnFormat)) {
			contractContext = optionsOrContextOrReturnFormat;
		} else {
			contractContext = contextOrReturnFormat;
		}

		let provider;
		if (
			typeof addressOrOptionsOrContext === 'object' &&
			'provider' in addressOrOptionsOrContext
		) {
			provider = addressOrOptionsOrContext.provider;
		} else if (
			typeof optionsOrContextOrReturnFormat === 'object' &&
			'provider' in optionsOrContextOrReturnFormat
		) {
			provider = optionsOrContextOrReturnFormat.provider;
		} else if (
			typeof contextOrReturnFormat === 'object' &&
			'provider' in contextOrReturnFormat
		) {
			provider = contextOrReturnFormat.provider;
		} else {
			provider = Contract.givenProvider;
		}

		super({
			...contractContext,
			provider,
			registeredSubscriptions: contractSubscriptions,
		});

		this._overloadedMethodAbis = new Map<string, AbiFunctionFragment[]>();

		// eslint-disable-next-line no-nested-ternary
		const returnDataFormat = isDataFormat(contextOrReturnFormat)
			? contextOrReturnFormat
			: isDataFormat(optionsOrContextOrReturnFormat)
			? optionsOrContextOrReturnFormat
			: returnFormat ?? DEFAULT_RETURN_FORMAT;

		const address =
			typeof addressOrOptionsOrContext === 'string' ? addressOrOptionsOrContext : undefined;

		// eslint-disable-next-line no-nested-ternary
		const options = isContractInitOptions(addressOrOptionsOrContext)
			? addressOrOptionsOrContext
			: isContractInitOptions(optionsOrContextOrReturnFormat)
			? optionsOrContextOrReturnFormat
			: undefined;

		this._parseAndSetJsonInterface(jsonInterface, returnDataFormat);

		if (!isNullish(address)) {
			this._parseAndSetAddress(address, returnDataFormat);
		}

		this.options = {
			address,
			jsonInterface: this._jsonInterface,
			gas: options?.gas ?? options?.gasLimit,
			gasPrice: options?.gasPrice,
			gasLimit: options?.gasLimit,
			from: options?.from,
			data: options?.data,
		};

		Object.defineProperty(this.options, 'address', {
			set: (value: Address) => this._parseAndSetAddress(value, returnDataFormat),
			get: () => this._address,
		});

		Object.defineProperty(this.options, 'jsonInterface', {
			set: (value: ContractAbi) => this._parseAndSetJsonInterface(value, returnDataFormat),
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

	public get defaultCommon(): Common | undefined {
		return (this.constructor as typeof Contract).defaultCommon ?? super.defaultCommon;
	}

	public set defaultCommon(value: Common | undefined) {
		super.defaultCommon = value;
	}

	public get transactionSendTimeout() {
		return (
			(this.constructor as typeof Contract).transactionSendTimeout ??
			super.transactionSendTimeout
		);
	}

	public set transactionSendTimeout(value: number) {
		super.transactionSendTimeout = value;
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

	/**
	 * Subscribe to an event.
	 *
	 * ```ts
	 * await myContract.events.MyEvent([options])
	 * ```
	 *
	 * There is a special event `allEvents` that can be used to subscribe all events.
	 *
	 * ```ts
	 * await myContract.events.allEvents([options])
	 * ```
	 *
	 * @returns - When individual event is accessed will returns {@link ContractBoundEvent} object
	 */
	public get events() {
		return this._events;
	}

	/**
	 * Creates a transaction object for that method, which then can be `called`, `send`, `estimated`, `createAccessList` , or `ABI encoded`.
	 *
	 * The methods of this smart contract are available through:
	 *
	 * The name: `myContract.methods.myMethod(123)`
	 * The name with parameters: `myContract.methods['myMethod(uint256)'](123)`
	 * The signature `myContract.methods['0x58cf5f10'](123)`
	 *
	 * This allows calling functions with same name but different parameters from the JavaScript contract object.
	 *
	 * \> The method signature does not provide a type safe interface, so we recommend to use method `name` instead.
	 *
	 * ```ts
	 * // calling a method
	 * const result = await myContract.methods.myMethod(123).call({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'});
	 *
	 * // or sending and using a promise
	 * const receipt = await myContract.methods.myMethod(123).send({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'});
	 *
	 * // or sending and using the events
	 * const sendObject = myContract.methods.myMethod(123).send({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'});
	 * sendObject.on('transactionHash', function(hash){
	 *   ...
	 * });
	 * sendObject.on('receipt', function(receipt){
	 *   ...
	 * });
	 * sendObject.on('confirmation', function(confirmationNumber, receipt){
	 *   ...
	 * });
	 * sendObject.on('error', function(error, receipt) {
	 *   ...
	 * });
	 * ```
	 *
	 * @returns - Either returns {@link PayableMethodObject} or {@link NonPayableMethodObject} based on the definitions of the {@doclink glossary/json_interface | json interface} of that contract.
	 */
	public get methods() {
		return this._methods;
	}

	/**
	 * Clones the current contract instance. This doesn't deploy contract on blockchain and only creates a local clone.
	 *
	 * @returns - The new contract instance.
	 *
	 * ```ts
	 * const contract1 = new eth.Contract(abi, address, {gasPrice: '12345678', from: fromAddress});
	 *
	 * const contract2 = contract1.clone();
	 * contract2.options.address = address2;
	 *
	 * (contract1.options.address !== contract2.options.address);
	 * > true
	 * ```
	 */
	public clone() {
		if (this.options.address) {
			return new Contract<Abi>(
				[...this._jsonInterface, ...this._errorsInterface] as unknown as Abi,
				this.options.address,
				{
					gas: this.options.gas,
					gasPrice: this.options.gasPrice,
					gasLimit: this.options.gasLimit,
					from: this.options.from,
					data: this.options.data,
					provider: this.currentProvider,
				},
				this.getContextObject(),
			);
		}

		return new Contract<Abi>(
			[...this._jsonInterface, ...this._errorsInterface] as unknown as Abi,
			{
				gas: this.options.gas,
				gasPrice: this.options.gasPrice,
				gasLimit: this.options.gasLimit,
				from: this.options.from,
				data: this.options.data,
				provider: this.currentProvider,
			},
			this.getContextObject(),
		);
	}

	/**
	 * Call this function to deploy the contract to the blockchain. After successful deployment the promise will resolve with a new contract instance.
	 *
	 * ```ts
	 * myContract.deploy({
	 *   data: '0x12345...',
	 *   arguments: [123, 'My String']
	 * })
	 * .send({
	 *   from: '0x1234567890123456789012345678901234567891',
	 *   gas: 1500000,
	 *   gasPrice: '30000000000000'
	 * }, function(error, transactionHash){ ... })
	 * .on('error', function(error){ ... })
	 * .on('transactionHash', function(transactionHash){ ... })
	 * .on('receipt', function(receipt){
	 *  console.log(receipt.contractAddress) // contains the new contract address
	 * })
	 * .on('confirmation', function(confirmationNumber, receipt){ ... })
	 * .then(function(newContractInstance){
	 *   console.log(newContractInstance.options.address) // instance with the new contract address
	 * });
	 *
	 *
	 * // When the data is already set as an option to the contract itself
	 * myContract.options.data = '0x12345...';
	 *
	 * myContract.deploy({
	 *   arguments: [123, 'My String']
	 * })
	 * .send({
	 *   from: '0x1234567890123456789012345678901234567891',
	 *   gas: 1500000,
	 *   gasPrice: '30000000000000'
	 * })
	 * .then(function(newContractInstance){
	 *   console.log(newContractInstance.options.address) // instance with the new contract address
	 * });
	 *
	 *
	 * // Simply encoding
	 * myContract.deploy({
	 *   data: '0x12345...',
	 *   arguments: [123, 'My String']
	 * })
	 * .encodeABI();
	 * > '0x12345...0000012345678765432'
	 *
	 *
	 * // Gas estimation
	 * myContract.deploy({
	 *   data: '0x12345...',
	 *   arguments: [123, 'My String']
	 * })
	 * .estimateGas(function(err, gas){
	 *   console.log(gas);
	 * });
	 * ```
	 *
	 * @returns - The transaction object
	 */
	public deploy(deployOptions?: {
		/**
		 * The byte code of the contract.
		 */
		data?: HexString;
		/**
		 * The arguments which get passed to the constructor on deployment.
		 */
		arguments?: ContractConstructorArgs<Abi>;
	}) {
		let abi = this._jsonInterface.find(j => j.type === 'constructor') as AbiConstructorFragment;

		if (!abi) {
			abi = {
				type: 'constructor',
				inputs: [],
				stateMutability: '',
			} as AbiConstructorFragment;
		}

		const data = format(
			{ eth: 'bytes' },
			deployOptions?.data ?? this.options.data,
			DEFAULT_RETURN_FORMAT,
		);

		if (!data || data.trim() === '0x') {
			throw new Web3ContractError('contract creation without any data provided.');
		}

		const args = deployOptions?.arguments ?? [];

		const contractOptions = { ...this.options, data };

		return {
			arguments: args,
			send: (
				options?: PayableTxOptions,
			): Web3PromiEvent<
				Contract<Abi>,
				SendTransactionEvents<typeof DEFAULT_RETURN_FORMAT>
			> => {
				const modifiedOptions = { ...options };

				// Remove to address
				// modifiedOptions.to = '0x0000000000000000000000000000000000000000';
				delete modifiedOptions.to;

				return this._contractMethodDeploySend(
					abi as AbiFunctionFragment,
					args as unknown[],
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
					params: args as unknown[],
					returnFormat,
					options: modifiedOptions,
					contractOptions,
				});
			},
			encodeABI: () =>
				encodeMethodABI(
					abi as AbiFunctionFragment,
					args as unknown[],
					format({ eth: 'bytes' }, data as Bytes, DEFAULT_RETURN_FORMAT),
				),
		};
	}

	/**
	 * Gets past events for this contract.
	 *
	 * ```ts
	 * const events = await myContract.getPastEvents('MyEvent', {
	 *   filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
	 *   fromBlock: 0,
	 *   toBlock: 'latest'
	 * });
	 *
	 * > [{
	 *   returnValues: {
	 *       myIndexedParam: 20,
	 *       myOtherIndexedParam: '0x123456789...',
	 *       myNonIndexParam: 'My String'
	 *   },
	 *   raw: {
	 *       data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
	 *       topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
	 *   },
	 *   event: 'MyEvent',
	 *   signature: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
	 *   logIndex: 0,
	 *   transactionIndex: 0,
	 *   transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
	 *   blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
	 *   blockNumber: 1234,
	 *   address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
	 * },{
	 *   ...
	 * }]
	 * ```
	 *
	 * @param eventName - The name of the event in the contract, or `allEvents` to get all events.
	 * @param filter - The filter options used to get events.
	 * @param returnFormat - Return format
	 * @returns - An array with the past event `Objects`, matching the given event name and filter.
	 */
	public async getPastEvents<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		returnFormat?: ReturnFormat,
	): Promise<(string | EventLog)[]>;
	public async getPastEvents<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		eventName: keyof ContractEvents<Abi> | 'allEvents',
		returnFormat?: ReturnFormat,
	): Promise<(string | EventLog)[]>;
	public async getPastEvents<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		filter: Omit<Filter, 'address'>,
		returnFormat?: ReturnFormat,
	): Promise<(string | EventLog)[]>;
	public async getPastEvents<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		eventName: keyof ContractEvents<Abi> | 'allEvents',
		filter: Omit<Filter, 'address'>,
		returnFormat?: ReturnFormat,
	): Promise<(string | EventLog)[]>;
	public async getPastEvents<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		param1?: keyof ContractEvents<Abi> | 'allEvents' | Omit<Filter, 'address'> | ReturnFormat,
		param2?: Omit<Filter, 'address'> | ReturnFormat,
		param3?: ReturnFormat,
	): Promise<(string | EventLog)[]> {
		const eventName = typeof param1 === 'string' ? param1 : 'allEvents';

		const filter =
			// eslint-disable-next-line no-nested-ternary
			typeof param1 !== 'string' && !isDataFormat(param1)
				? param1
				: !isDataFormat(param2)
				? param2
				: {};

		// eslint-disable-next-line no-nested-ternary
		const returnFormat = isDataFormat(param1)
			? param1
			: isDataFormat(param2)
			? param2
			: param3 ?? DEFAULT_RETURN_FORMAT;

		const abi =
			eventName === 'allEvents'
				? ALL_EVENTS_ABI
				: (this._jsonInterface.find(
						j => 'name' in j && j.name === eventName,
				  ) as AbiEventFragment & { signature: string });

		if (!abi) {
			throw new Web3ContractError(`Event ${eventName} not found.`);
		}

		const { fromBlock, toBlock, topics, address } = encodeEventABI(
			this.options,
			abi,
			filter ?? {},
			returnFormat,
		);

		const logs = await getLogs(this, { fromBlock, toBlock, topics, address }, returnFormat);
		return logs.map(log =>
			typeof log === 'string'
				? log
				: decodeEventABI(abi, log as LogsInput, this._jsonInterface, returnFormat),
		);
	}

	private _parseAndSetAddress(value?: Address, returnFormat: DataFormat = DEFAULT_RETURN_FORMAT) {
		this._address = value
			? toChecksumAddress(format({ eth: 'address' }, value, returnFormat))
			: value;
	}

	private _parseAndSetJsonInterface(
		abis: ContractAbi,
		returnFormat: DataFormat = DEFAULT_RETURN_FORMAT,
	) {
		this._functions = {};

		this._methods = {} as ContractMethodsInterface<Abi>;
		this._events = {} as ContractEventsInterface<Abi>;

		let result: ContractAbi = [];

		const functionsAbi = abis.filter(abi => abi.type !== 'error');
		const errorsAbi = abis.filter(abi =>
			isAbiErrorFragment(abi),
		) as unknown as AbiErrorFragment[];

		for (const a of functionsAbi) {
			const abi: Mutable<AbiFragment & { signature: HexString }> = {
				...a,
				signature: '',
			};

			if (isAbiFunctionFragment(abi)) {
				const methodName = jsonInterfaceMethodToString(abi);
				const methodSignature = encodeFunctionSignature(methodName);
				abi.signature = methodSignature;

				// make constant and payable backwards compatible
				abi.constant =
					abi.stateMutability === 'view' ??
					abi.stateMutability === 'pure' ??
					abi.constant;

				abi.payable = abi.stateMutability === 'payable' ?? abi.payable;
				this._overloadedMethodAbis.set(abi.name, [
					...(this._overloadedMethodAbis.get(abi.name) ?? []),
					abi,
				]);

				const contractMethod = this._createContractMethod(
					this._overloadedMethodAbis.get(abi.name) ?? [],
					errorsAbi,
				);

				this._functions[methodName] = {
					signature: methodSignature,
					method: contractMethod,
				};

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
				const event = this._createContractEvent(abi, returnFormat);
				abi.signature = eventSignature;

				if (!(eventName in this._events) || abi.name === 'bound') {
					// It's a private type and we don't want to expose it and no need to check
					this._events[eventName as keyof ContractEventsInterface<Abi>] = event as never;
				}
				// It's a private type and we don't want to expose it and no need to check
				this._events[abi.name as keyof ContractEventsInterface<Abi>] = event as never;
				// It's a private type and we don't want to expose it and no need to check
				this._events[eventSignature as keyof ContractEventsInterface<Abi>] = event as never;
			}

			this._events.allEvents = this._createContractEvent(ALL_EVENTS_ABI, returnFormat);

			result = [...result, abi];
		}

		this._jsonInterface = [...result] as unknown as ContractAbiWithSignature;
		this._errorsInterface = errorsAbi;
	}

	// eslint-disable-next-line class-methods-use-this
	private _getAbiParams(abi: AbiFunctionFragment, params: unknown[]): Array<unknown> {
		try {
			return validatorUtils.transformJsonDataToAbiFormat(abi.inputs ?? [], params);
		} catch (error) {
			throw new Web3ContractError(
				`Invalid parameters for method ${abi.name}: ${(error as Error).message}`,
			);
		}
	}

	private _createContractMethod<T extends AbiFunctionFragment[], E extends AbiErrorFragment>(
		abiArr: T,
		errorsAbis: E[],
	): ContractBoundMethod<T[0]> {
		const abi = abiArr[abiArr.length - 1];
		return (...params: unknown[]) => {
			let abiParams!: Array<unknown>;
			const abis = this._overloadedMethodAbis.get(abi.name) ?? [];
			let methodAbi: AbiFunctionFragment = abis[0];
			const internalErrorsAbis = errorsAbis;

			const arrayOfAbis: AbiFunctionFragment[] = abis.filter(
				_abi => (_abi.inputs ?? []).length === params.length,
			);

			if (abis.length === 1 || arrayOfAbis.length === 0) {
				abiParams = this._getAbiParams(methodAbi, params);
				validator.validate(abi.inputs ?? [], abiParams);
			} else {
				const errors: Web3ValidationErrorObject[] = [];

				for (const _abi of arrayOfAbis) {
					try {
						abiParams = this._getAbiParams(_abi, params);
						validator.validate(
							_abi.inputs as unknown as ValidationSchemaInput,
							abiParams,
						);
						methodAbi = _abi;
						break;
					} catch (e) {
						errors.push(e as Web3ValidationErrorObject);
					}
				}
				if (errors.length === arrayOfAbis.length) {
					throw new Web3ValidatorError(errors);
				}
			}
			if (methodAbi.stateMutability === 'payable') {
				return {
					arguments: abiParams,

					call: async (options?: PayableCallOptions, block?: BlockNumberOrTag) =>
						this._contractMethodCall(
							methodAbi,
							abiParams,
							internalErrorsAbis,
							options,
							block,
						),

					send: (options?: PayableTxOptions) =>
						this._contractMethodSend(methodAbi, abiParams, internalErrorsAbis, options),

					estimateGas: async <
						ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT,
					>(
						options?: PayableCallOptions,
						returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
					) =>
						this._contractMethodEstimateGas({
							abi: methodAbi,
							params: abiParams,
							returnFormat,
							options,
						}),

					encodeABI: () => encodeMethodABI(methodAbi, abiParams),

					createAccessList: async (
						options?: NonPayableCallOptions,
						block?: BlockNumberOrTag,
					) =>
						this._contractMethodCreateAccessList(
							methodAbi,
							abiParams,
							internalErrorsAbis,
							options,
							block,
						),
				} as unknown as PayableMethodObject<
					ContractOverloadedMethodInputs<T>,
					ContractOverloadedMethodOutputs<T>
				>;
			}
			return {
				arguments: abiParams,

				call: async (options?: NonPayableCallOptions, block?: BlockNumberOrTag) =>
					this._contractMethodCall(
						methodAbi,
						abiParams,
						internalErrorsAbis,
						options,
						block,
					),

				send: (options?: NonPayableTxOptions) =>
					this._contractMethodSend(methodAbi, abiParams, internalErrorsAbis, options),

				estimateGas: async <ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
					options?: NonPayableCallOptions,
					returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
				) =>
					this._contractMethodEstimateGas({
						abi: methodAbi,
						params: abiParams,
						returnFormat,
						options,
					}),

				encodeABI: () => encodeMethodABI(methodAbi, abiParams),

				createAccessList: async (
					options?: NonPayableCallOptions,
					block?: BlockNumberOrTag,
				) =>
					this._contractMethodCreateAccessList(
						methodAbi,
						abiParams,
						internalErrorsAbis,
						options,
						block,
					),
			} as unknown as NonPayableMethodObject<
				ContractOverloadedMethodInputs<T>,
				ContractOverloadedMethodOutputs<T>
			>;
		};
	}

	private async _contractMethodCall<Options extends PayableCallOptions | NonPayableCallOptions>(
		abi: AbiFunctionFragment,
		params: unknown[],
		errorsAbi: AbiErrorFragment[],
		options?: Options,
		block?: BlockNumberOrTag,
	) {
		const tx = getEthTxCallParams({
			abi,
			params,
			options,
			contractOptions: {
				...this.options,
				from: this.options.from ?? this.getConfig().defaultAccount,
			},
		});
		try {
			const result = await call(this, tx, block, DEFAULT_RETURN_FORMAT);
			return decodeMethodReturn(abi, result);
		} catch (error: unknown) {
			if (error instanceof ContractExecutionError) {
				// this will parse the error data by trying to decode the ABI error inputs according to EIP-838
				decodeErrorData(errorsAbi, error.innerError);
			}
			throw error;
		}
	}

	private async _contractMethodCreateAccessList<
		Options extends PayableCallOptions | NonPayableCallOptions,
	>(
		abi: AbiFunctionFragment,
		params: unknown[],
		errorsAbi: AbiErrorFragment[],
		options?: Options,
		block?: BlockNumberOrTag,
	) {
		const tx = getCreateAccessListParams({
			abi,
			params,
			options,
			contractOptions: {
				...this.options,
				from: this.options.from ?? this.getConfig().defaultAccount,
			},
		});

		try {
			return createAccessList(this, tx, block, DEFAULT_RETURN_FORMAT);
		} catch (error: unknown) {
			if (error instanceof ContractExecutionError) {
				// this will parse the error data by trying to decode the ABI error inputs according to EIP-838
				decodeErrorData(errorsAbi, error.innerError);
			}
			throw error;
		}
	}

	private _contractMethodSend<Options extends PayableCallOptions | NonPayableCallOptions>(
		abi: AbiFunctionFragment,
		params: unknown[],
		errorsAbi: AbiErrorFragment[],
		options?: Options,
		contractOptions?: ContractOptions,
	) {
		let modifiedContractOptions = contractOptions ?? this.options;
		modifiedContractOptions = {
			...modifiedContractOptions,
			data: undefined,
			from: modifiedContractOptions.from ?? this.defaultAccount ?? undefined,
		};

		const tx = getSendTxParams({
			abi,
			params,
			options,
			contractOptions: modifiedContractOptions,
		});
		const transactionToSend = sendTransaction(this, tx, DEFAULT_RETURN_FORMAT);

		// eslint-disable-next-line no-void
		void transactionToSend.on('contractExecutionError', (error: unknown) => {
			if (error instanceof ContractExecutionError) {
				// this will parse the error data by trying to decode the ABI error inputs according to EIP-838
				decodeErrorData(errorsAbi, error.innerError);
			}
		});

		return transactionToSend;
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
				if (receipt.status === BigInt(0)) {
					throw new Web3ContractError("code couldn't be stored", receipt);
				}

				const newContract = this.clone();

				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				newContract.options.address = receipt.contractAddress;
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
	private _createContractEvent(
		abi: AbiEventFragment & { signature: HexString },
		returnFormat: DataFormat = DEFAULT_RETURN_FORMAT,
	): ContractBoundEvent {
		return (...params: unknown[]) => {
			const { topics, fromBlock } = encodeEventABI(
				this.options,
				abi,
				params[0] as EventParameters,
			);
			const sub = new LogsSubscription(
				{
					address: this.options.address,
					topics,
					abi,
					jsonInterface: this._jsonInterface,
				},
				{ requestManager: this.requestManager, returnFormat },
			);
			if (!isNullish(fromBlock)) {
				// emit past events when fromBlock is defined
				this.getPastEvents(abi.name, { fromBlock, topics }, returnFormat)
					.then(logs => {
						logs.forEach(log => sub.emit('data', log as EventLog));
					})
					.catch(() => {
						sub.emit('error', new SubscriptionError('Failed to get past events.'));
					});
			}
			this.subscriptionManager?.addSubscription(sub).catch(() => {
				sub.emit('error', new SubscriptionError('Failed to subscribe.'));
			});

			return sub;
		};
	}
}