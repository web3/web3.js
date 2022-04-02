// import { toWei, hexToNumber } from 'web3-utils';
// import {
// 	Web3BaseProvider,
// 	EthExecutionAPI,
// 	Web3APIPayload,
// 	// 	// JsonRpcResponse,
// 	// 	// JsonRpcResponseWithResult,
// } from 'web3-common';
// import { httpStringProvider, wsStringProvider, ipcStringProvider } from '../fixtures/config';
// import net from 'net';
import path from 'path';
import { ipcStringProvider } from '../../fixtures/config';

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

	describe('Create Web3 class instance with string providers', () => {
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
		// afterAll(() => server.close());

		// https://ethereum.stackexchange.com/questions/52574/how-to-connect-to-ethereum-node-geth-via-ipc-from-outside-of-docker-container
		// https://github.com/ethereum/go-ethereum/issues/17907
		it('should create instance with string of IPC provider', () => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			// eslint-disable-next-line no-new
			const fullIpcPath = path.join(__dirname, ipcStringProvider);
			const ipcProvider = new Web3.providers.IpcProvider(fullIpcPath);
			// const ipcProvider = new Web3.providers.IpcProvider('/home/nikos/Desktop/web3.js/.github/geth/data/geth.ipc');
			const web3 = new Web3(ipcProvider);
			expect(web3).toBeInstanceOf(Web3);
			// const status = (web3.currentProvider as Web3BaseProvider).getStatus();
			// console.log(status);
			// console.debug('**************', 1);
			// (web3.currentProvider as Web3BaseProvider).on('disconnect', (code, reason) => {
			// 	console.log('******************************************************', code, reason);
			// 	// done();
			// 	// 	done();
			// 	// 	// while ((web3.currentProvider as Web3BaseProvider).getStatus() === 'connecting') {
			// 	// 	// 	i += i;
			// 	// 	// }
			// });

			// (web3.currentProvider as Web3BaseProvider).on('message', (code, reason) => {
			// 	console.log('******************************************************', code, reason);
			// 	// done();
			// });

			// (web3.currentProvider as Web3BaseProvider).on('connect', (objs, chainId) => {
			// 	console.log('^^^^^^^^^^^connect', objs, chainId);
			// });
			// (web3.currentProvider as Web3BaseProvider).on('message', w => {
			// 	console.warn('**************', w);
			// });
			// (web3.currentProvider as Web3BaseProvider)
			// 	.request({
			// 		jsonrpc: '2.0',
			// 		id: 42,
			// 		method: 'eth_mining',
			// 	} as Web3APIPayload<EthExecutionAPI, 'eth_mining'>)
			// 	.then(a => {
			// 		console.log(a);
			// 	})
			// 	.catch(e => {
			// 		console.log(`Error${e}`);
			// 	});

			// (web3.currentProvider as Web3BaseProvider).disconnect();
		});
		// it('should create instance with string of http provider', async () => {
		// 	const response: JsonRpcResponse = await httpProvider.request(jsonRpcPayload);
		// 	expect(
		// 		String(hexToNumber(String((response as JsonRpcResponseWithResult).result))),
		// 	).toEqual(toWei(accounts[0].balance, 'ether'));
		// });
	});
});
