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
import { Contract, decodeEventABI } from 'web3-eth-contract';
import { AbiEventFragment, Web3BaseProvider } from 'web3-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IpcProvider } from 'web3-providers-ipc';
import { Web3Eth } from '../../src';
import { LogsSubscription } from '../../src/web3_subscriptions';
import {
	closeOpenConnection,
	createTempAccount,
	describeIf,
	getSystemTestProviderUrl,
	isSocket,
	isWs,
} from '../fixtures/system_test_utils';
import { BasicAbi, BasicBytecode } from '../shared_fixtures/build/Basic';
import { eventAbi, Resolve } from './helper';

const checkEventCount = 2;

type MakeFewTxToContract = {
	sendOptions: Record<string, unknown>;
	contract: Contract<typeof BasicAbi>;
	testDataString: string;
};
const makeFewTxToContract = async ({
	contract,
	sendOptions,
	testDataString,
}: MakeFewTxToContract): Promise<void> => {
	const prs = [];
	for (let i = 0; i < checkEventCount; i += 1) {
		// eslint-disable-next-line no-await-in-loop
		prs.push(await contract.methods?.firesStringEvent(testDataString).send(sendOptions));
	}
};
describeIf(isSocket)('subscription', () => {
	let clientUrl: string;
	let web3Eth: Web3Eth;
	let provider: WebSocketProvider | IpcProvider;
	let contract: Contract<typeof BasicAbi>;
	let contractDeployed: Contract<typeof BasicAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;
	const testDataString = 'someTestString';
	let tempAcc: { address: string; privateKey: string };

	beforeEach(async () => {
		tempAcc = await createTempAccount();
		clientUrl = getSystemTestProviderUrl();
		provider = isWs ? new WebSocketProvider(clientUrl) : new IpcProvider(clientUrl);
		contract = new Contract(BasicAbi, undefined, {
			provider,
		});
	});
	afterEach(async () => {
		provider.disconnect();
		await closeOpenConnection(web3Eth);
	});

	describe('logs', () => {
		it(`wait for ${checkEventCount} logs`, async () => {
			web3Eth = new Web3Eth(provider as Web3BaseProvider);
			const from = tempAcc.address;
			deployOptions = {
				data: BasicBytecode,
				arguments: [10, 'string init value'],
			};

			sendOptions = { from, gas: '1000000' };
			contractDeployed = await contract.deploy(deployOptions).send(sendOptions);

			const sub: LogsSubscription = await web3Eth.subscribe('logs', {
				address: contractDeployed.options.address,
			});

			let count = 0;

			const pr = new Promise((resolve: Resolve) => {
				sub.on('data', (data: any) => {
					count += 1;
					const decodedData = decodeEventABI(
						eventAbi as AbiEventFragment & { signature: string },
						data,
						[],
					);
					expect(decodedData.returnValues['0']).toBe(testDataString);
					if (count >= checkEventCount) {
						resolve();
					}
				});
			});

			await makeFewTxToContract({
				contract: contractDeployed,
				sendOptions,
				testDataString,
			});

			await pr;
			await web3Eth.clearSubscriptions();
		});
	});
});
