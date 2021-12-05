// import { Web3Eth } from '../../src/index';

// describe('rpc_methods_no_params', () => {
//     let web3Eth: Web3Eth;

// 	beforeAll(() => {
//         web3Eth = new Web3Eth('http://127.0.0.1:8545');
// 	});

// 	describe('should make call with expected parameters', () => {
// 		it('getProtocolVersion', async () => {
// 			await getProtocolVersion(requestManager);

// 			expect(requestManagerSendSpy).toHaveBeenCalledWith({
// 				method: 'eth_protocolVersion',
// 				params: [],
// 			});
// 		});

// 		it('getSyncing', async () => {
// 			await getSyncing(requestManager);

// 			expect(requestManagerSendSpy).toHaveBeenCalledWith({
// 				method: 'eth_syncing',
// 				params: [],
// 			});
// 		});

// 		it('getCoinbase', async () => {
// 			await getCoinbase(requestManager);

// 			expect(requestManagerSendSpy).toHaveBeenCalledWith({
// 				method: 'eth_coinbase',
// 				params: [],
// 			});
// 		});

// 		it('getMining', async () => {
// 			await getMining(requestManager);

// 			expect(requestManagerSendSpy).toHaveBeenCalledWith({
// 				method: 'eth_mining',
// 				params: [],
// 			});
// 		});

// 		it('getHashRate', async () => {
// 			await getHashRate(requestManager);

// 			expect(requestManagerSendSpy).toHaveBeenCalledWith({
// 				method: 'eth_hashrate',
// 				params: [],
// 			});
// 		});
// 		it('getGasPrice', async () => {
// 			await getGasPrice(requestManager);

// 			expect(requestManagerSendSpy).toHaveBeenCalledWith({
// 				method: 'eth_gasPrice',
// 				params: [],
// 			});
// 		});
// 		it('getAccounts', async () => {
// 			await getAccounts(requestManager);

// 			expect(requestManagerSendSpy).toHaveBeenCalledWith({
// 				method: 'eth_accounts',
// 				params: [],
// 			});
// 		});
// 		it('getBlockNumber', async () => {
// 			await getBlockNumber(requestManager);

// 			expect(requestManagerSendSpy).toHaveBeenCalledWith({
// 				method: 'eth_blockNumber',
// 				params: [],
// 			});
// 		});
// 		it('getCompilers', async () => {
// 			await getCompilers(requestManager);

// 			expect(requestManagerSendSpy).toHaveBeenCalledWith({
// 				method: 'eth_getCompilers',
// 				params: [],
// 			});
// 		});
// 		it('newBlockFilter', async () => {
// 			await newBlockFilter(requestManager);

// 			expect(requestManagerSendSpy).toHaveBeenCalledWith({
// 				method: 'eth_newBlockFilter',
// 				params: [],
// 			});
// 		});
// 		it('newPendingTransactionFilter', async () => {
// 			await newPendingTransactionFilter(requestManager);

// 			expect(requestManagerSendSpy).toHaveBeenCalledWith({
// 				method: 'eth_newPendingTransactionFilter',
// 				params: [],
// 			});
// 		});
// 		it('getWork', async () => {
// 			await getWork(requestManager);

// 			expect(requestManagerSendSpy).toHaveBeenCalledWith({
// 				method: 'eth_getWork',
// 				params: [],
// 			});
// 		});
// 	});
// });
