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
import { toWei } from 'web3-utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import { EthPersonal } from 'web3-eth-personal';
import { PromiEvent } from 'web3-common';
// eslint-disable-next-line import/no-relative-packages
import { accounts, clientUrl } from '../../../../.github/test.config';
import { ReceiptInfo, SendTransactionEvents, Web3Eth } from '../../src';

export const prepareNetwork = async () => {
	if (process.env.TEST_CMD === 'e2e_geth') {
		const web3Eth = new Web3Eth(clientUrl);
		await web3Eth.sendTransaction({
			from: await web3Eth.getCoinbase(),
			to: accounts[0].address,
			value: toWei(100, 'ether'),
		});
		const web3Personal = new EthPersonal(clientUrl);
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
};
type SendFewTxParams = {
	web3Eth: Web3Eth;
	to: string;
	from: string;
	value: string;
	times?: number;
};
export type Resolve = (value?: unknown) => void;
export const sendFewTxes = async ({
	web3Eth,
	to,
	value,
	from,
	times = 3,
}: SendFewTxParams): Promise<unknown[]> => {
	const res = [];
	for (let i = 0; i < times; i += 1) {
		const tx: PromiEvent<ReceiptInfo, SendTransactionEvents> = web3Eth.sendTransaction({
			to,
			value,
			from,
		});
		res.push(
			// eslint-disable-next-line no-await-in-loop
			await new Promise((resolve: Resolve) => {
				tx.on('receipt', (params: ReceiptInfo) => {
					expect(params.status).toBe('0x1');
					resolve(params);
				});
			}),
		);
	}
	return res;
};
export const setupWeb3 = (web3Eth: Web3Eth, waitConfirmations = 3) => {
	web3Eth.setConfig({ transactionConfirmationBlocks: waitConfirmations });

	const account = web3Eth?.accountProvider?.privateKeyToAccount(accounts[0].privateKey);
	if (account && web3Eth?.wallet?.add) {
		web3Eth?.wallet?.add(account);
	}
};
