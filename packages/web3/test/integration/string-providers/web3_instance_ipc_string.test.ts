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
import path from 'path';
import { ipcStringProvider } from '../../fixtures/config';
import { Web3 } from '../../../src/index';

describe.skip('Web3 instance', () => {
	describe('Create Web3 class instance with string providers', () => {
		// https://ethereum.stackexchange.com/questions/52574/how-to-connect-to-ethereum-node-geth-via-ipc-from-outside-of-docker-container
		// https://github.com/ethereum/go-ethereum/issues/17907
		it('should create instance with string of IPC provider', () => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			// eslint-disable-next-line no-new
			const fullIpcPath = path.join(__dirname, ipcStringProvider);
			const ipcProvider = new Web3.providers.IpcProvider(fullIpcPath);
			const web3 = new Web3(ipcProvider);
			expect(web3).toBeInstanceOf(Web3);
		});
	});
});
