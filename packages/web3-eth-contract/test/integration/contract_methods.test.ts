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
import { basicContractAbi, basicContractByteCode } from '../shared_fixtures/sources/Basic';
// eslint-disable-next-line import/no-relative-packages
import { accounts, clientWsUrl } from '../../../../.github/test.config';

describe('contract', () => {
	let contract: Contract<typeof basicContractAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;

	beforeEach(async () => {
		contract = new Contract(basicContractAbi, undefined, {
			provider: clientWsUrl,
		});

		deployOptions = {
			data: basicContractByteCode,
			arguments: [10, 'string init value'],
		};

		sendOptions = { from: accounts[0].address, gas: '1000000' };

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
					return expect(contract.methods.reverts().call()).rejects.toEqual(
						expect.objectContaining({
							error: expect.objectContaining({
								message: expect.stringContaining('REVERTED WITH REVERT'),
							}),
						}),
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
					expect.objectContaining({ status: '0x1', transactionHash: expect.any(String) }),
				);
			});

			it('should returns a receipt (EIP-1559, maxFeePerGas and maxPriorityFeePerGas specified)', async () => {
				const receipt = await contract.methods.setValues(1, 'string value', true).send({
					...sendOptions,
					maxFeePerGas: '0x59682F00', // 1.5 Gwei
					maxPriorityFeePerGas: '0x1DCD6500', // .5 Gwei
					type: '0x2',
				});

				expect(receipt).toEqual(
					expect.objectContaining({ status: '0x1', transactionHash: expect.any(String) }),
				);
			});

			// TODO: Get and match the revert error message
			it('should returns errors on reverts', async () => {
				return expect(contract.methods.reverts().send(sendOptions)).rejects.toEqual(
					expect.objectContaining({ status: '0x0', transactionHash: expect.any(String) }),
				);
			});
		});
	});
});
