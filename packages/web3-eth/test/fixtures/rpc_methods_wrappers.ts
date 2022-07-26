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

import { DataFormat, DEFAULT_RETURN_FORMAT, FMT_NUMBER } from 'web3-utils';
import { Numbers, Uint, TransactionWithSenderAPI } from 'web3-types';

// Array consists of: returnType parameter, mock RPC result, expected output
export const getHashRateValidData: [DataFormat, Numbers, Numbers][] = [
	[DEFAULT_RETURN_FORMAT, '0x38a', '0x38a'],
	[{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }, '0x38a', '906'],
	[{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }, '0x38a', 906],
	[{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }, '0x38a', BigInt('0x38a')],
];

// Array consists of: returnType parameter, mock RPC result, expected output
export const getGasPriceValidData: [DataFormat, any, any][] = [
	[DEFAULT_RETURN_FORMAT, '0x1dfd14000', '0x1dfd14000'],
	[{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }, '0x1dfd14000', '8049999872'],
	[{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }, '0x1dfd14000', 8049999872],
	[{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }, '0x1dfd14000', BigInt('0x1dfd14000')],
];

// Array consists of: returnType parameter, mock RPC result, expected output
export const getBlockNumberValidData: [DataFormat, any, any][] = [
	[DEFAULT_RETURN_FORMAT, '0x4b7', '0x4b7'],
	[{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }, '0x4b7', '1207'],
	[{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }, '0x4b7', 1207],
	[{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }, '0x4b7', BigInt('0x4b7')],
];

export const transactionWithSender: TransactionWithSenderAPI = {
	to: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
	type: '0x0',
	nonce: '0x1',
	gas: '0xc350',
	value: '0x1',
	input: '0x0',
	maxFeePerGas: '0x1475505aab',
	maxPriorityFeePerGas: '0x7f324180',
	accessList: [],
	gasPrice: '0x4a817c800',
	from: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
	chainId: '0x1',
};

export const getChainIdValidData: [DataFormat, Uint, Numbers][] = [
	[DEFAULT_RETURN_FORMAT, '0x3d', '0x3d'],
	[{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }, '0x3d', 61],
	[{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }, '0x3d', '61'],
	[{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }, '0x3d', BigInt('0x3d')],
];
