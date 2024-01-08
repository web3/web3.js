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

import { Transaction } from 'web3-types';
import { Web3Eth } from '../../../src';
import {
	closeOpenConnection,
	createTempAccount,
	getSystemTestProvider,
} from '../../fixtures/system_test_utils';

describe('Web3Eth.estimateGas', () => {
	let web3Eth: Web3Eth;
	let tempAcc: { address: string; privateKey: string };

	beforeAll(async () => {
		web3Eth = new Web3Eth(getSystemTestProvider());
		tempAcc = await createTempAccount();
	});

	afterAll(async () => {
		await closeOpenConnection(web3Eth);
	});

	it('should estimate a simple value transfer', async () => {
		const transaction: Transaction = {
			from: tempAcc.address,
			to: '0x0000000000000000000000000000000000000000',
			value: '0x1',
		};
		const response = await web3Eth.estimateGas(transaction);
		expect(response).toBe(BigInt(21000));
	});

	it('should estimate a contract deployment', async () => {
		const greeterContractDeploymentData =
			'0x608060405234801561001057600080fd5b50610228806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063f540c8ba14610030575b600080fd5b61003861004e565b6040516100459190610170565b60405180910390f35b60606000805461005d906101c1565b80601f0160208091040260200160405190810160405280929190818152602001828054610089906101c1565b80156100d65780601f106100ab576101008083540402835291602001916100d6565b820191906000526020600020905b8154815290600101906020018083116100b957829003601f168201915b5050505050905090565b600081519050919050565b600082825260208201905092915050565b60005b8381101561011a5780820151818401526020810190506100ff565b60008484015250505050565b6000601f19601f8301169050919050565b6000610142826100e0565b61014c81856100eb565b935061015c8185602086016100fc565b61016581610126565b840191505092915050565b6000602082019050818103600083015261018a8184610137565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806101d957607f821691505b6020821081036101ec576101eb610192565b5b5091905056fea264697066735822122061f485ab43edfa5bd740bc1f3dd0d643813a4bd2457119e6578414d7389fbd8964736f6c63430008100033';
		const transaction: Transaction = {
			from: tempAcc.address,
			data: greeterContractDeploymentData,
			type: '0x0',
			value: '0x0',
		};
		const response = await web3Eth.estimateGas(transaction);
		// eslint-disable-next-line
		console.log('ESTIMATE GAS VALUE', response);
		expect(response).toBeGreaterThan(BigInt(470000));
		expect(response).toBeLessThan(BigInt(490000));
	});
});
