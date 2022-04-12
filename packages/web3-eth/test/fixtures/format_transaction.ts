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

import { FMT_BYTES, FMT_NUMBER, FormatType } from 'web3-common';
import { Transaction } from '../../src/types';

export const hexStringTransaction: FormatType<
	Transaction,
	{ number: FMT_NUMBER.HEX; bytes: FMT_BYTES.HEX }
> = {
	from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
	to: '0x3535353535353535353535353535353535353535',
	value: '0x174876e800',
	gas: '0x5208',
	gasPrice: '0x4a817c800',
	type: '0x0',
	maxFeePerGas: '0x1229298c00',
	maxPriorityFeePerGas: '0x49504f80',
	data: '0x',
	nonce: '0x4',
	chain: 'mainnet',
	hardfork: 'berlin',
	chainId: '0x1',
	common: {
		customChain: {
			name: 'foo',
			networkId: '0x4',
			chainId: '0x42',
		},
		baseChain: 'mainnet',
		hardfork: 'berlin',
	},
	gasLimit: '0x5208',
	v: '0x25',
	r: '0x4f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88d',
	s: '0x7e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0',
};

export const numberTransaction: FormatType<
	Transaction,
	{ number: FMT_NUMBER.NUMBER; bytes: FMT_BYTES.HEX }
> = {
	from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
	to: '0x3535353535353535353535353535353535353535',
	value: 100000000000,
	gas: 21000,
	gasPrice: 20000000000,
	type: 0,
	maxFeePerGas: 78000000000,
	maxPriorityFeePerGas: 1230000000,
	data: '0x',
	nonce: 4,
	chain: 'mainnet',
	hardfork: 'berlin',
	chainId: 1,
	common: {
		customChain: {
			name: 'foo',
			networkId: 4,
			chainId: 66,
		},
		baseChain: 'mainnet',
		hardfork: 'berlin',
	},
	gasLimit: 21000,
	v: 37,
	r: '0x4f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88d',
	s: '0x7e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0',
};

export const numberStringTransaction: FormatType<
	Transaction,
	{ number: FMT_NUMBER.STR; bytes: FMT_BYTES.HEX }
> = {
	from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
	to: '0x3535353535353535353535353535353535353535',
	value: '100000000000',
	gas: '21000',
	gasPrice: '20000000000',
	type: '0',
	maxFeePerGas: '78000000000',
	maxPriorityFeePerGas: '1230000000',
	data: '0x',
	nonce: '4',
	chain: 'mainnet',
	hardfork: 'berlin',
	chainId: '1',
	common: {
		customChain: {
			name: 'foo',
			networkId: '4',
			chainId: '66',
		},
		baseChain: 'mainnet',
		hardfork: 'berlin',
	},
	gasLimit: '21000',
	v: '37',
	r: '0x4f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88d',
	s: '0x7e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0',
};

export const bigIntTransaction: FormatType<
	Transaction,
	{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.HEX }
> = {
	from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
	to: '0x3535353535353535353535353535353535353535',
	value: BigInt(100000000000),
	gas: BigInt(21000),
	gasPrice: BigInt(20000000000),
	type: BigInt(0),
	maxFeePerGas: BigInt(78000000000),
	maxPriorityFeePerGas: BigInt(1230000000),
	data: '0x',
	nonce: BigInt(4),
	chain: 'mainnet',
	hardfork: 'berlin',
	chainId: BigInt(1),
	common: {
		customChain: {
			name: 'foo',
			networkId: BigInt(4),
			chainId: BigInt(66),
		},
		baseChain: 'mainnet',
		hardfork: 'berlin',
	},
	gasLimit: BigInt(21000),
	v: BigInt(37),
	r: '0x4f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88d',
	s: '0x7e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0',
};
