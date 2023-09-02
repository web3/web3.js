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
import { estimateUserOperationGasSchema } from '../../../src/schemas';

jest.mock('web3-rpc-methods');

describe('estimateUserOperationGas', () => {
	let web3Context: Web3Context<EthExecutionAPI>;
	let userOperation: UserOperation;
	let entryPoint: Address;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
		userOperation = {
			sender: '0x026B37A09aF3ceB346c39999c5738F86A1a48f4d',
			nonce: '123',
			initCode: '0x68656c6c6f',
			callData:
				'b61d27f600000000000000000000000000005ea00ac477b1030ce78506496e8c2de24bf5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000084161ac21f000000000000000000000000fd8ec18d48ac1f46b600e231da07d1da8209ceef0000000000000000000000000000a26b00c1f0df003000390027140000faa7190000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000',
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
		expect(ethRpcMethods.estimateUserOperationGas).toHaveBeenCalledWith(
			web3Context.requestManager,
			userOperation,
			entryPoint,
		);
	});

	it('should format mockRpcResponse using provided return format', async () => {
		const mockRpcResponse = {
			preVerificationGas: '0xdf17',
			verificationGasLimit: '0x128c4',
			callGasLimit: '0x18b33',
		};
		const expectedReturnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.UINT8ARRAY };
		const expectedFormattedResult = format(
			estimateUserOperationGasSchema,
			mockRpcResponse,
			expectedReturnFormat,
		);
		(ethRpcMethods.estimateUserOperationGas as jest.Mock).mockResolvedValueOnce(
			mockRpcResponse,
		);

		const result = await estimateUserOperationGas(
			web3Context,
			userOperation,
			entryPoint,
			expectedReturnFormat,
		);
		expect(result).toEqual(expectedFormattedResult);
	});

	it('should set maxFeePerGas to "0" if not provided', async () => {
		const userOperationWithoutMaxFee = {
			...userOperation,
			maxFeePerGas: undefined,
		};
		await estimateUserOperationGas(
			web3Context,
			userOperationWithoutMaxFee,
			entryPoint,
			DEFAULT_RETURN_FORMAT,
		);
		expect(ethRpcMethods.estimateUserOperationGas).toHaveBeenCalledWith(
			web3Context.requestManager,
			expect.objectContaining({
				...userOperationWithoutMaxFee,
				maxFeePerGas: '0', // Ensure it's set to "0"
			}),
			entryPoint,
		);
	});

	it('should set maxPriorityFeePerGas to "0" if not provided', async () => {
		const userOperationWithoutMaxPriorityFee = {
			...userOperation,
			maxPriorityFeePerGas: undefined,
		};
		await estimateUserOperationGas(
			web3Context,
			userOperationWithoutMaxPriorityFee,
			entryPoint,
			DEFAULT_RETURN_FORMAT,
		);
		expect(ethRpcMethods.estimateUserOperationGas).toHaveBeenCalledWith(
			web3Context.requestManager,
			expect.objectContaining({
				...userOperationWithoutMaxPriorityFee,
				maxPriorityFeePerGas: '0', // Ensure it's set to "0"
			}),
			entryPoint,
		);
	});
});
