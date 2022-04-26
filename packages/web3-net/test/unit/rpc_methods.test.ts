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

import { Web3RequestManager } from 'web3-core';

import { getId, getPeerCount, isListening } from '../../src/rpc_methods';
import { Web3NetAPI } from '../../src/web3_net_api';

describe('rpc_methods', () => {
	const requestManagerSendSpy = jest.fn();

	let requestManager: Web3RequestManager<Web3NetAPI>;

	beforeAll(() => {
		requestManager = new Web3RequestManager<Web3NetAPI>();
		requestManager.setProvider('http://127.0.0.1:8545');
		requestManager.send = requestManagerSendSpy;
	});

	describe('should make call with expected parameters', () => {
		it('getId', async () => {
			await getId(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'net_version',
				params: [],
			});
		});

		it('getPeerCount', async () => {
			await getPeerCount(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'net_peerCount',
				params: [],
			});
		});

		it('isListening', async () => {
			await isListening(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'net_listening',
				params: [],
			});
		});
	});
});
