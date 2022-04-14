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
import { httpStringProvider } from '../../fixtures/config';

import { Web3 } from '../../../src/index';

describe('Web3 instance', () => {
	describe('Create Web3 class instance with string providers', () => {
		it('should create instance with string of http provider', async () => {
			const web3 = new Web3(httpStringProvider);
			expect(web3).toBeInstanceOf(Web3); // toEqual(toWei(accounts[0].balance, 'ether'));
		});
	});
});
