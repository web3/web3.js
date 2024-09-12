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

import {
	CTransactionMiddleware,
	// eslint-disable-next-line import/no-relative-packages
} from '../fixtures/transaction_middleware';

import {
	blockMockResult,
	receiptMockResult,
	// eslint-disable-next-line import/no-relative-packages
} from '../../../../tools/web3-plugin-example/test/unit/fixtures/transactions_data';

import { Web3 } from '../../src/index';
import {
	ERC20TokenAbi,
	// eslint-disable-next-line import/no-relative-packages
} from '../shared_fixtures/contracts/ERC20Token';

describe('Contract Middleware', () => {
	it('should set transaction middleware in contract new instance if its set at eth package', async () => {
		const web3 = new Web3();
		const contractA = new web3.eth.Contract(
			ERC20TokenAbi,
			'0x7af963cF6D228E564e2A0aA0DdBF06210B38615D',
		);

		expect(web3.eth.getTransactionMiddleware()).toBeUndefined();
		expect(contractA.getTransactionMiddleware()).toBeUndefined();

		const middleware = new CTransactionMiddleware();
		web3.eth.setTransactionMiddleware(middleware);

		const contractB = new web3.eth.Contract(
			ERC20TokenAbi,
			'0x7af963cF6D228E564e2A0aA0DdBF06210B38615D',
		);

		expect(web3.eth.getTransactionMiddleware()).toBeDefined();
		expect(contractB.getTransactionMiddleware()).toBeDefined();
		expect(web3.eth.getTransactionMiddleware()).toEqual(contractB.getTransactionMiddleware());
	});

	it('should send transaction middleware in contract new instance if its set at eth package', async () => {
		const web3 = new Web3();

		const middleware = new CTransactionMiddleware();
		web3.eth.setTransactionMiddleware(middleware);

		const contract = new web3.eth.Contract(
			ERC20TokenAbi,
			'0x7af963cF6D228E564e2A0aA0DdBF06210B38615D',
		);

		const sendTransactionSpy = jest.fn();
		const account = web3.eth.accounts.create();

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
				sendTransactionSpy(request.params);

				return Promise.resolve(
					'0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
				);
			}
			if (request.method === 'eth_getTransactionReceipt') {
				return Promise.resolve(receiptMockResult.result);
			}

			return Promise.resolve('Unknown Request' as any);
		});

		await contract.methods.transfer(account.address, 100).send({ from: account?.address });

		// Check that sendTransactionSpy has been called exactly once
		expect(sendTransactionSpy).toHaveBeenCalledTimes(1);

		// Check that sendTransactionSpy has been called with a parameter containing data: "0x123"
		expect(sendTransactionSpy).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					data: '0x123',
					from: account.address,
				}),
			]),
		);
	});
});
