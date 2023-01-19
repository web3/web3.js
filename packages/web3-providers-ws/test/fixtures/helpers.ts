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
	new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(error);
				return;
			}
			if (stderr) {
				reject(stderr);
				return;
			}
			resolve(stdout);
		});
	});

const getPid = async (port: number): Promise<number> => {
	try {
		const pidStr = await execPromise(`lsof -Fp -i:${port}| grep '^p'`);
		if (pidStr) {
			return Number(pidStr.slice(1));
		}
		return 0;
	} catch (e) {
		return 0;
	}
};

export const stopGethServerIFExists = async (port: number) => {
	const prevPid = await getPid(port);
	if (prevPid > 0) {
		// close previous server
		await execPromise(`kill -9 ${prevPid}`);
	}
};
export const startGethServer = async (
	authPort: number,
	port: number,
): Promise<{ pid: number; path: string; close: () => Promise<void> }> => {
	await stopGethServerIFExists(port);

	await execPromise(
		`cd ../../ \n
		$(pwd)/tmp/geth --authrpc.port ${authPort} --ws --ws.addr 0.0.0.0 --ws.port ${port} --ws.api personal,web3,eth,admin,debug,miner,txpool,net --nodiscover --nousb --allow-insecure-unlock --dev --dev.period=0 &>/dev/null &`,
	);

	// eslint-disable-next-line no-promise-executor-return
	await new Promise(resolve => setTimeout(resolve, 1000));
	const pid = await getPid(port);
	return {
		pid,
		path: `ws://localhost:${port}`,
		close: async (): Promise<void> => {
			if (pid > 0) {
				await execPromise(`kill -9 ${pid}`);
			}
		},
	};
};
