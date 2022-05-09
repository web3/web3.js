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
import { sleep, processAsync } from '../shared_fixtures/utils';
import { greeterByteCode, greeterContractAbi } from '../shared_fixtures/sources/Greeter';
import { deployRevertAbi, deployRevertByteCode } from '../shared_fixtures/sources/DeployRevert';
import { getSystemTestProvider, getSystemTestAccounts } from '../fixtures/system_test_utils';

// TODO: Debug the "UncaughtException" caused after recent merge of 4.x
describe.skip('contract', () => {
	describe('deploy', () => {
		let contract: Contract<typeof greeterContractAbi>;
		let deployOptions: Record<string, unknown>;
		let sendOptions: Record<string, unknown>;
		let accounts: string[];

		beforeEach(async () => {
			contract = new Contract(greeterContractAbi, undefined, {
				provider: getSystemTestProvider(),
			});

			accounts = await getSystemTestAccounts();

			deployOptions = {
				data: greeterByteCode,
				arguments: ['My Greeting'],
			};

			sendOptions = { from: accounts[0], gas: '1000000' };
		});

		it('should deploy the contract', async () => {
			const deployedContract = await contract.deploy(deployOptions).send(sendOptions);

			expect(deployedContract).toBeDefined();
		});

		it('should deploy the contract if data is provided at initiation', async () => {
			contract = new Contract(greeterContractAbi, undefined, {
				provider: 'http://localhost:8545',
				data: greeterByteCode,
				from: accounts[0],
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

		// TODO: It works fine but tests hangs because of confirmation handler
		it.skip('should emit the "confirmation" event', async () => {
			const confirmationHandler = jest.fn();

			contract
				.deploy(deployOptions)
				.send(sendOptions)
				.on('confirmation', confirmationHandler);

			// Deploy once again to trigger block mining to trigger confirmation
			// We can send any other transaction as well
			await contract.deploy(deployOptions).send(sendOptions);

			await sleep(1000);

			expect(confirmationHandler).toHaveBeenCalled();
		});

		it('should emit the "transactionHash" event', async () => {
			return expect(
				processAsync(resolve => {
					contract.deploy(deployOptions).send(sendOptions).on('transactionHash', resolve);
				}),
			).resolves.toBeDefined();
		});

		it('should emit the "sending" event', async () => {
			return expect(
				processAsync(resolve => {
					contract.deploy(deployOptions).send(sendOptions).on('sending', resolve);
				}),
			).resolves.toBeDefined();
		});

		it('should emit the "sent" event', async () => {
			return expect(
				processAsync(resolve => {
					contract.deploy(deployOptions).send(sendOptions).on('sent', resolve);
				}),
			).resolves.toBeDefined();
		});

		it('should emit the "receipt" event', async () => {
			return expect(
				processAsync(resolve => {
					contract.deploy(deployOptions).send(sendOptions).on('receipt', resolve);
				}),
			).resolves.toBeDefined();
		});

		it('should fail with errors on "intrinic gas too low" OOG', async () => {
			return expect(
				contract.deploy(deployOptions).send({ ...sendOptions, gas: '100' }),
			).rejects.toEqual(
				expect.objectContaining({
					error: expect.objectContaining({
						message: expect.stringContaining('intrinsic gas too low'),
					}),
				}),
			);
		});

		it.skip('should fail with errors deploying a zero length bytecode',  () => {
			return expect(() =>
				contract
					.deploy({
						...deployOptions,
						data: '0x',
					})
					.send(sendOptions),
			).toThrow('No data provided.');
		});

		// TODO: Debug this test why it's failing when run with all other tests
		it.skip('should fail with errors on revert', async () => {
			const revert = new Contract(deployRevertAbi);
			revert.provider = 'http://localhost:8545';

			return expect(() =>
				revert
					.deploy({
						data: deployRevertByteCode,
					})
					.send(sendOptions),
			).rejects.toThrow('contract deployment error');
		});
	});
});
