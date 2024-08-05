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
import { Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, Web3EthExecutionAPI } from 'web3-types';
import { TransactionBlockTimeoutError } from 'web3-errors';
import { waitForTransactionReceipt } from '../../../src/utils/wait_for_transaction_receipt';

describe('waitForTransactionReceipt unit test', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	it(`waitForTransactionReceipt should throw error after block timeout`, async () => {
		let blockNum = 1;

		web3Context = new Web3Context({
			request: async (payload: any) => {
				let response: { jsonrpc: string; id: any; result: string } | undefined;

				switch (payload.method) {
					case 'eth_blockNumber':
						blockNum += 50;
						response = {
							jsonrpc: '2.0',
							id: payload.id,
							result: `0x${blockNum.toString(16)}`,
						};
						break;

					case 'eth_getTransactionReceipt':
						response = undefined;
						break;

					default:
						throw new Error(`Unknown payload ${payload}`);
				}

				return new Promise(resolve => {
					resolve(response as any);
				});
			},
			supportsSubscriptions: () => false,
		});

		await expect(async () =>
			waitForTransactionReceipt(
				web3Context,
				'0x0430b701e657e634a9d5480eae0387a473913ef29af8e60c38a3cee24494ed54',
				DEFAULT_RETURN_FORMAT,
			),
		).rejects.toThrow(TransactionBlockTimeoutError);
	});

	it(`waitForTransactionReceipt should resolve immediately if receipt is available`, async () => {
		let blockNum = 1;
		const txHash = '0x85d995eba9763907fdf35cd2034144dd9d53ce32cbec21349d4b12823c6860c5';
		const blockHash = '0xa957d47df264a31badc3ae823e10ac1d444b098d9b73d204c40426e57f47e8c3';

		web3Context = new Web3Context({
			request: async (payload: any) => {
				const response = {
					jsonrpc: '2.0',
					id: payload.id,
					result: {},
				};

				switch (payload.method) {
					case 'eth_blockNumber':
						blockNum += 10;
						response.result = `0x${blockNum.toString(16)}`;
						break;

					case 'eth_getTransactionReceipt':
						response.result = {
							blockHash,
							blockNumber: `0x1`,
							cumulativeGasUsed: '0xa12515',
							from: payload.from,
							gasUsed: payload.gasLimit,
							status: '0x1',
							to: payload.to,
							transactionHash: txHash,
							transactionIndex: '0x66',
						};
						break;

					default:
						throw new Error(`Unknown payload ${payload}`);
				}

				return new Promise(resolve => {
					resolve(response as any);
				});
			},
			supportsSubscriptions: () => false,
		});

		const res = await waitForTransactionReceipt(
			web3Context,
			'0x0430b701e657e634a9d5480eae0387a473913ef29af8e60c38a3cee24494ed54',
			DEFAULT_RETURN_FORMAT,
		);

		expect(res).toBeDefined();
		expect(res.transactionHash).toStrictEqual(txHash);
		expect(res.blockHash).toStrictEqual(blockHash);
	});

	it(`waitForTransactionReceipt should resolve immediately if receipt is available - when subscription is enabled`, async () => {
		let blockNum = 1;
		const txHash = '0x85d995eba9763907fdf35cd2034144dd9d53ce32cbec21349d4b12823c6860c5';
		const blockHash = '0xa957d47df264a31badc3ae823e10ac1d444b098d9b73d204c40426e57f47e8c3';

		web3Context = new Web3Context({
			request: async (payload: any) => {
				const response = {
					jsonrpc: '2.0',
					id: payload.id,
					result: {},
				};

				switch (payload.method) {
					case 'eth_blockNumber':
						blockNum += 10;
						response.result = `0x${blockNum.toString(16)}`;
						break;

					case 'eth_getTransactionReceipt':
						response.result = {
							blockHash,
							blockNumber: `0x1`,
							cumulativeGasUsed: '0xa12515',
							from: payload.from,
							gasUsed: payload.gasLimit,
							status: '0x1',
							to: payload.to,
							transactionHash: txHash,
							transactionIndex: '0x66',
						};
						break;

					default:
						throw new Error(`Unknown payload ${payload}`);
				}

				return new Promise(resolve => {
					resolve(response as any);
				});
			},
			supportsSubscriptions: () => true,
		});
		web3Context.enableExperimentalFeatures.useSubscriptionWhenCheckingBlockTimeout = true;

		const res = await waitForTransactionReceipt(
			web3Context,
			'0x0430b701e657e634a9d5480eae0387a473913ef29af8e60c38a3cee24494ed54',
			DEFAULT_RETURN_FORMAT,
		);

		expect(res).toBeDefined();
		expect(res.transactionHash).toStrictEqual(txHash);
		expect(res.blockHash).toStrictEqual(blockHash);
	});
});
