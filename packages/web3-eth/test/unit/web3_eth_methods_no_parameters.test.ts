import Web3Eth from '../../src/index';
import * as rpcMethods from '../../src/rpc_methods';

jest.mock('../../src/rpc_methods');

describe('web3_eth_methods_no_parameters', () => {
	let web3Eth: Web3Eth;

	beforeAll(() => {
		web3Eth = new Web3Eth('http://127.0.0.1:8545');
	});

	describe('should call RPC method with only request manager parameter', () => {
		it('getProtocolVersion', async () => {
			await web3Eth.getProtocolVersion();
			expect(rpcMethods.getProtocolVersion).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('isSyncing', async () => {
			await web3Eth.isSyncing();
			expect(rpcMethods.getSyncing).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('getCoinbase', async () => {
			await web3Eth.getCoinbase();
			expect(rpcMethods.getCoinbase).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('isMining', async () => {
			await web3Eth.isMining();
			expect(rpcMethods.getMining).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('getAccounts', async () => {
			await web3Eth.getAccounts();
			expect(rpcMethods.getAccounts).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('getWork', async () => {
			await web3Eth.getWork();
			expect(rpcMethods.getWork).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('getPendingTransactions', async () => {
			(rpcMethods.getPendingTransactions as jest.Mock).mockResolvedValueOnce([]);

			await web3Eth.getPendingTransactions();
			expect(rpcMethods.getPendingTransactions).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('requestAccounts', async () => {
			await web3Eth.requestAccounts();
			expect(rpcMethods.requestAccounts).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('getNodeInfo', async () => {
			await web3Eth.getNodeInfo();
			expect(rpcMethods.getNodeInfo).toHaveBeenCalledWith(web3Eth.requestManager);
		});
	});
});
