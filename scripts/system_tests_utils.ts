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
import { format, SocketProvider } from 'web3-utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
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
import {
	EthExecutionAPI,
	Bytes,
	Web3BaseProvider,
	Transaction,
	KeyStore,
	ProviderConnectInfo,
	Web3ProviderEventCallback,
	ProviderRpcError,
	JsonRpcSubscriptionResult,
	JsonRpcNotification,
	ETH_DATA_FORMAT,
	SupportedProviders,
	Web3APISpec,
	Web3EthExecutionAPI,
} from 'web3-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Personal } from 'web3-eth-personal';
// eslint-disable-next-line import/no-extraneous-dependencies
import Web3 from 'web3';

// eslint-disable-next-line import/no-extraneous-dependencies
import { NonPayableMethodObject } from 'web3-eth-contract';
// eslint-disable-next-line import/no-extraneous-dependencies
import HttpProvider from 'web3-providers-http';
// eslint-disable-next-line import/no-extraneous-dependencies
import IpcProvider from 'web3-providers-ipc';
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

export const getSystemTestProviderUrl = (): string =>
	getEnvVar('WEB3_SYSTEM_TEST_PROVIDER') ?? DEFAULT_SYSTEM_PROVIDER;

export const getSystemTestProvider = <API extends Web3APISpec = Web3EthExecutionAPI>():
	| string
	| SupportedProviders<API> => {
	const url = getSystemTestProviderUrl();
	if (url.includes('ipc')) {
		return new IpcProvider<API>(url);
	}
	return url;
};

export const getSystemTestEngine = (): string =>
	getEnvVar('WEB3_SYSTEM_TEST_ENGINE') ?? DEFAULT_SYSTEM_ENGINE;

export const isHttp: boolean = getSystemTestProviderUrl().startsWith('http');
export const isWs: boolean = getSystemTestProviderUrl().startsWith('ws');
export const isIpc: boolean = getSystemTestProviderUrl().includes('ipc');
export const isChrome: boolean = getSystemTestEngine() === 'chrome';
export const isFirefox: boolean = getSystemTestEngine() === 'firefox';
export const isElectron: boolean = getSystemTestEngine() === 'electron';
export const isNode: boolean = getSystemTestEngine() === 'isNode';
export const isSyncTest: boolean = getEnvVar('TEST_OPTION') === 'sync';
export const isSocket: boolean = isWs || isIpc;
export const isBrowser: boolean = ['chrome', 'firefox'].includes(getSystemTestEngine());

export const getSystemTestMnemonic = (): string => getEnvVar('WEB3_SYSTEM_TEST_MNEMONIC') ?? '';

export const getSystemTestBackend = (): string => getEnvVar('WEB3_SYSTEM_TEST_BACKEND') ?? '';

export const createAccount = _createAccount;

export const itIf = (condition: (() => boolean) | boolean) =>
	(typeof condition === 'function' ? condition() : condition) ? test : test.skip;

export const describeIf = (condition: (() => boolean) | boolean) =>
	(typeof condition === 'function' ? condition() : condition) ? describe : describe.skip;

const maxNumberOfAttempts = 100;
const intervalTime = 500; // ms

export const waitForOpenConnection = async (
	web3Context: Web3Context,
	currentAttempt = 1,
	status = 'connected',
) =>
	new Promise<void>((resolve, reject) => {
		if (!isSocket) {
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

export const closeOpenConnection = async (web3Context: Web3Context) => {
	if (!isSocket || web3Context?.provider instanceof HttpProvider) {
		return;
	}

	// make sure we try to close the connection after it is established
	if (
		web3Context?.provider &&
		(web3Context.provider as unknown as Web3BaseProvider).getStatus() === 'connecting'
	) {
		await waitForOpenConnection(web3Context);
	}

	// If an error happened during closing, that is acceptable at tests, just print a 'warn'.
	if (web3Context?.provider) {
		(web3Context.provider as unknown as Web3BaseProvider).on('error', (err: any) => {
			console.warn('error while trying to close the connection', err);
		});
	}

	// Wait a bit to ensure the connection does not have a pending data that
	//	could cause an error if written after closing the connection.
	await new Promise<void>(resolve => {
		setTimeout(resolve, 500);
	});

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
		keystore: string | KeyStore,
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
		const account = _createAccount();

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

export const refillAccount = async (from: string, to: string, value: string | number) => {
	const web3Eth = new Web3Eth(DEFAULT_SYSTEM_PROVIDER);

	await web3Eth.sendTransaction({
		from,
		to,
		value,
	});
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
		if (!mainAcc) {
			[mainAcc] = await web3Personal.getAccounts();
		}
		await refillAccount(mainAcc, acc.address, '100000000000000000');
	}

	return { address: acc.address.toLowerCase(), privateKey: acc.privateKey };
};
let tempAccountList: { address: string; privateKey: string }[] = [];
const walletsOnWorker = 20;

if (tempAccountList.length === 0) {
	tempAccountList = accountsString;
}
let currentIndex = Math.floor(Math.random() * (tempAccountList ? tempAccountList.length : 0));
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

export const signTxAndSendEIP1559 = async (
	provider: unknown,
	tx: Transaction,
	privateKey: string,
) => {
	const web3 = new Web3(provider as Web3BaseProvider);
	const acc = web3.eth.accounts.privateKeyToAccount(privateKey);
	const signedTx = await acc.signTransaction({
		...tx,
		type: '0x2',
		gas: tx.gas ?? '1000000',
		from: acc.address,
	});
	return web3.eth.sendSignedTransaction(signedTx.rawTransaction, undefined, {
		checkRevertBeforeSending: false,
	});
};

export const signTxAndSendEIP2930 = async (
	provider: unknown,
	tx: Transaction,
	privateKey: string,
) => {
	const web3 = new Web3(provider as Web3BaseProvider);
	const acc = web3.eth.accounts.privateKeyToAccount(privateKey);
	const signedTx = await acc.signTransaction({
		...tx,
		type: '0x1',
		gas: tx.gas ?? '1000000',
		from: acc.address,
	});
	return web3.eth.sendSignedTransaction(signedTx.rawTransaction, undefined, {
		checkRevertBeforeSending: false,
	});
};

export const signAndSendContractMethodEIP1559 = async (
	provider: unknown,
	address: string,
	method: NonPayableMethodObject,
	privateKey: string,
) =>
	signTxAndSendEIP1559(
		provider,
		{
			to: address,
			data: method.encodeABI(),
		},
		privateKey,
	);

export const signAndSendContractMethodEIP2930 = async (
	provider: unknown,
	address: string,
	method: NonPayableMethodObject,
	privateKey: string,
) =>
	signTxAndSendEIP2930(
		provider,
		{
			to: address,
			data: method.encodeABI(),
		},
		privateKey,
	);

export const createLocalAccount = async (web3: Web3) => {
	const account = web3.eth.accounts.create();
	await refillAccount((await createTempAccount()).address, account.address, '10000000000000000');
	web3.eth.accounts.wallet.add(account);
	return account;
};
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line arrow-body-style
export const waitForSocketConnect = async (provider: SocketProvider<any, any, any>) => {
	return new Promise<ProviderConnectInfo>(resolve => {
		provider.on('connect', ((
			_error: Error | ProviderRpcError | undefined,
			data: JsonRpcSubscriptionResult | JsonRpcNotification<ProviderConnectInfo> | undefined,
		) => {
			resolve(data as unknown as ProviderConnectInfo);
		}) as Web3ProviderEventCallback<ProviderConnectInfo>);
	});
};

// eslint-disable-next-line arrow-body-style
export const waitForSocketDisconnect = async (provider: SocketProvider<any, any, any>) => {
	return new Promise<ProviderRpcError>(resolve => {
		provider.on('disconnect', ((
			_error: ProviderRpcError | Error | undefined,
			data: JsonRpcSubscriptionResult | JsonRpcNotification<ProviderRpcError> | undefined,
		) => {
			resolve(data as unknown as ProviderRpcError);
		}) as Web3ProviderEventCallback<ProviderRpcError>);
	});
};

export const waitForOpenSocketConnection = async (provider: SocketProvider<any, any, any>) =>
	new Promise<ProviderConnectInfo>(resolve => {
		provider.on('connect', ((_error, data) => {
			resolve(data as unknown as ProviderConnectInfo);
		}) as Web3ProviderEventCallback<ProviderConnectInfo>);
	});

export const waitForCloseSocketConnection = async (provider: SocketProvider<any, any, any>) =>
	new Promise<ProviderRpcError>(resolve => {
		provider.on('disconnect', ((_error, data) => {
			resolve(data as unknown as ProviderRpcError);
		}) as Web3ProviderEventCallback<ProviderRpcError>);
	});

export const waitForEvent = async (
	web3Provider: SocketProvider<any, any, any>,
	eventName: string,
) =>
	new Promise(resolve => {
		web3Provider.on(eventName, (error: any, data: any) => {
			resolve(data || error);
		});
	});

export const sendFewSampleTxs = async (cnt = 1) => {
	const web3 = new Web3(DEFAULT_SYSTEM_PROVIDER);
	const fromAcc = await createLocalAccount(web3);
	const toAcc = createAccount();
	const res = [];
	for (let i = 0; i < cnt; i += 1) {
		res.push(
			// eslint-disable-next-line no-await-in-loop
			await web3.eth.sendTransaction({
				to: toAcc.address,
				value: '0x1',
				from: fromAcc.address,
				gas: '300000',
			}),
		);
	}
	await closeOpenConnection(web3);
	return res;
};
