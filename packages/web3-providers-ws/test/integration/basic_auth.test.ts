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
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Server } from 'http';

import { waitForOpenConnection } from '../fixtures/helpers';
import WebSocketProvider from '../../src/index';
import { getSystemTestProvider, describeIf, isWs } from '../fixtures/system_test_utils';

describeIf(isWs)('Support of Basic Auth', () => {
	let server: Server;
	let clientWsUrl: string;
	let webSocketProvider: WebSocketProvider;
	let currentAttempt = 0;

	beforeAll(() => {
		clientWsUrl = getSystemTestProvider();
		const app = express();
		const port = 3000;
		const host = 'localhost';

		const wsProxy = createProxyMiddleware({
			target: clientWsUrl,
			changeOrigin: true,
			ws: true,
			onError: () => {
				console.warn('************** proxy error');
			},
			logLevel: 'silent',
		});

		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		app.use(wsProxy);
		server = app.listen(port, host);

		server.on('upgrade', (req, socket, head) => {
			if (!req.headers.authorization || !req.headers.authorization?.includes('Basic ')) {
				socket.emit('error');
				socket.destroy();
			}
			const base64Credentials = req.headers.authorization?.split(' ')[1];
			const credentials: string = Buffer.from(base64Credentials as string, 'base64').toString(
				'ascii',
			);
			const [username, password] = credentials.split(':');
			if (username !== 'geth' || password !== 'authpass') {
				socket.emit('error');
				socket.destroy();
			}
			return wsProxy.upgrade?.(req as any, socket as any, head);
		});
	});
	afterAll(() => {
		server.close();
	});
	beforeEach(() => {
		webSocketProvider = new WebSocketProvider(
			'ws://geth:authpass@localhost:3000',
			{},
			{ delay: 1, autoReconnect: false, maxAttempts: 1 },
		);
		currentAttempt = 0;
	});
	afterEach(async () => {
		// make sure we try to close the connection after it is established
		if (webSocketProvider.getStatus() === 'connecting') {
			await waitForOpenConnection(webSocketProvider, currentAttempt);
		}
		webSocketProvider.disconnect();
	});
	// eslint-disable-next-line jest/expect-expect
	test('should connect with basic auth', async () => {
		await waitForOpenConnection(webSocketProvider, currentAttempt);
		webSocketProvider.disconnect();
	});
});
