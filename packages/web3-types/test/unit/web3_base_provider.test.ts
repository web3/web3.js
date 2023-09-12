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

import {
	EthExecutionAPI,
	JsonRpcResponseWithResult,
	Web3APIMethod,
	Web3APIPayload,
	Web3APIReturnType,
	Web3BaseProvider,
} from '../../src/index.js';

// @ts-expect-error mock class for testing. The abstract methods are not implemented.
class Web3ChildProvider extends Web3BaseProvider {
	// eslint-disable-next-line class-methods-use-this
	public async request<
		Method extends Web3APIMethod<EthExecutionAPI>,
		ResultType = Web3APIReturnType<EthExecutionAPI, Method> | unknown,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	>(_: Web3APIPayload<EthExecutionAPI, Method>): Promise<JsonRpcResponseWithResult<ResultType>> {
		return new Promise(resolve =>
			// eslint-disable-next-line no-promise-executor-return
			resolve({
				jsonrpc: '2.0',
				id: 1,
				result: 'result' as unknown as ResultType,
			}),
		);
	}
}

describe('Web3BaseProvider', () => {
	it('asEIP1193Provider will fix the returned result of the request method', async () => {
		const childProvider = new Web3ChildProvider();
		const returnValue = await childProvider.request({ method: 'eth_getBalance' });
		expect(returnValue.result).toBe('result');

		const eip1193CompatibleClass = childProvider.asEIP1193Provider();
		const returnValue2 = await eip1193CompatibleClass.request({
			method: 'eth_getBalance',
		});
		expect(returnValue2).toBe('result');
	});

	it('asEIP1193Provider would not be available inside the newly generated class', () => {
		const childProvider = new Web3ChildProvider();

		const eip1193CompatibleClass = childProvider.asEIP1193Provider();
		expect((eip1193CompatibleClass as any).asEIP1193Provider).toBeUndefined();
	});
});
