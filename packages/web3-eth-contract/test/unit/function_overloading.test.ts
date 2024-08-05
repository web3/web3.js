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

import { Contract } from '../../src/index';

const ABI = [
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'userId',
				type: 'uint256',
			},
		],
		name: 'funcWithParamsOverloading_pure',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes',
				name: 'userProfile',
				type: 'bytes',
			},
		],
		name: 'funcWithParamsOverloading_pure',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'userAddress',
				type: 'address',
			},
		],
		name: 'funcWithParamsOverloading_pure',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: 'userName',
				type: 'string',
			},
		],
		name: 'funcWithParamsOverloading_pure',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint8',
				name: 'userId',
				type: 'uint8',
			},
		],
		name: 'funcWithParamsOverloading_pure',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'userAddress',
				type: 'address',
			},
		],
		name: 'funcWithParamsOverloading_view',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'userId',
				type: 'uint256',
			},
		],
		name: 'funcWithParamsOverloading_view',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint8',
				name: 'userId',
				type: 'uint8',
			},
		],
		name: 'funcWithParamsOverloading_view',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: 'userName',
				type: 'string',
			},
		],
		name: 'funcWithParamsOverloading_view',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes',
				name: 'userProfile',
				type: 'bytes',
			},
		],
		name: 'funcWithParamsOverloading_view',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
] as const;

describe('test Params Overloading', () => {
	const contract: Contract<typeof ABI> = new Contract(ABI);
	describe('calling a function with multiple compatible inputs without specifying', () => {
		// TODO: 5.x Should throw a new error with the list of methods found.
		// Related issue: https://github.com/web3/web3.js/issues/6923
		it('should call the first one when the signature is not passed but also show a warning', async () => {
			const originalWarn = console.warn;
			console.warn = function (message: string) {
				expect(message).toMatch(
					'Multiple methods found that is compatible with the given inputs.',
				);
			};
			const abi = contract.methods['funcWithParamsOverloading_pure'](
				'0x12eca7a3959a42973ef4452e44948650be8b8610',
			).encodeABI();
			console.warn = originalWarn;
			expect(abi.substring(0, 10)).toBe('0x125f6ec5');
		});
	});

	describe('funcWithParamsOverloading_pure', () => {
		it('uint256', async () => {
			const abi = contract.methods['funcWithParamsOverloading_pure(uint256)'](
				'0x12eca7a3959a42973ef4452e44948650be8b8610',
			).encodeABI();
			expect(abi.substring(0, 10)).toBe('0x125f6ec5');
		});

		it('bytes', async () => {
			const abi = contract.methods['funcWithParamsOverloading_pure(bytes)'](
				'0x12eca7a3959a42973ef4452e44948650be8b8610',
			).encodeABI();
			expect(abi.substring(0, 10)).toBe('0x14ab2370');
		});

		it('address', async () => {
			const abi = contract.methods['funcWithParamsOverloading_pure(address)'](
				'0x12eca7a3959a42973ef4452e44948650be8b8610',
			).encodeABI();
			expect(abi.substring(0, 10)).toBe('0x6a46aa98');
		});

		it('string exact', async () => {
			const abi = contract.methods['funcWithParamsOverloading_pure(string)'](
				'0x12eca7a3959a42973ef4452e44948650be8b8610',
			).encodeABI();
			expect(abi.substring(0, 10)).toBe('0x79473ea8');
		});

		it('uint8', async () => {
			const abi =
				contract.methods['funcWithParamsOverloading_pure(uint8)']('0x12').encodeABI();
			expect(abi.substring(0, 10)).toBe('0xf2f11ccd');
		});
	});

	describe('funcWithParamsOverloading_view', () => {
		it('address', async () => {
			const abi = contract.methods['funcWithParamsOverloading_view(address)'](
				'0x12eca7a3959a42973ef4452e44948650be8b8610',
			).encodeABI();
			expect(abi.substring(0, 10)).toBe('0x251fcf7c');
		});

		it('uint256', async () => {
			const abi = contract.methods['funcWithParamsOverloading_view(uint256)'](
				'0x12eca7a3959a42973ef4452e44948650be8b8610',
			).encodeABI();
			expect(abi.substring(0, 10)).toBe('0x68c3043e');
		});

		it('uint8', async () => {
			const abi =
				contract.methods['funcWithParamsOverloading_view(uint8)']('0x12').encodeABI();
			expect(abi.substring(0, 10)).toBe('0xda202a6f');
		});

		it('string', async () => {
			const abi = contract.methods['funcWithParamsOverloading_view(string)'](
				'0x12eca7a3959a42973ef4452e44948650be8b8610',
			).encodeABI();
			expect(abi.substring(0, 10)).toBe('0xe0c3c20d');
		});

		it('bytes', async () => {
			const abi = contract.methods['funcWithParamsOverloading_view(bytes)'](
				'0x12eca7a3959a42973ef4452e44948650be8b8610',
			).encodeABI();
			expect(abi.substring(0, 10)).toBe('0xf16fda0d');
		});
	});
});
