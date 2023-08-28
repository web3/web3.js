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

// eslint-disable-next-line import/no-extraneous-dependencies
import Web3 from 'web3';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Web3Account } from 'web3-eth-accounts';
import { Contract } from '../../../src';
import { ERC20TokenAbi, ERC20TokenBytecode } from '../../shared_fixtures/build/ERC20Token';
import { getSystemTestProvider, createLocalAccount } from '../../fixtures/system_test_utils';

const initialSupply = BigInt('5000000000');

describe('contract', () => {
	describe('erc20', () => {
		let contract: Contract<typeof ERC20TokenAbi>;
		let sendOptions: Record<string, unknown>;
		let deployOptions: Record<string, unknown>;
		let localAccount: Web3Account;
		let web3: Web3;
		let contractDeployed: Contract<typeof ERC20TokenAbi>;

		beforeAll(async () => {
			web3 = new Web3(getSystemTestProvider());
			localAccount = await createLocalAccount(web3);
			contract = new web3.eth.Contract(ERC20TokenAbi) as unknown as Contract<
				typeof ERC20TokenAbi
			>;

			deployOptions = {
				data: ERC20TokenBytecode,
				arguments: [initialSupply],
			};

			sendOptions = {
				from: localAccount.address,
				gas: '2000000',
			};
			contractDeployed = await contract.deploy(deployOptions).send(sendOptions);
		});

		it('should deploy the contract', () => {
			expect(contractDeployed.options.address).toBeDefined();
		});

		it.each(['0x1', '0x2'])('should transfer tokens %p', async type => {
			const acc = web3.eth.accounts.create();
			const value = BigInt(10);

			await contractDeployed.methods.transfer(acc.address, value).send({
				...sendOptions,
				type,
			});

			expect(await contractDeployed.methods.balanceOf(acc.address).call()).toBe(value);
		});

		it.each(['0x1', '0x2'])('should approve and transferFrom tokens %p', async type => {
			const value = BigInt(10);
			const transferFromValue = BigInt(4);
			const tempAccount = await createLocalAccount(web3);
			// approve
			await contractDeployed.methods
				.approve(tempAccount.address, value)
				.send({ ...sendOptions, type });

			// transferFrom
			await contractDeployed.methods
				.transferFrom(localAccount.address, tempAccount.address, transferFromValue)
				.send({ ...sendOptions, from: tempAccount.address, type });

			expect(await contractDeployed.methods.balanceOf(tempAccount.address).call()).toBe(
				transferFromValue,
			);

			// allowance
			expect(
				await contractDeployed.methods
					.allowance(localAccount.address, tempAccount.address)
					.call(),
			).toBe(value - transferFromValue);
		});

		it.each(['0x1', '0x2'])('should increase allowance %p', async type => {
			const value = BigInt(10);
			const extraAmount = BigInt(4);
			const tempAccount = await createLocalAccount(web3);

			// approve
			await contractDeployed.methods
				.approve(tempAccount.address, value)
				.send({ ...sendOptions, type });

			// allowance
			expect(
				await contractDeployed.methods
					.allowance(localAccount.address, tempAccount.address)
					.call(),
			).toBe(value);

			// increaseAllowance
			await contractDeployed.methods
				.increaseAllowance(tempAccount.address, extraAmount)
				.send({ ...sendOptions, from: localAccount.address, type, gas: '2000000' });

			// check allowance
			expect(
				await contractDeployed.methods
					.allowance(localAccount.address, tempAccount.address)
					.call(),
			).toBe(value + extraAmount);
		});
	});
});
