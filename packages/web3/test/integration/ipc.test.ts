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

import IpcProvider from 'web3-providers-ipc';
import {
	getSystemTestProvider,
	describeIf,
	isIpc,
	closeOpenConnection,
} from '../shared_fixtures/system_tests_utils';
import Web3 from '../../src/index';

describe('Web3 instance', () => {
	let clientUrl: string;
	let web3: Web3;

	beforeAll(() => {
		clientUrl = getSystemTestProvider();
		web3 = new Web3(clientUrl);
	});
	afterAll(async () => {
		await closeOpenConnection(web3);
	});

	describeIf(isIpc)('Create Web3 class instance with ipc string providers', () => {
		// https://ethereum.stackexchange.com/questions/52574/how-to-connect-to-ethereum-node-geth-via-ipc-from-outside-of-docker-container
		// https://github.com/ethereum/go-ethereum/issues/17907
		it('should create instance with string of IPC provider', async () => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars

			expect(web3).toBeInstanceOf(Web3);
			await (web3.provider as IpcProvider).waitForConnection();
			expect((web3.provider as IpcProvider).getStatus()).toBe('connected');
		});
	});
});
