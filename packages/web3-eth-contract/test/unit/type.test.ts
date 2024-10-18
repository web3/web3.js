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

import { Contract } from '../../src';

describe('Contract method types', () => {
	it('contract method params types test', () => {
		const abiAsConst = [
			{
				inputs: [
					{ internalType: 'uint256', name: 'testArg1', type: 'uint256' },
					{ internalType: 'uint256', name: 'testArg2', type: 'uint256' },
				],
				name: 'testWithParams',
				outputs: [{ internalType: 'uint256', name: 'testRes1', type: 'uint256' }],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'testWithoutParams',
				outputs: [{ internalType: 'uint256', name: 'testRes1', type: 'uint256' }],
				stateMutability: 'nonpayable',
				type: 'function',
			},
		] as const;

		const abiAsArray = [
			{
				inputs: [
					{ internalType: 'uint256', name: 'testArg1', type: 'uint256' },
					{ internalType: 'uint256', name: 'testArg2', type: 'uint256' },
				],
				name: 'testWithParams',
				outputs: [{ internalType: 'uint256', name: 'testRes1', type: 'uint256' }],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			{
				inputs: [],
				name: 'testWithoutParams',
				outputs: [{ internalType: 'uint256', name: 'testRes1', type: 'uint256' }],
				stateMutability: 'nonpayable',
				type: 'function',
			},
		];

		// abi as const
		const contract = new Contract<typeof abiAsConst>(abiAsConst);
		contract.methods.testWithParams(1, 2); // no ts error - works as expected
		// @ts-expect-error ts compiler error
		expect(() => contract.methods.testWithParams()).toThrow(); // ts error - works as expected
		// @ts-expect-error ts compiler error
		contract.methods.testWithoutParams(1, 2); // ts error - works as expected
		contract.methods.testWithoutParams(); // no ts error - works as expected

		// abi as usual array type
		const contract2 = new Contract<typeof abiAsArray>(abiAsArray);
		// because we do not know exact type without const or provided type
		contract2.methods.testWithParams(1, 2); // no ts error - works as expected
		contract2.methods.testWithoutParams(); // no ts error - works as expected
		contract2.methods.testWithoutParams(1, 2); // no ts error - works as expected
		expect(() => contract2.methods.testWithParams()).toThrow(); // no ts error - works as expected
	});
});
