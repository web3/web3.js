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

import { externalWssStringProvider } from '../../fixtures/config';

import { Web3 } from '../../../src/index';

describe('Web3 instance', () => {
	describe('Create Web3 class instance with string providers', () => {
		let web3: Web3;
		async function waitForSocketState(web3Inst: Web3, state: string) {
			return new Promise<void>(resolve => {
				setTimeout(() => {
					if ((web3Inst.currentProvider as Web3BaseProvider).getStatus() === state) {
						resolve();
					} else {
						// eslint-disable-next-line @typescript-eslint/no-empty-function
						waitForSocketState(web3Inst, state).then(resolve, () => {});
					}
				}, 5);
			});
		}
		afterEach(async () => {
			(web3.currentProvider as Web3BaseProvider).disconnect(1000, 'done');
			await waitForSocketState(web3, 'disconnected');
		});

		it('should create instance with string of ws provider', async () => {
			web3 = new Web3(externalWssStringProvider);
			expect(web3).toBeInstanceOf(Web3);
			await waitForSocketState(web3, 'connected');
		});
	});
});
