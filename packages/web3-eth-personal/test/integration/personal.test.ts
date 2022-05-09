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
import { EthPersonal } from '../../src/index';
import { accounts, clientUrl } from '../config/personal.test.config';
import { getSystemTestBackend, getSystemTestAccounts } from '../fixtures/system_test_utils';

describe('peronsal integration tests', () => {
	let ethPersonal: EthPersonal;
	let account: string[];
	beforeAll(() => {
		ethPersonal = new EthPersonal(clientUrl);
	});
	beforeEach(async () => {
		account = await getSystemTestAccounts();
	});
	it('new account', async () => {
		const newAccount = await ethPersonal.newAccount('!@superpassword');
		expect(isHexStrict(newAccount)).toBe(true);
	});

	it('ecRecover', async () => {
		if (getSystemTestBackend() === 'geth') {
			// ganache does not support ecRecover
			const signature = await ethPersonal.sign('0x2313', account[0], '');
			const publicKey = await ethPersonal.ecRecover('0x2313', signature); // ecRecover is returning all lowercase
			// eslint-disable-next-line jest/no-conditional-expect
			expect(toChecksumAddress(publicKey)).toBe(toChecksumAddress(account[0]));
		}
	});

	it('lock account', async () => {
		// ganache requires prefixed, must be apart of account ganache command
		const lockAccount = await ethPersonal.lockAccount(account[1]);
		expect(lockAccount).toBe(true);
	});

	it('unlock account', async () => {
		const key = account[0];
		const unlockedAccount = await ethPersonal.unlockAccount(key, '', 100000);
		expect(unlockedAccount).toBe(true);
	});

	it('sign', async () => {
		if (getSystemTestBackend() === 'geth') {
			// ganache does not support sign
			const key = account[0];
			await ethPersonal.unlockAccount(key, '', 100000);
			const signature = await ethPersonal.sign('0xdeadbeaf', account[0], '');
			const address = await ethPersonal.ecRecover('0xdeadbeaf', signature);
			// eslint-disable-next-line jest/no-conditional-expect
			expect(account[0]).toBe(address);
		}
	});

	it('getAccounts', async () => {
		const accountList = await ethPersonal.getAccounts();
		const accountsLength = accountList.length;
		// create a new account
		await ethPersonal.newAccount('cde');
		const updatedAccountList = await ethPersonal.getAccounts();
		expect(updatedAccountList).toHaveLength(accountsLength + 1);
	});

	it('importRawKey', async () => {
		const rawKey =
			getSystemTestBackend() === 'geth'
				? accounts[4].privateKey.slice(2)
				: accounts[4].privateKey;
		const key = await ethPersonal.importRawKey(rawKey, 'password123');
		expect(toChecksumAddress(key)).toBe(accounts[4].address);
	});

	it('sendTransaction', async () => {
		const to = account[3];
		const value = `10000`;

		const from = account[0];
		await ethPersonal.unlockAccount(from, '', 100000);
		const tx = {
			from,
			to,
			value,
			gas: '21000',
			maxFeePerGas: '0x59682F00',
			maxPriorityFeePerGas: '0x1DCD6500',
		};
		const receipt = await ethPersonal.sendTransaction(tx, '');

		expect(isHexStrict(receipt)).toBe(true);
	});
});
