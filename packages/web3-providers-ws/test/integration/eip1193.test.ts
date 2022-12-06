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

import { hexToNumber } from 'web3-utils';
import {
	HexString,
	ProviderConnectInfo,
	ProviderRpcError,
	Web3ProviderEventCallback,
} from 'web3-types';
import WebSocketProvider from '../../src/index';

import { getSystemTestProvider, describeIf, isWs } from '../fixtures/system_test_utils';
import { waitForOpenConnection } from '../fixtures/helpers';

describeIf(isWs)('WebSocketProvider - eip1193', () => {
	let clientWsUrl: string;
	let webSocketProvider: WebSocketProvider;

	beforeAll(() => {
		clientWsUrl = getSystemTestProvider();
	});
	beforeEach(() => {
		webSocketProvider = new WebSocketProvider(clientWsUrl);
	});
	afterEach(() => {
		webSocketProvider.disconnect(1000);
	});

	describe('check events', () => {
		it('should send connect event', async () => {
			const { chainId } = await new Promise(resolve => {
				webSocketProvider.on('connect', ((_error: unknown, data) => {
					resolve(data as unknown as ProviderConnectInfo);
				}) as Web3ProviderEventCallback<ProviderConnectInfo>);
			});
			expect(hexToNumber(chainId)).toBeGreaterThan(0);
		});
		it('should send disconnect event', async () => {
			await waitForOpenConnection(webSocketProvider, 0);

			const disconnectPromise = new Promise<ProviderRpcError>(resolve => {
				webSocketProvider.on('disconnect', ((error: ProviderRpcError) => {
					resolve(error);
				}) as Web3ProviderEventCallback<ProviderRpcError>);
			});

			webSocketProvider.disconnect(4100, 'Some extra data');
			const err = await disconnectPromise;
			expect(err.code).toBe(4100);
			expect(err.data).toBe('Some extra data');
		});
		it('should send chainChanged event', async () => {
			await waitForOpenConnection(webSocketProvider, 0);
			const chainChangedPromise = new Promise<ProviderConnectInfo>(resolve => {
				webSocketProvider.on('chainChanged', ((_error, data) => {
					resolve(data as unknown as ProviderConnectInfo);
				}) as Web3ProviderEventCallback<ProviderConnectInfo>);
			});
			// @ts-expect-error set private variable
			webSocketProvider._chainId = '0x1';
			webSocketProvider.disconnect(1000);
			webSocketProvider.connect();
			const changedData = await chainChangedPromise;
			expect(changedData.chainId).not.toBe('0x1');
			expect(hexToNumber(changedData.chainId)).toBeGreaterThan(0);
		});
		it('should send accountsChanged event', async () => {
			await waitForOpenConnection(webSocketProvider, 0);
			const chainChangedPromise = new Promise<{ accounts: HexString[] }>(resolve => {
				webSocketProvider.on('accountsChanged', ((_error, data) => {
					resolve(data as unknown as { accounts: HexString[] });
				}) as Web3ProviderEventCallback<{ accounts: HexString[] }>);
			});
			// @ts-expect-error set private variable
			webSocketProvider._accounts = ['1', '2'];
			webSocketProvider.disconnect(1000);
			webSocketProvider.connect();
			const changedData = await chainChangedPromise;
			expect(JSON.stringify(changedData.accounts)).not.toBe(JSON.stringify(['1', '2']));
		});
	});
});
