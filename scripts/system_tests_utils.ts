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

// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from 'cross-fetch';

// eslint-disable-next-line import/no-extraneous-dependencies
import { EthPersonal } from 'web3-eth-personal';

// eslint-disable-next-line import/no-extraneous-dependencies
import { create as createAccount } from 'web3-eth-accounts';

// eslint-disable-next-line import/no-extraneous-dependencies
import { Web3Eth } from 'web3-eth';

let _accounts: string[] = [];

/**
 * Get the env variable from Cypress if it exists or node process
 */
export const getEnvVar = (name: string): string | undefined =>
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	global.Cypress ? Cypress.env(name) : process.env[name];

export const getSystemTestProvider = (): string =>
	getEnvVar('WEB3_SYSTEM_TEST_PROVIDER') ?? 'http://localhost:8545';

export const getSystemTestMnemonic = (): string => getEnvVar('WEB3_SYSTEM_TEST_MNEMONIC') ?? '';

export const getSystemTestBackend = (): string => getEnvVar('WEB3_SYSTEM_TEST_BACKEND') ?? '';

const accounts: {
	address: string;
	privateKey: string;
}[] = [
	{
		address: '0xdc6bad79dab7ea733098f66f6c6f9dd008da3258',
		privateKey: '0x4c3758228f536f7a210f8936182fb5b728046970b8e3215d0b5cb4c4faae8a4e',
	},
	{
		address: '0x962f9a9c2a6c092474d24def35eccb3d9363265e',
		privateKey: '0x34aeb1f338c17e6b440c189655c89fcef148893a24a7f15c0cb666d9cf5eacb3',
	},
];

export const createNewAccount = async (config?: {
	unlock?: boolean;
	refill?: boolean;
}): Promise<{ address: string; privateKey: string }> => {
	const acc = createAccount();
	const clientUrl = getSystemTestProvider().replace('ws://', 'http://');
	if (config?.unlock) {
		const web3Personal = new EthPersonal(clientUrl);
		await web3Personal.importRawKey(
			getSystemTestBackend() === 'geth' ? acc.privateKey.slice(2) : acc.privateKey,
			'123456',
		);
		await web3Personal.unlockAccount(acc.address, '123456', 1000);
	}

	if (config?.refill) {
		const web3Personal = new EthPersonal(clientUrl);
		const web3Eth = new Web3Eth(clientUrl);
		const accList = await web3Personal.getAccounts();
		await web3Eth.sendTransaction({
			from: accList[0],
			to: acc.address,
			value: '1000000000000000000',
		});
	}

	return { address: acc.address, privateKey: acc.privateKey };
};

export const getSystemTestAccounts = async (): Promise<string[]> => {
	if (_accounts.length > 0) {
		return _accounts;
	}

	// For this script we need to connect over http
	const clientUrl = getSystemTestProvider().replace('ws://', 'http://');

	if (getSystemTestBackend() === 'geth') {
		const web3Eth = new Web3Eth(clientUrl);
		const web3Personal = new EthPersonal(clientUrl);

		await web3Eth.sendTransaction({
			from: await web3Eth.getCoinbase(),
			to: accounts[0].address,
			value: '100000000000000000000',
		});

		const existsAccounts = (await web3Personal.getAccounts()).map((a: string) =>
			a.toUpperCase(),
		);
		if (
			!(
				existsAccounts?.length > 0 &&
				existsAccounts.includes(accounts[0].address.toUpperCase())
			)
		) {
			await web3Personal.importRawKey(accounts[0].privateKey.substring(2), '123456');
			await web3Personal.unlockAccount(accounts[0].address, '123456', 500);
		} else {
			await web3Personal.unlockAccount(accounts[0].address, '123456', 500);
		}
	}

	const res = await fetch(clientUrl, {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify({
			jsonrpc: '2.0',
			id: 'id',
			method: 'eth_accounts',
			params: [],
		}),
	});

	_accounts = ((await res.json()) as { result: string[] }).result;

	return _accounts;
};

export const itIf = (condition: (() => boolean) | boolean) =>
	(typeof condition === 'function' ? condition() : condition) ? test : test.skip;

export const describeIf = (condition: (() => boolean) | boolean) =>
	(typeof condition === 'function' ? condition() : condition) ? describe : describe.skip;
