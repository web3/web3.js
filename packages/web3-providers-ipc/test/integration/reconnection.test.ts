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
	stopGethServerIFExists,
} from '../fixtures/helpers';

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
		afterAll(async () => {
			await stopGethServerIFExists(8547);
			await stopGethServerIFExists(8548);
			await stopGethServerIFExists(8549);
		});
		it.skip('check defaults', async () => {
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
		it.skip('set custom reconnectOptions', async () => {
			const web3Provider = new IpcProvider(getSystemTestProvider(), {}, reconnectionOptions);
			// @ts-expect-error-next-line
			expect(web3Provider._reconnectOptions).toEqual(reconnectionOptions);
			await waitForOpenConnection(web3Provider);
			web3Provider.disconnect(1000, 'test');
			await waitForCloseConnection(web3Provider);
		});
		it('should emit connect and disconnected events', async () => {
			// eslint-disable-next-line no-console
			console.log('1');
			const server = await startGethServer(8547);
			// eslint-disable-next-line no-console
			console.log('2');
			const web3Provider = new IpcProvider(server.path);
			expect(!!(await waitForEvent(web3Provider, 'connect'))).toBe(true);
			// eslint-disable-next-line no-console
			console.log('3');
			const disconnectPromise = waitForEvent(web3Provider, 'disconnect');
			web3Provider.disconnect();
			expect(!!(await disconnectPromise)).toBe(true);
			// eslint-disable-next-line no-console
			console.log('4');
			// @ts-expect-error read protected property
			expect(web3Provider.isReconnecting).toBe(false);
			await server.close();
			// eslint-disable-next-line no-console
			console.log('5');
		});
		it.skip('should connect, disconnect and reconnect', async () => {
			const server = await startGethServer(8548);
			const web3Provider = new IpcProvider(`${server.path}`, {}, reconnectionOptions);
			expect(!!(await waitForEvent(web3Provider, 'connect'))).toBe(true);
			await server.close();
			const connectEvent = waitForEvent(web3Provider, 'connect');
			// eslint-disable-next-line no-promise-executor-return
			await new Promise(resolve => setTimeout(resolve, 1000));
			const server2 = await startGethServer(8548);
			expect(!!(await connectEvent)).toBe(true);
			web3Provider.disconnect();
			await waitForEvent(web3Provider, 'disconnect');
			await server2.close();
		});
		it.skip('should connect, disconnect, try reconnect and reach max attempts', async () => {
			const server = await startGethServer(8549);
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

			const errorEvent = waitForEvent(web3Provider, 'error');

			await server.close();
			const errorMessage = await errorEvent;
			expect(errorMessage).toBe(`Max connection attempts exceeded (${3})`);
		});
	});
});
