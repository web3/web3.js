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
import { ErrorsContractAbi, ErrorsContractBytecode } from '../shared_fixtures/build/ErrorsContract';
import { Contract } from '../../src';
import {
	getSystemTestProvider,
	createTempAccount,
	getSystemTestBackend,
	describeIf,
} from '../fixtures/system_test_utils';

describe('contract errors', () => {
	let sendOptions: Record<string, unknown>;
	let contract: Contract<typeof ErrorsContractAbi>;
	let deployOptions: Record<string, unknown>;

	let deployedContract: Contract<typeof ErrorsContractAbi>;

	beforeAll(async () => {
		const acc = await createTempAccount();
		sendOptions = { from: acc.address };

		contract = new Contract(ErrorsContractAbi, undefined, {
			provider: getSystemTestProvider(),
		});

		deployOptions = {
			data: ErrorsContractBytecode,
		};

		const sendOptionsLocal = { from: acc.address, gas: '10000000' };
		deployedContract = await contract.deploy(deployOptions).send(sendOptionsLocal);

		contract.setProvider(getSystemTestProvider());
	});

	describeIf(getSystemTestBackend() === 'geth')('Test EIP-838 Error Codes', () => {
		it('Unauthorized', async () => {
			let error: ContractExecutionError | undefined;
			try {
				await deployedContract.methods.unauthorize().send(sendOptions);

				// execution should throw before this line, if not throw here to indicate an issue.
			} catch (err: any) {
				error = err;
			}

			expect(error).toBeDefined();

			expect(error).toMatchObject({
				message: expect.stringContaining(
					'Error happened while trying to execute a function inside a smart contract',
				),
				code: ERR_CONTRACT_EXECUTION_REVERTED,
				innerError: {
					errorName: 'Unauthorized',
					errorSignature: 'Unauthorized()',
				},
			});
		});

		it('Error with parameter', async () => {
			let error: ContractExecutionError | undefined;
			try {
				await deployedContract.methods.badRequire().send(sendOptions);

				// execution should throw before this line, if not throw here to indicate an issue.
			} catch (err: any) {
				error = err;
			}

			expect(error).toBeDefined();

			expect(error).toMatchObject({
				message: expect.stringContaining(
					'Error happened while trying to execute a function inside a smart contract',
				),
				code: ERR_CONTRACT_EXECUTION_REVERTED,
				innerError: {
					errorName: 'CustomError',
					errorSignature: 'CustomError(string)',
					errorArgs: {
						0: 'reverted using custom Error',
					},
				},
			});
		});
	});
});
