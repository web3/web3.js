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

import { Numbers, ContractInitOptions } from 'web3-types';
import { InvalidBlockError } from 'web3-errors';

export const compareBlockNumbersValidData: [[Numbers, Numbers], number][] = [
	[[1, 1], 0],
	[[1, 2], -1],
	[[2, 1], 1],
	[[BigInt(1), BigInt(1)], 0],
	[[BigInt(1), BigInt(2)], -1],
	[[BigInt(2), BigInt(1)], 1],
	[[1, BigInt(1)], 0],
	[[1, BigInt(2)], -1],
	[[2, BigInt(1)], 1],
	[['earliest', 0], 0],
	[[0, 'earliest'], 0],
	[['earliest', 'earliest'], 0],
	[['pending', 'pending'], 0],
	[['latest', 'latest'], 0],
	[['earliest', 'pending'], -1],
	[[BigInt('9007199254740992'), BigInt('9007199254740991')], 1],
	[[13532346, 13532300], 1],
	[['pending', 'latest'], 1],
	[['safe', 'safe'], 0],
	[['earliest', 'safe'], -1],
	[['safe', 'pending'], -1],
	[['pending', 'safe'], 1],
	[['finalized', 'finalized'], 0],
	[['earliest', 'finalized'], -1],
	[['finalized', 'pending'], -1],
	[['pending', 'finalized'], 1],
	[['safe', 'latest'], -1],
	[['latest', 'safe'], 1],
	[['earliest', 2], -1],
	[[2, 'earliest'], 1],
];

const errorObj = new InvalidBlockError('Cannot compare blocktag with provided non-blocktag input.');
export const compareBlockNumbersInvalidData: [[Numbers, Numbers], InvalidBlockError][] = [
	[['pending', 'unknown'], errorObj],
	[['', 'pending'], errorObj],
	[[22, 'finalized'], errorObj],
	[['finalized', 22], errorObj],
	[['latest', 110], errorObj],
	[[222, 'latest'], errorObj],
	[['pending', 230], errorObj],
	[[10000, 'pending'], errorObj],
	[['latest', BigInt(1)], errorObj],
	[['pending', BigInt(1)], errorObj],
	[['safe', 0], errorObj],
	[[0, 'safe'], errorObj],
];

export const isBloomValidData: [any, true][] = [
	[
		'0x00000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000008000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000010000000000000000000000000000000000010000000000402000000000000000000000020000010000000000000000000000000000000000000000000000000000000000000',
		true,
	],
	[
		'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
		true,
	],
];

export const isContractInitValidData: ContractInitOptions[] = [
	{ dataInputFill: 'data' },
	{ syncWithContext: true },
	{ gas: '100000', syncWithContext: true, dataInputFill: 'data' },
];

export const isContractInitInvalidData: unknown[] = ['', 12, {}];
