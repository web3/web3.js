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
// eslint-disable-next-line import/no-extraneous-dependencies
import { Web3BaseProvider } from 'web3-types';
import { Web3Eth } from '../../src';
import { BasicAbi, BasicBytecode } from '../shared_fixtures/build/Basic';
import { LogsSubscription } from '../../src/web3_subscriptions';
import {
	describeIf,
	getSystemTestAccounts,
	getSystemTestProvider,
	isWs,
} from '../fixtures/system_test_utils';

describeIf(isWs)('subscription', () => {
	let clientUrl: string;
	let accounts: string[] = [];
	let web3Eth: Web3Eth;
	let providerWs: WebSocketProvider;
	let contract: Contract<typeof BasicAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;
	let from: string;
	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
		accounts = await getSystemTestAccounts();
		[, from] = accounts;
		providerWs = new WebSocketProvider(
			clientUrl,
			{},
			{ delay: 1, autoReconnect: false, maxAttempts: 1 },
		);
		contract = new Contract(BasicAbi, undefined, {
			provider: clientUrl,
		});

		deployOptions = {
			data: BasicBytecode,
			arguments: [10, 'string init value'],
		};

		sendOptions = { from, gas: '1000000' };

		contract = await contract.deploy(deployOptions).send(sendOptions);
	});
	afterAll(() => {
		providerWs.disconnect();
	});

	describe('logs', () => {
		it(`clear`, async () => {
			web3Eth = new Web3Eth(providerWs as Web3BaseProvider);
			const sub: LogsSubscription = await web3Eth.subscribe('logs');
			expect(sub.id).toBeDefined();
			await web3Eth.clearSubscriptions();
			expect(sub.id).toBeUndefined();
		});
	});
});
