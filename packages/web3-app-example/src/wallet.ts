// /*
// This file is part of web3.js.
//
// web3.js is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// web3.js is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
// */
// import Web3 from '../../web3';
// import { privateKeyToAccount, Web3Account } from '../../web3-eth-accounts';
// // import { Web3PromiEvent } from '../../web3-core';
// // import { prepareTransactionForSigning, SendSignedTransactionEvents } from '../../web3-eth';
//
// export default class Wallet {
// 	private readonly web3: Web3;
// 	private readonly account: Web3Account;
// 	constructor(privateKey: string) {
// 		this.account = privateKeyToAccount(privateKey);
// 		this.web3 = new Web3('http://127.0.0.1:8545');
// 	}
// 	// async sendEther(
// 	// 	address: string,
// 	// 	value: string,
// 	// ): Promise<Web3PromiEvent<any, SendSignedTransactionEvents<any>>> {
// 	// 	const preparedTx = await prepareTransactionForSigning(
// 	// 		{
// 	// 			from: this.account.address,
// 	// 			to: address,
// 	// 			value,
// 	// 			gas: '21000',
// 	// 			gasPrice: await this.web3.eth.getGasPrice(),
// 	// 		},
// 	// 		this.web3,
// 	// 		this.account.privateKey,
// 	// 	);
// 	// 	console.log('preparedTx', preparedTx);
// 	// 	const signedTx = await signTransaction(preparedTx, this.account.privateKey);
// 	// 	console.log('signedTx', signedTx);
// 	// 	return this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
// 	// }
// 	getBalance(address?: string) {
// 		return this.web3.eth.getBalance(address ?? this.account.address);
// 	}
// }
