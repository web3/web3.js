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
import { sleep } from '../shared_fixtures/utils';
import { GreeterBytecode, GreeterAbi } from '../shared_fixtures/build/Greeter';
import { DeployRevertAbi, DeployRevertBytecode } from '../shared_fixtures/build/DeployRevert';
import { getSystemTestProvider, isWs, createTempAccount } from '../fixtures/system_test_utils';

describe('contract', () => {
	describe('deploy', () => {
		let contract: Contract<typeof GreeterAbi>;
		let deployOptions: Record<string, unknown>;
		let sendOptions: Record<string, unknown>;
		let acc: { address: string; privateKey: string };

		beforeEach(async () => {
			contract = new Contract(GreeterAbi, undefined, {
				provider: getSystemTestProvider(),
			});

			acc = await createTempAccount();

			deployOptions = {
				data: GreeterBytecode,
				arguments: ['My Greeting'],
			};

			sendOptions = { from: acc.address, gas: '1000000' };
		});

		it('should deploy the contract', async () => {
			const deployedContract = await contract.deploy(deployOptions).send(sendOptions);

			expect(deployedContract).toBeDefined();
		});

		it('should deploy the contract if data is provided at initiation', async () => {
			contract = new Contract(GreeterAbi, {
				provider: getSystemTestProvider(),
				data: GreeterBytecode,
				from: acc.address,
				gas: '1000000',
			});
			const deployedContract = await contract.deploy({ arguments: ['Hello World'] }).send();

			expect(deployedContract).toBeDefined();
		});

		it('should return instance of the contract', async () => {
			const deployedContract = await contract.deploy(deployOptions).send(sendOptions);

			expect(deployedContract).toBeInstanceOf(Contract);
		});

		it('should set contract address on new contract instance', async () => {
			const deployedContract = await contract.deploy(deployOptions).send(sendOptions);

			expect(deployedContract.options.address).toBeDefined();
		});

		it('should emit the "confirmation" event', async () => {
			const confirmationHandler = jest.fn();

			await contract
				.deploy(deployOptions)
				.send(sendOptions)
				.on('confirmation', confirmationHandler);

			// Wait for sometime to allow the transaction to be processed
			await sleep(500);

			// Deploy once again to trigger block mining to trigger confirmation
			// We can send any other transaction as well
			await contract.deploy(deployOptions).send(sendOptions);

			// Wait for some fraction of time to trigger the handler
			// On http we use polling to get confirmation, so wait a bit longer
			await sleep(isWs ? 500 : 2000);

			// eslint-disable-next-line jest/no-standalone-expect
			expect(confirmationHandler).toHaveBeenCalled();
		});

		it('should emit the "transactionHash" event', async () => {
			const handler = jest.fn();

			const promiEvent = contract
				.deploy(deployOptions)
				.send(sendOptions)
				.on('transactionHash', handler);

			// Deploy the contract
			await promiEvent;

			expect(handler).toHaveBeenCalled();
		});

		it('should emit the "sending" event', async () => {
			const handler = jest.fn();

			const promiEvent = contract
				.deploy(deployOptions)
				.send(sendOptions)
				.on('sending', handler);

			// Deploy the contract
			await promiEvent;

			expect(handler).toHaveBeenCalled();
		});

		it('should emit the "sent" event', async () => {
			const handler = jest.fn();

			const promiEvent = contract.deploy(deployOptions).send(sendOptions).on('sent', handler);

			// Deploy the contract
			await promiEvent;

			expect(handler).toHaveBeenCalled();
		});

		it('should emit the "receipt" event', async () => {
			const handler = jest.fn();

			const promiEvent = contract
				.deploy(deployOptions)
				.send(sendOptions)
				.on('receipt', handler);

			// Deploy the contract
			await promiEvent;

			expect(handler).toHaveBeenCalled();
		});

		it('should fail with errors on "intrinsic gas too low" OOG', async () => {
			await expect(
				contract.deploy(deployOptions).send({ ...sendOptions, gas: '100' }),
			).rejects.toThrow('Returned error: intrinsic gas too low');
		});

		it('should fail with errors deploying a zero length bytecode', () => {
			return expect(() =>
				contract
					.deploy({
						...deployOptions,
						data: '0x',
					})
					.send(sendOptions),
			).toThrow('contract creation without any data provided.');
		});

		it('should fail with errors on revert', async () => {
			const revert = new Contract(DeployRevertAbi);
			revert.provider = getSystemTestProvider();
			// eslint-disable-next-line jest/no-standalone-expect
			await expect(
				revert
					.deploy({
						data: DeployRevertBytecode,
					})
					.send(sendOptions),
			).rejects.toThrow("code couldn't be stored");
		});
	});
});
