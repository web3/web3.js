import path from 'path';
import { ipcStringProvider } from '../../fixtures/config';
import { Web3 } from '../../../src/index';

describe('Web3 instance', () => {
	describe('Create Web3 class instance with string providers', () => {
		// https://ethereum.stackexchange.com/questions/52574/how-to-connect-to-ethereum-node-geth-via-ipc-from-outside-of-docker-container
		// https://github.com/ethereum/go-ethereum/issues/17907
		it('should create instance with string of IPC provider', () => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			// eslint-disable-next-line no-new
			const fullIpcPath = path.join(__dirname, ipcStringProvider);
			const ipcProvider = new Web3.providers.IpcProvider(fullIpcPath);
			const web3 = new Web3(ipcProvider);
			expect(web3).toBeInstanceOf(Web3);
		});
	});
});
