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
import { GreeterBytecode, GreeterAbi } from '../../shared_fixtures/build/Greeter';
import {
	getSystemTestProvider,
	createLocalAccount,
	closeOpenConnection,
} from '../../fixtures/system_test_utils';
import { Contract } from '../../../src';

describe('contract', () => {
	describe('deploy', () => {
		let contract: Contract<typeof GreeterAbi>;
		let sendOptions: Record<string, unknown>;
		let deployOptions: Record<string, unknown>;
		let localAccount: Web3Account;
		let web3: Web3;

		beforeAll(async () => {
			web3 = new Web3(getSystemTestProvider());
			contract = new web3.eth.Contract(GreeterAbi) as unknown as Contract<typeof GreeterAbi>;
			deployOptions = {
				data: GreeterBytecode,
				arguments: ['My Greeting'],
			};
		});

		afterAll(async () => {
			await closeOpenConnection(web3);
		});

		beforeEach(async () => {
			localAccount = await createLocalAccount(web3);
			sendOptions = {
				from: localAccount.address,
				gas: '1000000',
			};
		});

		it.each(['0x1', '0x2'])('should emit the "sending" event', async txType => {
			const handler = jest.fn();
			const acc = await createLocalAccount(web3);
			const promiEvent = contract
				.deploy(deployOptions)
				.send({
					...sendOptions,
					from: acc.address,
					type: txType,
				})
				.on('sending', handler);

			// Deploy the contract
			await promiEvent;

			expect(handler).toHaveBeenCalled();
		});

		it.each(['0x1', '0x2'])('should deploy contract %p', async txType => {
			const acc = await createLocalAccount(web3);
			const deployedContract = await contract.deploy(deployOptions).send({
				...sendOptions,
				from: acc.address,
				type: txType,
			});
			expect(deployedContract.options.address).toBeDefined();
		});

		it('deploy should fail with low baseFeeGas EIP1559', async () => {
			await expect(
				contract.deploy(deployOptions).send({
					type: '0x2',
					gas: '1000',
					maxFeePerGas: '0x1',
					maxPriorityFeePerGas: '0x1',
					from: localAccount.address,
				}),
			).rejects.toThrow('Signer Error Signer Error  gasLimit is too low');
		});

		it.each(['0x1', '0x2'])(
			'should return estimated gas of contract method %p',
			async txType => {
				const contractDeployed = await contract.deploy(deployOptions).send(sendOptions);

				const estimatedGas = await contractDeployed.methods
					.setGreeting('Hello')
					.estimateGas({
						...sendOptions,
						type: txType,
					});
				expect(Number(estimatedGas)).toBeGreaterThan(0);
			},
		);

		it('should deploy the contract if data is provided at initiation', async () => {
			const contractWithParams = new web3.eth.Contract(GreeterAbi, undefined, {
				provider: web3.provider,
				data: GreeterBytecode,
				from: localAccount.address,
				gas: '1000000',
			}) as unknown as Contract<typeof GreeterAbi>;

			const deployedContract = await contractWithParams
				.deploy({ arguments: ['Hello World'] })
				.send();

			expect(deployedContract.options.address).toBeDefined();
		});

		it('should emit the "confirmation" event', async () => {
			const confirmationHandler = jest.fn();
			const promievent = contract.deploy(deployOptions).send(sendOptions);
			const receiptPromise = new Promise<void>(resolve => {
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				promievent.on('receipt', () => {
					resolve();
				});
			});

			const confirmationPRomise = new Promise<void>(resolve => {
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				promievent.on('confirmation', () => {
					confirmationHandler();
					resolve();
				});
			});
			await promievent;
			await receiptPromise;

			// Deploy once again to trigger block mining to trigger confirmation
			// We can send any other transaction as well
			await contract.deploy(deployOptions).send(sendOptions);

			await confirmationPRomise;
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
	});
});
