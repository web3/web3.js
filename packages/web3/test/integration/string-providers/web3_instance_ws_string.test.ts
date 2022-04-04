// import { toWei, hexToNumber } from 'web3-utils';
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
		// let jsonRpcPayload: Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;
		beforeAll(() => {
			// jest.spyOn(WebSocket.prototype, 'send');
			// jsonRpcPayload = {
			// 	jsonrpc: '2.0',
			// 	id: 42,
			// 	method: 'eth_getBalance',
			// 	params: ['0x407d73d8a49eeb85d32cf465507dd71d507100c1', 'latest'],
			// };
			// jsonRpcResponse = { ...jsonRpcPayload, result: JSON.stringify(jsonRpcPayload) };
		});
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
			const wsStringProviderWithPort = `${wsStringProvider}:${process.env.WSPORT ?? 8546}`;
			web3 = new Web3(wsStringProviderWithPort);
			// 	// .on('connect', msg => {
			// 	// });
			// 	// (web3.currentProvider as Web3BaseProvider).once();
			// 	// const curProvider = web3.currentProvider as Web3BaseProvider;

			// (web3.currentProvider as Web3BaseProvider).on('connect', () => {
			// 	console.log('^^^^^^^^^^^connect');
			// });
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			// 	(web3.currentProvider as Web3BaseProvider).on('message', async () => {
			// 		// console.log('^^^^^^^^^^^message', accounts);
			expect(web3).toBeInstanceOf(Web3);
			await waitForSocketState(web3, 'connected');
			// jest.advanceTimersByTime(20000);

			// setTimeout(async () => {
			// 	console.log('-----------------------------\n--------\n---------\n');
			// 	(web3.currentProvider as Web3BaseProvider).disconnect(2, 'done');
			// 	await waitForSocketState(web3, 'disconnected');
			// 	console.log((web3.currentProvider as Web3BaseProvider).getStatus());
			// }, 250000);

			// 		// (web3.currentProvider as Web3BaseProvider).
			// 		// while ((web3.`currentProvider as Web3BaseProvider).getStatus() !== 'disconnected') {
			// 		// await new Promise(r => setTimeout(r, 2000));
			// 		// }
			// 	});
			// 	// console.log(web3.currentProvider);
			// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			// 	// (web3.currentProvider as Web3BaseProvider).on('message', obj => {
			// 	// 	console.log('******************************************************', obj);
			// 	// 	done();
			// 	// 	// while ((web3.currentProvider as Web3BaseProvider).getStatus() === 'connecting') {
			// 	// 	// 	i += i;
			// 	// 	// }
			// 	// });
			// 	// TODO: Does currently websocketprovider emit disconnect
			// 	// (web3.currentProvider as Web3BaseProvider).on('disconnect', () => {
			// 	// 	console.log('#######################');
			// 	// 	done();
			// 	// });
			// 	// .on();

			// 	// (web3.currentProvider as Web3BaseProvider).on('accountsChanged', accounts => {
			// 	// console.log('^^^^^^^^^^^', accounts);
			// 	// });
			// 	// web3.on('message', () => {});

			// 	(web3.currentProvider as Web3BaseProvider)
			// 		.request(jsonRpcPayload)
			// 		.then(() => {})
			// 		.catch(() => {});
			// 	// Disconnect from websocket to stop Jest from hanging
			// 	// (web3.currentProvider as Web3BaseProvider).disconnect(2, 'done');
		});
	});
});
