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

import { TransactionReceipt, TransactionInfo } from 'web3-types';
import WebSocketProvider from 'web3-providers-ws';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Contract, decodeEventABI } from 'web3-eth-contract';
import { hexToNumber, hexToString, numberToHex, FMT_BYTES, FMT_NUMBER } from 'web3-utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AbiEventFragment } from 'web3-eth-abi';
import { getStorageSlotNumForLongString } from 'web3-utils/src';
// eslint-disable-next-line import/no-extraneous-dependencies
import IpcProvider from 'web3-providers-ipc';
import { Web3Eth } from '../../src';

import {
	getSystemTestBackend,
	getSystemTestProvider,
	createNewAccount,
	itIf,
	isIpc,
	isWs,
	createTempAccount,
} from '../fixtures/system_test_utils';
import { BasicAbi, BasicBytecode } from '../shared_fixtures/build/Basic';
import {
	eventAbi,
	mapFormatToType,
	sendFewTxes,
	validateReceipt,
	validateTransaction,
} from './helper';

describe('rpc', () => {
	let web3Eth: Web3Eth;
	let clientUrl: string;
	let contractDeployed: Contract<typeof BasicAbi>;
	let contract: Contract<typeof BasicAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;
	let tempAcc: { address: string; privateKey: string };
	let tempAcc2: { address: string; privateKey: string };
	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
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
		tempAcc = await createTempAccount();
		tempAcc2 = await createTempAccount();
		sendOptions = { from: tempAcc.address, gas: '1000000' };

		contractDeployed = await contract.deploy(deployOptions).send(sendOptions);
		if (isIpc) {
			await (contract.provider as IpcProvider).waitForConnection();
			await (web3Eth.provider as IpcProvider).waitForConnection();
		}
	});

	afterAll(() => {
		if (isWs) {
			(web3Eth.provider as WebSocketProvider).disconnect();
			(contract.provider as WebSocketProvider).disconnect();
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
			const accListLowerCase = accList.map((add: string) => add.toLowerCase());
			expect(accListLowerCase).toContain(account.address.toLowerCase());
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
				from: tempAcc.address,
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
			await contractDeployed.methods
				?.setValues(numberData, stringData, boolData)
				.send(sendOptions);
			const resNumber = await web3Eth.getStorageAt(
				contractDeployed.options.address as string,
				'0x0',
				undefined,
			);
			const resString = await web3Eth.getStorageAt(
				contractDeployed.options.address as string,
				'0x1',
				undefined,
			);
			const resBool = await web3Eth.getStorageAt(
				contractDeployed.options.address as string,
				'0x2',
				undefined,
			);

			expect(Number(resNumber)).toBe(numberData);

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
			await contractDeployed.methods
				?.setValues(numberData, stringDataLong, boolData)
				.send(sendOptions);

			const resStringLong = await web3Eth.getStorageAt(
				contractDeployed.options.address as string,
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
					// eslint-disable-next-line no-await-in-loop
					web3Eth.getStorageAt(
						contractDeployed.options.address as string,
						`0x${(
							BigInt(String(hexToNumber(slotDataNum as string))) + BigInt(i)
						).toString(16)}`,
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
			const code = await web3Eth.getCode(
				contractDeployed?.options?.address as string,
				undefined,
				{
					number: format as FMT_NUMBER,
					bytes: FMT_BYTES.HEX,
				},
			);
			expect(code).toBeDefined();
			expect(BasicBytecode.slice(-100)).toBe(code.slice(-100));
		});

		it('getTransaction', async () => {
			const [receipt] = await sendFewTxes({
				web3Eth,
				from: tempAcc.address,
				to: tempAcc2.address,
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
				to: tempAcc2.address,
				value: '0x1',
				from: tempAcc.address,
			});

			const res = await web3Eth.getPendingTransactions();
			await tx;
			// TODO: validate pending tx fields match with submitted tx
			// TODO: investigate why res always is empty array
			// eslint-disable-next-line jest/no-standalone-expect
			expect(res).toBeDefined();
		});

		it('getTransactionReceipt', async () => {
			const [receipt] = await sendFewTxes({
				web3Eth,
				from: tempAcc.address,
				to: tempAcc2.address,
				value: '0x1',
				times: 1,
			});
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const res: TransactionReceipt = (await web3Eth.getTransactionReceipt(
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
			expect(Number(res)).toBeGreaterThan(0);
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
			// expect(res[0]).toEqual(tempAcc.address);
		});

		itIf(getSystemTestBackend() !== 'ganache')('getProof', async () => {
			const numberData = BigInt(10);
			const stringData = 'str';
			const boolData = true;
			const sendRes = await contractDeployed.methods
				.setValues(numberData, stringData, boolData)
				.send(sendOptions);
			await web3Eth.getStorageAt(contractDeployed.options.address as string, 0, undefined);
			const res = await web3Eth.getProof(
				contractDeployed.options.address as string,
				['0x0000000000000000000000000000000000000000000000000000000000000000'],
				sendRes?.blockNumber,
			);
			// eslint-disable-next-line jest/no-standalone-expect
			expect(res.storageProof).toBeDefined();
			// eslint-disable-next-line jest/no-standalone-expect
			expect(res.storageProof[0].value).toBe(numberData);
		});

		it('getPastLogs', async () => {
			const listOfStrings = ['t1', 't2', 't3'];
			const resTx = [];
			for (const l of listOfStrings) {
				// eslint-disable-next-line  no-await-in-loop
				resTx.push(await contractDeployed.methods?.firesStringEvent(l).send(sendOptions));
			}
			const res: Array<any> = await web3Eth.getPastLogs({
				address: contractDeployed.options.address as string,
				fromBlock: numberToHex(Math.min(...resTx.map(d => Number(d.blockNumber)))),
			});
			const results = res.map(
				r =>
					decodeEventABI(eventAbi as AbiEventFragment & { signature: string }, r, [])
						.returnValues[0],
			);
			for (const l of listOfStrings) {
				expect(results).toContain(l);
			}
		});
	});
});
