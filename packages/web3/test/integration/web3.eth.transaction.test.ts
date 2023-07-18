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

import * as httpProvider from 'web3-providers-http';
import { Web3Account } from 'web3-eth-accounts';
import Web3, { DEFAULT_RETURN_FORMAT, Transaction } from '../../src';
import testsData from '../fixtures/transactions.json';

jest.mock('web3-providers-http');

describe('signTransaction', () => {
	let blockNum = 1;

	it.each(testsData)(
		'Integration test of transaction %s with Web3, Web3.Eth, Web3.Accounts and Provider should pass',
		async txObj => {
			const web3: Web3 = new Web3('http://127.0.0.1:8080');

			const account: Web3Account = web3.eth.accounts.privateKeyToAccount(txObj.privateKey);

			web3.eth.wallet?.add(txObj.privateKey);

			const normalTx: Transaction = {
				...txObj.transaction,
				from: account.address,
			};

			// either make it legacy or type 0x2 tx, instead of keeping both gasPrice and (maxPriorityFeePerGas maxFeePerGas)
			if (txObj.transaction?.maxPriorityFeePerGas) {
				delete normalTx['gasPrice'];
			} else {
				delete normalTx['maxPriorityFeePerGas'];
				delete normalTx['maxFeePerGas'];
			}

			jest.spyOn(httpProvider.HttpProvider.prototype, 'request').mockImplementation(
				async (payload: any) => {
					const response = {
						jsonrpc: '2.0',
						id: payload.id,
						result: {},
					};

					switch (payload.method) {
						case 'net_version':
							response.result = '1';
							break;

						case 'eth_chainId':
							response.result = '0x1';
							break;

						case 'eth_blockNumber':
							blockNum += 10;
							response.result = `0x${blockNum.toString(16)}`;
							break;

						case 'eth_getTransactionReceipt':
							response.result = {
								blockHash:
									'0xa957d47df264a31badc3ae823e10ac1d444b098d9b73d204c40426e57f47e8c3',
								blockNumber: `0x${blockNum.toString(16)}`,
								cumulativeGasUsed: '0xa12515',
								// "effectiveGasPrice": payload.effectiveGasPrice,
								from: payload.from,
								gasUsed: payload.gasLimit,
								// "logs": [{}],
								// "logsBloom": "0xa957d47df264a31badc3ae823e10ac1d444b098d9b73d204c40426e57f47e8c3", // 256 byte bloom filter
								status: '0x1',
								to: payload.to,
								transactionHash:
									'0x85d995eba9763907fdf35cd2034144dd9d53ce32cbec21349d4b12823c6860c5',
								transactionIndex: '0x66',
								// "type": payload.type
							};
							break;

						case 'eth_sendRawTransaction':
							if (txObj.transaction.maxPriorityFeePerGas !== undefined) {
								// eslint-disable-next-line jest/no-conditional-expect
								expect(payload.params[0]).toBe(txObj.signedLondon); // validate transaction for London HF
							} else {
								// eslint-disable-next-line jest/no-conditional-expect
								expect(payload.params[0]).toBe(txObj.signedBerlin); // validate transaction for Berlin HF
							}
							response.result =
								'0x895ebb29d30e0afa891a5ca3a2687e073bd2c7ab544117ac386c8d8ff3ad583b';
							break;

						default:
							throw new Error(`Unknown payload ${payload}`);
					}

					return new Promise(resolve => {
						resolve(response as any);
					});
				},
			);

			const res = await web3.eth.sendTransaction(normalTx, DEFAULT_RETURN_FORMAT, {
				ignoreGasPricing: true,
				checkRevertBeforeSending: false,
			});
			expect(res).toBeDefined();
		},
	);
});
