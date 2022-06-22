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
import { Contract } from '../../src';
import { BasicAbi, BasicBytecode } from '../shared_fixtures/build/Basic';
import { getSystemTestProvider, getSystemTestAccounts } from '../fixtures/system_test_utils';

describe('contract', () => {
	let contract: Contract<typeof BasicAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;
	let accounts: string[];

	beforeEach(async () => {
		contract = new Contract(BasicAbi, undefined, {
			provider: getSystemTestProvider(),
		});

		accounts = await getSystemTestAccounts();

		deployOptions = {
			data: BasicBytecode,
			arguments: [10, 'string init value'],
		};

		sendOptions = { from: accounts[0], gas: '1000000' };

		contract = await contract.deploy(deployOptions).send(sendOptions);
	});

	describe('methods', () => {
		describe('call', () => {
			it('should retrieve the values', async () => {
				const result = await contract.methods.getValues().call();

				expect(result).toEqual(['10', 'string init value', false]);
			});

			describe('revert handling', () => {
				it('should returns the expected revert reason string', async () => {
					return expect(contract.methods.reverts().call()).rejects.toThrow(
						'REVERTED WITH REVERT',
					);
				});
			});
		});

		describe('send', () => {
			it('should returns a receipt', async () => {
				const receipt = await contract.methods
					.setValues(1, 'string value', true)
					.send(sendOptions);

				expect(receipt).toEqual(
					expect.objectContaining({
						// status: BigInt(1),
						transactionHash: expect.any(String),
					}),
				);

				// To avoid issue with the `objectContaining` and `cypress` had to add
				// these expectations explicitly on each attribute
				expect(receipt.status).toEqual(BigInt(1));
			});

			it('should returns a receipt (EIP-1559, maxFeePerGas and maxPriorityFeePerGas specified)', async () => {
				const receipt = await contract.methods.setValues(1, 'string value', true).send({
					...sendOptions,
					maxFeePerGas: '0x59682F00', // 1.5 Gwei
					maxPriorityFeePerGas: '0x1DCD6500', // .5 Gwei
					type: '0x2',
				});

				expect(receipt).toEqual(
					expect.objectContaining({
						// status: BigInt(1),
						transactionHash: expect.any(String),
					}),
				);

				// To avoid issue with the `objectContaining` and `cypress` had to add
				// these expectations explicitly on each attribute
				expect(receipt.status).toEqual(BigInt(1));
			});

			// TODO: Get and match the revert error message
			it('should returns errors on reverts', async () => {
				try {
					await contract.methods.reverts().send(sendOptions);
				} catch (receipt: any) {
					// eslint-disable-next-line jest/no-conditional-expect
					expect(receipt).toEqual(
						expect.objectContaining({
							transactionHash: expect.any(String),
						}),
					);

					// To avoid issue with the `objectContaining` and `cypress` had to add
					// these expectations explicitly on each attribute
					// eslint-disable-next-line jest/no-conditional-expect
					expect(receipt.status).toEqual(BigInt(0));
				}

				expect.assertions(2);
			});
		});
	});
});
