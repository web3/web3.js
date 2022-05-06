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
import { accounts, clientUrl } from '../config/personal.test.config'; // eslint-disable-line import/no-relative-packages
import { getSystemTestBackend, getSystemTestAccounts } from '../fixtures/system_test_utils';

describe('set up account', () => {
	let ethPersonal: EthPersonal;
	let account: string[];
	beforeAll(async () => {
		ethPersonal = new EthPersonal(clientUrl);
		account = await getSystemTestAccounts();
	});
	it('new account', async () => {
		const newAccount = await ethPersonal.newAccount('!@superpassword');
		expect(isHexStrict(newAccount)).toBe(true);
	});

	it('sign', async () => {
		if (getSystemTestBackend() === 'geth') {
			// ganache does not support sign
			const signature = await ethPersonal.sign('0xdeadbeaf', account[0], '');
			// eslint-disable-next-line jest/no-conditional-expect
			expect(signature).toBe(
				'0x2f835b77e8fbb14951830b57e3b9c81cec6f2ec25bf749ac37cbeaa859baf5877797effc174048187a9491f17af3a37a6fa8044f773d89b2ced4d8f2c188c7e01c',
			);
		}
	});

	it('ecRecover', async () => {
		if (getSystemTestBackend() === 'geth') {
			// ganache does not support ecRecover
			const signature = await ethPersonal.sign('0x2313', account[0], '');
			const publicKey = await ethPersonal.ecRecover('0x2313', signature); // ecRecover is returning all lowercase
			// eslint-disable-next-line jest/no-conditional-expect
			expect(toChecksumAddress(publicKey)).toBe(accounts[0]);
		}
	});

	it('lock account', async () => {
		// ganache requires prefixed, must be apart of account ganache command
		const lockAccount = await ethPersonal.lockAccount(account[0]);
		expect(lockAccount).toBe(true);
	});

	it('unlock account', async () => {
		const key = account[0];
		const unlockedAccount = await ethPersonal.unlockAccount(key, '', 10000);
		expect(unlockedAccount).toBe(true);
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
		const rawKey = accounts[4].privateKey;
		const key = await ethPersonal.importRawKey(rawKey.slice(2), 'password123');
		expect(toChecksumAddress(key)).toBe(accounts[4].address);
	});

	it('signTransaction', async () => {
		const from = account[0];
		const to = account[2];
		const value = `10000`;
		const tx = {
			from,
			to,
			value,
			gas: '21000',
			maxFeePerGas: '0x59682F00',
			maxPriorityFeePerGas: '0x1DCD6500',
		};
		const signedTx = await ethPersonal.signTransaction(tx, '');

		const expectedResult =
			'0x02f86e82053980841dcd65008459682f0082520894ccfe90c862d2501ce233107d1a1f40afd50d09d082271080c001a0567617b322c9acb53697bcef1a2fae60c42cc9d66b04d779ed967cc02e055640a003aae813dff1508b4ec1fcea720c9803aeec67e97c000fa10cb1d12eb8822f58';
		expect(signedTx).toEqual(expectedResult);
	});

	it('sendTransaction', async () => {
		const to = accounts[2].address;
		const value = `10000`;

		const from = account[0];
		const tx = {
			from,
			to,
			value,
			gas: '21000',
			maxFeePerGas: '0x59682F00',
			maxPriorityFeePerGas: '0x1DCD6500',
		};
		const receipt = await ethPersonal.sendTransaction(tx, '');
		const expectedResult = '0xce8c0649b6d8bc6fa933cd7b610c6435436d85b51095bf47d35dd52b7f0c5b0b';
		expect(JSON.parse(JSON.stringify(receipt))).toEqual(
			JSON.parse(JSON.stringify(expectedResult)),
		);
		expect(isHexStrict(receipt)).toBe(true);
	});
});
