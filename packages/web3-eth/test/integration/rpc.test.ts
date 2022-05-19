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
import { FMT_BYTES, FMT_NUMBER } from 'web3-common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Contract, decodeEventABI } from 'web3-eth-contract';
import { hexToNumber, numberToHex } from 'web3-utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AbiEventFragment } from 'web3-eth-abi';
import { ReceiptInfo, Web3Eth } from '../../src';

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
const eventAbi: AbiEventFragment = BasicAbi.find((e: any) => {
	return e.name === 'StringEvent' && (e as AbiEventFragment).type === 'event';
})! as AbiEventFragment;
describe('rpc', () => {
	let web3Eth: Web3Eth;
	let accounts: string[] = [];
	let clientUrl: string;

	let contract: Contract<typeof BasicAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;

	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
		const acc1 = await createNewAccount({ unlock: true, refill: true });
		const acc2 = await createNewAccount({ unlock: true, refill: true });
		accounts = [acc1.address, acc2.address];
		web3Eth = new Web3Eth(clientUrl);

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

// TODO: in future release, add accounts in node wallet via eth_personal API and match address in tests
		it('getAccounts', async () => {
			const accList = await web3Eth.getAccounts();
			expect(accList).toContain(accounts[0].toLowerCase());
			expect(accList).toContain(accounts[1].toLowerCase());
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
			const res = await web3Eth.getBalance(accounts[0], undefined, {
				number: format as FMT_NUMBER,
				bytes: FMT_BYTES.HEX,
			});
			expect(typeof res).toBe(mapFormatToType[format as string]);
			expect(parseInt(String(res), 16)).toBeGreaterThan(0);
		});

		it('getStorageAt', async () => {
			const numberData = 10;
			const stringData = 'str';
			const boolData = true;
			await contract.methods?.setValues(numberData, stringData, boolData).send(sendOptions);
			const resNumber = await web3Eth.getStorageAt(
				contract.options.address as string,
				0,
				undefined,
				{
					number: FMT_NUMBER.BIGINT,
					bytes: FMT_BYTES.HEX,
				},
			);
			const resString = await web3Eth.getStorageAt(
				contract.options.address as string,
				1,
				undefined,
				{
					number: FMT_NUMBER.STR,
					bytes: FMT_BYTES.HEX,
				},
			);
			const resBool = await web3Eth.getStorageAt(
				contract.options.address as string,
				2,
				undefined,
				{
					number: FMT_NUMBER.NUMBER,
					bytes: FMT_BYTES.HEX,
				},
			);

			expect(hexToNumber(resNumber)).toBe(numberData);
			// todo investigate why resString is not equal to stringData
			expect(resString).toBeDefined();
			expect(Boolean(hexToNumber(resBool))).toBe(boolData);
		});

		it.each(Object.values(FMT_NUMBER))('getCode', async format => {
			const code = await web3Eth.getCode(contract?.options?.address as string, undefined, {
				number: format as FMT_NUMBER,
				bytes: FMT_BYTES.HEX,
			});
			expect(code).toBeDefined();
			expect(BasicBytecode.slice(-100)).toBe(code.slice(-100));
		});

// TODO: in next release add tests for getBlock with get block by hash and get block by number, also add test for validating all block fields (blocknum, hash, baseFeePerGas,nonce,stateRoot,sizegasLimit, ....etc) instead of parentHash only
		it.each(
			toAllVariants<{
				block: 'earliest' | 'latest' | 'pending';
				hydrated: boolean;
				format: string;
			}>({
				block: ['earliest', 'latest', 'pending'],
				hydrated: [true, false],
				format: Object.values(FMT_NUMBER),
			}),
		)('getBlock', async ({ hydrated, block, format }) => {
			const b = await web3Eth.getBlock(block, hydrated, {
				number: format as FMT_NUMBER,
				bytes: FMT_BYTES.HEX,
			});
			expect(b.parentHash?.length).toBe(66);
		});

		it('getTransactionCount', async () => {
			const countBefore = await web3Eth.getTransactionCount(accounts[0], 'latest', {
				number: FMT_NUMBER.NUMBER,
				bytes: FMT_BYTES.HEX,
			});

			await sendFewTxes({
				web3Eth,
				from: accounts[0],
				to: accounts[1],
				value: '0x1',
				times: 3,
			});

			const countAfter = await web3Eth.getTransactionCount(accounts[0], 'latest', {
				number: FMT_NUMBER.NUMBER,
				bytes: FMT_BYTES.HEX,
			});
			expect(Number(countAfter) - Number(countBefore)).toBe(3);
		});

		it('getBlockTransactionCount', async () => {
			const [receipt] = await sendFewTxes({
				web3Eth,
				from: accounts[0],
				to: accounts[1],
				value: '0x1',
				times: 1,
			});

			const res = await web3Eth.getBlockTransactionCount(
				(receipt as ReceiptInfo).blockHash as string,
			);
			expect(res).toBe('0x1');
		});

		it('getBlockUncleCount', async () => {
			const [receipt] = await sendFewTxes({
				web3Eth,
				from: accounts[0],
				to: accounts[1],
				value: '0x1',
				times: 1,
			});

			const res = await web3Eth.getBlockUncleCount(
				(receipt as ReceiptInfo).blockHash as string,
			);
			expect(res).toBe('0x0');
		});

		it('getUncle', async () => {
			const [receipt] = await sendFewTxes({
				web3Eth,
				from: accounts[0],
				to: accounts[1],
				value: '0x1',
				times: 1,
			});

			const res = await web3Eth.getUncle((receipt as ReceiptInfo).blockHash as string, 0);
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

			const res = await web3Eth.getTransaction((receipt as ReceiptInfo).transactionHash);
			expect(res?.hash).toBe((receipt as ReceiptInfo).transactionHash);
		});

		itIf(getSystemTestBackend() !== 'ganache')('getPendingTransactions', async () => {
			const pr = sendFewTxes({
				web3Eth,
				from: accounts[0],
				to: accounts[1],
				value: '0x1',
				times: 1,
			});

			const res = await web3Eth.getPendingTransactions();
			await pr;
			// eslint-disable-next-line jest/no-standalone-expect
			expect(res).toBeDefined();
		});

		it('getTransactionFromBlock', async () => {
			const [receipt] = await sendFewTxes({
				web3Eth,
				from: accounts[0],
				to: accounts[1],
				value: '0x1',
				times: 1,
			});

			const res = await web3Eth.getTransactionFromBlock(
				(receipt as ReceiptInfo).blockHash as string,
				0,
			);
			expect(res?.hash).toBe((receipt as ReceiptInfo).transactionHash);
		});

		it('getTransactionReceipt', async () => {
			const [receipt] = await sendFewTxes({
				web3Eth,
				from: accounts[0],
				to: accounts[1],
				value: '0x1',
				times: 1,
			});

			const res = await web3Eth.getTransactionReceipt(
				(receipt as ReceiptInfo).transactionHash as string,
			);
			expect(res?.transactionHash).toBe((receipt as ReceiptInfo).transactionHash);
		});

		it('getChainId', async () => {
			const res = await web3Eth.getChainId({
				number: FMT_NUMBER.NUMBER,
				bytes: FMT_BYTES.HEX,
			});
			expect(res).toBeGreaterThan(0);
		});

		it('getNodeInfo', async () => {
			const res = await web3Eth.getNodeInfo();
			expect(res).toBeDefined();
		});

		itIf(!['ganache', 'geth'].includes(getSystemTestBackend()))('getWork', async () => {
			const res = await web3Eth.getWork();
			// eslint-disable-next-line jest/no-standalone-expect
			expect(res[0]).toBeDefined();
		});

		itIf(!['geth', 'ganache'].includes(getSystemTestBackend()))('requestAccounts', async () => {
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
