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

import { Transaction, Web3Account } from 'web3-eth-accounts';
import { transactionSchema } from 'web3-eth';
import { SupportedProviders, Web3, Web3PluginBase } from '../../src';
import {
	createAccount,
	createLocalAccount,
	getSystemTestProvider,
	waitForOpenConnection,
} from '../shared_fixtures/system_tests_utils';
import { SomeNewTxTypeTransaction, TRANSACTION_TYPE } from '../fixtures/tx-type-15';

class Eip4844Plugin extends Web3PluginBase {
	public pluginNamespace = 'txType3';
	public constructor() {
		super();
		// eslint-disable-next-line
		this.registerNewTransactionType(TRANSACTION_TYPE, SomeNewTxTypeTransaction);
	}
}

describe('Add New Tx as a Plugin', () => {
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
	it('should receive correct type of tx', async () => {
		web3.registerPlugin(new Eip4844Plugin());
		web3.config.customTransactionSchema = {
			type: 'object',
			properties: {
				...transactionSchema.properties,
				customField: { format: 'string' },
			},
		};
		web3.eth.config.customTransactionSchema = web3.config.customTransactionSchema;
		const tx = {
			from: account1.address,
			to: account2.address,
			value: '0x1',
			type: TRANSACTION_TYPE,
			maxPriorityFeePerGas: BigInt(5000000),
			maxFeePerGas: BigInt(5000000),
			customField: BigInt(42),
		};
		const sub = web3.eth.sendTransaction(tx);

		const waitForEvent: Promise<Transaction & { customField: bigint }> = new Promise(
			resolve => {
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				sub.on('sending', txData => {
					resolve(txData as unknown as Transaction & { customField: bigint });
				});
			},
		);
		const { type, customField } = await waitForEvent;
		expect(Number(type)).toBe(TRANSACTION_TYPE);
		expect(BigInt(customField)).toBe(BigInt(42));
		await expect(sub).rejects.toThrow();
	});
});
