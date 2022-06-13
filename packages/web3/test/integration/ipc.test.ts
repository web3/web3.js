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

import { Web3BaseProvider } from 'web3-common';
import IpcProvider from 'web3-providers-ipc';
import { getSystemTestProvider, describeIf } from '../shared_fixtures/system_tests_utils';
import { Web3 } from '../../src/index';

const waitForOpenConnection = async (web3Inst: Web3, status = 'connected') => {
	return new Promise<void>((resolve, reject) => {
		const maxNumberOfAttempts = 10;
		const intervalTime = 5000; // ms
		let currentAttempt = 0;
		const interval = setInterval(() => {
			if (currentAttempt > maxNumberOfAttempts - 1) {
				clearInterval(interval);
				reject(new Error('Maximum number of attempts exceeded'));
			} else if ((web3Inst.provider as unknown as Web3BaseProvider).getStatus() === status) {
				clearInterval(interval);
				resolve();
			}
			// eslint-disable-next-line no-plusplus, no-param-reassign
			currentAttempt++;
		}, intervalTime);
	});
};

describe('Web3 instance', () => {
	let clientUrl: string;
	let web3: Web3;

	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
	});

	describeIf(getSystemTestProvider().includes('ipc'))(
		'Create Web3 class instance with http string providers',
		() => {
			// https://ethereum.stackexchange.com/questions/52574/how-to-connect-to-ethereum-node-geth-via-ipc-from-outside-of-docker-container
			// https://github.com/ethereum/go-ethereum/issues/17907
			it('should create instance with string of IPC provider', async () => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				// eslint-disable-next-line no-new
				const ipcProvider = new Web3.providers.IpcProvider(clientUrl);
				web3 = new Web3(ipcProvider);

				expect(web3).toBeInstanceOf(Web3);
				await waitForOpenConnection(web3);
				expect((web3.provider as unknown as IpcProvider).getStatus()).toBe('connected');
			});
		},
	);
});
