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

import { LogsOutput } from 'web3-types';
import { Contract } from '../../src';
import { ERC20TokenAbi, ERC20TokenBytecode } from '../shared_fixtures/build/ERC20Token';
import {
	getSystemTestProvider,
	describeIf,
	isWs,
	createTempAccount,
	createNewAccount,
	refillAccount,
	signAndSendContractMethodEIP1559,
	signAndSendContractMethodEIP2930,
} from '../fixtures/system_test_utils';
import { processAsync, toUpperCaseHex } from '../shared_fixtures/utils';

const initialSupply = BigInt('5000000000');

describe('contract', () => {
	describe('erc20', () => {
		let contract: Contract<typeof ERC20TokenAbi>;
		let deployOptions: Record<string, unknown>;
		let sendOptions: Record<string, unknown>;

		beforeAll(() => {
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
			let pkAccount: { address: string; privateKey: string };
			let mainAcc: { address: string; privateKey: string };
			const prepareForTransfer = async (value: string) => {
				const tempAccount = await createTempAccount();
				await contractDeployed.methods.transfer(pkAccount.address, value).send(sendOptions);
				return tempAccount;
			};

			beforeAll(async () => {
				mainAcc = await createTempAccount();
				pkAccount = await createNewAccount();
				await refillAccount(mainAcc.address, pkAccount.address, '20000000000000000');
				sendOptions = { from: mainAcc.address, gas: '10000000' };
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
					expect(await contractDeployed.methods.decimals().call()).toBe(BigInt(18));
				});

				it('should return total supply', async () => {
					expect(await contractDeployed.methods.totalSupply().call()).toBe(initialSupply);
				});

				it('should transfer tokens', async () => {
					const acc2 = await createTempAccount();
					const value = BigInt(10);
					await contractDeployed.methods.transfer(acc2.address, value).send(sendOptions);

					expect(await contractDeployed.methods.balanceOf(acc2.address).call()).toBe(
						value,
					);
				});
				it.each([signAndSendContractMethodEIP1559, signAndSendContractMethodEIP2930])(
					'should transfer tokens with local wallet %p',
					async signAndSendContractMethod => {
						const value = BigInt(10);
						const tempAccount = await prepareForTransfer(value.toString());
						await signAndSendContractMethod(
							contract.provider,
							contractDeployed.options.address as string,
							contractDeployed.methods.transfer(tempAccount.address, value),
							pkAccount.privateKey,
						);

						expect(
							await contractDeployed.methods.balanceOf(tempAccount.address).call(),
						).toBe(value);
					},
				);

				it.each([signAndSendContractMethodEIP1559, signAndSendContractMethodEIP2930])(
					'should approve and transferFrom tokens with local wallet %p',
					async signAndSendContractMethod => {
						const value = BigInt(10);
						const transferFromValue = BigInt(4);
						const tempAccount = await prepareForTransfer(value.toString());
						// approve
						const res = await signAndSendContractMethod(
							contract.provider,
							contractDeployed.options.address as string,
							contractDeployed.methods.approve(pkAccount.address, value),
							pkAccount.privateKey,
						);

						expect(res.status).toBe(BigInt(1));
						expect(
							(res.logs as LogsOutput[])[0].topics[2].endsWith(
								pkAccount.address.substring(2),
							),
						).toBe(true);

						// transferFrom
						await signAndSendContractMethod(
							contract.provider,
							contractDeployed.options.address as string,
							contractDeployed.methods.transferFrom(
								pkAccount.address,
								tempAccount.address,
								transferFromValue,
							),
							pkAccount.privateKey,
						);
						expect(
							await contractDeployed.methods.balanceOf(tempAccount.address).call(),
						).toBe(transferFromValue);

						// allowance
						expect(
							await contractDeployed.methods
								.allowance(pkAccount.address, pkAccount.address)
								.call(),
						).toBe(value - transferFromValue);
					},
				);

				it.each([signAndSendContractMethodEIP1559, signAndSendContractMethodEIP2930])(
					'should approve and transferFrom tokens with local wallet %p',
					async signAndSendContractMethod => {
						const value = BigInt(10);
						const transferFromValue = BigInt(4);
						const tempAccount = await prepareForTransfer(value.toString());
						// approve
						await signAndSendContractMethod(
							contract.provider,
							contractDeployed.options.address as string,
							contractDeployed.methods.approve(
								tempAccount.address,
								transferFromValue,
							),
							tempAccount.privateKey,
						);

						// allowance
						expect(
							await contractDeployed.methods
								.allowance(tempAccount.address, tempAccount.address)
								.call(),
						).toBe(transferFromValue);

						// increaseAllowance
						await signAndSendContractMethod(
							contract.provider,
							contractDeployed.options.address as string,
							contractDeployed.methods.increaseAllowance(
								tempAccount.address,
								transferFromValue,
							),
							tempAccount.privateKey,
						);

						// allowance
						expect(
							await contractDeployed.methods
								.allowance(tempAccount.address, tempAccount.address)
								.call(),
						).toBe(transferFromValue + transferFromValue);
					},
				);
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
						value: BigInt(100),
					});
				});
			});
		});
	});
});
