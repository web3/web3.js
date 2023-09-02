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
	HexStringBytes,
} from 'web3-types';
import { ethRpcMethods } from 'web3-rpc-methods';
import { getUserOperationByHash } from '../../../src/rpc_method_wrappers';
import { userOperationSchema } from '../../../src/schemas';

jest.mock('web3-rpc-methods');

describe('getUserOperationByHash', () => {
	let web3Context: Web3Context<EthExecutionAPI>;
	let hash: HexStringBytes;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
		hash = '0xa890d7c0dccfd6cebc025919f4857ab97953ae218e82f5e24c297f02ceea5b21';
	});

	it('should call ethRpcMethods.getUserOperationByHash with expected parameters', async () => {
		await getUserOperationByHash(web3Context, hash, DEFAULT_RETURN_FORMAT);
		expect(ethRpcMethods.getUserOperationByHash).toHaveBeenCalledWith(
			web3Context.requestManager,
			hash,
		);
	});

	it('should format mockRpcResponse using provided return format', async () => {
		const mockRpcResponse = {
			userOperation: {
				sender: '0x026b37a09af3ceb346c39999c5738f86a1a48f4d',
				nonce: '0x7',
				initCode: '0x',
				callData:
					'0xb61d27f600000000000000000000000000005ea00ac477b1030ce78506496e8c2de24bf5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000084161ac21f000000000000000000000000fd8ec18d48ac1f46b600e231da07d1da8209ceef0000000000000000000000000000a26b00c1f0df003000390027140000faa7190000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000',
				callGasLimit: '0x18b33',
				verificationGasLimit: '0x128c4',
				preVerificationGas: '0xdf17',
				maxFeePerGas: '0x8f0d1834',
				maxPriorityFeePerGas: '0x8f0d1834',
				paymasterAndData:
					'0xa312d8d37be746bd09cbd9e9ba2ef16bc7da48ff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064f21687ecfdd082749bfde7f5bf3825a568996dfec60a4ef45e87adce9d9f99bc2d616e7098ca263a497d734e8752a99e21d0ccbcf07c2216f2aa75015bf1904c72a46b1c',
				signature:
					'0xee5f9dce70bc9f00c3870b1d06fd78b20004617ffff2f874ef4a1e0a9bf4d04d4766053b8b1f3c4345437e553f0e58af23568e244c2b28b6b86cdf04176989111b2ef26907bb154c02f226f27cea48cbe87cfcc53a074e9c2e9e8d97717d33876673533c367dcae0d727b9a0ca0e92b312e448ee067232231178319a8534c035e51b',
			},
			entryPoint: '0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789',
			blockNumber: 39642225,
			blockHash: '0x638a175940cacb33f35e265961b164b14aa77477438340e635b227752f31981f',
			transactionHash: '0xc3e64ac247ae2343335596e106d1b97e35637656e1b99b37977a4165b34aeeb4',
		};
		const expectedReturnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.UINT8ARRAY };
		const expectedFormattedResult = format(
			userOperationSchema,
			mockRpcResponse,
			expectedReturnFormat,
		);
		(ethRpcMethods.getUserOperationByHash as jest.Mock).mockResolvedValueOnce(mockRpcResponse);

		const result = await getUserOperationByHash(web3Context, hash, expectedReturnFormat);
		expect(result).toEqual(expectedFormattedResult);
	});
});
