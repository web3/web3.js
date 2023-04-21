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
import { HexString, ProviderConnectInfo, ProviderRpcError } from 'web3-types';
import WebSocketProvider from '../../src/index';

import {
	describeIf,
	getSystemTestProviderUrl,
	isWs,
	waitForSocketConnect,
	waitForSocketDisconnect,
} from '../fixtures/system_test_utils';

describeIf(isWs)('WebSocketProvider - eip1193', () => {
	let socketPath: string;
	let socketProvider: WebSocketProvider;

	beforeAll(() => {
		socketPath = getSystemTestProviderUrl();
	});
	beforeEach(() => {
		socketProvider = new WebSocketProvider(socketPath);
	});
	afterEach(async () => {
		socketProvider.disconnect(1000);
		await waitForSocketDisconnect(socketProvider);
	});

	describe('check events', () => {
		it('should send connect event', async () => {
			const providerConnectInfo = await new Promise<ProviderConnectInfo>(resolve => {
				socketProvider.on('connect', (data: ProviderConnectInfo) => {
					resolve(data);
				});
			});
			expect(hexToNumber(providerConnectInfo.chainId)).toBeGreaterThan(0);
		});
		it('should send disconnect event', async () => {
			await waitForSocketConnect(socketProvider);
			const disconnectPromise = new Promise<ProviderRpcError>(resolve => {
				socketProvider.on('disconnect', (error: ProviderRpcError) => {
					resolve(error);
				});
			});
			socketProvider.disconnect(1000, 'Some extra data');

			const err = await disconnectPromise;
			expect(err.code).toBe(1000);
			expect(err.data).toBe('Some extra data');
		});
		it('should send chainChanged event', async () => {
			await waitForSocketConnect(socketProvider);
			// @ts-expect-error set private variable
			socketProvider._chainId = '0x1';
			socketProvider.disconnect(1000);
			await waitForSocketDisconnect(socketProvider);
			const chainChangedPromise = new Promise<HexString>(resolve => {
				socketProvider.on('chainChanged', (result: HexString) => {
					resolve(result);
				});
			});
			socketProvider.connect();
			await waitForSocketConnect(socketProvider);
			const chainId = await chainChangedPromise;
			expect(chainId).not.toBe('0x1');
			expect(hexToNumber(chainId)).toBeGreaterThan(0);
		});
		it('should send accountsChanged event', async () => {
			await waitForSocketConnect(socketProvider);

			// @ts-expect-error set private variable
			socketProvider._accounts = ['1', '2'];
			socketProvider.disconnect(1000);
			await waitForSocketDisconnect(socketProvider);
			const chainChangedPromise = new Promise<HexString[]>(resolve => {
				socketProvider.on('accountsChanged', (accounts: HexString[]) => {
					resolve(accounts);
				});
			});
			socketProvider.connect();
			await waitForSocketConnect(socketProvider);
			const accounts = await chainChangedPromise;

			expect(JSON.stringify(accounts)).not.toBe(JSON.stringify(['1', '2']));
		});
	});
});
