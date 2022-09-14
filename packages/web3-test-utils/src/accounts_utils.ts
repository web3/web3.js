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
import { Web3RequestManager } from 'web3-core';
import {
	Address,
	BlockTags,
	HexString32Bytes,
	Transaction,
	TransactionWithSenderAPI,
	Web3AccountProvider,
	Web3BaseWallet,
	Web3BaseWalletAccount,
} from 'web3-types';
import { ethRpcMethods } from 'web3-rpc-methods';

import { getTestClient, getTestProvider } from './get_env';

const _sendTransaction = async (
	transaction: Transaction & { from: Address },
): Promise<HexString32Bytes> => {
	const web3RequestManager = new Web3RequestManager(getTestProvider());
	const _transaction = { ...transaction };

	if (transaction.type === undefined) {
		_transaction.type = '0x0';
	}

	if (transaction.value === undefined) {
		_transaction.value = '0x0';
	}

	if (transaction.input === undefined) {
		_transaction.input = '0x';
	}

	if (transaction.nonce === undefined) {
		_transaction.nonce = await ethRpcMethods.getTransactionCount(
			web3RequestManager,
			transaction.from,
			BlockTags.LATEST,
		);
	}

	if (transaction.gas === undefined) {
		_transaction.gas = await ethRpcMethods.estimateGas(
			web3RequestManager,
			_transaction as TransactionWithSenderAPI,
			BlockTags.LATEST,
		);
	}

	return ethRpcMethods.sendTransaction(
		web3RequestManager,
		_transaction as TransactionWithSenderAPI,
	);
};

const fundGethAccount = async (fundeeAddress: Address, fundAmount: bigint) => {
	const [mainAccount] = await ethRpcMethods.getAccounts(
		new Web3RequestManager(getTestProvider()),
	);
	await _sendTransaction({
		from: mainAccount,
		to: fundeeAddress,
		value: `0x${fundAmount.toString(16)}`,
	});
};

export const fundAccount = async (fundeeAddress: Address, fundAmount: bigint) => {
	switch (getTestClient()) {
		case 'geth':
			await fundGethAccount(fundeeAddress, fundAmount);
			break;
		case 'ganache':
			throw new Error('Not implemented');
		case 'infura':
			throw new Error('Not implemented');
		default:
			// TODO Replace errors
			throw new Error(`Test client: ${getTestClient()} not supported`);
	}
};

export const createAndFundNewAccount = async (
	web3AccountProvider: Web3AccountProvider<Web3BaseWalletAccount>,
	fundAmount: bigint,
) => {
	const newAccount = web3AccountProvider.create();
	await fundAccount(newAccount.address, fundAmount);
	return { address: newAccount.address, privateKey: newAccount.privateKey };
};

export const addFundedAccountToWallet = async (
	web3BaseWallet: Web3BaseWallet<Web3BaseWalletAccount>,
	fundAmount: bigint,
) => {
	web3BaseWallet.create(1);
	const newAccount = web3BaseWallet.get(0);
	// TODO replace error
	if (newAccount === undefined) throw new Error('Unable to get newly created account');
	await fundAccount(newAccount.address, fundAmount);
};
