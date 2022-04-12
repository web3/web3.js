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

import { DEFAULT_RETURN_FORMAT, FormatType } from 'web3-common';
import { Transaction } from '../../src/types';

export const transactionType0x0: FormatType<Transaction, typeof DEFAULT_RETURN_FORMAT>[] = [
	{
		from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
		to: '0x3535353535353535353535353535353535353535',
		value: '0x174876e800',
		gas: '0x5208',
		gasPrice: '0x4a817c800',
		type: '0x0',
		data: '0x0',
		nonce: '0x4',
		chainId: '0x1',
		gasLimit: '0x5208',
	},
];

export const transactionType0x1: FormatType<Transaction, typeof DEFAULT_RETURN_FORMAT>[] = [
	{
		from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
		to: '0x3535353535353535353535353535353535353535',
		value: '0x174876e800',
		gas: '0x5208',
		gasPrice: '0x4a817c800',
		type: '0x1',
		data: '0x0',
		nonce: '0x4',
		chainId: '0x1',
		gasLimit: '0x5208',
	},
	{
		from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
		to: '0x3535353535353535353535353535353535353535',
		value: '0x174876e800',
		gas: '0x5208',
		gasPrice: '0x4a817c800',
		data: '0x0',
		nonce: '0x4',
		chainId: '0x1',
		gasLimit: '0x5208',
		accessList: [],
	},
	{
		from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
		to: '0x3535353535353535353535353535353535353535',
		value: '0x174876e800',
		gas: '0x5208',
		gasPrice: '0x4a817c800',
		data: '0x0',
		nonce: '0x4',
		chainId: '0x1',
		gasLimit: '0x5208',
		hardfork: 'berlin',
	},
	{
		from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
		to: '0x3535353535353535353535353535353535353535',
		value: '0x174876e800',
		gas: '0x5208',
		gasPrice: '0x4a817c800',
		data: '0x0',
		nonce: '0x4',
		chainId: '0x1',
		gasLimit: '0x5208',
		common: {
			customChain: {
				networkId: '0x42',
				chainId: '0x42',
			},
			hardfork: 'berlin',
		},
	},
];

export const transactionType0x2: FormatType<Transaction, typeof DEFAULT_RETURN_FORMAT>[] = [
	{
		from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
		to: '0x3535353535353535353535353535353535353535',
		value: '0x174876e800',
		gas: '0x5208',
		type: '0x2',
		data: '0x0',
		nonce: '0x4',
		chainId: '0x1',
		gasLimit: '0x5208',
	},
	{
		from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
		to: '0x3535353535353535353535353535353535353535',
		value: '0x174876e800',
		gas: '0x5208',
		maxFeePerGas: '0x1229298c00',
		data: '0x0',
		nonce: '0x4',
		chainId: '0x1',
		gasLimit: '0x5208',
	},
	{
		from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
		to: '0x3535353535353535353535353535353535353535',
		value: '0x174876e800',
		gas: '0x5208',
		maxPriorityFeePerGas: '0x49504f80',
		data: '0x0',
		nonce: '0x4',
		chainId: '0x1',
		gasLimit: '0x5208',
	},
	{
		from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
		to: '0x3535353535353535353535353535353535353535',
		value: '0x174876e800',
		gas: '0x5208',
		gasPrice: '0x4a817c800',
		data: '0x0',
		nonce: '0x4',
		chainId: '0x1',
		gasLimit: '0x5208',
		hardfork: 'london',
	},
	{
		from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
		to: '0x3535353535353535353535353535353535353535',
		value: '0x174876e800',
		gas: '0x5208',
		gasPrice: '0x4a817c800',
		data: '0x0',
		nonce: '0x4',
		chainId: '0x1',
		gasLimit: '0x5208',
		common: {
			customChain: {
				networkId: '0x42',
				chainId: '0x42',
			},
			hardfork: 'london',
		},
	},
];

export const transactionTypeUndefined: FormatType<Transaction, typeof DEFAULT_RETURN_FORMAT>[] = [
	{
		from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
		to: '0x3535353535353535353535353535353535353535',
		value: '0x174876e800',
		gas: '0x5208',
		gasPrice: '0x4a817c800',
		data: '0x0',
		nonce: '0x4',
		chainId: '0x1',
		gasLimit: '0x5208',
	},
];
