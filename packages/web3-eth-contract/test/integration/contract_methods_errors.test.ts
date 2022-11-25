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
import { VendingMachineAbi, VendingMachineBytecode } from '../shared_fixtures/build/VendingMachine';
import { Contract } from '../../src';
import { getSystemTestProvider, createTempAccount } from '../fixtures/system_test_utils';

describe('contract errors', () => {
	let sendOptions: Record<string, unknown>;
	let contract: Contract<typeof VendingMachineAbi>;
	let deployOptions: Record<string, unknown>;

	let deployedContract: Contract<typeof VendingMachineAbi>;

	beforeAll(async () => {
		const acc = await createTempAccount();
		sendOptions = { from: acc.address };
		// sendOptions = { from: '0xe2597eb05cf9a87eb1309e86750c903ec38e527e' };

		contract = new Contract(VendingMachineAbi, undefined, {
			provider: getSystemTestProvider(),
		});

		deployOptions = {
			data: VendingMachineBytecode,
		};

		const sendOptionsLocal = { from: acc.address, gas: '10000000' };
		deployedContract = await contract.deploy(deployOptions).send(sendOptionsLocal);

		// console.log(deployedContract['_address'], acc);
		// console.log(getSystemTestProvider());
		contract.setProvider(getSystemTestProvider());
	});

	describe('Test EIP-838 Error Codes', () => {
		// const addr = '0xbd0B4B009a76CA97766360F04f75e05A3E449f1E';
		// The following will be updated when implementing https://github.com/web3/web3.js/issues/5482
		it('testError1', async () => {
			let error: ContractExecutionError | undefined;
			try {
				await deployedContract.methods.withdraw().send(sendOptions);

				// execution should throw before this line, if not throw here to indicate an issue.
			} catch (err: any) {
				error = err;
			}

			expect(error).toBeDefined();

			// eslint-disable-next-line no-console
			console.log(error);

			// expect(error?.code).toEqual(ERR_CONTRACT_EXECUTION_REVERTED);
			// expect(error?.innerError?.code).toBe(3);
			// expect(error?.innerError?.errorArgs && error?.innerError?.errorArgs[0]).toEqual(addr);
			// expect(error?.innerError?.errorArgs?.addr).toEqual(addr);
			// expect(error?.innerError?.errorArgs && error?.innerError?.errorArgs[1]).toEqual(
			// 	BigInt(42),
			// );
			// expect(error?.innerError?.errorArgs?.value).toEqual(BigInt(42));
			// expect(error?.innerError?.errorName).toBe('TestError1');
			// expect(error?.innerError?.errorSignature).toBe('TestError1(address,uint256)');

			// TODO: use something similar to the following (when implementing https://github.com/web3/web3.js/issues/5482)
			// expect(error).toMatchObject({
			// 	message: expect.stringContaining(
			// 		'Error happened while trying to execute a function inside a smart contract',
			// 	),
			// 	code: ERR_CONTRACT_EXECUTION_REVERTED,
			// 	error: {
			// 		innerError: {
			// 			code: 3,
			// 			// errorArgs: {
			// 			// 	0: addr,
			// 			// 	1: BigInt(42),
			// 			// 	addr,
			// 			// 	value: 42,
			// 			// },
			// 			errorName: 'TestError1',
			// 			errorSignature: 'TestError1(address,uint256)',
			// 		},
			// 	},
			// });
		});
	});
});
