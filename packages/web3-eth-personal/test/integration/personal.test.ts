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

	it('signTransaction', async () => {
		const key = account[0];
		await ethPersonal.unlockAccount(key, '', 100000);
		const from = account[0];
		const to = '0x1337C75FdF978ABABaACC038A1dCd580FeC28ab2';
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
		const signedTx = await ethPersonal.signTransaction(tx, '');

		const expectedResult =
			'0x02f86e82053980841dcd65008459682f00825208946e599da0bff7a6598ac1224e4985430bf16458a482271080c080a080dfd8ea310fd2b56f46de72d02c540b7076ea3d8f9b946dc83a7785301bc027a0696332df244fabec85a6e777f565c2f69ba0d4d607ced23ac03a0b503fae4659';
		expect(signedTx).toEqual(expectedResult);
	});

	it('sendTransaction', async () => {
		const to = accounts[2].address;
		const value = `10000`;

		const from = account[2];
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
		const expectedResult =
			getSystemTestBackend() === 'geth'
				? '0x0761906d26530ddd872719b49918d1925f1bd333480b4e451d445774774a1241'
				: '0xce8c0649b6d8bc6fa933cd7b610c6435436d85b51095bf47d35dd52b7f0c5b0b';
		expect(JSON.parse(JSON.stringify(receipt))).toEqual(
			JSON.parse(JSON.stringify(expectedResult)),
		);
		expect(isHexStrict(receipt)).toBe(true);
	});
});
