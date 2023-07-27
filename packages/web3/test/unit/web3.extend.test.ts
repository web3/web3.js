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

import { Address, BlockTag } from 'web3-types';
import { Web3 } from '../../src/web3';

declare module 'web3' {
	interface Web3Context {
		// for first test like web3.myModule.getL2Balance(...)
		myModule: {
			getBalance(address: Address, blockTag: BlockTag): Promise<bigint>;
			getL2Balance(address: Address, blockTag: BlockTag): Promise<bigint>;
		};

		// for second test, if user want to define these method types on web3 obj like web3.getBalance(...)
		getBalance(address: Address, blockTag: BlockTag): Promise<bigint>;
		getL2Balance(address: Address, blockTag: BlockTag): Promise<bigint>;
	}
}

describe('Web3 extend tests', () => {
	it('web3 extend should send correct rpc call', async () => {
		const web3 = new Web3('http://127.0.0.1:7545');

		const requestManagerSendSpy = jest.fn();
		web3.requestManager.send = requestManagerSendSpy;

		web3.extend({
			property: 'myModule',
			methods: [
				{
					name: 'getBalance',
					call: 'eth_getBalance',
				},
				{
					name: 'getL2Balance',
					call: 'eth_getBalance',
				},
			],
		});

		await web3.myModule.getBalance('0x5b43746580AAF00A69019fA59D9ed7d9c85dDd70', 'latest');

		expect(requestManagerSendSpy).toHaveBeenCalledWith({
			method: 'eth_getBalance',
			params: ['0x5b43746580AAF00A69019fA59D9ed7d9c85dDd70', 'latest'],
		});

		await web3.myModule.getL2Balance('0x5b43746580AAF00A69019fA59D9ed7d9c85dDd70', 'latest');

		expect(requestManagerSendSpy).toHaveBeenCalledWith({
			method: 'eth_getBalance',
			params: ['0x5b43746580AAF00A69019fA59D9ed7d9c85dDd70', 'latest'],
		});
	});

	it('web3 extend should send correct rpc call without property field defined', async () => {
		const web3 = new Web3('http://127.0.0.1:7545');

		const requestManagerSendSpy = jest.fn();
		web3.requestManager.send = requestManagerSendSpy;

		web3.extend({
			methods: [
				{
					name: 'getBalance',
					call: 'eth_getBalance',
				},
				{
					name: 'getL2Balance',
					call: 'eth_getBalance',
				},
			],
		});

		await web3.getBalance('0x5b43746580AAF00A69019fA59D9ed7d9c85dDd70', 'latest');

		expect(requestManagerSendSpy).toHaveBeenCalledWith({
			method: 'eth_getBalance',
			params: ['0x5b43746580AAF00A69019fA59D9ed7d9c85dDd70', 'latest'],
		});

		await web3.getL2Balance('0x5b43746580AAF00A69019fA59D9ed7d9c85dDd70', 'latest');

		expect(requestManagerSendSpy).toHaveBeenCalledWith({
			method: 'eth_getBalance',
			params: ['0x5b43746580AAF00A69019fA59D9ed7d9c85dDd70', 'latest'],
		});
	});
});
