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

import * as eth from 'web3-eth';
import * as ethAccounts from 'web3-eth-accounts';
import { SignTransactionResult, Web3Account } from 'web3-eth-accounts';
import { Web3EthInterface } from '../../src/types';
import { Web3 } from '../../src';

jest.mock('web3-eth-accounts');
jest.mock('web3-eth');

describe('test new Web3().eth.accounts', () => {
	let accounts: Web3EthInterface['accounts'];

	beforeAll(() => {
		const web3 = new Web3();
		accounts = web3.eth.accounts;
	});

	beforeEach(() => {
		jest.spyOn(eth, 'prepareTransactionForSigning').mockReturnValue({} as Promise<any>);
		jest.spyOn(ethAccounts, 'signTransaction').mockReturnValue(
			undefined as unknown as Promise<SignTransactionResult>,
		);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('`signTransaction` should call the original `prepareTransactionForSigning` and `signTransaction`', async () => {
		await accounts.signTransaction({}, '');

		expect(eth.prepareTransactionForSigning).toHaveBeenCalledTimes(1);
		expect(ethAccounts.signTransaction).toHaveBeenCalledTimes(1);
	});

	it('`privateKeyToAccount` should call the original `privateKeyToAccount` and add `signTransaction`', async () => {
		jest.spyOn(ethAccounts, 'privateKeyToAccount').mockReturnValue({
			privateKey: '',
		} as unknown as Web3Account);

		const account = accounts.privateKeyToAccount('');
		expect(ethAccounts.privateKeyToAccount).toHaveBeenCalledTimes(1);

		await account.signTransaction({});

		expect(eth.prepareTransactionForSigning).toHaveBeenCalledTimes(1);
		expect(ethAccounts.signTransaction).toHaveBeenCalledTimes(1);
	});

	it('`decrypt` should call the original `decrypt` and add `signTransaction`', async () => {
		jest.spyOn(ethAccounts, 'decrypt').mockReturnValue({
			privateKey: '',
		} as unknown as Promise<Web3Account>);

		await accounts.decrypt('', '', { nonStrict: false });
		expect(ethAccounts.decrypt).toHaveBeenCalledWith('', '', false);

		const account = await accounts.decrypt('', '');
		expect(ethAccounts.decrypt).toHaveBeenCalledWith('', '', true);

		await account.signTransaction({});

		expect(eth.prepareTransactionForSigning).toHaveBeenCalledTimes(1);
		expect(ethAccounts.signTransaction).toHaveBeenCalledTimes(1);
	});

	it('`create` should call the original `create` and add `signTransaction`', async () => {
		jest.spyOn(ethAccounts, 'create').mockReturnValue({
			privateKey: '',
		} as unknown as Web3Account);
		const account = accounts.create();

		expect(ethAccounts.create).toHaveBeenCalledTimes(1);

		await account.signTransaction({});

		expect(eth.prepareTransactionForSigning).toHaveBeenCalledTimes(1);
		expect(ethAccounts.signTransaction).toHaveBeenCalledTimes(1);
	});
});
