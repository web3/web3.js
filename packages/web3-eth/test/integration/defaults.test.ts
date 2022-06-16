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
// eslint-disable-next-line import/no-extraneous-dependencies
import { Contract } from 'web3-eth-contract';
import { hexToNumber, numberToHex } from 'web3-utils';
import { TransactionBuilder, TransactionTypeParser, Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, Web3PromiEvent } from 'web3-common';
import {
	prepareTransactionForSigning,
	ReceiptInfo,
	SendTransactionEvents,
	transactionBuilder,
	Web3Eth,
} from '../../src';

import { createNewAccount, getSystemTestProvider } from '../fixtures/system_test_utils';
import {
	defaultTransactionBuilder,
	getTransactionFromAttr,
	getTransactionType,
} from '../../src/utils';
import { BasicAbi, BasicBytecode } from '../shared_fixtures/build/Basic';
import { MsgSenderAbi, MsgSenderBytecode } from '../shared_fixtures/build/MsgSender';
import { detectTransactionType } from '../../dist';
import { getTransactionGasPricing } from '../../src/utils/get_transaction_gas_pricing';
import { Resolve, sendFewTxes } from './helper';

describe('defaults', () => {
	let web3Eth: Web3Eth;
	let eth2: Web3Eth;
	let accounts: string[] = [];
	let clientUrl: string;
	let contract: Contract<typeof BasicAbi>;
	let contractMsgFrom: Contract<typeof BasicAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;

	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
		const acc1 = await createNewAccount({ unlock: true, refill: true });
		const acc2 = await createNewAccount({ unlock: true, refill: true });
		accounts = [acc1.address, acc2.address];
		if (clientUrl.startsWith('ws')) {
			web3Eth = new Web3Eth(
				new WebSocketProvider(
					clientUrl,
					{},
					{ delay: 1, autoReconnect: false, maxAttempts: 1 },
				),
			);
		} else {
			web3Eth = new Web3Eth(clientUrl);
		}

		contract = new Contract(BasicAbi, undefined, undefined, web3Eth.getContextObject() as any);
		deployOptions = {
			data: BasicBytecode,
			arguments: [10, 'string init value'],
		};
		sendOptions = { from: accounts[0], gas: '1000000' };
		contract = await contract.deploy(deployOptions).send(sendOptions);

		contractMsgFrom = await new Contract(
			MsgSenderAbi,
			undefined,
			undefined,
			web3Eth.getContextObject() as any,
		)
			.deploy({
				data: MsgSenderBytecode,
				arguments: ['test'],
			})
			.send({ from: accounts[1], gas: '2700000' });
	});
	afterAll(() => {
		if (clientUrl.startsWith('ws')) {
			(web3Eth?.provider as WebSocketProvider)?.disconnect();
		}
	});

	describe('defaults', () => {
		it('defaultAccount', async () => {
			// default
			expect(web3Eth.defaultAccount).toBeUndefined();

			// after set
			web3Eth.setConfig({
				defaultAccount: accounts[0],
			});
			expect(web3Eth.defaultAccount).toBe(accounts[0]);

			// set by create new instance
			eth2 = new Web3Eth({
				provider: web3Eth.provider,
				config: {
					defaultAccount: accounts[1],
				},
			});
			expect(eth2.defaultAccount).toBe(accounts[1]);

			// check utils
			expect(getTransactionFromAttr(eth2)).toBe(accounts[1]);
			// TODO: after handleRevert implementation https://github.com/ChainSafe/web3.js/issues/5069 add following tests in future release
			//  set handleRevert true and test following functions with invalid input tx data and see revert reason present in error details:
			contractMsgFrom.setConfig({
				defaultAccount: accounts[0],
			});

			const tx = await contractMsgFrom.methods
				?.setTestString('test2')
				.send({ gas: '1000000' });
			const txSend = await web3Eth.sendTransaction({
				to: accounts[1],
				value: '0x1',
			});
			expect(tx.from).toBe(accounts[0].toLowerCase());
			expect(txSend.from).toBe(accounts[0].toLowerCase());

			const tx2 = await contractMsgFrom.methods?.setTestString('test3').send({
				from: accounts[1],
			});
			const tx2Send = await web3Eth.sendTransaction({
				to: accounts[0],
				value: '0x1',
				from: accounts[1],
			});
			expect(tx2.from).toBe(accounts[1].toLowerCase());
			expect(tx2Send.from).toBe(accounts[1].toLowerCase());

			// TODO: uncomment this test after finish #5117
			// const fromDefault = await contractMsgFrom.methods?.from().call();
			// const fromPass = await contractMsgFrom.methods?.from().call({from:accounts[0]});
			// const fromPass2 = await contractMsgFrom.methods?.from().call({from:accounts[1]});
			// expect(fromDefault).toBe(accounts[0].toLowerCase());
			// expect(fromPass).toBe(accounts[0].toLowerCase());
			// expect(fromPass2).toBe(accounts[1].toLowerCase());
		});

		it('handleRevert', () => {
			/*
            //TO DO: after handleRevert implementation https://github.com/ChainSafe/web3.js/issues/5069 add following tests in future release
            /* set handleRevert true and test following functions with invalid input tx data and see revert reason present in error details:

            web3.eth.call()
            web3.eth.sendTransaction()
            contract.methods.myMethod(…).send(…)
            contract.methods.myMethod(…).call(…)

            */
			// default
			expect(web3Eth.handleRevert).toBe(false);

			// after set
			web3Eth.setConfig({
				handleRevert: true,
			});
			expect(web3Eth.handleRevert).toBe(true);

			// set by create new instance
			eth2 = new Web3Eth({
				provider: web3Eth.provider,
				config: {
					handleRevert: true,
				},
			});
			expect(eth2.handleRevert).toBe(true);
		});
		it('defaultBlock', async () => {
			// default
			expect(web3Eth.defaultBlock).toBe('latest');

			// after set
			web3Eth.setConfig({
				defaultBlock: 'earliest',
			});
			expect(web3Eth.defaultBlock).toBe('earliest');

			// set by create new instance
			eth2 = new Web3Eth({
				provider: web3Eth.provider,
				config: {
					defaultBlock: 'earliest',
				},
			});
			expect(eth2.defaultBlock).toBe('earliest');

			// check implementation
			const acc = await createNewAccount({ refill: true, unlock: true });

			await sendFewTxes({
				web3Eth: eth2,
				from: acc.address,
				to: accounts[1],
				times: 1,
				value: '0x1',
			});
			const balance = await eth2.getBalance(acc.address);
			const code = await eth2.getCode(contract?.options?.address as string);
			const storage = await eth2.getStorageAt(contract?.options?.address as string, 0);
			const transactionCount = await eth2.getTransactionCount(acc.address);
			expect(storage === '0x' ? 0 : Number(hexToNumber(storage))).toBe(0);
			expect(code).toBe('0x');
			expect(balance).toBe('0x0');
			expect(transactionCount).toBe('0x0');

			// pass blockNumber to rewrite defaultBlockNumber
			const balanceWithBlockNumber = await eth2.getBalance(acc.address, 'latest');
			const transactionCountWithBlockNumber = await eth2.getTransactionCount(
				acc.address,
				'latest',
			);
			const codeWithBlockNumber = await eth2.getCode(
				contract?.options?.address as string,
				'latest',
			);
			const storageWithBlockNumber = await eth2.getStorageAt(
				contract?.options?.address as string,
				0,
				'latest',
			);
			expect(Number(hexToNumber(storageWithBlockNumber))).toBe(10);
			expect(transactionCountWithBlockNumber).toBe('0x1');
			expect(Number(hexToNumber(balanceWithBlockNumber))).toBeGreaterThan(0);
			expect(codeWithBlockNumber.startsWith(BasicBytecode.slice(0, 10))).toBe(true);

			// set new default block to config
			eth2.setConfig({
				defaultBlock: 'latest',
			});
			const balanceLatest = await eth2.getBalance(acc.address);
			const codeLatest = await eth2.getCode(contract?.options?.address as string);
			const storageLatest = await eth2.getStorageAt(contract?.options?.address as string, 0);
			const transactionCountLatest = await eth2.getTransactionCount(acc.address);
			expect(codeLatest.startsWith(BasicBytecode.slice(0, 10))).toBe(true);
			expect(Number(hexToNumber(storageLatest))).toBe(10);
			expect(transactionCountLatest).toBe('0x1');
			expect(Number(hexToNumber(balanceLatest))).toBeGreaterThan(0);
		});
		it('transactionBlockTimeout', () => {
			// default
			expect(web3Eth.transactionBlockTimeout).toBe(50);

			// after set
			web3Eth.setConfig({
				transactionBlockTimeout: 1,
			});
			expect(web3Eth.transactionBlockTimeout).toBe(1);

			// set by create new instance
			eth2 = new Web3Eth({
				provider: web3Eth.provider,
				config: {
					transactionBlockTimeout: 120,
				},
			});
			expect(eth2.transactionBlockTimeout).toBe(120);
		});
		it('transactionConfirmationBlocks', () => {
			// default
			expect(web3Eth.transactionConfirmationBlocks).toBe(24);

			// after set
			web3Eth.setConfig({
				transactionConfirmationBlocks: 3,
			});
			expect(web3Eth.transactionConfirmationBlocks).toBe(3);

			// set by create new instance
			eth2 = new Web3Eth({
				provider: web3Eth.provider,
				config: {
					transactionConfirmationBlocks: 4,
				},
			});
			expect(eth2.transactionConfirmationBlocks).toBe(4);
		});
		it('transactionConfirmationBlocks implementation', async () => {
			const waitConfirmations = 3;
			const eth = new Web3Eth(web3Eth.provider);
			eth.setConfig({ transactionConfirmationBlocks: waitConfirmations });

			const from = accounts[0];
			const to = accounts[1];
			const value = `0x1`;
			const sentTx: Web3PromiEvent<ReceiptInfo, SendTransactionEvents> = eth.sendTransaction({
				to,
				value,
				from,
			});

			const receiptPromise = new Promise((resolve: Resolve) => {
				sentTx.on('receipt', (params: ReceiptInfo) => {
					expect(params.status).toBe('0x1');
					resolve();
				});
			});
			let shouldBe = 2;
			const confirmationPromise = new Promise((resolve: Resolve) => {
				sentTx.on('confirmation', ({ confirmationNumber }) => {
					expect(parseInt(String(confirmationNumber), 16)).toBe(shouldBe);
					shouldBe += 1;
					if (shouldBe > waitConfirmations) {
						resolve();
					}
				});
			});
			await receiptPromise;
			await sendFewTxes({ web3Eth: eth, from, to, value, times: waitConfirmations });
			await confirmationPromise;
		});
		it('transactionPollingInterval and transactionPollingTimeout', () => {
			// default
			expect(web3Eth.transactionPollingInterval).toBe(1000);
			expect(web3Eth.transactionPollingTimeout).toBe(750);

			// after set
			web3Eth.setConfig({
				transactionPollingInterval: 3,
				transactionPollingTimeout: 10,
			});
			expect(web3Eth.transactionPollingInterval).toBe(3);
			expect(web3Eth.transactionPollingTimeout).toBe(10);

			// set by create new instance
			eth2 = new Web3Eth({
				provider: web3Eth.provider,
				config: {
					transactionPollingInterval: 400,
					transactionPollingTimeout: 10,
				},
			});
			expect(eth2.transactionPollingInterval).toBe(400);
			expect(eth2.transactionPollingTimeout).toBe(10);
		});
		// todo will work with not instance mining
		// itIf(getSystemTestProvider().startsWith('http'))('transactionReceiptPollingInterval and transactionConfirmationPollingInterval implementation', async () => {
		//     eth2 = new Web3Eth({
		//         provider: web3Eth.provider,
		//         config: {
		//             transactionPollingInterval: 400,
		//             transactionPollingTimeout: 10,
		//         },
		//     });
		//
		//     const sentTx: Web3PromiEvent<ReceiptInfo, SendTransactionEvents> = eth2.sendTransaction({
		//         to: accounts[1],
		//         value: '0x1',
		//         from: accounts[0],
		//     });
		//
		//     const res = await Promise.race([
		//         new Promise((resolve) => setTimeout(resolve, 410)),
		//         new Promise((resolve: Resolve) => {
		//             sentTx.on('receipt', (params: ReceiptInfo) => {
		//                 expect(params.status).toBe('0x1');
		//                 resolve(params);
		//             });
		//         }),
		//     ]);
		//     expect((res as ReceiptInfo).status).toBe('0x1');
		//
		//     const sentTx2: Web3PromiEvent<ReceiptInfo, SendTransactionEvents> = eth2.sendTransaction({
		//         to: accounts[1],
		//         value: '0x1',
		//         from: accounts[0],
		//     });
		//     const res2 = await Promise.race([
		//         new Promise((resolve) => setTimeout(()=>resolve(false), 300)),
		//         new Promise((resolve: Resolve) => {
		//             sentTx2.on('receipt', (params: ReceiptInfo) => {
		//                 expect(params.status).toBe('0x1');
		//                 resolve(params);
		//             });
		//         }),
		//     ]);
		//     expect((res2 as boolean)).toBe(false);
		//
		//
		// });
		it('transactionReceiptPollingInterval and transactionConfirmationPollingInterval', () => {
			// default
			expect(web3Eth.transactionReceiptPollingInterval).toBeUndefined();
			expect(web3Eth.transactionConfirmationPollingInterval).toBeUndefined();

			// after set
			web3Eth.setConfig({
				transactionReceiptPollingInterval: 3,
				transactionConfirmationPollingInterval: 10,
			});
			expect(web3Eth.transactionReceiptPollingInterval).toBe(3);
			expect(web3Eth.transactionConfirmationPollingInterval).toBe(10);

			// set by create new instance
			eth2 = new Web3Eth({
				provider: web3Eth.provider,
				config: {
					transactionReceiptPollingInterval: 400,
					transactionConfirmationPollingInterval: 10,
				},
			});
			expect(eth2.transactionReceiptPollingInterval).toBe(400);
			expect(eth2.transactionConfirmationPollingInterval).toBe(10);
		});
		it('blockHeaderTimeout', () => {
			// default
			expect(web3Eth.blockHeaderTimeout).toBe(10);

			// after set
			web3Eth.setConfig({
				blockHeaderTimeout: 3,
			});
			expect(web3Eth.blockHeaderTimeout).toBe(3);

			// set by create new instance
			eth2 = new Web3Eth({
				provider: web3Eth.provider,
				config: {
					blockHeaderTimeout: 4,
				},
			});
			expect(eth2.blockHeaderTimeout).toBe(4);
		});
		it('maxListenersWarningThreshold', () => {
			// default
			expect(web3Eth.maxListenersWarningThreshold).toBe(100);

			// after set
			web3Eth.setConfig({
				maxListenersWarningThreshold: 3,
			});
			expect(web3Eth.maxListenersWarningThreshold).toBe(3);

			// set by create new instance
			eth2 = new Web3Eth({
				provider: web3Eth.provider,
				config: {
					maxListenersWarningThreshold: 4,
				},
			});
			expect(eth2.maxListenersWarningThreshold).toBe(4);
		});
		it('defaultNetworkId', async () => {
			// default
			expect(web3Eth.defaultNetworkId).toBeUndefined();

			// after set
			web3Eth.setConfig({
				defaultNetworkId: 3,
			});
			expect(web3Eth.defaultNetworkId).toBe(3);

			// set by create new instance
			eth2 = new Web3Eth({
				provider: web3Eth.provider,
				config: {
					defaultNetworkId: 4,
				},
			});
			expect(eth2.defaultNetworkId).toBe(4);
			const res = await defaultTransactionBuilder({
				transaction: {
					from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
					to: '0x3535353535353535353535353535353535353535',
					value: '0x174876e800',
					gas: '0x5208',
				},
				web3Context: eth2 as Web3Context<any>,
			});
			expect(res.networkId).toBe(4);

			// pass network id
			const resWithPassNetworkId = await defaultTransactionBuilder({
				transaction: {
					from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
					to: '0x3535353535353535353535353535353535353535',
					value: '0x174876e800',
					gas: '0x5208',
					networkId: 5,
				},
				web3Context: eth2 as Web3Context<any>,
			});

			expect(resWithPassNetworkId.networkId).toBe('0x5');
		});
		it('defaultChain', async () => {
			// default
			expect(web3Eth.defaultChain).toBe('mainnet');

			// after set
			web3Eth.setConfig({
				defaultChain: 'ropsten',
			});
			expect(web3Eth.defaultChain).toBe('ropsten');

			// set by create new instance
			eth2 = new Web3Eth({
				provider: web3Eth.provider,
				config: {
					defaultChain: 'rinkeby',
				},
			});
			expect(eth2.defaultChain).toBe('rinkeby');
			const res = await defaultTransactionBuilder({
				transaction: {
					from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
					to: '0x3535353535353535353535353535353535353535',
					value: '0x174876e800',
					gas: '0x5208',
				},
				web3Context: eth2 as Web3Context<any>,
			});
			expect(res.chain).toBe('rinkeby');
		});
		it('defaultHardfork', async () => {
			// default
			expect(web3Eth.defaultHardfork).toBe('london');

			// after set
			web3Eth.setConfig({
				defaultHardfork: 'dao',
			});
			expect(web3Eth.defaultHardfork).toBe('dao');

			// set by create new instance
			eth2 = new Web3Eth({
				provider: web3Eth.provider,
				config: {
					defaultHardfork: 'istanbul',
				},
			});
			expect(eth2.defaultHardfork).toBe('istanbul');

			const res = await prepareTransactionForSigning(
				{
					from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
					to: '0x3535353535353535353535353535353535353535',
					value: '0x174876e800',
					gas: '0x5208',
					gasPrice: '0x4a817c800',
					data: '0x0',
					nonce: '0x4',
					chainId: '0x1',
					gasLimit: '0x5208',
				},
				eth2,
			);
			expect(res.common.hardfork()).toBe('istanbul');
		});
		it('defaultCommon', () => {
			// default
			expect(web3Eth.defaultCommon).toBeUndefined();
			const common = {
				customChain: {
					name: 'test',
					networkId: 123,
					chainId: 1234,
				},
				baseChain: 12345,
				hardfork: 'dao',
			};
			// after set
			web3Eth.setConfig({
				defaultCommon: common,
			});
			expect(web3Eth.defaultCommon).toBe(common);

			// set by create new instance
			eth2 = new Web3Eth({
				provider: web3Eth.provider,
				config: {
					defaultCommon: common,
				},
			});
			expect(eth2.defaultCommon).toBe(common);
		});
		it('defaultTransactionType', () => {
			// default
			expect(web3Eth.defaultTransactionType).toBe('0x0');
			// after set
			web3Eth.setConfig({
				defaultTransactionType: '0x3',
			});
			expect(web3Eth.defaultTransactionType).toBe('0x3');

			// set by create new instance
			eth2 = new Web3Eth({
				provider: web3Eth.provider,
				config: {
					defaultTransactionType: '0x4444',
				},
			});
			expect(eth2.defaultTransactionType).toBe('0x4444');

			const res = getTransactionType(
				{
					from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
					to: '0x3535353535353535353535353535353535353535',
					value: '0x174876e800',
					gas: '0x5208',
					data: '0x0',
					nonce: '0x4',
					chainId: '0x1',
					gasLimit: '0x5208',
				},
				eth2,
			);
			expect(res).toBe('0x4444');

			// test override to 0x2 if:
			// tx.maxFeePerGas !== undefined ||
			// tx.maxPriorityFeePerGas !== undefined ||
			// tx.hardfork === 'london' ||
			// tx.common?.hardfork === 'london'
			const maxFeePerGasOverride = getTransactionType(
				{
					from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
					to: '0x3535353535353535353535353535353535353535',
					value: '0x174876e800',
					gas: '0x5208',
					data: '0x0',
					nonce: '0x4',
					chainId: '0x1',
					gasLimit: '0x5208',
					maxFeePerGas: '0x32',
				},
				eth2,
			);
			expect(maxFeePerGasOverride).toBe('0x2');
			const maxPriorityFeePerGasOverride = getTransactionType(
				{
					from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
					to: '0x3535353535353535353535353535353535353535',
					value: '0x174876e800',
					gas: '0x5208',
					data: '0x0',
					nonce: '0x4',
					chainId: '0x1',
					gasLimit: '0x5208',
					maxPriorityFeePerGas: '0x32',
				},
				eth2,
			);
			expect(maxPriorityFeePerGasOverride).toBe('0x2');
			const hardforkOverride = getTransactionType(
				{
					from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
					to: '0x3535353535353535353535353535353535353535',
					value: '0x174876e800',
					gas: '0x5208',
					data: '0x0',
					nonce: '0x4',
					chainId: '0x1',
					gasLimit: '0x5208',
					hardfork: 'london',
				},
				eth2,
			);
			expect(hardforkOverride).toBe('0x2');
			const commonOverride = getTransactionType(
				{
					from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
					to: '0x3535353535353535353535353535353535353535',
					value: '0x174876e800',
					gas: '0x5208',
					data: '0x0',
					nonce: '0x4',
					chainId: '0x1',
					gasLimit: '0x5208',
					common: {
						customChain: { name: 'ropsten', networkId: '2', chainId: '0x1' },
						hardfork: 'london',
					},
				},
				eth2,
			);
			expect(commonOverride).toBe('0x2');

			// override to 0x1 if:
			// tx.accessList !== undefined || tx.hardfork === 'berlin' || tx.common?.hardfork === 'berlin'

			const accessListOverride = getTransactionType(
				{
					from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
					to: '0x3535353535353535353535353535353535353535',
					value: '0x174876e800',
					gas: '0x5208',
					data: '0x0',
					nonce: '0x4',
					chainId: '0x1',
					gasLimit: '0x5208',
					accessList: [
						{
							address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
							storageKeys: ['0x3535353535353535353535353535353535353535'],
						},
					],
				},
				eth2,
			);
			expect(accessListOverride).toBe('0x1');

			const hardforkBerlinOverride = getTransactionType(
				{
					from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
					to: '0x3535353535353535353535353535353535353535',
					value: '0x174876e800',
					gas: '0x5208',
					data: '0x0',
					nonce: '0x4',
					chainId: '0x1',
					gasLimit: '0x5208',
					hardfork: 'berlin',
				},
				eth2,
			);
			expect(hardforkBerlinOverride).toBe('0x1');

			const commonBerlinOverride = getTransactionType(
				{
					from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
					to: '0x3535353535353535353535353535353535353535',
					value: '0x174876e800',
					gas: '0x5208',
					data: '0x0',
					nonce: '0x4',
					chainId: '0x1',
					gasLimit: '0x5208',
					common: {
						customChain: { name: 'ropsten', networkId: '2', chainId: '0x1' },
						hardfork: 'berlin',
					},
				},
				eth2,
			);
			expect(commonBerlinOverride).toBe('0x1');
		});
		it('defaultMaxPriorityFeePerGas', async () => {
			// default
			expect(web3Eth.defaultMaxPriorityFeePerGas).toBe(numberToHex(2500000000));
			// after set
			web3Eth.setConfig({
				defaultMaxPriorityFeePerGas: numberToHex(2100000000),
			});
			expect(web3Eth.defaultMaxPriorityFeePerGas).toBe(numberToHex(2100000000));

			// set by create new instance
			eth2 = new Web3Eth({
				provider: web3Eth.provider,
				config: {
					defaultMaxPriorityFeePerGas: numberToHex(1200000000),
				},
			});
			expect(eth2.defaultMaxPriorityFeePerGas).toBe(numberToHex(1200000000));

			const res = await getTransactionGasPricing(
				{
					from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
					to: '0x3535353535353535353535353535353535353535',
					value: '0x174876e800',
					type: '0x2',
					gas: '0x5208',
					data: '0x0',
					nonce: '0x4',
					chainId: '0x1',
					gasLimit: '0x5208',
				},
				eth2,
				DEFAULT_RETURN_FORMAT,
			);
			expect(res?.maxPriorityFeePerGas).toBe(numberToHex(1200000000));

			// override test
			const resOverride = await getTransactionGasPricing(
				{
					from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
					to: '0x3535353535353535353535353535353535353535',
					value: '0x174876e800',
					type: '0x2',
					gas: '0x5208',
					data: '0x0',
					nonce: '0x4',
					chainId: '0x1',
					gasLimit: '0x5208',
					maxPriorityFeePerGas: '0x123123123',
				},
				eth2,
				DEFAULT_RETURN_FORMAT,
			);
			expect(resOverride?.maxPriorityFeePerGas).toBe('0x123123123');
		});
		it('transactionBuilder', async () => {
			// default
			expect(web3Eth.transactionBuilder).toBeUndefined();

			// default
			expect(web3Eth.transactionBuilder).toBeUndefined();

			const newBuilderMock = jest.fn() as unknown as TransactionBuilder;

			web3Eth.setConfig({
				transactionBuilder: newBuilderMock,
			});
			expect(web3Eth.transactionBuilder).toBe(newBuilderMock);

			// set by create new instance
			eth2 = new Web3Eth({
				provider: web3Eth.provider,
				config: {
					transactionBuilder: newBuilderMock,
				},
			});
			expect(eth2.transactionBuilder).toBe(newBuilderMock);

			await transactionBuilder({
				transaction: {
					from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
					to: '0x3535353535353535353535353535353535353535',
					value: '0x174876e800',
					gas: '0x5208',
					gasPrice: '0x4a817c800',
					data: '0x0',
					nonce: '0x4',
					chainId: '0x1',
					gasLimit: '0x5208',
				},
				web3Context: eth2,
			});
			expect(newBuilderMock).toHaveBeenCalled();
		});
		it('transactionTypeParser', () => {
			// default
			expect(web3Eth.transactionTypeParser).toBeUndefined();

			const newParserMock = jest.fn() as unknown as TransactionTypeParser;

			web3Eth.setConfig({
				transactionTypeParser: newParserMock,
			});
			expect(web3Eth.transactionTypeParser).toBe(newParserMock);

			// set by create new instance
			eth2 = new Web3Eth({
				provider: web3Eth.provider,
				config: {
					transactionTypeParser: newParserMock,
				},
			});
			expect(eth2.transactionTypeParser).toBe(newParserMock);
			detectTransactionType(
				{
					from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
					to: '0x3535353535353535353535353535353535353535',
					value: '0x174876e800',
					gas: '0x5208',
					gasPrice: '0x4a817c800',
					data: '0x0',
					nonce: '0x4',
					chainId: '0x1',
					gasLimit: '0x5208',
				},
				eth2,
			);
			expect(newParserMock).toHaveBeenCalled();
		});
	});
});
