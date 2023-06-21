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
import { Web3SubscriptionManager } from 'web3-core';
import { Web3BaseProvider } from 'web3-types';
import * as rpcMethodWrappers from '../../src/rpc_method_wrappers';
import { LogsSubscription } from '../../src';
import { Web3Eth } from '../../src/web3_eth';
import { mockRpcResponse as mockGetLogsRpcResponse } from './rpc_method_wrappers/fixtures/get_logs';
import { sleep } from '../shared_fixtures/utils';

jest.mock('../../src/rpc_method_wrappers');

describe('Web3Eth subscribe and clear subscriptions', () => {
	let web3Eth: Web3Eth;

	it('should return the subscription data provided by the Subscription Manager', async () => {
		const requestManager = { send: jest.fn(), on: jest.fn(), provider: { on: jest.fn() } };

		const subManager = new Web3SubscriptionManager(requestManager as any, undefined as any);
		const dummyLogs = { logs: { test1: 'test1' } };

		jest.spyOn(subManager, 'subscribe').mockResolvedValueOnce(dummyLogs);
		web3Eth = new Web3Eth({
			provider: {
				on: jest.fn(),
			} as unknown as Web3BaseProvider,
			subscriptionManager: subManager,
		});

		const logs = await web3Eth.subscribe('logs');
		expect(logs).toStrictEqual(dummyLogs);
	});

	it('should call `_processSubscriptionResult` when the logs are of type LogsSubscription and the `fromBlock` is provided', async () => {
		const requestManager = { send: jest.fn(), on: jest.fn(), provider: { on: jest.fn() } };
		const subManager = new Web3SubscriptionManager(requestManager as any, undefined as any);

		const dummyLogs = new LogsSubscription({}, { subscriptionManager: subManager });
		jest.spyOn(subManager, 'subscribe').mockResolvedValueOnce(dummyLogs);
		jest.spyOn(rpcMethodWrappers, 'getLogs').mockResolvedValueOnce(mockGetLogsRpcResponse);

		web3Eth = new Web3Eth({
			provider: {
				on: jest.fn(),
			} as unknown as Web3BaseProvider,
			subscriptionManager: subManager,
		});
		jest.spyOn(dummyLogs, '_processSubscriptionResult');

		const logs = await web3Eth.subscribe('logs', {
			fromBlock: 0,
		});
		await sleep(100);

		expect(logs).toStrictEqual(dummyLogs);
		expect(dummyLogs._processSubscriptionResult).toHaveBeenCalled();
	});

	it('should be able to clear subscriptions', async () => {
		const requestManager = { send: jest.fn(), on: jest.fn(), provider: { on: jest.fn() } };
		const subManager = new Web3SubscriptionManager(requestManager as any, undefined as any);

		jest.spyOn(subManager, 'unsubscribe');

		web3Eth = new Web3Eth({
			provider: {
				on: jest.fn(),
			} as unknown as Web3BaseProvider,
			subscriptionManager: subManager,
		});

		await web3Eth.clearSubscriptions();

		expect(subManager.unsubscribe).toHaveBeenCalledWith(undefined);
	});

	it('should be able to clear subscriptions and pass `shouldClearSubscription` when passing `notClearSyncing`', async () => {
		const requestManager = { send: jest.fn(), on: jest.fn(), provider: { on: jest.fn() } };
		const subManager = new Web3SubscriptionManager(requestManager as any, undefined as any);

		jest.spyOn(subManager, 'unsubscribe');

		web3Eth = new Web3Eth({
			provider: {
				on: jest.fn(),
			} as unknown as Web3BaseProvider,
			subscriptionManager: subManager,
		});

		await web3Eth.clearSubscriptions(true);

		expect(subManager.unsubscribe).toHaveBeenCalledWith(Web3Eth['shouldClearSubscription']);
	});
});
