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

import { CloseEvent } from 'ws';
import { ProviderRpcError } from 'web3-types/src/web3_api_types';
import WebSocketProvider from '../../src';

import { createProxy } from '../fixtures/proxy';
import {
	describeIf,
	getSystemTestProviderUrl,
	isBrowser,
	waitForSocketConnect,
	isWs,
	waitForCloseSocketConnection,
	waitForEvent,
} from '../fixtures/system_test_utils';

describeIf(isWs && !isBrowser)('WebSocketProvider - reconnection', () => {
	describe('subscribe event tests', () => {
		let reconnectionOptions: {
			delay: number;
			autoReconnect: boolean;
			maxAttempts: number;
		};
		beforeAll(() => {
			reconnectionOptions = {
				delay: 500,
				autoReconnect: true,
				maxAttempts: 100,
			};
		});
		it('check defaults', async () => {
			const web3Provider = new WebSocketProvider(getSystemTestProviderUrl());
			// @ts-expect-error-next-line
			expect(web3Provider._reconnectOptions).toEqual({
				autoReconnect: true,
				delay: 5000,
				maxAttempts: 5,
			});
			await waitForSocketConnect(web3Provider);
			web3Provider.disconnect(1000, 'test');
			await waitForCloseSocketConnection(web3Provider);
		});
		it('set custom reconnectOptions', async () => {
			const web3Provider = new WebSocketProvider(
				getSystemTestProviderUrl(),
				{},
				reconnectionOptions,
			);
			// @ts-expect-error-next-line
			expect(web3Provider._reconnectOptions).toEqual(reconnectionOptions);
			await waitForSocketConnect(web3Provider);
			web3Provider.disconnect(1000, 'test');
			await waitForCloseSocketConnection(web3Provider);
		});
		it('should emit connect and disconnected events', async () => {
			const server = await createProxy(18545, getSystemTestProviderUrl());
			const web3Provider = new WebSocketProvider(server.path, {}, reconnectionOptions);
			expect(!!(await waitForEvent(web3Provider, 'connect'))).toBe(true);
			// @ts-expect-error set protected option
			web3Provider._reconnectOptions = {
				...reconnectionOptions,
				autoReconnect: false,
			};

			const disconnectPromise = waitForEvent(web3Provider, 'disconnect');
			// @ts-expect-error read protected property
			expect(web3Provider.isReconnecting).toBe(false);
			await server.close();

			expect(!!(await disconnectPromise)).toBe(true);
		});

		it('should connect, disconnect and reconnect', async () => {
			const server = await createProxy(18546, getSystemTestProviderUrl());
			const web3Provider = new WebSocketProvider(server.path, {}, reconnectionOptions);
			expect(!!(await waitForEvent(web3Provider, 'connect'))).toBe(true);
			web3Provider.disconnect(1002);
			await server.close();
			const connectEvent = waitForEvent(web3Provider, 'connect');
			const server2 = await createProxy(18546, getSystemTestProviderUrl());
			expect(!!(await connectEvent)).toBe(true);

			web3Provider.disconnect();
			await waitForEvent(web3Provider, 'disconnect');
			await server2.close();
		});
		it('should connect, disconnect, try reconnect and reach max attempts', async () => {
			const server = await createProxy(18547, getSystemTestProviderUrl());
			const web3Provider = new WebSocketProvider(
				server.path,
				{},
				{
					...reconnectionOptions,
					delay: 1,
					maxAttempts: 3,
				},
			);
			expect(!!(await waitForEvent(web3Provider, 'connect'))).toBe(true);

			// @ts-expect-error replace close handler
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			web3Provider._onCloseHandler = (_: CloseEvent) => {
				// @ts-expect-error replace close event
				web3Provider._onCloseEvent({ code: 1002 });
			};
			// @ts-expect-error run protected method
			web3Provider._removeSocketListeners();
			// @ts-expect-error run protected method
			web3Provider._addSocketListeners();
			const errorEvent = new Promise(resolve => {
				web3Provider.on('error', (error: unknown) => {
					if (
						// eslint-disable-next-line @typescript-eslint/no-unsafe-call
						(error as ProviderRpcError)?.message?.startsWith(
							'Maximum number of reconnect attempts reached',
						)
					) {
						resolve(error);
					}
				});
			});

			await server.close();
			const error = (await errorEvent) as Error;
			expect(error.message).toBe(`Maximum number of reconnect attempts reached! (${3})`);
		});
	});
});
