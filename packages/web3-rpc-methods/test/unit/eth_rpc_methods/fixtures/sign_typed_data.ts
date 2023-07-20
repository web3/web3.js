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
import { Address, Eip712TypedData } from 'web3-types';

const address = '0x407d73d8a49eeb85d32cf465507dd71d507100c1';

const typedData = {
	types: {
		EIP712Domain: [
			{
				name: 'name',
				type: 'string',
			},
			{
				name: 'version',
				type: 'string',
			},
			{
				name: 'chainId',
				type: 'uint256',
			},
			{
				name: 'verifyingContract',
				type: 'address',
			},
		],
		Person: [
			{
				name: 'name',
				type: 'string',
			},
			{
				name: 'wallet',
				type: 'address',
			},
		],
		Mail: [
			{
				name: 'from',
				type: 'Person',
			},
			{
				name: 'to',
				type: 'Person',
			},
			{
				name: 'contents',
				type: 'string',
			},
		],
	},
	primaryType: 'Mail',
	domain: {
		name: 'Ether Mail',
		version: '1',
		chainId: 1,
		verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
	},
	message: {
		from: {
			name: 'Cow',
			wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
		},
		to: {
			name: 'Bob',
			wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
		},
		contents: 'Hello, Bob!',
	},
};

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - address
 *     - message
 */
type TestData = [string, [Address, Eip712TypedData, boolean | undefined]];
export const testData: TestData[] = [
	['useLegacy = undefined', [address, typedData, undefined]],
	['useLegacy = false', [address, typedData, false]],
	['useLegacy = true', [address, typedData, true]],
];
