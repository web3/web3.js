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
import { ETH_DATA_FORMAT, format } from 'web3-utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
	create,
	create as _createAccount,
	decrypt,
	privateKeyToAccount,
	signTransaction,
} from 'web3-eth-accounts';

// eslint-disable-next-line import/no-extraneous-dependencies
import { prepareTransactionForSigning, Web3Eth } from 'web3-eth';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Web3Context } from 'web3-core';

// eslint-disable-next-line import/no-extraneous-dependencies
import { EthExecutionAPI, Bytes, Web3BaseProvider, Transaction } from 'web3-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Personal } from 'web3-eth-personal';

import accountsString from './accounts.json';

/**
 * Get the env variable from Cypress if it exists or node process
 */
export const getEnvVar = (name: string): string | undefined =>
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	global.Cypress ? Cypress.env(name) : process.env[name];

export const DEFAULT_SYSTEM_PROVIDER = 'http://127.0.0.1:8545';
export const DEFAULT_SYSTEM_ENGINE = 'node';

export const getSystemTestProvider = (): string =>
	getEnvVar('WEB3_SYSTEM_TEST_PROVIDER') ?? DEFAULT_SYSTEM_PROVIDER;

export const getSystemTestEngine = (): string =>
	getEnvVar('WEB3_SYSTEM_TEST_ENGINE') ?? DEFAULT_SYSTEM_ENGINE;

export const isHttp: boolean = getSystemTestProvider().startsWith('http');
export const isWs: boolean = getSystemTestProvider().startsWith('ws');
export const isIpc: boolean = getSystemTestProvider().includes('ipc');
export const isChrome: boolean = getSystemTestEngine() === 'chrome';
export const isFirefox: boolean = getSystemTestEngine() === 'firefox';
export const isElectron: boolean = getSystemTestEngine() === 'electron';
export const isNode: boolean = getSystemTestEngine() === 'isNode';
export const isBrowser: boolean = ['chrome', 'firefox'].includes(getSystemTestEngine());

export const getSystemTestMnemonic = (): string => getEnvVar('WEB3_SYSTEM_TEST_MNEMONIC') ?? '';

export const getSystemTestBackend = (): string => getEnvVar('WEB3_SYSTEM_TEST_BACKEND') ?? '';

export const createAccount = _createAccount;

export const itIf = (condition: (() => boolean) | boolean) =>
	(typeof condition === 'function' ? condition() : condition) ? test : test.skip;

export const describeIf = (condition: (() => boolean) | boolean) =>
	(typeof condition === 'function' ? condition() : condition) ? describe : describe.skip;

const maxNumberOfAttempts = 10;
const intervalTime = 5000; // ms

export const waitForOpenConnection = async (
	web3Context: Web3Context<any>,
	currentAttempt = 1,
	status = 'connected',
) =>
	new Promise<void>((resolve, reject) => {
		if (!getSystemTestProvider().startsWith('ws')) {
			resolve();
			return;
		}

		const interval = setInterval(() => {
			if (currentAttempt > maxNumberOfAttempts - 1) {
				clearInterval(interval);
				reject(new Error('Maximum number of attempts exceeded'));
			} else if (
				(web3Context.provider as unknown as Web3BaseProvider).getStatus() === status
			) {
				clearInterval(interval);
				resolve();
			}
			// eslint-disable-next-line no-plusplus, no-param-reassign
			currentAttempt++;
		}, intervalTime);
	});

export const closeOpenConnection = async (web3Context: Web3Context<any>) => {
	if (!isWs && !isIpc) {
		return;
	}

	// make sure we try to close the connection after it is established
	if (
		web3Context?.provider &&
		(web3Context.provider as unknown as Web3BaseProvider).getStatus() === 'connecting'
	) {
		await waitForOpenConnection(web3Context);
	}

	if (
		web3Context?.provider &&
		'disconnect' in (web3Context.provider as unknown as Web3BaseProvider)
	) {
		(web3Context.provider as unknown as Web3BaseProvider).disconnect(1000, '');
	}
};

export const createAccountProvider = (context: Web3Context<EthExecutionAPI>) => {
	const signTransactionWithContext = async (transaction: Transaction, privateKey: Bytes) => {
		const tx = await prepareTransactionForSigning(transaction, context);

		const privateKeyBytes = format({ eth: 'bytes' }, privateKey, ETH_DATA_FORMAT);

		return signTransaction(tx, privateKeyBytes);
	};

	const privateKeyToAccountWithContext = (privateKey: Buffer | string) => {
		const account = privateKeyToAccount(privateKey);

		return {
			...account,
			signTransaction: async (transaction: Transaction) =>
				signTransactionWithContext(transaction, account.privateKey),
		};
	};

	const decryptWithContext = async (
		keystore: string,
		password: string,
		options?: Record<string, unknown>,
	) => {
		const account = await decrypt(keystore, password, (options?.nonStrict as boolean) ?? true);

		return {
			...account,
			signTransaction: async (transaction: Transaction) =>
				signTransactionWithContext(transaction, account.privateKey),
		};
	};

	const createWithContext = () => {
		const account = create();

		return {
			...account,
			signTransaction: async (transaction: Transaction) =>
				signTransactionWithContext(transaction, account.privateKey),
		};
	};

	return {
		create: createWithContext,
		privateKeyToAccount: privateKeyToAccountWithContext,
		decrypt: decryptWithContext,
	};
};

let mainAcc: string;
export const createNewAccount = async (config?: {
	unlock?: boolean;
	refill?: boolean;
	privateKey?: string;
	password?: string;
	doNotImport?: boolean;
}): Promise<{ address: string; privateKey: string }> => {
	const acc = config?.privateKey ? privateKeyToAccount(config?.privateKey) : _createAccount();

	const clientUrl = DEFAULT_SYSTEM_PROVIDER;

	if (config?.unlock) {
		const web3Personal = new Personal(clientUrl);
		if (!config?.doNotImport) {
			await web3Personal.importRawKey(
				getSystemTestBackend() === 'geth' ? acc.privateKey.slice(2) : acc.privateKey,
				config.password ?? '123456',
			);
		}

		await web3Personal.unlockAccount(acc.address, config.password ?? '123456', 100000000);
	}

	if (config?.refill) {
		const web3Personal = new Personal(clientUrl);
		const web3Eth = new Web3Eth(clientUrl);
		if (!mainAcc) {
			[mainAcc] = await web3Personal.getAccounts();
		}

		await web3Eth.sendTransaction({
			from: mainAcc,
			to: acc.address,
			value: '100000000000000000',
		});
	}

	return { address: acc.address.toLowerCase(), privateKey: acc.privateKey };
};
let tempAccountList: { address: string; privateKey: string }[] = [];
const walletsOnWorker = 20;

if (tempAccountList.length === 0) {
	tempAccountList = accountsString;
}
let currentIndex = 0;
export const createTempAccount = async (
	config: {
		unlock?: boolean;
		refill?: boolean;
		privateKey?: string;
		password?: string;
	} = {},
): Promise<{ address: string; privateKey: string }> => {
	if (
		config.unlock === false ||
		config.refill === false ||
		config.privateKey ||
		config.password
	) {
		return createNewAccount({
			unlock: config.unlock ?? true,
			refill: config.refill ?? true,
			privateKey: config.privateKey,
			password: config.password,
		});
	}

	if (currentIndex >= walletsOnWorker || !tempAccountList[currentIndex]) {
		currentIndex = 0;
	}

	const acc = tempAccountList[currentIndex];
	await createNewAccount({
		unlock: true,
		refill: false,
		privateKey: acc.privateKey,
		doNotImport: true,
	});
	currentIndex += 1;

	return acc;
};

export const getSystemTestAccountsWithKeys = async (): Promise<
	{
		address: string;
		privateKey: string;
	}[]
> => {
	const acc = await createTempAccount();
	const acc2 = await createTempAccount();
	const acc3 = await createTempAccount();
	return [acc, acc2, acc3];
};

export const getSystemTestAccounts = async (): Promise<string[]> =>
	(await getSystemTestAccountsWithKeys()).map(a => a.address);
