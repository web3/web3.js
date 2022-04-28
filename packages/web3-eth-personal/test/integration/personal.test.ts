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

describe('set up account', () => {
	let ethPersonal: EthPersonal;
	beforeAll(() => {
		ethPersonal = new EthPersonal(clientUrl);
	});
	it('new account', async () => {
		const newAccount = await ethPersonal.newAccount('!@superpassword');
		expect(isHexStrict(newAccount)).toBe(true);
	});

	it('sign', async () => {
		if (process.env.TEST_CMD === 'e2e_geth') {
			// ganache does not support sign

			await ethPersonal.importRawKey(accounts[0].privateKey.slice(2), '123');
			const signature = await ethPersonal.sign('0xdeadbeaf', accounts[0].address, '123');
			// eslint-disable-next-line jest/no-conditional-expect
			expect(signature).toBe(
				'0x2f835b77e8fbb14951830b57e3b9c81cec6f2ec25bf749ac37cbeaa859baf5877797effc174048187a9491f17af3a37a6fa8044f773d89b2ced4d8f2c188c7e01c',
			);
		}
	});

	it('ecRecover', async () => {
		if (process.env.TEST_CMD === 'e2e_geth') {
			// ganache does not support ecRecover

			await ethPersonal.importRawKey(accounts[2].privateKey, 'abc'); // import account
			const signature = await ethPersonal.sign('0x2313', accounts[2].address, 'abc');
			const publicKey = await ethPersonal.ecRecover('0x2313', signature); // ecRecover is returning all lowercase
			// eslint-disable-next-line jest/no-conditional-expect
			expect(toChecksumAddress(publicKey)).toBe(accounts[2].address);
		}
	});

	it('lock account', async () => {
		// ganache requires prefixed, must be apart of account ganache command
		let key;
		if (process.env.TEST_CMD === 'e2e_geth') {
			key = await ethPersonal.newAccount('123');
			key = key.slice(2);
		} else {
			key = await ethPersonal.importRawKey(accounts[0].privateKey, '123');
		}
		const lockAccount = await ethPersonal.lockAccount(key);
		expect(lockAccount).toBe(true);
	});

	it('unlock account', async () => {
		let key;
		if (process.env.TEST_CMD === 'e2e_geth') {
			key = await ethPersonal.newAccount('123');
			key = key.slice(2);
		} else {
			key = await ethPersonal.importRawKey(accounts[3].privateKey, '123');
		}
		const unlockedAccount = await ethPersonal.unlockAccount(key, '123', 10000);
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
		const account = process.env.TEST_CMD === 'e2e_geth' ? accounts[4] : accounts[5];
		const key = await ethPersonal.importRawKey(account.privateKey, 'password123');
		expect(toChecksumAddress(key)).toBe(account.address);
	});

	it('signTransaction', async () => {
		const rawKey =
			process.env.TEST_CMD === 'e2e_geth'
				? accounts[0].privateKey.slice(2)
				: accounts[0].privateKey;
		await ethPersonal.importRawKey(rawKey, 'password123');

		const from = accounts[0].address;
		const to = accounts[2].address;
		const value = `10000`;
		const tx = {
			from,
			to,
			value,
			gas: '21000',
			maxFeePerGas: '0x59682F00',
			maxPriorityFeePerGas: '0x1DCD6500',
			nonce: 0,
		};
		const signedTx = await ethPersonal.signTransaction(tx, 'password123');

		const expectedResult =
			process.env.TEST_CMD === 'e2e_geth'
				? '0x02f86e82053980841dcd65008459682f0082520894962f9a9c2a6c092474d24def35eccb3d9363265e82271080c001a02661e510e0a64d65694808278f11dacbee33f3d8bcb589d37a168e911ba5f97fa0488b98a76e25487e28d393757b25d22f7272e0a0b39da4c1b8c8cd45e3173819'
				: '0x02f86e82053980841dcd65008459682f008252089462ff0b7cfd7c46e2d647359608592ae91ed2faad82271080c001a0164b80af6236765677e1cc5e14f9b50e967ce9867a1b6df099be589cb734fe22a01a3e79c19373ae1601f26c40e5f9cd9a26befc24e462c8921b1830d8d0afc82c';
		expect(signedTx).toEqual(expectedResult);
	});

	it('sendTransaction', async () => {
		const rawKey =
			process.env.TEST_CMD === 'e2e_geth'
				? 'cd3376bb711cb332ee3fb2ca04c6a8b9f70c316fcdf7a1f44ef4c7999483295d'
				: accounts[1].privateKey;

		await ethPersonal.importRawKey(rawKey, 'password123');

		const from = accounts[0].address;
		const to = accounts[2].address;
		const value = `10000`;
		const tx = {
			from,
			to,
			value,
			gas: '21000',
			maxFeePerGas: '0x59682F00',
			maxPriorityFeePerGas: '0x1DCD6500',
			nonce: 0,
		};
		const receipt = await ethPersonal.sendTransaction(tx, 'password123');
		const expectedResult =
			process.env.TEST_CMD === 'e2e_geth'
				? '0x38be8c210b979484dd2e9dbec12c535cc012abf11f3ca7399632227be205c805'
				: '0x3ca91d8071d31cef11f39cf58fa4307e31b4b24eb4a4c8d0d95da5ba3d554bc8';
		expect(JSON.parse(JSON.stringify(receipt))).toEqual(
			JSON.parse(JSON.stringify(expectedResult)),
		);
	});
});
