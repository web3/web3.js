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
import { ProviderConnectInfo, ProviderRpcError, Web3ProviderEventCallback } from 'web3-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { exec } from 'child_process';
import WebSocketProvider from '../../src';

export const waitForOpenConnection = async (provider: WebSocketProvider) => {
	return new Promise<ProviderConnectInfo>(resolve => {
		provider.on('connect', ((_error, data) => {
			resolve(data as unknown as ProviderConnectInfo);
		}) as Web3ProviderEventCallback<ProviderConnectInfo>);
	});
};

export const waitForCloseConnection = async (provider: WebSocketProvider) => {
	return new Promise<ProviderRpcError>(resolve => {
		provider.on('disconnect', ((_error, data) => {
			resolve(data as unknown as ProviderRpcError);
		}) as Web3ProviderEventCallback<ProviderRpcError>);
	});
};

export const waitForEvent = async (web3Provider: WebSocketProvider, eventName: string) =>
	new Promise(resolve => {
		web3Provider.on(eventName, (error: any, data: any) => {
			resolve(data || error);
		});
	});

const execPromise = async (command: string): Promise<string> =>
	new Promise(resolve => {
		exec(command, (_, stdout, stderr) => {
			if (stderr) {
				resolve(stderr);
				return;
			}
			resolve(stdout);
		});
	});

export const stopServerIfExists = async (port: number) => {
	const res = await execPromise(
		`$(docker ps --filter publish=${port}/tcp | grep '8545') && echo \${S:0:12}`,
	);
	if (res) {
		await execPromise(
			`S=$(docker ps --filter publish=${port}/tcp | grep '8545') && docker container stop \${S:0:12}`,
		);
	}
};

export const startGethServer = async (
	port: number,
): Promise<{ path: string; close: () => Promise<void> }> => {
	await stopServerIfExists(port);

	await execPromise(
		`docker run -d -p ${port}:${port} ethereum/client-go --nodiscover --nousb --ws --ws.addr 0.0.0.0 --ws.port ${port} --allow-insecure-unlock --http.api personal,web3,eth,admin,debug,txpool,net --ws.api personal,web3,eth,admin,debug,miner,txpool,net --dev`,
	);

	// eslint-disable-next-line no-promise-executor-return
	await new Promise(resolve => setTimeout(resolve, 500));

	return {
		path: `ws://localhost:${port}`,
		close: async (): Promise<void> => {
			await stopServerIfExists(port);
		},
	};
};
