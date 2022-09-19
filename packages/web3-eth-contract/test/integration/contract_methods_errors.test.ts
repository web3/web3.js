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

import { ContractExecutionError, ERR_CONTRACT_EXECUTION_REVERTED } from 'web3-errors';
import { Contract } from '../../src';
import { createTempAccount } from '../fixtures/system_test_utils';

describe('contract errors', () => {
	let sendOptions: Record<string, unknown>;

	beforeAll(async () => {
		const acc = await createTempAccount();
		sendOptions = { from: acc.address };
	});

	describe('Test EIP-838 Error Codes', () => {
		const addr = '0xbd0B4B009a76CA97766360F04f75e05A3E449f1E';
		it('testError1', async () => {
			const abi = [
				{
					inputs: [
						{ internalType: 'address', name: 'addr', type: 'address' },
						{ internalType: 'uint256', name: 'value', type: 'uint256' },
					],
					name: 'TestError1',
					type: 'error',
				},
				{
					inputs: [
						{ internalType: 'bool', name: 'pass', type: 'bool' },
						{ internalType: 'address', name: 'addr', type: 'address' },
						{ internalType: 'uint256', name: 'value', type: 'uint256' },
					],
					name: 'testError1',
					outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
					stateMutability: 'pure',
					type: 'function',
				},
			] as const;
			const contract = new Contract(abi, addr);
			contract.setProvider('https://ropsten.infura.io/v3/49a0efa3aaee4fd99797bfa94d8ce2f1');

			let error: ContractExecutionError | undefined;
			try {
				await contract.methods.testError1(false, addr, 42).call(sendOptions);

				// execution should throw before this line, if not throw here to indicate an issue.
			} catch (err: any) {
				error = err;
			}

			expect(error).toBeDefined();

			expect(error?.code).toEqual(ERR_CONTRACT_EXECUTION_REVERTED);
			expect(error?.innerError?.code).toBe(3);
			expect(error?.innerError?.errorArgs && error?.innerError?.errorArgs[0]).toEqual(addr);
			expect(error?.innerError?.errorArgs?.addr).toEqual(addr);
			expect(error?.innerError?.errorArgs && error?.innerError?.errorArgs[1]).toEqual(
				BigInt(42),
			);
			expect(error?.innerError?.errorArgs?.value).toEqual(BigInt(42));
			expect(error?.innerError?.errorName).toBe('TestError1');
			expect(error?.innerError?.errorSignature).toBe('TestError1(address,uint256)');
		});
	});
});
