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
import {
	TransactionReceipt,
	Transaction,
	FMT_BYTES,
	FMT_NUMBER,
	SupportedProviders,
} from 'web3-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Contract } from 'web3-eth-contract';
import { validator } from 'web3-validator';
import { Web3Eth } from '../../../src';
import {
	getSystemTestProvider,
	createTempAccount,
	closeOpenConnection,
	getSystemTestBackend,
	describeIf,
	createNewAccount,
	refillAccount,
	BACKEND,
} from '../../fixtures/system_test_utils';
import { BasicAbi, BasicBytecode } from '../../shared_fixtures/build/Basic';
import { toAllVariants } from '../../shared_fixtures/utils';
import { sendFewTxes } from '../helper';
import { blockSchema } from '../../../src/schemas';

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
		tempAcc = await createNewAccount({ unlock: true });
		await refillAccount(
			(
				await createTempAccount()
			).address,
			tempAcc.address,
			'10000000000000000',
		);
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

			expect(validator.validateJSONSchema(blockSchema, b)).toBeUndefined();
			if (hydrated && b.transactions?.length > 0) {
				// eslint-disable-next-line jest/no-conditional-expect
				expect(b.transactions).toBeInstanceOf(Array<Transaction>);
			}
		});
	});

	describeIf(getSystemTestBackend() === BACKEND.GETH)(
		'getBlock calls with POS tags in POA node',
		() => {
			it.each(['safe', 'finalized'])(
				// only geth throws this error
				'getBlock',
				async blockTag => {
					const request = await web3Eth.getBlock(blockTag);

					expect(request).toBeDefined();
					expect(validator.validateJSONSchema(blockSchema, request)).toBeUndefined();
				},
			);
		},
	);
});
