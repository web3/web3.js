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
import { Web3Context } from 'web3-core';

import { CustomRpcMethodsPlugin } from '../../src/custom_rpc_methods';

describe('CustomRpcMethodsPlugin', () => {
	it('should register the plugin', () => {
		const web3Context = new Web3Context('http://127.0.0.1:8545');
		web3Context.registerPlugin(new CustomRpcMethodsPlugin());
		expect(web3Context.customRpcMethods).toBeDefined();
	});

	describe('methods', () => {
		const requestManagerSendSpy = jest.fn();

		let web3Context: Web3Context;

		beforeAll(() => {
			web3Context = new Web3Context('http://127.0.0.1:8545');
			web3Context.registerPlugin(new CustomRpcMethodsPlugin());
			web3Context.requestManager.send = requestManagerSendSpy;
		});

		it('should call `customRpcMethod` with expected RPC object', async () => {
			await web3Context.customRpcMethods.customRpcMethod();
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'custom_rpc_method',
				params: [],
			});
		});

		it('should call `customRpcMethodWithParameters` with expected RPC object', async () => {
			const parameter1 = 'myString';
			const parameter2 = 42;
			await web3Context.customRpcMethods.customRpcMethodWithParameters(
				parameter1,
				parameter2,
			);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'custom_rpc_method_with_parameters',
				params: [parameter1, parameter2],
			});
		});
	});
});
