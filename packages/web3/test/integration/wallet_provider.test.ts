import { httpStringProvider, accounts } from '../fixtures/config';
import { Web3 } from '../../src/index';
// eslint-disable-next-line import/order
import HDWalletProvider from '@truffle/hdwallet-provider';

describe('Web3 instance', () => {
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
	});
});
