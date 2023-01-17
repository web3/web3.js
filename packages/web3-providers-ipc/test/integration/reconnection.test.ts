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

import IpcProvider from '../../src';

import { describeIf, getSystemTestProvider, isIpc } from '../fixtures/system_test_utils';
import {
	waitForCloseConnection,
	waitForOpenConnection,
	startGethServer,
	waitForEvent,
} from '../fixtures/helpers';

const PORT = 8547;
describeIf(isIpc)('IpcSocketProvider - reconnection', () => {
	describe('subscribe event tests', () => {
		it('check defaults', async () => {
			const web3Provider = new IpcProvider(getSystemTestProvider());
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
			const web3Provider = new IpcProvider(
				getSystemTestProvider(),
				{},
				{
					autoReconnect: true,
					delay: 123,
					maxAttempts: 456,
				},
			);
			// @ts-expect-error-next-line
			expect(web3Provider._reconnectOptions).toEqual({
				autoReconnect: true,
				delay: 123,
				maxAttempts: 456,
			});
			await waitForOpenConnection(web3Provider);
			web3Provider.disconnect(1000, 'test');
			await waitForCloseConnection(web3Provider);
		});
		it('should emit connect and disconnected events', async () => {
			const server = await startGethServer(PORT);
			const web3Provider = new IpcProvider(server.path);
			expect(!!(await waitForEvent(web3Provider, 'connect'))).toBe(true);
			const disconnectPromise = waitForEvent(web3Provider, 'disconnect');
			web3Provider.disconnect();
			expect(!!(await disconnectPromise)).toBe(true);
			await server.close();
		});
		it('should connect, disconnect and reconnect', async () => {
			const server = await startGethServer(PORT);
			const web3Provider = new IpcProvider(
				`${server.path}`,
				{},
				{
					delay: 10,
					autoReconnect: true,
					maxAttempts: 500,
				},
			);
			expect(!!(await waitForEvent(web3Provider, 'connect'))).toBe(true);
			await server.close();
			const connectEvent = waitForEvent(web3Provider, 'connect');
			// eslint-disable-next-line no-promise-executor-return
			await new Promise(resolve => setTimeout(resolve, 1000));
			const server2 = await startGethServer(PORT);
			expect(!!(await connectEvent)).toBe(true);
			web3Provider.disconnect();
			await waitForEvent(web3Provider, 'disconnect');
			await server2.close();
		});
		it('should connect, disconnect, try reconnect and reach max attempts', async () => {
			const server = await startGethServer(PORT);
			const web3Provider = new IpcProvider(
				server.path,
				{},
				{
					delay: 1,
					autoReconnect: true,
					maxAttempts: 3,
				},
			);
			expect(!!(await waitForEvent(web3Provider, 'connect'))).toBe(true);

			const errorEvent = waitForEvent(web3Provider, 'error');

			await server.close();
			const errorMessage = await errorEvent;
			expect(errorMessage).toBe(`Max connection attempts exceeded (${3})`);
		});
	});
});
