// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from 'cross-fetch';

// eslint-disable-next-line import/no-extraneous-dependencies
import { EthPersonal } from 'web3-eth-personal';

// eslint-disable-next-line import/no-extraneous-dependencies
import { Web3Eth } from 'web3-eth';

let _accounts: string[] = [];

export const getSystemTestProvider = (): string =>
	process.env.WEB3_SYSTEM_TEST_PROVIDER ?? 'http://localhost:8545';

export const getSystemTestMnemonic = (): string => process.env.WEB3_SYSTEM_TEST_MNEMONIC ?? '';

export const getSystemTestBackend = (): string => process.env.WEB3_SYSTEM_TEST_BACKEND ?? '';

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

export const getSystemTestAccounts = async (): Promise<string[]> => {
	if (_accounts.length > 0) {
		return _accounts;
	}

	const clientUrl = `http://localhost:${process.env.WEB3_SYSTEM_TEST_HTTP_PORT ?? 8545}`;

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
