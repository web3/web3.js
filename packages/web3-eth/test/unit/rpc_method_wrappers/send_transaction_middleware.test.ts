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

import { Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, Web3EthExecutionAPI } from 'web3-types';
import { blockMockResult, receiptMockResult } from '../../fixtures/transactions_data';
import { TransactionMiddleware, sendTransaction } from '../../../src';

const mockTransactionMiddleware: TransactionMiddleware = {
	processTransaction: jest.fn(async transaction => {
		const tx = { ...transaction };
		tx.data = '0x123';
		return Promise.resolve(tx);
	}),
};

describe('sendTransaction', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeEach(() => {
		let blockNum = 0;
		web3Context = new Web3Context('http://127.0.0.1:8545');

		web3Context.requestManager.send = jest.fn(async request => {
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
				return Promise.resolve(
					'0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
				);
			}
			if (request.method === 'eth_getTransactionReceipt') {
				return Promise.resolve(receiptMockResult.result);
			}

			return Promise.resolve('Unknown Request' as any);
		});
	});

	afterEach(() => jest.resetAllMocks());

	it('should call processTransaction when transactionMiddleware is provided', async () => {
		const transaction = {
			from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
			to: '0x6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
			value: '0x1',
			data: '0x1',
		};

		await sendTransaction(
			web3Context,
			transaction,
			DEFAULT_RETURN_FORMAT,
			{},
			mockTransactionMiddleware,
		);

		expect(mockTransactionMiddleware.processTransaction).toHaveBeenCalledWith(transaction);
	});

	it('should not call processTransaction when transactionMiddleware is not provided', async () => {
		const transaction = {
			from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
			to: '0x6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
			value: '0x1',
			data: '0x1',
		};

		await sendTransaction(web3Context, transaction, DEFAULT_RETURN_FORMAT);

		expect(mockTransactionMiddleware.processTransaction).not.toHaveBeenCalled();
	});
});
