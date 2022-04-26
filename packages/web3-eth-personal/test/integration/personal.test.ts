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
import { HexString, toChecksumAddress } from 'web3-utils';
import { EthPersonal } from '../../src/index';
import { accounts, clientUrl } from '../../../../.github/test.config'; // eslint-disable-line import/no-relative-packages

describe('set up account', () => {
	let ethPersonal: EthPersonal;
	let testAccount: HexString;
	beforeAll(async () => {
		ethPersonal = new EthPersonal(clientUrl);
		testAccount = await ethPersonal.newAccount('abc');
	});
	it('new account', async () => {
		const newAccount = await ethPersonal.newAccount('!@superpassword');
		expect(isHexStrict(newAccount)).toBe(true);
	});

	it('sign', async () => {
		const signature = await ethPersonal.sign('0x1234', testAccount, 'abc');
		expect(isHexStrict(signature)).toBe(true);
	});

	it('ecRecover', async () => {
		const signature = await ethPersonal.sign('0x2313', testAccount, 'abc');
		const publicKey = await ethPersonal.ecRecover('0x2313', signature); // ecRecover is returning all lowercase
		expect(toChecksumAddress(publicKey)).toBe(testAccount);
	});

	it('lock account', async () => {
		const lockAccount = await ethPersonal.lockAccount(testAccount);
		expect(lockAccount).toBe(true);
	});

	it('unlock account', async () => {
		const unlockedAccount = await ethPersonal.unlockAccount(testAccount, 'abc', 10000);
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
		const key = await ethPersonal.importRawKey(
			'cd3376bb711cb332ee3fb2ca04c6a8b9f70c316fcdf7a1f44ef4c7999483295d',
			'password123',
		);
		expect(key).toBe('0x7a5fe9d95ece090694b0ad8c50ca078f1d3ee021');
	});

	it('signTransaction', async () => {
		await ethPersonal.importRawKey(accounts[0].privateKey.slice(2), 'password123');

		const from = accounts[0].address;
		// const password = accounts[0].privateKey;
		const to = accounts[1].address;
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
		const expectedResult = {
			raw: '0x02f86e82053980841dcd65008459682f0082520894962f9a9c2a6c092474d24def35eccb3d9363265e82271080c001a0bbfbe91f1c160296709b7bbfdc6801f70dea7f2907e96d99d57b56d9ed7e08d7a0252567d33a5578574b4425f74bc91954ad40f4f1660d7f875712f91d8b45cbd7',
			tx: {
				type: '0x2',
				nonce: '0x0',
				gasPrice: null,
				maxPriorityFeePerGas: '0x1dcd6500',
				maxFeePerGas: '0x59682f00',
				gas: '0x5208',
				value: '0x2710',
				input: '0x',
				v: '0x1',
				r: '0xbbfbe91f1c160296709b7bbfdc6801f70dea7f2907e96d99d57b56d9ed7e08d7',
				s: '0x252567d33a5578574b4425f74bc91954ad40f4f1660d7f875712f91d8b45cbd7',
				to: '0x962f9a9c2a6c092474d24def35eccb3d9363265e',
				chainId: '0x539',
				accessList: [],
				hash: '0x866889c524d0f2977adc2fcfac5b9dc7be5b366b6602590794dde2686cf993b7',
			},
		};
		expect(JSON.parse(JSON.stringify(signedTx))).toEqual(
			JSON.parse(JSON.stringify(expectedResult)),
		);
	});
});
