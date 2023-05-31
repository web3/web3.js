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

import { IpcProvider } from '../../src';

import { startGethServer } from '../fixtures/helpers';
import {
	describeIf,
	getSystemTestProviderUrl,
	isIpc,
	waitForSocketConnect,
	waitForCloseSocketConnection,
	waitForEvent,
} from '../fixtures/system_test_utils';

describeIf(isIpc)('IpcSocketProvider - reconnection', () => {
	describe('subscribe event tests', () => {
		let reconnectionOptions: {
			delay: number;
			autoReconnect: boolean;
			maxAttempts: number;
		};
		beforeAll(() => {
			reconnectionOptions = {
				delay: 50,
				autoReconnect: true,
				maxAttempts: 1000,
			};
		});
		it('check defaults', async () => {
			const web3Provider = new IpcProvider(getSystemTestProviderUrl());
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
			const web3Provider = new IpcProvider(
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
			const web3Provider = new IpcProvider(getSystemTestProviderUrl());
			expect(!!(await waitForEvent(web3Provider, 'connect'))).toBe(true);
			const disconnectPromise = waitForEvent(web3Provider, 'disconnect');
			web3Provider.disconnect();
			expect(!!(await disconnectPromise)).toBe(true);
			// @ts-expect-error read protected property
			expect(web3Provider.isReconnecting).toBe(false);
		});
		it('should connect, disconnect and reconnect', async () => {
			const web3Provider = new IpcProvider(
				getSystemTestProviderUrl(),
				{},
				reconnectionOptions,
			);
			expect(!!(await waitForEvent(web3Provider, 'connect'))).toBe(true);
			const connectEvent = waitForEvent(web3Provider, 'connect');
			// @ts-expect-error call protected function
			web3Provider._socketConnection?.end();
			expect(!!(await connectEvent)).toBe(true);
			web3Provider.disconnect();
			await waitForEvent(web3Provider, 'disconnect');
		});
		it('should connect, disconnect, try reconnect and reach max attempts', async () => {
			const server = await startGethServer();
			const web3Provider = new IpcProvider(
				server.path,
				{},
				{
					...reconnectionOptions,
					delay: 1,
					maxAttempts: 3,
				},
			);
			expect(!!(await waitForEvent(web3Provider, 'connect'))).toBe(true);
			server.close();
			// @ts-expect-error call protected function
			web3Provider._socketConnection?.end();
			const errorEvent = waitForEvent(web3Provider, 'error');

			const error = (await errorEvent) as Error;
			expect(error.message).toBe(`Maximum number of reconnect attempts reached! (${3})`);
		});
	});
});
