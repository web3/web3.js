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
import { Personal } from '../../src/index';
import {
	getSystemTestBackend,
	getSystemTestProvider,
	itIf,
	createAccount,
	createNewAccount,
	createTempAccount,
	closeOpenConnection
} from '../fixtures/system_test_utils';

describe('personal integration tests', () => {
	let ethPersonal: Personal;
	let clientUrl: string;

	beforeAll(() => {
		clientUrl = getSystemTestProvider();
		ethPersonal = new Personal(clientUrl);
	});

	afterAll(async () => {
		await closeOpenConnection(ethPersonal);
	});

	it('new account', async () => {
		const newAccount = await ethPersonal.newAccount('!@superpassword');
		expect(isHexStrict(newAccount)).toBe(true);
	});

	itIf(getSystemTestBackend() === 'geth')('ecRecover', async () => {
		const password = '123456';
		const acc = (await createTempAccount({ password })).address;
		// ganache does not support ecRecover
		const signature = await ethPersonal.sign('0x2313', acc, password);
		const publicKey = await ethPersonal.ecRecover('0x2313', signature); // ecRecover is returning all lowercase
		// eslint-disable-next-line jest/no-standalone-expect
		expect(toChecksumAddress(publicKey)).toBe(toChecksumAddress(acc));
	});

	it('lock account', async () => {
		const { address } = await createTempAccount();
		const lockAccount = await ethPersonal.lockAccount(address);
		expect(lockAccount).toBe(true);

		const from = address;
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
		const { address } = await createTempAccount();
		const unlockedAccount = await ethPersonal.unlockAccount(address, '123456', 1000);
		expect(unlockedAccount).toBe(true);

		const tx = {
			from: address,
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
		const password = '123456';
		const key = (await createTempAccount({ password })).address;
		await ethPersonal.unlockAccount(key, password, 100000);
		const signature = await ethPersonal.sign('0xdeadbeaf', key, password);
		const address = await ethPersonal.ecRecover('0xdeadbeaf', signature);
		// eslint-disable-next-line jest/no-standalone-expect
		expect(key).toBe(address);
	});

	it('getAccounts', async () => {
		const accountList = await ethPersonal.getAccounts();
		// create a new account
		const account = await ethPersonal.newAccount('cde');
		const updatedAccountList = await ethPersonal.getAccounts();
		accountList.push(account);
		expect(updatedAccountList.length).toBeGreaterThan(account.length);
	});

	it('importRawKey', async () => {
		const { address, privateKey } = createAccount();
		const rawKey = getSystemTestBackend() === 'geth' ? privateKey.slice(2) : privateKey;
		const key = await ethPersonal.importRawKey(rawKey, '123456');
		expect(toChecksumAddress(key).toLowerCase()).toBe(address.toLowerCase());
	});

	// geth doesn't have signTransaction method
	itIf(getSystemTestBackend() === 'ganache')('signTransaction', async () => {
		const acc = await createNewAccount({
			privateKey: '0x43c74e0b52c754285db6fc52cc98353804e5025e38ab80d7d9e2fd53d456de84',
			unlock: true,
			refill: true,
		});
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
			'0x02f86e82053980841dcd65008459682f00825208941337c75fdf978ababaacc038a1dcd580fec28ab282271080c001a0fef20ce4d8dd7e129bd52d08599988e74b0baad0692b9e316368896b22544162a07d69fac7625a925286dcf1be61d35c787f467b2b7e911181098d49c1ae041deb';
		// eslint-disable-next-line jest/no-standalone-expect
		expect(signedTx).toEqual(expectedResult);
	});

	it('sendTransaction', async () => {
		const from = (await createNewAccount({ unlock: true, refill: true })).address;

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
