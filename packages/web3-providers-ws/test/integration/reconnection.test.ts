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
import WebSocketProvider from '../../src';

import { describeIf, isWs, getSystemTestProvider, isBrowser } from '../fixtures/system_test_utils';
import {
	waitForCloseConnection,
	waitForOpenConnection,
	startGethServer,
	waitForEvent,
	stopServerIfExists,
} from '../fixtures/helpers';

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
		afterAll(async () => {
			await stopServerIfExists(18545);
			await stopServerIfExists(18546);
			await stopServerIfExists(18547);
		});
		it('check defaults', async () => {
			const web3Provider = new WebSocketProvider(getSystemTestProvider());
			// @ts-expect-error-next-line
			expect(web3Provider._reconnectOptions).toEqual({
				autoReconnect: true,
				delay: 5000,
				maxAttempts: 5,
			});
			await waitForOpenConnection(web3Provider);
			web3Provider.disconnect(1000, 'test');
			await waitForCloseConnection(web3Provider);
		});
		it('set custom reconnectOptions', async () => {
			const web3Provider = new WebSocketProvider(
				getSystemTestProvider(),
				{},
				reconnectionOptions,
			);
			// @ts-expect-error-next-line
			expect(web3Provider._reconnectOptions).toEqual(reconnectionOptions);
			await waitForOpenConnection(web3Provider);
			web3Provider.disconnect(1000, 'test');
			await waitForCloseConnection(web3Provider);
		});
		it.skip('should emit connect and disconnected events', async () => {
			const server = await startGethServer(18545);
			const web3Provider = new WebSocketProvider(server.path, {}, reconnectionOptions);
			// await waitForOpenConnection(web3Provider);
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
		it.skip('should connect, disconnect and reconnect', async () => {
			const server = await startGethServer(18546);
			const web3Provider = new WebSocketProvider(server.path, {}, reconnectionOptions);

			expect(!!(await waitForEvent(web3Provider, 'connect'))).toBe(true);

			// @ts-expect-error-next-line
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			web3Provider._onCloseHandler = (_: CloseEvent) => {
				// @ts-expect-error-next-line
				web3Provider._onCloseEvent({ code: 1002 });
			};
			// @ts-expect-error-next-line
			web3Provider._removeSocketListeners();
			// @ts-expect-error-next-line
			web3Provider._addSocketListeners();
			await server.close();
			const connectEvent = waitForEvent(web3Provider, 'connect');
			const server2 = await startGethServer(18546);
			expect(!!(await connectEvent)).toBe(true);
			// @ts-expect-error-next-line
			web3Provider._onCloseHandler = (event: CloseEvent) => {
				// @ts-expect-error-next-line
				web3Provider._onCloseEvent(event);
			};
			// @ts-expect-error-next-line
			web3Provider._removeSocketListeners();
			// @ts-expect-error-next-line
			web3Provider._addSocketListeners();
			web3Provider.disconnect(1000, 'test');
			await server2.close();
		});
		it.skip('should connect, disconnect, try reconnect and reach max attempts', async () => {
			const server = await startGethServer(18547);
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

			const errorEvent = waitForEvent(web3Provider, 'error');

			await server.close();
			const errorMessage = await errorEvent;
			expect(errorMessage).toBe(`Max connection attempts exceeded (${3})`);
		});
	});
});
