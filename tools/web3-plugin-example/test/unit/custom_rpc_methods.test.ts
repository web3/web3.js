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
import Web3 from 'web3';

import { CustomRpcMethodsPlugin } from '../../src/custom_rpc_methods';

declare module 'web3' {
	interface Web3 {
		customRpcMethods: CustomRpcMethodsPlugin;
	}
}

describe('CustomRpcMethodsPlugin Tests', () => {
	it('should register CustomRpcMethodsPlugin plugin', () => {
		const web3 = new Web3('http://127.0.0.1:8545');
		web3.registerPlugin(new CustomRpcMethodsPlugin());
		// Both CustomRpcMethodsPlugin and ContractMethodWrappersPlugin
		// redeclare the web3 module, and this seems to confuse the TypeScript server
		expect(web3.customRpcMethods).toBeDefined();
	});

	describe('CustomRpcMethodsPlugin methods tests', () => {
		const requestManagerSendSpy = jest.fn();

		let web3: Web3;

		beforeAll(() => {
			web3 = new Web3('http://127.0.0.1:8545');
			web3.registerPlugin(new CustomRpcMethodsPlugin());
			web3.requestManager.send = requestManagerSendSpy;
		});

		it('should call CustomRpcMethodsPlugin.customRpcMethod with expected RPC object', async () => {
			// Both CustomRpcMethodsPlugin and ContractMethodWrappersPlugin
			// redeclare the web3 module, and this seems to confuse the TypeScript server
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			await web3.customRpcMethods.customRpcMethod();
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'custom_rpc_method',
				params: [],
			});
		});

		it('should call CustomRpcMethodsPlugin.customRpcMethodWithParameters with expected RPC object', async () => {
			const parameter1 = 'myString';
			const parameter2 = 42;
			// Both CustomRpcMethodsPlugin and ContractMethodWrappersPlugin
			// redeclare the web3 module, and this seems to confuse the TypeScript server
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			await web3.customRpcMethods.customRpcMethodWithParameters(parameter1, parameter2);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'custom_rpc_method_with_parameters',
				params: [parameter1, parameter2],
			});
		});
	});
});
