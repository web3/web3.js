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

import { generateUserOpHash } from '../../../src/utils/generate_useroperation_hash';

jest.mock('web3-rpc-methods');

describe('generateUserOpHash', () => {
	it('generates the correct hash for a valid UserOperation object', () => {
		const userOp = {
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

		const entryPoint = '0xaE036c65C649172b43ef7156b009c6221B596B8b';
		const chainId = '0x1';
		const result = generateUserOpHash(userOp, entryPoint, chainId);
		const expectedResult = '0xe554d0701f7fdc734f84927d109537f1ac4ee4ebfa3670c71d224a4fa15dbcd1';

		expect(result).toEqual(expectedResult);
	});
	it('throws an error when sha3 returns undefined', () => {
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
		expect(() => generateUserOpHash(userOp, entryPoint, chainId)).toThrow(
			'sha3 returned undefined',
		);
	});
});
