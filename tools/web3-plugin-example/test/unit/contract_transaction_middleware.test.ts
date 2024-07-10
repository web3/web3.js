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

import { Web3, Contract } from 'web3';
import { GreeterAbi, GreeterBytecode } from './fixtures/Greeter';
import { TransactionMiddlewarePlugin } from '../../src/transaction_middleware_plugin';
import { blockMockResult, receiptMockResult } from './fixtures/transactions_data';

describe('Contract Transaction Middleware', () => {

	it('should modify contracts deployment transaction before signing and sending', async () => {

		// This will allow Contract Transaction modification before signing and gas estimations

		const web3 = new Web3('http://127.0.0.1:8545');
		const plugin: TransactionMiddlewarePlugin = new TransactionMiddlewarePlugin();

		/// Mock block starts - Mock web3 internal calls for test
		let blockNum = 1000;

		// Create a spy for eth_sendTransaction
		const sendTransactionSpy = jest.fn();

		web3.requestManager.send = jest.fn(async (request) => {
			blockNum += 1;

			if (request.method === 'eth_getBlockByNumber') {
				return Promise.resolve(blockMockResult.result);
			}
			if (request.method === 'eth_blockNumber') {
				return Promise.resolve(blockNum.toString(16));
			}
			if (request.method === 'eth_sendTransaction') {
				// Call the spy with the request params
				sendTransactionSpy(request.params);
				return Promise.resolve("0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f");
			}
			if (request.method === 'eth_getTransactionReceipt') {
				return Promise.resolve(receiptMockResult.result);
			}

			return Promise.resolve("Unknown Request" as any);
		});

		/// Mock block ends here

		web3.registerPlugin(plugin);

		const contract: Contract<typeof GreeterAbi> = new web3.eth.Contract(GreeterAbi);

		await contract.deploy(
			{
				data: GreeterBytecode,
				arguments: ['My Greeting'],
			} as any)

			.send(
				{ from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4' }
			);  // this should call Tx middleware for contract deploy

		const deployedContract = new web3.eth.Contract(GreeterAbi, "0x5FbDB2315678afecb367f032d93F642f64180aa3");
		await deployedContract.methods.increment().send(
			{ from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4' }); // this should call Tx middleware for method send

		// First, check the number of calls
		expect(sendTransactionSpy).toHaveBeenCalledTimes(2);

		const expectedData = "0x123";
		// Then, check each call individually
		expect(sendTransactionSpy.mock.calls[0][0]).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					data: expectedData
				})
			])
		);

		expect(sendTransactionSpy.mock.calls[1][0]).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					data: expectedData
				})
			])
		);
	});

});
