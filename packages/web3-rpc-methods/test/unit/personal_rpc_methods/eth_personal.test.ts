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

import { Web3RequestManager } from 'web3-core';
import { EthPersonalAPI } from 'web3-types';
import { personalRpcMethods } from '../../../src/index';

describe('Eth Personal', () => {
	let requestManagerSendSpy: jest.Mock;
	let requestManager: Web3RequestManager<EthPersonalAPI>;

	beforeAll(() => {
		requestManager = new Web3RequestManager<EthPersonalAPI>('http://127.0.0.1:8545');
		requestManagerSendSpy = jest.fn();
		requestManager.send = requestManagerSendSpy;
	});

	it('should call requestManager.send with personal_listAccounts method', async () => {
		await personalRpcMethods.getAccounts(requestManager);
		expect(requestManagerSendSpy).toHaveBeenCalledWith({
			method: 'personal_listAccounts',
			params: [],
		});
	});

	it('should call requestManager.send with personal_newAccount method', async () => {
		const pass = 'ABC123';
		await personalRpcMethods.newAccount(requestManager, pass);
		expect(requestManagerSendSpy).toHaveBeenCalledWith({
			method: 'personal_newAccount',
			params: [pass],
		});
	});

	it('should call requestManager.send with personal_unlockAccount method', async () => {
		const pass = 'ABC123';
		const address = '0x4106486FB42F3Abf07CC07ef5DEE38f60319e789';
		const duration = 100;
		await personalRpcMethods.unlockAccount(requestManager, address, pass, duration);

		expect(requestManagerSendSpy).toHaveBeenCalledWith({
			method: 'personal_unlockAccount',
			params: [address, pass, duration],
		});
	});

	it('should call requestManager.send with personal_lockAccount method', async () => {
		const address = '0x4106486FB42F3Abf07CC07ef5DEE38f60319e789';

		await personalRpcMethods.lockAccount(requestManager, address);

		expect(requestManagerSendSpy).toHaveBeenCalledWith({
			method: 'personal_lockAccount',
			params: [address],
		});
	});

	it('should call requestManager.send with personal_importRawKey method', async () => {
		const passPhrase = '123456';
		const keyData = 'abe40cb08850da918ee951b237fa87946499b2d8643e4aa12b0610b050c731f6';
		await personalRpcMethods.importRawKey(requestManager, keyData, passPhrase);

		expect(requestManagerSendSpy).toHaveBeenCalledWith({
			method: 'personal_importRawKey',
			params: [keyData, passPhrase],
		});
	});

	it('should call requestManager.send with personal_sendTransaction method', async () => {
		const passPhrase = '123456';
		const tx = {
			from: '0x0d4aa485ecbc499c70860feb7e5aaeaf5fd8172e',
			gasPrice: '20000',
			gas: '21000',
			to: '0x4106486FB42F3Abf07CC07ef5DEE38f60319e789',
			value: '1000000',
			data: '',
			nonce: 0,
		};
		await personalRpcMethods.sendTransaction(requestManager, tx, passPhrase);

		expect(requestManagerSendSpy).toHaveBeenCalledWith({
			method: 'personal_sendTransaction',
			params: [tx, passPhrase],
		});
	});

	it('should call requestManager.send with personal_signTransaction method', async () => {
		const passPhrase = '123456';
		const tx = {
			from: '0x0d4aa485ecbc499c70860feb7e5aaeaf5fd8172e',
			gasPrice: '20000',
			gas: '21000',
			to: '0x4106486FB42F3Abf07CC07ef5DEE38f60319e789',
			value: '1000000',
			data: '',
			nonce: 0,
		};
		await personalRpcMethods.signTransaction(requestManager, tx, passPhrase);

		expect(requestManagerSendSpy).toHaveBeenCalledWith({
			method: 'personal_signTransaction',
			params: [tx, passPhrase],
		});
	});

	it('should call requestManager.send with personal_sign method', async () => {
		const data = 'Hello world';
		const address = '0x0D4Aa485ECbC499c70860fEb7e5AaeAf5fd8172E';
		const pass = '123456';

		await personalRpcMethods.sign(requestManager, data, address, pass);

		expect(requestManagerSendSpy).toHaveBeenCalledWith({
			method: 'personal_sign',
			params: [data, address, pass],
		});
	});

	it('should call requestManager.send with personal_ecRecover method', async () => {
		const data = 'Hello world';
		const signature =
			'0x5d21d01b3198ac34d0585a9d76c4d1c8123e5e06746c8962318a1c08ffb207596e6fce4a6f377b7c0fc98c5f646cd73438c80e8a1a95cbec55a84c2889dca0301b';

		await personalRpcMethods.ecRecover(requestManager, data, signature);

		expect(requestManagerSendSpy).toHaveBeenCalledWith({
			method: 'personal_ecRecover',
			params: [data, signature],
		});
	});
});
