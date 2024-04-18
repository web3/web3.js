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

import { SupportedProviders } from 'web3-types';
import { numberToHex } from 'web3-utils';
import { Web3, Contract, FMT_BYTES, FMT_NUMBER } from '../../src';

import {
	closeOpenConnection,
	getSystemTestProvider,
	createNewAccount,
	createTempAccount,
	mapFormatToType,
} from '../shared_fixtures/system_tests_utils';
import { BasicAbi, BasicBytecode } from '../shared_fixtures/build/Basic';

describe('format', () => {
	let web3: Web3;
	let clientUrl: string | SupportedProviders;
	let contractDeployed: Contract<typeof BasicAbi>;
	let contract: Contract<typeof BasicAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;
	let tempAcc: { address: string; privateKey: string };
	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
		web3 = new Web3({
			provider: clientUrl,
			config: {
				transactionPollingTimeout: 2000,
			},
		});
		contract = new web3.eth.Contract(BasicAbi);

		deployOptions = {
			data: BasicBytecode,
			arguments: [10, 'string init value'],
		};
		tempAcc = await createTempAccount();
		sendOptions = { from: tempAcc.address, gas: '1000000' };

		contractDeployed = await contract.deploy(deployOptions).send(sendOptions);
	});

	afterAll(async () => {
		await closeOpenConnection(web3);
	});

	describe('methods', () => {
		it.each(Object.values(FMT_NUMBER))('getBlockNumber', async format => {
			web3.defaultReturnFormat = { number: format as FMT_NUMBER, bytes: FMT_BYTES.HEX };
			const res = await web3.eth.getBlockNumber();
			expect(typeof res).toBe(mapFormatToType[format as string]);
			expect(parseInt(String(res), 16)).toBeGreaterThan(0);
		});

		it.each(Object.values(FMT_NUMBER))('getGasPrice', async format => {
			web3.defaultReturnFormat = { number: format as FMT_NUMBER, bytes: FMT_BYTES.HEX };
			const res = await web3.eth.getGasPrice();
			expect(typeof res).toBe(mapFormatToType[format as string]);
			expect(parseInt(String(res), 16)).toBeGreaterThan(0);
		});

		it.each(Object.values(FMT_NUMBER))('getBalance', async format => {
			web3.defaultReturnFormat = { number: format as FMT_NUMBER, bytes: FMT_BYTES.HEX };
			const value = '0xa';
			const newAccount = await createNewAccount();
			await web3.eth.sendTransaction({
				to: newAccount.address,
				value,
				from: tempAcc.address,
			});
			const res = await web3.eth.getBalance(newAccount.address);
			expect(typeof res).toBe(mapFormatToType[format as string]);
			expect(numberToHex(res)).toBe(value);
		});

		it.each(Object.values(FMT_BYTES))('getCode', async format => {
			web3.defaultReturnFormat = { number: FMT_NUMBER.BIGINT, bytes: format };
			const code = await web3.eth.getCode(contractDeployed?.options?.address as string);
			expect(code).toBeDefined();
			expect(typeof code).toBe(mapFormatToType[format as string]);
		});

		it.each(Object.values(FMT_NUMBER))('getChainId', async format => {
			web3.defaultReturnFormat = { number: format as FMT_NUMBER, bytes: FMT_BYTES.HEX };

			const res = await web3.eth.getChainId();
			expect(typeof res).toBe(mapFormatToType[format as string]);
			expect(Number(res)).toBeGreaterThan(0);
		});
	});
});
