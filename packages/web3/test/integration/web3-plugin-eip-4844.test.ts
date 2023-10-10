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

/* eslint-disable @typescript-eslint/no-magic-numbers */

import { SupportedProviders, Web3, Web3PluginBase } from 'web3';
import { TransactionFactory, Web3Account } from 'web3-eth-accounts';
import {
	createAccount,
	createLocalAccount,
	getSystemTestProvider,
	waitForOpenConnection,
} from "web3.js/scripts/system_tests_utils";
import { BlobEIP4844Transaction } from '../fixtures/tx-type-eip484';

export class Eip4844Plugin extends Web3PluginBase {
	public pluginNamespace = 'tx';

	constructor() {
		super();
		// @ts-expect-error
		TransactionFactory.registerTransactionType<typeof BlobEIP4844Transaction>(
			3,
			BlobEIP4844Transaction,
		);
	}
}

describe('Plugin 4844', () => {
	let web3: Web3;
	let clientUrl: string | SupportedProviders;
	let account1: Web3Account;
	let account2: Web3Account;
	beforeEach(async () => {
		clientUrl = getSystemTestProvider();
		web3 = new Web3(clientUrl);
		account1 = await createLocalAccount(web3);
		account2 = createAccount();
		web3.eth.accounts.wallet.add(account1);
		await waitForOpenConnection(web3.eth);
	});
	it('should create instance of the plugin', async () => {
		web3.registerPlugin(new Eip4844Plugin());
		const gasPrice = await web3.eth.getGasPrice();
		const sentTx = web3.eth.sendTransaction(
			{
				from: account1.address,
				to: account2.address,
				gas: BigInt(500000),
				gasPrice,
				maxFeePerGas: BigInt(500000),
				value: '0x1',
				type: 3,
			},
			undefined,
			{
				checkRevertBeforeSending: false,
			},
		);
		console.log('sentTx', sentTx);
		console.log('sentTx res ', await sentTx);
	});
});
