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

import { Numbers } from 'web3-types';

export interface CreateTestData {
	address: string;
	input: {
		from: string;
		nonce: Numbers;
	};
}

export const testData: CreateTestData[] = [
	{
		address: '0x0C1B54fb6fdf63DEe15e65CAdBA8F2e028E26Bd0',

		input: {
			from: '0xe2597eb05cf9a87eb1309e86750c903ec38e527e',
			nonce: 0,
		},
	},
	{
		address: '0x0C1B54fb6fdf63DEe15e65CAdBA8F2e028E26Bd0',

		input: {
			from: '0xe2597eb05cf9a87eb1309e86750c903ec38e527e',
			nonce: BigInt(0),
		},
	},
	{
		address: '0x0C1B54fb6fdf63DEe15e65CAdBA8F2e028E26Bd0',

		input: {
			from: '0xe2597eb05cf9a87eb1309e86750c903ec38e527e',
			nonce: '0x0',
		},
	},
	{
		address: '0x3474627D4F63A678266BC17171D87f8570936622',

		input: {
			from: '0xb2682160c482eb985ec9f3e364eec0a904c44c23',
			nonce: 10,
		},
	},

	{
		address: '0x3474627D4F63A678266BC17171D87f8570936622',

		input: {
			from: '0xb2682160c482eb985ec9f3e364eec0a904c44c23',
			nonce: '0xa',
		},
	},

	{
		address: '0x3474627D4F63A678266BC17171D87f8570936622',

		input: {
			from: '0xb2682160c482eb985ec9f3e364eec0a904c44c23',
			nonce: '0x0a',
		},
	},

	{
		address: '0x271300790813f82638A8A6A8a86d65df6dF33c17',

		input: {
			from: '0x8ba1f109551bd432803012645ac136ddd64dba72',
			nonce: '0x200',
		},
	},

	{
		address: '0x271300790813f82638A8A6A8a86d65df6dF33c17',

		input: {
			from: '0x8ba1f109551bd432803012645ac136ddd64dba72',
			nonce: '0x0200',
		},
	},

	{
		address: '0x995C25706C407a1F1E84b3777775e3e619764933',

		input: {
			from: '0x8ba1f109551bd432803012645ac136ddd64dba72',
			nonce: '0x1d',
		},
	},

	{
		address: '0x995C25706C407a1F1E84b3777775e3e619764933',

		input: {
			from: '0x8ba1f109551bd432803012645ac136ddd64dba72',
			nonce: '0x001d',
		},
	},

	{
		address: '0x995C25706C407a1F1E84b3777775e3e619764933',

		input: {
			from: '0x8ba1f109551bd432803012645ac136ddd64dba72',
			nonce: 29,
		},
	},

	{
		address: '0x0CcCC7507aEDf9FEaF8C8D731421746e16b4d39D',

		input: {
			from: '0xc6af6e1a78a6752c7f8cd63877eb789a2adb776c',
			nonce: 0,
		},
	},
];
