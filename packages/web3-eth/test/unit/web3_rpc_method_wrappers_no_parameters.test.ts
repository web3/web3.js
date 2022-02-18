import Web3Eth from '../../src/index';
import * as rpcMethods from '../../src/rpc_methods';
import {
	getAccounts,
	getCoinbase,
	getProtocolVersion,
	getWork,
	isMining,
	isSyncing,
} from '../../src/rpc_method_wrappers';

jest.mock('../../src/rpc_methods');

describe('web3_eth_methods_no_parameters', () => {
	let web3Eth: Web3Eth;

	beforeAll(() => {
		web3Eth = new Web3Eth('http://127.0.0.1:8545');
	});

	describe('should call RPC method with only request manager parameter', () => {
		it('getProtocolVersion', async () => {
			await getProtocolVersion(web3Eth);
			expect(rpcMethods.getProtocolVersion).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('isSyncing', async () => {
			await isSyncing(web3Eth);
			expect(rpcMethods.getSyncing).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('getCoinbase', async () => {
			await getCoinbase(web3Eth);
			expect(rpcMethods.getCoinbase).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('isMining', async () => {
			await isMining(web3Eth);
			expect(rpcMethods.getMining).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('getAccounts', async () => {
			await getAccounts(web3Eth);
			expect(rpcMethods.getAccounts).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('getWork', async () => {
			await getWork(web3Eth);
			expect(rpcMethods.getWork).toHaveBeenCalledWith(web3Eth.requestManager);
		});
	});
});
