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

import { WebSocketProvider } from 'web3-providers-ws';
import {
	closeOpenConnection,
} from '../shared_fixtures/system_tests_utils';
import Web3 from '../../src/index';



describe('Web3 instance', () => {
	// let provider: SupportedProviders<EthExecutionAPI> | string;
	let web3: Web3;

	beforeEach(() => {
		// provider = getSystemTestProvider();
		web3 = new Web3("ws://127.0.0.1:8545");
	});
	afterAll(async () => {
		await closeOpenConnection(web3);
	});

	describe('web3 ws tests', () => {
		it('should connect and disconnect using safe disconnect subscription successfully', async () => {

            // const websocketProvider = new WebSocketProvider(provider as string);
            // const web3 = new Web3(websocketProvider);
            // Subscribe to new block headers
            const subscription = await web3.eth.subscribe("newBlockHeaders");
            // eslint-disable-next-line
            subscription.unsubscribe();
            if (web3.currentProvider)
            await (web3.currentProvider as WebSocketProvider).safeDisconnect();
		});

        it('should throw error when connect and disconnecting', async () => {

            const subscription = await web3.eth.subscribe("newBlockHeaders");

            // eslint-disable-next-line
            subscription.unsubscribe();
            if (web3.currentProvider) {
                (web3.currentProvider as WebSocketProvider).disconnect();
            }
		});
	});
});