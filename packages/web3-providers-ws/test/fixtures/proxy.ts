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
import WebSocket from 'ws';

export const createProxy = async (
	port: number,
	origin: string,
): Promise<{
	server: WebSocket.Server;
	path: string;
	close: () => Promise<void>;
	originWs: WebSocket;
}> => {
	const originWs = new WebSocket(origin);

	await new Promise(resolve => {
		originWs.on('open', () => {
			resolve(true);
		});
	});

	const webSocketServer = new WebSocket.Server({
		host: '127.0.0.1',
		port,
	});
	// eslint-disable-next-line  @typescript-eslint/no-empty-function
	let closeFunc = async () => {};
	webSocketServer.on('connection', ws => {
		ws.on('message', (d, isBinary) => {
			originWs.send(d, { binary: isBinary });
		});
		originWs.on('message', (d, isBinary) => {
			ws.send(d, { binary: isBinary });
		});
		closeFunc = async () => {
			await new Promise(resolve => {
				const timeOut = setTimeout(() => {
					resolve(true);
				}, 2000);
				ws.on('close', () => {
					ws.removeAllListeners();
					clearTimeout(timeOut);
					resolve(true);
				});
				ws.terminate();
			});
			await new Promise(resolve => {
				const timeOut = setTimeout(() => {
					resolve(true);
				}, 2000);
				originWs.on('close', () => {
					clearTimeout(timeOut);
					originWs.removeAllListeners();
					resolve(true);
				});

				originWs.terminate();
			});
			webSocketServer.close();
		};
	});

	return {
		path: `ws://127.0.0.1:${port}`,
		server: webSocketServer,
		originWs,
		close: async () => closeFunc(),
	};
};
