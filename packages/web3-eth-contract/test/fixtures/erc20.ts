import { EventEmitter } from 'events';
import { Address, Numbers } from 'web3-utils';
import {
	ContractEventLog,
	NonPayableTransactionObject,
	PayableTransactionObject,
	Callback,
	ContactEventOptions,
} from '../../src/types';

export interface Erc20Interface {
	methods: {
		name: (args: never) => PayableTransactionObject<never, [string]>;

		approve: (
			_spender: string,
			_value: Numbers,
		) => NonPayableTransactionObject<
			{
				_spender: string;
				_value: Numbers;
			},
			[boolean]
		>;
		totalSupply: (args: never) => NonPayableTransactionObject<never, [Numbers]>;

		transferFrom: (
			_from: Address,
			_to: Address,
			_value: Numbers,
		) => NonPayableTransactionObject<
			{
				_from: Address;
				_to: Address;
				_value: Numbers;
			},
			[boolean]
		>;

		decimals: (args: never) => NonPayableTransactionObject<never, [Numbers]>;

		balanceOf: (_owner: Address) => NonPayableTransactionObject<{ _owner: Address }, [Numbers]>;

		symbol: (args: never) => NonPayableTransactionObject<never, [string]>;

		transfer: (
			_to: Address,
			_value: Numbers,
		) => NonPayableTransactionObject<
			{
				_to: Address;
				_value: Numbers;
			},
			[boolean]
		>;

		allowance: (
			_owner: Address,
			_spender: Address,
		) => NonPayableTransactionObject<
			{
				_owner: Address;
				_spender: Address;
			},
			[Numbers]
		>;
	};

	events: {
		Approval:
			| ((
					cb: Callback<
						ContractEventLog<{ owner: Address; spender: Address; value: Numbers }>
					>,
			  ) => EventEmitter)
			| ((
					options: ContactEventOptions,
					cb: Callback<
						ContractEventLog<{ owner: Address; spender: Address; value: Numbers }>
					>,
			  ) => EventEmitter);

		Transfer:
			| ((
					cb: Callback<ContractEventLog<{ from: Address; to: Address; value: Numbers }>>,
			  ) => EventEmitter)
			| ((
					options: ContactEventOptions,
					cb: Callback<ContractEventLog<{ from: Address; to: Address; value: Numbers }>>,
			  ) => EventEmitter);
	};
}

// https://ethereumdev.io/abi-for-erc20-contract-on-ethereum/
export const erc20Abi = [
	{
		constant: true,
		inputs: [],
		name: 'name',
		outputs: [
			{
				name: '',
				type: 'string',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{
				name: '_spender',
				type: 'address',
			},
			{
				name: '_value',
				type: 'uint256',
			},
		],
		name: 'approve',
		outputs: [
			{
				name: '',
				type: 'bool',
			},
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'totalSupply',
		outputs: [
			{
				name: '',
				type: 'uint256',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{
				name: '_from',
				type: 'address',
			},
			{
				name: '_to',
				type: 'address',
			},
			{
				name: '_value',
				type: 'uint256',
			},
		],
		name: 'transferFrom',
		outputs: [
			{
				name: '',
				type: 'bool',
			},
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'decimals',
		outputs: [
			{
				name: '',
				type: 'uint8',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [
			{
				name: '_owner',
				type: 'address',
			},
		],
		name: 'balanceOf',
		outputs: [
			{
				name: 'balance',
				type: 'uint256',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'symbol',
		outputs: [
			{
				name: '',
				type: 'string',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{
				name: '_to',
				type: 'address',
			},
			{
				name: '_value',
				type: 'uint256',
			},
		],
		name: 'transfer',
		outputs: [
			{
				name: '',
				type: 'bool',
			},
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [
			{
				name: '_owner',
				type: 'address',
			},
			{
				name: '_spender',
				type: 'address',
			},
		],
		name: 'allowance',
		outputs: [
			{
				name: '',
				type: 'uint256',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		payable: true,
		stateMutability: 'payable',
		type: 'fallback',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				name: 'spender',
				type: 'address',
			},
			{
				indexed: false,
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: 'from',
				type: 'address',
			},
			{
				indexed: true,
				name: 'to',
				type: 'address',
			},
			{
				indexed: false,
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
] as const;
