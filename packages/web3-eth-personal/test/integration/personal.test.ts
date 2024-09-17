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
import { EthPersonalAPI, SupportedProviders } from 'web3-types';
import { toChecksumAddress } from 'web3-utils';
import { isHexStrict } from 'web3-validator';
import { Personal } from '../../src/index';
import {
	closeOpenConnection,
	createAccount,
	createNewAccount,
	createTempAccount,
	getSystemTestBackend,
	getSystemTestProvider,
	itIf,
	describeIf,
	BACKEND,
} from '../fixtures/system_test_utils';

// hardhat does not support personal
describeIf(getSystemTestBackend() !== BACKEND.HARDHAT)('personal integration tests', () => {
	let ethPersonal: Personal;
	let clientUrl: string | SupportedProviders<EthPersonalAPI>;

	beforeAll(() => {
		clientUrl = getSystemTestProvider();
		ethPersonal = new Personal(clientUrl);
	});

	afterAll(async () => {
		await closeOpenConnection(ethPersonal);
	});

	test('new account', async () => {
		const newAccount = await ethPersonal.newAccount('!@superpassword');
		expect(isHexStrict(newAccount)).toBe(true);
	});

	itIf(getSystemTestBackend() === BACKEND.GETH)('ecRecover', async () => {
		const password = '123456';
		const acc = (await createTempAccount({ password })).address;
		// ganache does not support ecRecover
		const signature = await ethPersonal.sign('0x2313', acc, password);
		const publicKey = await ethPersonal.ecRecover('0x2313', signature); // ecRecover is returning all lowercase
		// eslint-disable-next-line jest/no-standalone-expect
		expect(toChecksumAddress(publicKey)).toBe(toChecksumAddress(acc));
	});

	test('lock account', async () => {
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

	test('unlock account', async () => {
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
	itIf(getSystemTestBackend() === BACKEND.GETH)('sign', async () => {
		const password = '123456';
		const key = (await createTempAccount({ password })).address;
		await ethPersonal.unlockAccount(key, password, 100000);
		const signature = await ethPersonal.sign('0xdeadbeaf', key, password);
		const address = await ethPersonal.ecRecover('0xdeadbeaf', signature);
		// eslint-disable-next-line jest/no-standalone-expect
		expect(key).toBe(address);
	});

	test('getAccounts', async () => {
		const accountList = await ethPersonal.getAccounts();
		// create a new account
		await ethPersonal.newAccount('cde');
		const updatedAccountList = await ethPersonal.getAccounts();
		expect(updatedAccountList.length).toBeGreaterThan(accountList.length);
	});

	test('importRawKey', async () => {
		const { address, privateKey } = createAccount();
		const rawKey = getSystemTestBackend() === BACKEND.GETH ? privateKey.slice(2) : privateKey;
		const key = await ethPersonal.importRawKey(rawKey, '123456');
		expect(toChecksumAddress(key).toLowerCase()).toBe(address.toLowerCase());
	});

	test('sendTransaction', async () => {
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
