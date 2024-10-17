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

import { AccountAbstraction, UserOperation, UserOperationRequire } from '../../src/index.js';

describe('AccountAbstraction tests', () => {
	const web3aa = new AccountAbstraction('http://127.0.0.1:8555/');
	let sendSpy: jest.SpyInstance;
	const requestManagerSendSpy = jest.fn();

	beforeAll(() => {
		// spy on private member so using any in tests only
		(web3aa as any).bundlerRequestManager.send = requestManagerSendSpy;
	});

	it('should have requestManager defined with context', () => {
		expect(web3aa.requestManager).toBeDefined();
	});

	describe('AccountAbstraction method tests', () => {
		let userOperation: UserOperation | UserOperationRequire;

		beforeEach(() => {
			userOperation = {
				sender: '0x9fd042a18e90ce326073fa70f111dc9d798d9a52',
				nonce: '123',
				initCode: '0x68656c6c6f',
				callData: '0x776F726C64',
				callGasLimit: '1000',
				verificationGasLimit: '2300',
				preVerificationGas: '3100',
				maxFeePerGas: '8500',
				maxPriorityFeePerGas: '1',
				paymasterAndData: '0x626c6f63746f',
				signature: '0x636c656d656e74',
			};
			sendSpy = jest.spyOn(web3aa, 'sendUserOperation').mockImplementation();
		});

		afterEach(() => {
			sendSpy.mockRestore();
		});

		it('should call rpcMethods.sendUserOperation with expected parameters', async () => {
			const entryPoint = '0x636c656d656e74';
			await web3aa.sendUserOperation(userOperation, entryPoint);
			expect(sendSpy).toHaveBeenCalledWith(userOperation, entryPoint);
		});

		it('should call rpcMethods.estimateUserOperationGas with expected parameters', async () => {
			const entryPoint = '0x636c656d656e74';
			const estimateSpy = jest.spyOn(web3aa, 'estimateUserOperationGas').mockImplementation();
			await web3aa.estimateUserOperationGas(userOperation, entryPoint);
			expect(estimateSpy).toHaveBeenCalledWith(userOperation, entryPoint);
			estimateSpy.mockRestore();
		});

		it('should call rpcMethods.estimateUserOperationGas should set maxFeePerGas to "0" if not provided', async () => {
			const entryPoint = '0x636c656d656e74';
			const userOperationWithoutMaxFee = {
				...userOperation,
				maxFeePerGas: undefined,
			};
			await web3aa.estimateUserOperationGas(userOperationWithoutMaxFee, entryPoint);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_estimateUserOperationGas',
				params: [
					{
						...userOperationWithoutMaxFee,
						maxFeePerGas: '0', // Ensure it's set to "0"
					},
					entryPoint,
				],
			});
		});

		it('should call rpcMethods.estimateUserOperationGas should set maxPriorityFeePerGas to "0" if not provided', async () => {
			const entryPoint = '0x636c656d656e74';
			const userOperationWithoutMaxFee = {
				...userOperation,
				maxPriorityFeePerGas: undefined,
			};
			await web3aa.estimateUserOperationGas(userOperationWithoutMaxFee, entryPoint);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_estimateUserOperationGas',
				params: [
					{
						...userOperationWithoutMaxFee,
						maxPriorityFeePerGas: '0', // Ensure it's set to "0"
					},
					entryPoint,
				],
			});
		});

		it('should call rpcMethods.getUserOperationByHash with expected parameters', async () => {
			const hash = '0xa890d7c0dccfd6cebc025919f4857ab97953ae218e82f5e24c297f02ceea5b21';
			const estimateSpy = jest.spyOn(web3aa, 'getUserOperationByHash').mockImplementation();
			await web3aa.getUserOperationByHash(hash);
			expect(estimateSpy).toHaveBeenCalledWith(hash);
			estimateSpy.mockRestore();
		});

		it('should call rpcMethods.getUserOperationReceipt with expected parameters', async () => {
			const hash = '0x123456789abcdef0123456789abcdef012345678';
			const estimateSpy = jest.spyOn(web3aa, 'getUserOperationReceipt').mockImplementation();
			await web3aa.getUserOperationReceipt(hash);
			expect(estimateSpy).toHaveBeenCalledWith(hash);
			estimateSpy.mockRestore();
		});

		it('should call rpcMethods.supportedEntryPoints with expected parameters', async () => {
			const supportedEntryPointsSendSpy = jest
				.spyOn((web3aa as any).bundlerRequestManager, 'send')
				.mockResolvedValue([
					'0xcd01C8aa8995A59eB7B2627E69b40e0524B5ecf8',
					'0x7A0A0d159218E6a2f407B99173A2b12A6DDfC2a6',
				]);

			const result = await web3aa.supportedEntryPoints();

			expect(supportedEntryPointsSendSpy).toHaveBeenCalledWith({
				method: 'eth_supportedEntryPoints',
				params: [],
			});
			expect(result).toEqual([
				'0xcd01C8aa8995A59eB7B2627E69b40e0524B5ecf8',
				'0x7A0A0d159218E6a2f407B99173A2b12A6DDfC2a6',
			]);
		});

		it('should call rpcMethods.generateUserOpHash with expected parameters', () => {
			const entryPoint = '0xaE036c65C649172b43ef7156b009c6221B596B8b';
			const chainId = '0x1';
			const expectedResult =
				'0xe554d0701f7fdc734f84927d109537f1ac4ee4ebfa3670c71d224a4fa15dbcd1';
			const result = web3aa.generateUserOpHash(
				userOperation as UserOperationRequire,
				entryPoint,
				chainId,
			);

			expect(result).toEqual(expectedResult);
		});
		it('should call rpcMethods.generateUserOpHash with throws an error when sha3 returns undefined', () => {
			const userOp = {
				sender: '0x9fd042a18e90ce326073fa70f111dc9d798d9a52',
				nonce: '123',
				initCode: '',
				callData: '0x776F726C64',
				callGasLimit: '1000',
				verificationGasLimit: '2300',
				preVerificationGas: '3100',
				maxFeePerGas: '8500',
				maxPriorityFeePerGas: '1',
				paymasterAndData: '0x626c6f63746f',
				signature: '0x636c656d656e74',
			};
			const entryPoint = '0xaE036c65C649172b43ef7156b009c6221B596B8b';
			const chainId = '0x1';

			// Expect an error to be thrown
			expect(() => web3aa.generateUserOpHash(userOp, entryPoint, chainId)).toThrow(
				'sha3 returned undefined',
			);
		});
	});
});
