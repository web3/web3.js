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
import { Contract } from 'web3-eth-contract';
import { hexToNumber } from 'web3-utils';
import { Web3Eth } from '../../src';

import { getSystemTestAccounts, getSystemTestProvider } from '../fixtures/system_test_utils';
import { basicContractAbi, basicContractByteCode } from '../shared_fixtures/sources/Basic';

const mapFormatToType = {
	[FMT_NUMBER.NUMBER]: 'number',
	[FMT_NUMBER.HEX]: 'string',
	[FMT_NUMBER.STR]: 'string',
	[FMT_NUMBER.BIGINT]: 'bigint',
};
// type Resolve = (value?: unknown) => void;
//
// type SendFewTxParams = {
//     web3Eth: Web3Eth;
//     to: string;
//     from: string;
//     value: string;
// };
// const sendTx = async ({ web3Eth, to, value, from }: SendFewTxParams) => {
//         const tx: PromiEvent<ReceiptInfo, SendTransactionEvents> = web3Eth.sendTransaction({
//             to,
//             value,
//             from,
//         });
//         // eslint-disable-next-line no-await-in-loop
//         await new Promise((resolve: Resolve) => {
//             tx.on('receipt', (params: ReceiptInfo) => {
//                 expect(params.status).toBe('0x1');
//                 resolve();
//             });
//         });
// };

describe('rpc', () => {
	let web3Eth: Web3Eth;
	let accounts: string[] = [];
	let clientUrl: string;

	let contract: Contract<typeof basicContractAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;

	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
		accounts = await getSystemTestAccounts();
		web3Eth = new Web3Eth(clientUrl);

		contract = new Contract(basicContractAbi, undefined, {
			provider: clientUrl,
		});

		deployOptions = {
			data: basicContractByteCode,
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
		it('getProtocolVersion', async () => {
			const version = await web3Eth.getProtocolVersion();
			expect(parseInt(version, 16)).toBeGreaterThan(0);
		});
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
			const hashRate = await web3Eth.getHashRate({ number: format, bytes: FMT_BYTES.HEX });
			expect(typeof hashRate).toBe(mapFormatToType[format]);
		});
		it('getAccounts', async () => {
			const accList = await web3Eth.getAccounts();
			expect(accounts).toHaveLength(accList.length);
			for (const acc of accList) {
				expect(accounts).toContain(acc);
			}
		});
		describe.each(['getBlockNumber', 'getGasPrice'])(
			'check method with format',
			(methodName: string) => {
				it.each(Object.values(FMT_NUMBER))(`check method ${methodName}`, async format => {
					// @ts-expect-error call any method
					// eslint-disable-next-line
					const res = await web3Eth[methodName]({ number: format, bytes: FMT_BYTES.HEX });
					expect(typeof res).toBe(mapFormatToType[format]);
					expect(parseInt(String(res), 16)).toBeGreaterThan(0);
				});
			},
		);

		it.each(Object.values(FMT_NUMBER))('getBalance', async format => {
			const res = await web3Eth.getBalance(accounts[0], undefined, {
				number: format,
				bytes: FMT_BYTES.HEX,
			});
			expect(typeof res).toBe(mapFormatToType[format]);
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
			expect(resString).toBeDefined();
			expect(Boolean(hexToNumber(resBool))).toBe(boolData);
		});
	});
});
