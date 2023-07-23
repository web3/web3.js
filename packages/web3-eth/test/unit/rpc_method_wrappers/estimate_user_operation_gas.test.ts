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
import { format } from 'web3-utils';
import {
	DEFAULT_RETURN_FORMAT,
	FMT_BYTES,
	FMT_NUMBER,
	EthExecutionAPI,
	Address,
	UserOperation,
} from 'web3-types';
import { ethRpcMethods } from 'web3-rpc-methods';
import { estimateUserOperationGas } from '../../../src/rpc_method_wrappers';

jest.mock('web3-rpc-methods');

describe('estimateUserOperationGas', () => {
	let web3Context: Web3Context<EthExecutionAPI>;
	let userOperation: UserOperation;
	let entryPoint: Address;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
		userOperation = {
			sender: '0x9fd042a18e90ce326073fa70f111dc9d798d9a52',
			nonce: '123',
			initCode: '0x68656c6c6f',
			callData: '0x776F726C64',
			callGasLimit: '1000',
			verificationGasLimit: '2300',
			preVerificationGas: '3100',
			maxFeePerGas: '0',
			maxPriorityFeePerGas: '0',
			paymasterAndData: '0x626c6f63746f',
			signature: '0x636c656d656e74',
		};
		entryPoint = '0x636c656d656e74';
	});

	it('should call rpcMethods.estimateUserOperationGas with expected parameters', async () => {
		await estimateUserOperationGas(
			web3Context,
			userOperation,
			entryPoint,
			DEFAULT_RETURN_FORMAT,
		);
		expect(ethRpcMethods.sendUserOperation).toHaveBeenCalledWith(
			web3Context.requestManager,
			userOperation,
			entryPoint,
		);
	});

	it('should format mockRpcResponse using provided return format', async () => {
		const mockRpcResponse =
			'0xe554d0701f7fdc734f84927d109537f1ac4ee4ebfa3670c71d224a4fa15dbcd1';
		const expectedReturnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.UINT8ARRAY };
		const expectedFormattedResult = format(
			{ format: 'uint' },
			mockRpcResponse,
			expectedReturnFormat,
		);
		(ethRpcMethods.sendUserOperation as jest.Mock).mockResolvedValueOnce(mockRpcResponse);

		const result = await estimateUserOperationGas(
			web3Context,
			userOperation,
			entryPoint,
			expectedReturnFormat,
		);
		expect(result).toBe(expectedFormattedResult);
	});
});
