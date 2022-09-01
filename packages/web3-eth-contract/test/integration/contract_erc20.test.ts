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
import { ERC20TokenAbi, ERC20TokenBytecode } from '../shared_fixtures/build/ERC20Token';
import {
	getSystemTestProvider,
	describeIf,
	isWs,
	createTempAccount,
} from '../fixtures/system_test_utils';
import { processAsync, toUpperCaseHex } from '../shared_fixtures/utils';

const initialSupply = '5000000000';

describe('contract', () => {
	describe('erc20', () => {
		let contract: Contract<typeof ERC20TokenAbi>;
		let deployOptions: Record<string, unknown>;
		let sendOptions: Record<string, unknown>;

		beforeAll(async () => {
			contract = new Contract(ERC20TokenAbi, undefined, {
				provider: getSystemTestProvider(),
			});

			deployOptions = {
				data: ERC20TokenBytecode,
				arguments: [initialSupply],
			};
		});

		it('should deploy the contract', async () => {
			const acc = await createTempAccount();
			const sendOptionsLocal = { from: acc.address, gas: '10000000' };
			await expect(
				contract.deploy(deployOptions).send(sendOptionsLocal),
			).resolves.toBeDefined();
		});

		describe('contract instance', () => {
			let contractDeployed: Contract<typeof ERC20TokenAbi>;
			beforeAll(async () => {
				const acc = await createTempAccount();
				sendOptions = { from: acc.address, gas: '10000000' };
				contractDeployed = await contract.deploy(deployOptions).send(sendOptions);
			});
			describe('methods', () => {
				it('should return the name', async () => {
					expect(await contractDeployed.methods.name().call()).toBe('Gold');
				});

				it('should return the symbol', async () => {
					expect(await contractDeployed.methods.symbol().call()).toBe('GLD');
				});

				it('should return the decimals', async () => {
					expect(await contractDeployed.methods.decimals().call()).toBe('18');
				});

				it('should return total supply', async () => {
					expect(await contractDeployed.methods.totalSupply().call()).toBe(initialSupply);
				});

				it('should transfer tokens', async () => {
					const acc2 = await createTempAccount();
					await contractDeployed.methods.transfer(acc2.address, '10').send(sendOptions);

					expect(await contractDeployed.methods.balanceOf(acc2.address).call()).toBe(
						'10',
					);
				});
			});

			describeIf(isWs)('events', () => {
				it('should emit transfer event', async () => {
					const acc2 = await createTempAccount();
					await expect(
						processAsync(async resolve => {
							const event = contractDeployed.events.Transfer();
							event.on('data', data => {
								resolve({
									from: toUpperCaseHex(data.returnValues.from as string),
									to: toUpperCaseHex(data.returnValues.to as string),
									value: data.returnValues.value,
								});
							});

							await contractDeployed.methods
								.transfer(acc2.address, '100')
								.send(sendOptions);
						}),
					).resolves.toEqual({
						from: toUpperCaseHex(sendOptions.from as string),
						to: toUpperCaseHex(acc2.address),
						value: '100',
					});
				});
			});
		});
	});
});
