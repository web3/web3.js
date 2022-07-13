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
import WebSocketProvider from 'web3-providers-ws';
import { Block, FMT_BYTES, FMT_NUMBER } from 'web3-common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Contract } from 'web3-eth-contract';
// eslint-disable-next-line import/no-extraneous-dependencies
import IpcProvider from 'web3-providers-ipc';
import { TransactionReceipt, Web3Eth, TransactionInfo } from '../../src';

import {
	getSystemTestBackend,
	getSystemTestProvider,
	createNewAccount,
	isIpc,
	isWs,
} from '../fixtures/system_test_utils';
import { BasicAbi, BasicBytecode } from '../shared_fixtures/build/Basic';
import { toAllVariants } from '../shared_fixtures/utils';
import { sendFewTxes, validateBlock, validateTransaction } from './helper';

describe('rpc with block', () => {
	let web3Eth: Web3Eth;
	let accounts: string[] = [];
	let clientUrl: string;

	let contract: Contract<typeof BasicAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;

	let blockData: {
		earliest: 'earliest';
		latest: 'latest';
		pending: 'pending';
		blockNumber: number | bigint;
		blockHash: string;
		transactionHash: string;
		transactionIndex: number | bigint;
	};

	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
		const acc1 = await createNewAccount({ unlock: true, refill: true });
		const acc2 = await createNewAccount({ unlock: true, refill: true });
		accounts = [acc1.address, acc2.address];
		web3Eth = new Web3Eth({
			provider: clientUrl,
			config: {
				transactionPollingTimeout: 2000,
			},
		});

		contract = new Contract(BasicAbi, undefined, {
			provider: clientUrl,
		});

		deployOptions = {
			data: BasicBytecode,
			arguments: [10, 'string init value'],
		};
		if (isIpc) {
			await (contract.provider as IpcProvider).waitForConnection();
			await (web3Eth.provider as IpcProvider).waitForConnection();
		}
		sendOptions = { from: accounts[0], gas: '1000000' };

		contract = await contract.deploy(deployOptions).send(sendOptions);
		const [receipt]: TransactionReceipt[] = await sendFewTxes({
			web3Eth,
			from: accounts[0],
			to: accounts[1],
			value: '0x1',
			times: 1,
		});

		blockData = {
			pending: 'pending',
			latest: 'latest',
			earliest: 'earliest',
			blockNumber: Number(receipt.blockNumber),
			blockHash: String(receipt.blockHash),
			transactionHash: String(receipt.transactionHash),
			transactionIndex: Number(receipt.transactionIndex),
		};
	});

	afterAll(() => {
		if (isWs) {
			(web3Eth.provider as WebSocketProvider).disconnect();
		}
	});

	describe('methods', () => {
		it.each(
			toAllVariants<{
				block: 'earliest' | 'latest' | 'pending' | 'blockHash' | 'blockNumber';
				hydrated: boolean;
				format: string;
			}>({
				block: ['earliest', 'latest', 'blockHash', 'blockNumber'],
				hydrated: [true, false],
				format: Object.values(FMT_NUMBER),
			}),
		)('getBlock', async ({ hydrated, block, format }) => {
			const b = {
				...(await web3Eth.getBlock(blockData[block], hydrated, {
					number: format as FMT_NUMBER,
					bytes: FMT_BYTES.HEX,
				})),
			};
			if (blockData[block] === 'pending') {
				b.nonce = '0x0';
				b.miner = '0x0000000000000000000000000000000000000000';
				b.totalDifficulty = '0x0';
			}
			validateBlock(b as Block);
		});

		it.each(
			toAllVariants<{
				block: 'earliest' | 'latest' | 'pending' | 'blockHash' | 'blockNumber';
				format: string;
			}>({
				block: ['earliest', 'latest', 'pending', 'blockNumber'],
				format: Object.values(FMT_NUMBER),
			}),
		)('getTransactionCount', async ({ block, format }) => {
			const acc = await createNewAccount({ unlock: true, refill: true });
			const [receipt] = await sendFewTxes({
				web3Eth,
				from: acc.address,
				to: accounts[1],
				value: '0x1',
				times: 1,
			});
			const data = {
				pending: 'pending',
				latest: 'latest',
				earliest: 'earliest',
				blockNumber: Number(receipt.blockNumber),
				blockHash: String(receipt.blockHash),
				transactionHash: String(receipt.transactionHash),
				transactionIndex: Number(receipt.transactionIndex),
			};
			const countBefore = await web3Eth.getTransactionCount(acc.address, data[block], {
				number: format as FMT_NUMBER,
				bytes: FMT_BYTES.HEX,
			});
			const count = 2;
			const res = await sendFewTxes({
				web3Eth,
				from: acc.address,
				to: accounts[1],
				value: '0x1',
				times: count,
			});
			const receiptAfter = res[res.length - 1];
			const dataAfter = {
				pending: 'pending',
				latest: 'latest',
				earliest: 'earliest',
				blockNumber: Number(receiptAfter.blockNumber),
				blockHash: String(receiptAfter.blockHash),
				transactionHash: String(receiptAfter.transactionHash),
				transactionIndex: Number(receiptAfter.transactionIndex),
			};
			const countAfter = await web3Eth.getTransactionCount(acc.address, dataAfter[block], {
				number: format as FMT_NUMBER,
				bytes: FMT_BYTES.HEX,
			});
			// eslint-disable-next-line jest/no-standalone-expect
			expect(Number(countAfter) - Number(countBefore)).toBe(
				blockData[block] === 'earliest' ? 0 : count,
			);
		});

		it.each(
			toAllVariants<{
				block: 'earliest' | 'latest' | 'pending' | 'blockHash' | 'blockNumber';
			}>({
				block: ['earliest', 'latest', 'pending', 'blockHash', 'blockNumber'],
			}),
		)('getBlockTransactionCount', async ({ block }) => {
			const res = await web3Eth.getBlockTransactionCount(blockData[block]);
			let shouldBe: number;
			if (getSystemTestBackend() === 'ganache') {
				shouldBe = blockData[block] === 'earliest' ? 0 : 1;
			} else {
				shouldBe = ['earliest', 'pending'].includes(String(blockData[block])) ? 0 : 1;
			}
			expect(Number(res)).toBe(shouldBe);
		});

		it.each(
			toAllVariants<{
				block: 'earliest' | 'latest' | 'pending' | 'blockHash' | 'blockNumber';
			}>({
				block: ['earliest', 'latest', 'pending', 'blockHash', 'blockNumber'],
			}),
		)('getBlockUncleCount', async ({ block }) => {
			const res = await web3Eth.getBlockUncleCount(blockData[block]);
			expect(Number(res)).toBe(0);
		});

		it.each(
			toAllVariants<{
				block: 'earliest' | 'latest' | 'pending' | 'blockNumber';
			}>({
				block: ['earliest', 'latest', 'pending', 'blockNumber'],
			}),
		)('getUncle', async ({ block }) => {
			const res = await web3Eth.getUncle(blockData[block], 0);
			// eslint-disable-next-line jest/no-standalone-expect
			expect(res).toBeNull();
		});
		it('getTransactionFromBlock', async () => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const tx = (await web3Eth.getTransactionFromBlock(
				blockData.blockNumber,
				blockData.transactionIndex,
			))!;
			validateTransaction(tx as TransactionInfo);
			expect(tx?.hash).toBe(blockData.transactionHash);
		});
	});
});
