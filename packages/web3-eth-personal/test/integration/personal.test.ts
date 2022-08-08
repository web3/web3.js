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
import { isHexStrict } from 'web3-validator';
import { toChecksumAddress } from 'web3-utils';
import WebSocketProvider from 'web3-providers-ws';
import { Personal } from '../../src/index';
import { importedAccount } from '../config/personal.config';
import {
	getSystemTestBackend,
	getSystemTestAccounts,
	getSystemTestProvider,
	itIf,
	isWs,
	createNewAccount,
} from '../fixtures/system_test_utils';

describe('personal integration tests', () => {
	let ethPersonal: Personal;
	let accounts: string[];
	let clientUrl: string;

	beforeAll(() => {
		clientUrl = getSystemTestProvider();
		ethPersonal = new Personal(clientUrl);
	});

	beforeEach(async () => {
		accounts = await getSystemTestAccounts();
	});

	afterAll(() => {
		if (isWs) {
			(ethPersonal.provider as WebSocketProvider).disconnect();
		}
	});

	it('new account', async () => {
		const newAccount = await ethPersonal.newAccount('!@superpassword');
		expect(isHexStrict(newAccount)).toBe(true);
	});

	itIf(getSystemTestBackend() === 'geth')('ecRecover', async () => {
		// ganache does not support ecRecover
		const signature = await ethPersonal.sign('0x2313', accounts[0], '');
		const publicKey = await ethPersonal.ecRecover('0x2313', signature); // ecRecover is returning all lowercase
		// eslint-disable-next-line jest/no-standalone-expect
		expect(toChecksumAddress(publicKey)).toBe(toChecksumAddress(accounts[0]));
	});

	it('lock account', async () => {
		const lockAccount = await ethPersonal.lockAccount(accounts[1]);
		expect(lockAccount).toBe(true);

		const from = accounts[1];
		const tx = {
			from,
			to: '0x1337C75FdF978ABABaACC038A1dCd580FeC28ab2',
			value: `0`,
			gas: '21000',
			maxFeePerGas: '0x59682F00',
			maxPriorityFeePerGas: '0x1DCD6500',
		};
		// locked accounts will error
		await expect(ethPersonal.sendTransaction(tx, '')).rejects.toThrow();
	});

	it('unlock account', async () => {
		const from = accounts[0];
		const unlockedAccount = await ethPersonal.unlockAccount(from, '123456', 1000);
		expect(unlockedAccount).toBe(true);

		const tx = {
			from,
			to: '0x1337C75FdF978ABABaACC038A1dCd580FeC28ab2',
			value: `0`,
			gas: '21000',
			maxFeePerGas: '0x59682F00',
			maxPriorityFeePerGas: '0x1DCD6500',
		};
		const receipt = await ethPersonal.sendTransaction(tx, '123456');

		expect(isHexStrict(receipt)).toBe(true);
	});

	// ganache does not support sign
	itIf(getSystemTestBackend() === 'geth')('sign', async () => {
		const key = accounts[0];
		await ethPersonal.unlockAccount(key, '123456', 100000);
		const signature = await ethPersonal.sign('0xdeadbeaf', accounts[0], '');
		const address = await ethPersonal.ecRecover('0xdeadbeaf', signature);
		// eslint-disable-next-line jest/no-standalone-expect
		expect(accounts[0]).toBe(address);
	});

	it('getAccounts', async () => {
		const accountList = await ethPersonal.getAccounts();
		// create a new account
		const account = await ethPersonal.newAccount('cde');
		const updatedAccountList = await ethPersonal.getAccounts();
		accountList.push(account);
		expect(updatedAccountList).toStrictEqual(accountList);
	});

	it('importRawKey', async () => {
		const rawKey =
			getSystemTestBackend() === 'geth'
				? importedAccount.privateKey.slice(2)
				: importedAccount.privateKey;
		const key = await ethPersonal.importRawKey(rawKey, 'password123');
		expect(toChecksumAddress(key)).toBe(importedAccount.address);
	});

	// geth doesn't have signTransaction method
	itIf(getSystemTestBackend() === 'ganache')('signTransaction', async () => {
		const acc = await createNewAccount({
			privateKey: '0x9d43a04d801b997355a3ec4460d60563a383e271715138b66899f92c5bc414c2',
		});
		await ethPersonal.unlockAccount(acc.address, '123456', 100000);
		const tx = {
			from: acc.address,
			to: '0x1337C75FdF978ABABaACC038A1dCd580FeC28ab2',
			value: '10000',
			gas: '21000',
			maxFeePerGas: '0x59682F00',
			maxPriorityFeePerGas: '0x1DCD6500',
			nonce: 0,
		};
		const signedTx = await ethPersonal.signTransaction(tx, '123456');
		const expectedResult =
			'0x02f86e82053980841dcd65008459682f00825208941337c75fdf978ababaacc038a1dcd580fec28ab282271080c001a032d0977d9f8b75ca93c19281ab28ddbc4aca18431271a54bc6bd8ad2d6abc7eaa072eb89b36ec7e479fa98a3a613a394338a6e8b15c5015b1692449aa026613f4b';
		// eslint-disable-next-line jest/no-standalone-expect
		expect(signedTx).toEqual(expectedResult);
	});

	it('sendTransaction', async () => {
		const from = accounts[0];

		const unlockedAccount = await ethPersonal.unlockAccount(from, '123456', 1000);
		expect(unlockedAccount).toBe(true);

		const tx = {
			from,
			to: '0x1337C75FdF978ABABaACC038A1dCd580FeC28ab2',
			value: `0`,
			gas: '21000',
			maxFeePerGas: '0x59682F00',
			maxPriorityFeePerGas: '0x1DCD6500',
		};
		const receipt = await ethPersonal.sendTransaction(tx, '123456');

		expect(isHexStrict(receipt)).toBe(true);
	});
});
