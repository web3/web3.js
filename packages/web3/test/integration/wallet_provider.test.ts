import { httpStringProvider, accounts } from '../fixtures/config';
import { Web3 } from '../../src/index';
// eslint-disable-next-line import/order
import HDWalletProvider from '@truffle/hdwallet-provider';

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

	describe('Create Web3 class instance with external providers', () => {
		let provider: HDWalletProvider;
		beforeAll(() => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			provider = new HDWalletProvider({
				privateKeys: [accounts[0].privateKey],
				providerOrUrl: httpStringProvider,
			});
		});
		// afterAll(() => server.close());
		it('should create instance with external wallet provider', async () => {
			const web3 = new Web3(provider);
			expect(web3).toBeInstanceOf(Web3); // toEqual(toWei(accounts[0].balance, 'ether'));
		});

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
		// it('should create instance with string of http provider', async () => {
		// 	const response: JsonRpcResponse = await httpProvider.request(jsonRpcPayload);
		// 	expect(
		// 		String(hexToNumber(String((response as JsonRpcResponseWithResult).result))),
		// 	).toEqual(toWei(accounts[0].balance, 'ether'));
		// });
	});
});
