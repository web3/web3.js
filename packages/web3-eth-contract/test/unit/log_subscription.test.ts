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

import * as eth from 'web3-eth';
import { WebSocketProvider } from 'web3-providers-ws';
import { Web3SubscriptionManager } from 'web3-core';
import { Contract, ContractLogsSubscription } from '../../src';
import { GreeterAbi, GreeterBytecode } from '../shared_fixtures/build/Greeter';

jest.mock('web3-eth');

describe('contract log subscription', () => {
	const contract = new Contract<typeof GreeterAbi>(GreeterAbi);
	const sendOptions = {
		from: '0x12364916b10Ae90076dDa6dE756EE1395BB69ec2',
		gas: '1000000',
	};
	const deployedAddr = '0x20bc23D0598b12c34cBDEf1fae439Ba8744DB426';
	const providerString = 'ws://mydomain.com';

	beforeAll(() => {
		jest.spyOn(WebSocketProvider.prototype, 'connect').mockImplementation(() => {
			// nothing
		});
		jest.spyOn(WebSocketProvider.prototype, 'getStatus').mockImplementation(() => 'connected');
		contract.setProvider(providerString);

		jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
			const newContract = contract.clone();
			newContract.options.address = deployedAddr;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return Promise.resolve(newContract) as any;
		});
	});

	it('Request Manager should call eth_subscribe with correct params', async () => {
		const spyRequestManagerSend = jest
			.spyOn(contract.requestManager, 'send')
			.mockImplementation(async () => {
				return 'sub-id';
			});

		const deployedContract = await contract
			.deploy({
				data: GreeterBytecode,
				arguments: ['My Greeting'],
			})
			.send(sendOptions);

		const topics = ['0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5'];

		deployedContract.events.allEvents({ fromBlock: 'earliest', topics });

		deployedContract.events.GREETING_CHANGED({ fromBlock: 'earliest', topics });

		expect(spyRequestManagerSend).toHaveBeenCalledTimes(2);
		expect(spyRequestManagerSend).toHaveBeenCalledWith({
			method: 'eth_subscribe',
			params: [
				'logs',
				// those params has been generated inside: _buildSubscriptionParams
				{ address: deployedAddr, topics },
			],
		});
	});

	it('should be able to subscribe to logs with contractInstance.subscriptionManager.subscribe', async () => {
		const address = '0x407D73d8a49eeb85D32Cf465507dd71d507100c1';
		const contractInstance = new Contract(GreeterAbi, address);

		jest.spyOn(WebSocketProvider.prototype, 'request').mockImplementation(
			async (payload: any) => {
				return {
					jsonrpc: '2.0',
					id: payload.id,
					result: {},
				};
			},
		);

		jest.spyOn(Web3SubscriptionManager.prototype, 'subscribe').mockImplementation(
			async (name: string | number | symbol, args?: any) => {
				expect(name).toBe('logs');
				expect(args.address).toBe(address);

				return new ContractLogsSubscription(args, {
					subscriptionManager: contractInstance.subscriptionManager,
				});
			},
		);

		contract.setProvider(providerString);

		const sub = contractInstance.subscriptionManager.subscribe('logs');
		expect(await sub).toBeInstanceOf(ContractLogsSubscription);

		contractInstance.subscriptionManager.clear();

		contractInstance.provider?.disconnect();
	});
});
