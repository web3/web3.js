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
import { SupportedProviders, TransactionInfo, TransactionReceipt } from 'web3-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Contract } from 'web3-eth-contract';
import { Web3Eth } from '../../../src';
import {
	getSystemTestProvider,
	createTempAccount,
	closeOpenConnection,
} from '../../fixtures/system_test_utils';
import { BasicAbi, BasicBytecode } from '../../shared_fixtures/build/Basic';
import { sendFewTxes, validateTransaction } from '../helper';

describe('rpc with block', () => {
	let web3Eth: Web3Eth;
	let clientUrl: string | SupportedProviders;

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
	let tempAcc: { address: string; privateKey: string };

	beforeAll(() => {
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
	});
	beforeAll(async () => {
		tempAcc = await createTempAccount();
		sendOptions = { from: tempAcc.address, gas: '1000000' };

		await contract.deploy(deployOptions).send(sendOptions);
		const [receipt]: TransactionReceipt[] = await sendFewTxes({
			from: tempAcc.address,
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
	afterAll(async () => {
		await closeOpenConnection(web3Eth);
		await closeOpenConnection(contract);
	});

	describe('methods', () => {
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
