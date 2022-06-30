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
	getSystemTestAccounts,
	describeIf,
	isWs,
} from '../fixtures/system_test_utils';
import { processAsync, toUpperCaseHex } from '../shared_fixtures/utils';

const initialSupply = '5000000000';

describe('contract', () => {
	describe('erc20', () => {
		let contract: Contract<typeof ERC20TokenAbi>;
		let deployOptions: Record<string, unknown>;
		let sendOptions: Record<string, unknown>;
		let accounts: string[];

		beforeAll(async () => {
			contract = new Contract(ERC20TokenAbi, undefined, {
				provider: getSystemTestProvider(),
			});

			accounts = await getSystemTestAccounts();

			deployOptions = {
				data: ERC20TokenBytecode,
				arguments: [initialSupply],
			};

			sendOptions = { from: accounts[0], gas: '10000000' };
		});

		it('should deploy the contract', async () => {
			await expect(contract.deploy(deployOptions).send(sendOptions)).resolves.toBeDefined();
		});

		describe('contract instance', () => {
			beforeAll(async () => {
				contract = await contract.deploy(deployOptions).send(sendOptions);
			});

			describe('methods', () => {
				it('should return the name', async () => {
					expect(await contract.methods.name().call()).toBe('Gold');
				});

				it('should return the symbol', async () => {
					expect(await contract.methods.symbol().call()).toBe('GLD');
				});

				it('should return the decimals', async () => {
					expect(await contract.methods.decimals().call()).toBe('18');
				});

				it('should return total supply', async () => {
					expect(await contract.methods.totalSupply().call()).toBe(initialSupply);
				});

				it('should transfer tokens', async () => {
					await contract.methods.transfer(accounts[1], '100000').send(sendOptions);

					expect(await contract.methods.balanceOf(accounts[1]).call()).toBe('100000');
				});
			});

			describeIf(isWs)('events', () => {
				it('should emit transfer event', async () => {
					await expect(
						processAsync(async resolve => {
							const event = await contract.events.Transfer();
							event.on('data', data => {
								resolve({
									from: toUpperCaseHex(data.returnValue.from as string),
									to: toUpperCaseHex(data.returnValue.to as string),
									value: data.returnValue.value,
								});
							});

							await contract.methods
								.transfer(accounts[1], '100000')
								.send(sendOptions);
						}),
					).resolves.toEqual({
						from: toUpperCaseHex(sendOptions['from'] as string),
						to: toUpperCaseHex(accounts[1]),
						value: '100000',
					});
				});
			});
		});
	});
});
