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

import { Address, Numbers } from 'web3-utils';
import { LogsSubscription } from '../../src/log_subscription';
import { ContractEventOptions, PayableMethodObject, NonPayableMethodObject } from '../../src/types';

export interface Erc20Interface {
	methods: {
		[key: string]: (
			...args: ReadonlyArray<any>
		) =>
			| PayableMethodObject<ReadonlyArray<unknown>, ReadonlyArray<unknown>>
			| NonPayableMethodObject<ReadonlyArray<unknown>, ReadonlyArray<unknown>>;

		name: () => NonPayableMethodObject<[], [string]>;

		approve: (
			_spender: string,
			_value: Numbers,
		) => NonPayableMethodObject<[_spender: string, _value: Numbers], [boolean]>;
		totalSupply: () => NonPayableMethodObject<[], [Numbers]>;
		transferFrom: (
			_from: Address,
			_to: Address,
			_value: Numbers,
		) => NonPayableMethodObject<[_from: Address, _to: Address, _value: Numbers], [boolean]>;
		decimals: () => NonPayableMethodObject<[], [Numbers]>;
		balanceOf: (_owner: Address) => NonPayableMethodObject<[_owner: Address], [Numbers]>;
		symbol: () => NonPayableMethodObject<[], [string]>;
		transfer: (
			_to: Address,
			_value: Numbers,
		) => NonPayableMethodObject<[_to: Address, _value: Numbers], [boolean]>;
		allowance: (
			_owner: Address,
			_spender: Address,
		) => NonPayableMethodObject<[_owner: Address, _spender: Address], [Numbers]>;
	};

	events: {
		[key: string]: (options?: ContractEventOptions) => Promise<LogsSubscription>;
		Approval: (options?: ContractEventOptions) => Promise<LogsSubscription>;
		Transfer: (options?: ContractEventOptions) => Promise<LogsSubscription>;
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
