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
import {
	Web3BaseProvider,
	// 	EthExecutionAPI,
	// 	Web3APIPayload,
	// 	// 	// JsonRpcResponse,
	// 	// 	// JsonRpcResponseWithResult,
} from 'web3-common';
// import { httpStringProvider, wsStringProvider, ipcStringProvider } from '../fixtures/config';
// import net from 'net';
import { wsStringProvider } from '../../fixtures/config';

import { Web3 } from '../../../src/index';

describe('Web3 instance', () => {
	// let httpProvider: HttpProvider;
	// let jsonRpcPayload: Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;

	// beforeAll(() => {
	// 	httpProvider = new HttpProvider(clientUrl);
	// 	jsonRpcPayload = {
	// 		jsonrpc: '2.0',
	// 		id: 42,
	// 		method: 'eth_getBalance',
	// 		params: [accounts[0].address, 'latest'],
	// 	} as Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;
	// });
	// afterAll(() => mongoose.disconnect());

	describe('Create Web3 class instance with string providers', () => {
		// jest.setTimeout(35000);
		// jest.useFakeTimers();
		let web3: Web3;
		async function waitForSocketState(web3Inst: Web3, state: string) {
			return new Promise<void>(resolve => {
				setTimeout(() => {
					if ((web3Inst.currentProvider as Web3BaseProvider).getStatus() === state) {
						resolve();
					} else {
						// eslint-disable-next-line @typescript-eslint/no-empty-function
						waitForSocketState(web3Inst, state).then(resolve, () => {});
					}
				}, 5);
			});
		}
		afterEach(async () => {
			(web3.currentProvider as Web3BaseProvider).disconnect(1000, 'done');
			await waitForSocketState(web3, 'disconnected');
			// web3.currentProvider.disconnect();
			// setTimeout(() => {
			// 	done();
			// }, 30000); // delay * (maxAttempts + 1) stop jest from handling

			// jest.advanceTimersByTime(30000);
		});

		it('should create instance with string of ws provider', async () => {
			// const web3 = new Web3(wsStringProvider);
			const wsStringProviderWithPort = `${wsStringProvider}:${process.env.WSPORT ?? 8545}`;
			web3 = new Web3(wsStringProviderWithPort);
			expect(web3).toBeInstanceOf(Web3);
			await waitForSocketState(web3, 'connected');
		});
	});
});
