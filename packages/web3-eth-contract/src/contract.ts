// eslint-disable-next-line max-classes-per-file
import { EthExecutionAPI, inputAddressFormatter, Web3EventEmitter } from 'web3-common';
import { Web3Context } from 'web3-core';
import {
	AbiEventFragment,
	AbiFunctionFragment,
	ContractAbi,
	ContractEvents,
	ContractMethods,
	encodeEventSignature,
	encodeFunctionSignature,
	isAbiEventFragment,
	isAbiFunctionFragment,
	jsonInterfaceMethodToString,
} from 'web3-eth-abi';
import { Address, toChecksumAddress } from 'web3-utils';
import {
	ContractEventEmitterInterface,
	ContractEventsInterface,
	ContractInitOptions,
	ContractMethodsInterface,
	ContractOptions,
} from './types';

type ContractBoundFunction = string;
type ContractBoundEvent = string;

export class Contract<Abi extends ContractAbi>
	extends Web3Context<EthExecutionAPI>
	implements Web3EventEmitter<ContractEventEmitterInterface<Abi, ContractEvents<Abi>>>
{
	public readonly options: ContractOptions;

	private _jsonInterface!: Abi;
	private _address?: Address | null;
	private _functions: Record<
		string,
		{
			signature: string;
			function: ContractBoundFunction;
			cascadeFunction?: ContractBoundFunction;
		}
	> = {};
	private _events: Record<string, ContractBoundEvent> = {};

	public readonly methods: ContractMethodsInterface<Abi, ContractMethods<Abi>>;
	public readonly events: ContractEventsInterface<Abi, ContractEvents<Abi>>;

	public constructor(jsonInterface: Abi, address?: Address, options?: ContractInitOptions) {
		super(options?.provider ?? '');

		// TODO: Implement these methods
		this.methods = {} as ContractMethodsInterface<Abi, ContractMethods<Abi>>;
		// TODO: Implement these events
		this.events = {} as ContractEventsInterface<Abi, ContractEvents<Abi>>;

		this._parseAndSetAddress(address);
		this._parseAndSetJsonInterface(jsonInterface);

		this.options = {
			address: null,
			jsonInterface: [],
			gas: options?.gas ?? options?.gasLimit ?? null,
			gasPrice: options?.gasPrice ?? null,
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

	private _parseAndSetAddress(value?: Address) {
		this._address = value ? toChecksumAddress(inputAddressFormatter(value)) : null;
	}

	private _parseAndSetJsonInterface(abis: ContractAbi) {
		this._functions = {};
		this._events = {};
		let result: ContractAbi = [];

		for (const a of abis) {
			const abi = {
				...a,
			};

			if (isAbiFunctionFragment(abi)) {
				const name = jsonInterfaceMethodToString(abi);
				const signature = encodeFunctionSignature(name);

				// make constant and payable backwards compatible
				abi.constant =
					abi.stateMutability === 'view' ??
					abi.stateMutability === 'pure' ??
					abi.constant;
				abi.payable = abi.stateMutability === 'payable' ?? abi.payable;

				if (name in this._functions) {
					this._functions[name] = {
						signature,
						function: this._createContractFunction(name, abi),
						cascadeFunction: this._functions[name].function,
					};
				} else {
					this._functions[name] = {
						signature,
						function: this._createContractFunction(name, abi),
					};
				}
			} else if (isAbiEventFragment(abi)) {
				const name = jsonInterfaceMethodToString(abi);
				const signature = encodeEventSignature(name);
				const event = this._createContractEvent(name, abi);

				if (!(name in this._events) || abi.name === 'bound') {
					this._events[name] = event;
				}

				this._events[signature] = event;
			}

			result = [...result, abi];
		}

		this._jsonInterface = [...result] as unknown as Abi;
	}

	// eslint-disable-next-line class-methods-use-this
	private _createContractFunction(
		name: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_abi: AbiFunctionFragment,
	): ContractBoundFunction {
		return name;
	}

	// eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
	private _createContractEvent(name: string, _abi: AbiEventFragment): ContractBoundEvent {
		return name;
	}
}
