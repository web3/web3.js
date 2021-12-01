import { EthExecutionAPI, inputAddressFormatter } from 'web3-common';
import { Web3Context } from 'web3-core';
import {
	encodeEventSignature,
	encodeFunctionSignature,
	isAbiEventFragment,
	isAbiFunctionFragment,
	JsonAbiEventFragment,
	JsonAbiFragment,
	JsonAbiFunctionFragment,
	jsonInterfaceMethodToString,
} from 'web3-eth-abi';
import { Address, toChecksumAddress } from 'web3-utils';
import { ContractInitOptions, ContractOptions } from './types';

type ContractBoundFunction = string;
type ContractBoundEvent = string;

export class Contract extends Web3Context<EthExecutionAPI> {
	public readonly options: ContractOptions;

	private _jsonInterface!: JsonAbiFragment[];
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

	public constructor(
		jsonInterface: JsonAbiFragment[],
		address?: Address,
		options?: ContractInitOptions,
	) {
		super(options?.provider ?? '');

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
			set: (value: JsonAbiFragment[]) => this._parseAndSetJsonInterface(value),
			get: () => this._jsonInterface,
		});
	}

	private _parseAndSetAddress(value?: Address) {
		this._address = value ? toChecksumAddress(inputAddressFormatter(value)) : null;
	}

	private _parseAndSetJsonInterface(abis: JsonAbiFragment[]) {
		this._functions = {};
		this._events = {};
		const result: JsonAbiFragment[] = [];

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

			result.push(abi);
		}

		this._jsonInterface = abis;
	}

	// eslint-disable-next-line class-methods-use-this
	private _createContractFunction(
		name: string,
		_abi: JsonAbiFunctionFragment,
	): ContractBoundFunction {
		return name;
	}

	// eslint-disable-next-line class-methods-use-this
	private _createContractEvent(name: string, _abi: JsonAbiEventFragment): ContractBoundEvent {
		return name;
	}
}
