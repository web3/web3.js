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
import { privateKeyToAccount, signTransaction, Web3Account } from 'web3-eth-accounts';
import { Web3PromiEvent } from 'web3-core';
import Web3Eth, { prepareTransactionForSigning, SendSignedTransactionEvents } from 'web3-eth';
import { Receipt } from 'web3-types';
import { DataFormat } from 'web3-utils';

export default class Wallet {
	private readonly web3: Web3Eth;

	private readonly account: Web3Account;
	public constructor(privateKey: string) {
		this.account = privateKeyToAccount(privateKey);
		this.web3 = new Web3Eth('http://127.0.0.1:8545');
	}
	public async sendEther(
		address: string,
		value: string,
	): Promise<Web3PromiEvent<Receipt, SendSignedTransactionEvents<DataFormat>>> {
		const preparedTx = await prepareTransactionForSigning(
			{
				from: this.account.address,
				to: address,
				value,
				gas: '21000',
				gasPrice: await this.web3.getGasPrice(),
			},
			this.web3,
			this.account.privateKey,
		);
		const signedTx = await signTransaction(preparedTx, this.account.privateKey);

		return this.web3.sendSignedTransaction<DataFormat>(signedTx.rawTransaction);
	}

	public async getBalance(address?: string) {
		return this.web3.getBalance(address ?? this.account.address);
	}
}
