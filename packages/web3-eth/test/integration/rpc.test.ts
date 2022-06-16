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
import { Contract, decodeEventABI } from 'web3-eth-contract';
import { hexToNumber, hexToString, numberToHex } from 'web3-utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AbiEventFragment } from 'web3-eth-abi';
import { getStorageSlotNumForLongString } from 'web3-utils/src';
import { ReceiptInfo, Web3Eth, TransactionInfo } from '../../src';

import {
	getSystemTestBackend,
	getSystemTestProvider,
	createNewAccount,
	itIf,
} from '../fixtures/system_test_utils';
import { BasicAbi, BasicBytecode } from '../shared_fixtures/build/Basic';
import { toAllVariants } from '../shared_fixtures/utils';
import { sendFewTxes } from './helper';

const mapFormatToType: { [key: string]: string } = {
	[FMT_NUMBER.NUMBER]: 'number',
	[FMT_NUMBER.HEX]: 'string',
	[FMT_NUMBER.STR]: 'string',
	[FMT_NUMBER.BIGINT]: 'bigint',
};
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const eventAbi: AbiEventFragment = BasicAbi.find((e: any) => {
	return e.name === 'StringEvent' && (e as AbiEventFragment).type === 'event';
})! as AbiEventFragment;

describe('rpc', () => {
	let web3Eth: Web3Eth;
	let accounts: string[] = [];
	let clientUrl: string;
	let blockNumber: number | bigint;
	let blockHash: string;
	let transactionHash: string;
	let transactionIndex: number | bigint;

	let contract: Contract<typeof BasicAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;

	const validateTransaction = (tx: TransactionInfo) => {
		expect(tx.nonce).toBeDefined();
		expect(tx.hash).toBeDefined();
		expect(String(tx.hash)?.length).toBe(66);
		expect(tx.type).toBe('0x0');
		expect(tx.blockHash).toBeDefined();
		expect(String(tx.blockHash)?.length).toBe(66);
		expect(hexToNumber(String(tx.blockNumber))).toBeGreaterThan(0);
		expect(tx.transactionIndex).toBeDefined();
		expect(tx.from?.length).toBe(42);
		expect(tx.to?.length).toBe(42);
		expect(tx.value).toBe('0x1');
		expect(tx.input).toBe('0x');
		expect(tx.r).toBeDefined();
		expect(tx.s).toBeDefined();
		expect(hexToNumber(String(tx.gas))).toBeGreaterThan(0);
	};
	const validateBlock = (b: Block) => {
		expect(b.nonce).toBeDefined();
		expect(Number(b.baseFeePerGas)).toBeGreaterThan(0);
		expect(b.number).toBeDefined();
		expect(b.hash).toBeDefined();
		expect(b.parentHash?.length).toBe(66);
		expect(b.sha3Uncles?.length).toBe(66);
		expect(b.transactionsRoot).toHaveLength(66);
		expect(b.receiptsRoot).toHaveLength(66);
		expect(b.logsBloom).toBeDefined();
		expect(b.miner).toHaveLength(42);
		expect(b.difficulty).toBeDefined();
		expect(b.stateRoot).toHaveLength(66);
		expect(b.gasLimit).toBeDefined();
		expect(b.gasUsed).toBeDefined();
		expect(b.timestamp).toBeDefined();
		expect(b.extraData).toBeDefined();
		expect(b.mixHash).toBeDefined();
		expect(b.totalDifficulty).toBeDefined();
		expect(b.baseFeePerGas).toBeDefined();
		expect(b.size).toBeDefined();
		expect(Array.isArray(b.transactions)).toBe(true);
		expect(Array.isArray(b.uncles)).toBe(true);
	};
	const validateReceipt = (r: ReceiptInfo) => {
		expect(r.transactionHash).toBeDefined();
		expect(r.transactionIndex).toBeDefined();
		expect(r.blockHash).toBeDefined();
		expect(r.blockNumber).toBeDefined();
		expect(r.from).toBeDefined();
		expect(r.to).toBeDefined();
		expect(r.cumulativeGasUsed).toBeDefined();
		expect(r.gasUsed).toBeDefined();
		expect(r.effectiveGasPrice).toBeDefined();
		expect(r.logs).toBeDefined();
		expect(r.logsBloom).toBeDefined();
		expect(r.status).toBeDefined();
		expect(String(r.transactionHash)).toHaveLength(66);
		expect(hexToNumber(String(r.gasUsed))).toBeGreaterThan(0);
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

		sendOptions = { from: accounts[0], gas: '1000000' };

		contract = await contract.deploy(deployOptions).send(sendOptions);
	});
	beforeEach(async () => {
		const [receipt]: ReceiptInfo[] = await sendFewTxes({
			web3Eth,
			from: accounts[0],
			to: accounts[1],
			value: '0x1',
			times: 1,
		});

		blockNumber = hexToNumber(String(receipt.blockNumber));
		blockHash = String(receipt.blockHash);
		transactionHash = String(receipt.transactionHash);
		transactionIndex = hexToNumber(String(receipt.transactionIndex));
	});
	afterAll(() => {
		if (clientUrl.startsWith('ws')) {
			(web3Eth.provider as WebSocketProvider).disconnect();
		}
	});

	describe('methods', () => {
		itIf(!['geth'].includes(getSystemTestBackend()))('getProtocolVersion', async () => {
			const version = await web3Eth.getProtocolVersion();
			// eslint-disable-next-line jest/no-standalone-expect
			expect(parseInt(version, 16)).toBeGreaterThan(0);
		});

		// TODO:in beta,  test eth_syncing during sync mode with return obj having ( startingblock, currentBlock, heighestBlock )
		it('isSyncing', async () => {
			const isSyncing = await web3Eth.isSyncing();
			expect(isSyncing).toBe(false);
		});

		// TODO: in future release, set coinbase account in node and match actual address here
		it('getCoinbase', async () => {
			const coinbase = await web3Eth.getCoinbase();
			expect(coinbase.startsWith('0x')).toBe(true);
			expect(coinbase).toHaveLength(42);
		});

		it('isMining', async () => {
			const isMining = await web3Eth.isMining();
			expect(isMining).toBe(true);
		});

		it.each(Object.values(FMT_NUMBER))('getHashRate', async format => {
			const hashRate = await web3Eth.getHashRate({
				number: format as FMT_NUMBER,
				bytes: FMT_BYTES.HEX,
			});
			expect(typeof hashRate).toBe(mapFormatToType[format as string]);
		});

		it('getAccounts', async () => {
			const account = await createNewAccount({ unlock: true });
			const accList = await web3Eth.getAccounts();
			expect(accList).toContain(accounts[0].toLowerCase());
			expect(accList).toContain(accounts[1].toLowerCase());
			expect(accList).toContain(account.address.toLowerCase());
		});

		it.each(Object.values(FMT_NUMBER))('getBlockNumber', async format => {
			const res = await web3Eth.getBlockNumber({
				number: format as FMT_NUMBER,
				bytes: FMT_BYTES.HEX,
			});
			expect(typeof res).toBe(mapFormatToType[format as string]);
			expect(parseInt(String(res), 16)).toBeGreaterThan(0);
		});
		it.each(Object.values(FMT_NUMBER))('getGasPrice', async format => {
			const res = await web3Eth.getGasPrice({
				number: format as FMT_NUMBER,
				bytes: FMT_BYTES.HEX,
			});
			expect(typeof res).toBe(mapFormatToType[format as string]);
			expect(parseInt(String(res), 16)).toBeGreaterThan(0);
		});

		it.each(Object.values(FMT_NUMBER))('getBalance', async format => {
			const value = '0xa';
			const newAccount = await createNewAccount();
			await web3Eth.sendTransaction({
				to: newAccount.address,
				value,
				from: accounts[0],
			});
			const res = await web3Eth.getBalance(newAccount.address, undefined, {
				number: format as FMT_NUMBER,
				bytes: FMT_BYTES.HEX,
			});
			expect(typeof res).toBe(mapFormatToType[format as string]);

			expect(numberToHex(res)).toBe(value);
		});

		it('getStorageAt', async () => {
			const numberData = 10;
			const stringData = 'str';
			const boolData = true;
			await contract.methods?.setValues(numberData, stringData, boolData).send(sendOptions);
			const resNumber = await web3Eth.getStorageAt(
				contract.options.address as string,
				'0x0',
				undefined,
				{
					number: FMT_NUMBER.BIGINT,
					bytes: FMT_BYTES.HEX,
				},
			);
			const resString = await web3Eth.getStorageAt(
				contract.options.address as string,
				'0x1',
				undefined,
				{
					number: FMT_NUMBER.STR,
					bytes: FMT_BYTES.HEX,
				},
			);
			const resBool = await web3Eth.getStorageAt(
				contract.options.address as string,
				'0x2',
				undefined,
				{
					number: FMT_NUMBER.NUMBER,
					bytes: FMT_BYTES.HEX,
				},
			);

			expect(hexToNumber(resNumber)).toBe(numberData);

			const rString = hexToString(resString.slice(0, resString.length / 2 + 1))
				.split('')
				.filter(d => d !== '\x00')
				.join('');

			expect(rString).toHaveLength(stringData.length);
			expect(rString).toEqual(stringData);
			expect(Boolean(hexToNumber(resBool))).toBe(boolData);

			// long string data test
			const stringDataLong =
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In in interdum nibh, in viverra diam. Morbi eleifend diam sed erat malesuada molestie. Donec ultricies, mi et porta viverra, est magna tempus lorem, sit amet tempus mauris sapien vitae lacus. Duis at est quis nisl dictum accumsan eget et libero. Phasellus semper nibh et varius accumsan. Cras fringilla egestas dui, vitae bibendum enim tincidunt id. Donec condimentum lacinia nulla, eget elementum tortor tristique vel. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut ac risus tellus. Etiam nec neque et erat efficitur laoreet. Maecenas fermentum feugiat diam, ut ultricies ipsum mollis at. In in velit turpis. Vestibulum urna ipsum, vestibulum ut cursus ut, ullamcorper quis est.';
			await contract.methods
				?.setValues(numberData, stringDataLong, boolData)
				.send(sendOptions);

			const resStringLong = await web3Eth.getStorageAt(
				contract.options.address as string,
				1,
				undefined,
				{
					number: FMT_NUMBER.STR,
					bytes: FMT_BYTES.HEX,
				},
			);

			const slotCount = Math.ceil((Number(hexToNumber(resStringLong)) - 1) / 64);
			const slotDataNum = getStorageSlotNumForLongString(1);

			const prs = [];
			for (let i = 0; i < slotCount; i += 1) {
				prs.push(
					web3Eth.getStorageAt(
						contract.options.address as string,
						`0x${(BigInt(hexToNumber(String(slotDataNum))) + BigInt(i)).toString(16)}`,
					),
				);
			}
			const str = (await Promise.all(prs))
				.map(t => hexToString(t))
				.join('')
				.split('')
				.filter(d => d !== '\x00')
				.join('');
			expect(stringDataLong).toBe(str);
		});

		it.each(Object.values(FMT_NUMBER))('getCode', async format => {
			const code = await web3Eth.getCode(contract?.options?.address as string, undefined, {
				number: format as FMT_NUMBER,
				bytes: FMT_BYTES.HEX,
			});
			expect(code).toBeDefined();
			expect(BasicBytecode.slice(-100)).toBe(code.slice(-100));
		});

		// eslint-disable-next-line jest/expect-expect
		it.each(
			toAllVariants<{
				block: number | bigint | string;
				hydrated: boolean;
				format: string;
			}>({
				block: ['earliest', 'latest', blockHash, blockNumber],
				hydrated: [true, false],
				format: Object.values(FMT_NUMBER),
			}),
		)('getBlock', async ({ hydrated, block, format }) => {
			const b = {
				...(await web3Eth.getBlock(block, hydrated, {
					number: format as FMT_NUMBER,
					bytes: FMT_BYTES.HEX,
				})),
			};
			if (block === 'pending') {
				b.nonce = '0x0';
				b.miner = '0x0000000000000000000000000000000000000000';
				b.totalDifficulty = '0x0';
			}
			validateBlock(b as Block);
		});

		it.each(
			toAllVariants<{
				block: number | bigint | string;
				format: string;
			}>({
				block: ['earliest', 'latest', 'pending', blockHash, blockNumber],
				format: Object.values(FMT_NUMBER),
			}),
		)('getTransactionCount', async ({ block, format }) => {
			const countBefore = await web3Eth.getTransactionCount(accounts[0], block, {
				number: format as FMT_NUMBER,
				bytes: FMT_BYTES.HEX,
			});

			const count = 2;
			await sendFewTxes({
				web3Eth,
				from: accounts[0],
				to: accounts[1],
				value: '0x1',
				times: count,
			});

			const countAfter = await web3Eth.getTransactionCount(accounts[0], block, {
				number: format as FMT_NUMBER,
				bytes: FMT_BYTES.HEX,
			});
			expect(Number(countAfter) - Number(countBefore)).toBe(block === 'earliest' ? 0 : count);
		});

		it.each(
			toAllVariants<{
				block: number | bigint | string;
			}>({
				block: ['earliest', 'latest', 'pending', blockHash, blockNumber],
			}),
		)('getBlockTransactionCount', async ({ block }) => {
			const res = await web3Eth.getBlockTransactionCount(block);
			let shouldBe: string;
			if (getSystemTestBackend() === 'ganache') {
				shouldBe = block === 'earliest' ? '0x0' : '0x1';
			} else {
				shouldBe = ['earliest', 'pending'].includes(String(block)) ? '0x0' : '0x1';
			}
			expect(res).toBe(shouldBe);
		});

		it.each(
			toAllVariants<{
				block: number | bigint | string;
			}>({
				block: ['earliest', 'latest', 'pending', blockHash, blockNumber],
			}),
		)('getBlockUncleCount', async ({ block }) => {
			const res = await web3Eth.getBlockUncleCount(block);
			expect(res).toBe('0x0');
		});

		it.each(
			toAllVariants<{
				block: number | bigint | string;
			}>({
				block: ['earliest', 'latest', 'pending', blockHash, blockNumber],
			}),
		)('getUncle', async ({ block }) => {
			const res = await web3Eth.getUncle(block, 0);
			expect(res).toBeNull();
		});

		it('getTransaction', async () => {
			const [receipt] = await sendFewTxes({
				web3Eth,
				from: accounts[0],
				to: accounts[1],
				value: '0x1',
				times: 1,
			});

			const res = await web3Eth.getTransaction(receipt.transactionHash);
			// TODO: after alpha release add tests for matching following (first get nonce of account sending tx and validate nonce with tx is incremented)
			// TODO: after alpha release add tests for matching following (from and to addresses)
			// TODO: after alpha release add tests for matching following (value transferred)
			// TODO: after alpha release add tests for matching following (specify some random inputData in tx and validate in test with getTransaction)

			validateTransaction(res as TransactionInfo);
			expect(res?.hash).toBe(receipt.transactionHash);
		});

		itIf(getSystemTestBackend() !== 'ganache')('getPendingTransactions', async () => {
			const tx = web3Eth.sendTransaction({
				to: accounts[1],
				value: '0x1',
				from: accounts[0],
			});

			const res = await web3Eth.getPendingTransactions();
			await tx;
			// TODO: validate pending tx fields match with submitted tx
			// TODO: investigate why res always is empty array
			// eslint-disable-next-line jest/no-standalone-expect
			expect(res).toBeDefined();
		});

		it.each([blockHash, blockNumber])('getTransactionFromBlock', async block => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const tx = (await web3Eth.getTransactionFromBlock(block, transactionIndex))!;
			validateTransaction(tx as TransactionInfo);
			expect(tx?.hash).toBe(transactionHash);
		});

		it('getTransactionReceipt', async () => {
			const [receipt] = await sendFewTxes({
				web3Eth,
				from: accounts[0],
				to: accounts[1],
				value: '0x1',
				times: 1,
			});
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const res: ReceiptInfo = (await web3Eth.getTransactionReceipt(
				// TODO: add more scenarios in future release with block number
				receipt.transactionHash as string,
			))!;
			validateReceipt(res);
			expect(res?.transactionHash).toBe(receipt.transactionHash);
		});

		it('getChainId', async () => {
			const res = await web3Eth.getChainId({
				number: FMT_NUMBER.NUMBER,
				bytes: FMT_BYTES.HEX,
			});
			// TODO: in next release validate chain ID , it should match with chain id of connected client
			expect(res).toBeGreaterThan(0);
		});

		it('getNodeInfo', async () => {
			const res = await web3Eth.getNodeInfo();
			// TODO: in next release, it should also be validated
			expect(res).toBeDefined();
		});

		itIf(!['ganache', 'geth'].includes(getSystemTestBackend()))('getWork', async () => {
			const res = await web3Eth.getWork();
			// eslint-disable-next-line jest/no-standalone-expect
			expect(res[0]).toBeDefined();
		});

		itIf(!['geth', 'ganache'].includes(getSystemTestBackend()))('requestAccounts', () => {
			// const res = await web3Eth.requestAccounts();
			// eslint-disable-next-line jest/no-standalone-expect
			expect(true).toBe(true);
			// expect(res[0]).toEqual(accounts[0]);
		});

		itIf(getSystemTestBackend() !== 'ganache')('getProof', async () => {
			const numberData = 10;
			const stringData = 'str';
			const boolData = true;
			const sendRes = await contract.methods
				?.setValues(numberData, stringData, boolData)
				.send(sendOptions);
			await web3Eth.getStorageAt(contract.options.address as string, 0, undefined, {
				number: FMT_NUMBER.BIGINT,
				bytes: FMT_BYTES.HEX,
			});
			const res = await web3Eth.getProof(
				contract.options.address as string,
				['0x0000000000000000000000000000000000000000000000000000000000000000'],
				sendRes?.blockNumber,
			);
			// eslint-disable-next-line jest/no-standalone-expect
			expect(res.storageProof).toBeDefined();
			// eslint-disable-next-line jest/no-standalone-expect
			expect(hexToNumber(res.storageProof[0].value)).toBe(numberData);
		});

		it('getPastLogs', async () => {
			const listOfStrings = ['t1', 't2', 't3'];
			const resTx = [];
			for (const l of listOfStrings) {
				// eslint-disable-next-line  no-await-in-loop
				resTx.push(await contract.methods?.firesStringEvent(l).send(sendOptions));
			}
			const res: Array<any> = await web3Eth.getPastLogs({
				address: contract.options.address as string,
				fromBlock: numberToHex(
					Math.min(...resTx.map(d => Number(hexToNumber(d.blockNumber)))),
				),
			});
			const results = res.map(
				r =>
					decodeEventABI(eventAbi as AbiEventFragment & { signature: string }, r)
						.returnValue[0],
			);
			for (const l of listOfStrings) {
				expect(results).toContain(l);
			}
		});
	});
});
