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

import { Web3, Transaction } from 'web3';
import { TransactionMiddlewarePlugin } from '../../src/transaction_middleware_plugin';
import { blockMockResult, receiptMockResult } from './fixtures/transactions_data';

describe('Transaction Middleware', () => {
	// This will allow Transaction modification before signing and gas estimations
	it('should modify transaction before signing', async () => {
		const web3 = new Web3('http://127.0.0.1:8545');
		const plugin = new TransactionMiddlewarePlugin();

		/// Mock block starts - Mock web3 internal calls for test
		let blockNum = 1000;

		web3.requestManager.send = jest.fn(async request => {
			blockNum += 1;

			if (request.method === 'eth_getBlockByNumber') {
				return Promise.resolve(blockMockResult.result);
			}
			if (request.method === 'eth_call') {
				return Promise.resolve('0x');
			}
			if (request.method === 'eth_blockNumber') {
				return Promise.resolve(blockNum.toString(16));
			}
			if (request.method === 'eth_sendTransaction') {
				// Test that middleware modified transaction
				// eslint-disable-next-line jest/no-conditional-expect
				expect((request.params as any)[0].data).toBe('0x123');

				return Promise.resolve(
					'0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
				);
			}
			if (request.method === 'eth_getTransactionReceipt') {
				return Promise.resolve(receiptMockResult.result);
			}

			return Promise.resolve('Unknown Request' as any);
		});

		/// Mock block ends here

		web3.registerPlugin(plugin);

		const transaction: Transaction = {
			from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
			to: '0x6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
			value: '0x1',
			data: '0x1',
		};

		await web3.eth.sendTransaction(transaction as any);
	});
});
