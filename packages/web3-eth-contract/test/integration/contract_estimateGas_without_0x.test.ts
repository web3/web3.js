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

import { ETH_DATA_FORMAT } from 'web3-types';
import { Contract } from '../../src';
import {
	getSystemTestProvider,
	createTempAccount,
	closeOpenConnection,
} from '../fixtures/system_test_utils';

describe('contract', () => {
	// Create a new contract object using the ABI and bytecode
	const abi = [
		{
			inputs: [{ internalType: 'uint256', name: '_myNumber', type: 'uint256' }],
			stateMutability: 'nonpayable',
			type: 'constructor',
		},
		{
			inputs: [],
			name: 'myNumber',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [{ internalType: 'uint256', name: '_myNumber', type: 'uint256' }],
			name: 'setMyNumber',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function',
		},
	];
	let acc: { address: string; privateKey: string };
	let contract: Contract<typeof abi>;

	beforeEach(async () => {
		acc = await createTempAccount();
	});

	afterAll(async () => {
		await closeOpenConnection(contract);
	});

	it('should be able to add `data` input without `0x` prefix', async () => {
		contract = new Contract(abi, undefined, {
			provider: getSystemTestProvider(),
		});

		const myContract = contract.deploy({
			data: '608060405234801561001057600080fd5b506040516101d93803806101d983398181016040528101906100329190610054565b806000819055505061009e565b60008151905061004e81610087565b92915050565b60006020828403121561006657600080fd5b60006100748482850161003f565b91505092915050565b6000819050919050565b6100908161007d565b811461009b57600080fd5b50565b61012c806100ad6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806323fd0e401460375780636ffd773c146051575b600080fd5b603d6069565b6040516048919060bf565b60405180910390f35b6067600480360381019060639190608c565b606f565b005b60005481565b8060008190555050565b60008135905060868160e2565b92915050565b600060208284031215609d57600080fd5b600060a9848285016079565b91505092915050565b60b98160d8565b82525050565b600060208201905060d2600083018460b2565b92915050565b6000819050919050565b60e98160d8565b811460f357600080fd5b5056fea2646970667358221220d28cf161457f7936995800eb9896635a02a559a0561bff6a09a40bfb81cd056564736f6c63430008000033',
			arguments: [1],
		});

		const gas = await myContract.estimateGas(
			{
				from: acc.address,
			},
			ETH_DATA_FORMAT,
		);
		expect(gas).toBeDefined();
		expect(gas).toMatch(/0[xX][0-9a-fA-F]/i);
	});
});
