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

// https://github.com/ensdomains/ens/blob/master/contracts/ReverseRegistrar.sol
const REVERSE_REGISTRAR = [
	{
		inputs: [
			{
				internalType: 'contract ENS',
				name: 'ensAddr',
				type: 'address',
			},
			{
				internalType: 'contract Resolver',
				name: 'resolverAddr',
				type: 'address',
			},
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		constant: true,
		inputs: [],
		name: 'ADDR_REVERSE_NODE',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
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
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		name: 'claim',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'resolver',
				type: 'address',
			},
		],
		name: 'claimWithResolver',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'defaultResolver',
		outputs: [
			{
				internalType: 'contract Resolver',
				name: '',
				type: 'address',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'ens',
		outputs: [
			{
				internalType: 'contract ENS',
				name: '',
				type: 'address',
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
				internalType: 'address',
				name: 'addr',
				type: 'address',
			},
		],
		name: 'node',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		payable: false,
		stateMutability: 'pure',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'string',
				name: 'name',
				type: 'string',
			},
		],
		name: 'setName',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
] as const;

export default REVERSE_REGISTRAR;
