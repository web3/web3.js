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

import { Net } from '../../src';
import * as rpcMethodWrappers from '../../src/rpc_method_wrappers';
import { getDataFormat } from '../fixtures/web3_net_methods';

jest.mock('../../src/rpc_method_wrappers');

describe('web3_eth_methods', () => {
	let web3Net: Net;

	beforeAll(() => {
		web3Net = new Net('http://127.0.0.1:8545');
	});

	describe('should call RPC method', () => {
		describe('getId', () => {
			it.each(getDataFormat)('returnType: %s', async returnType => {
				await web3Net.getId(returnType);
				expect(rpcMethodWrappers.getId).toHaveBeenCalledWith(web3Net, returnType);
			});
		});

		describe('getPeerCount', () => {
			it.each(getDataFormat)('returnType: %s', async returnType => {
				await web3Net.getPeerCount(returnType);
				expect(rpcMethodWrappers.getPeerCount).toHaveBeenCalledWith(web3Net, returnType);
			});
		});

		it('isListening', async () => {
			await web3Net.isListening();
			expect(rpcMethodWrappers.isListening).toHaveBeenCalledWith(web3Net);
		});
	});
});
