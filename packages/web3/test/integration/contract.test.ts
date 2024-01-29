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
import * as Web3Eth from 'web3-eth';
import { Web3, Contract } from '../../src/index';

import {
	ERC20TokenAbi,
	// eslint-disable-next-line import/no-relative-packages
} from '../shared_fixtures/contracts/ERC20Token';

jest.mock('web3-eth');

describe('Contract', () => {
	describe('Contract use the context wallet', () => {
		it('should work when created as web.eth.Contract', async () => {
			const web3 = new Web3('https://rpc2.sepolia.org');
			const contract = new web3.eth.Contract(
				ERC20TokenAbi,
				'0x7af963cF6D228E564e2A0aA0DdBF06210B38615D',
			);

			// could be add wallet also as:
			// const account = web3.eth.accounts.wallet.add('Private Key').get(0);
			const account = web3.eth.accounts.create();

			expect(contract.wallet).toBeDefined();

			const sendTransactionSpy = jest
				.spyOn(Web3Eth, 'sendTransaction')
				.mockImplementation((_objInstance, tx) => {
					expect(tx.from).toStrictEqual(account.address);
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return { on: jest.fn() } as any;
				});

			await contract.methods.transfer(account.address, 100).send({ from: account?.address });

			expect(sendTransactionSpy).toHaveBeenLastCalledWith(
				expect.any(Object),
				expect.objectContaining({
					from: account.address,
				}),
				expect.any(Object),
				expect.any(Object),
			);
		});
		it('should work when passed to constructor as Contract(..., web3Context)', async () => {
			const web3 = new Web3('https://rpc2.sepolia.org');
			const contract = new Contract(
				ERC20TokenAbi,
				'0x7af963cF6D228E564e2A0aA0DdBF06210B38615D',
				web3,
			);

			// could be add wallet also as:
			// const account = web3.eth.accounts.wallet.add('Private Key').get(0);
			const account = web3.eth.accounts.create();

			expect(contract.wallet).toBeDefined();

			const sendTransactionSpy = jest
				.spyOn(Web3Eth, 'sendTransaction')
				.mockImplementation((_objInstance, tx) => {
					expect(tx.from).toStrictEqual(account.address);
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return { on: jest.fn() } as any;
				});

			await contract.methods.transfer(account.address, 100).send({ from: account?.address });

			expect(sendTransactionSpy).toHaveBeenLastCalledWith(
				expect.any(Object),
				expect.objectContaining({
					from: account.address,
				}),
				expect.any(Object),
				expect.any(Object),
			);
		});
	});
});
