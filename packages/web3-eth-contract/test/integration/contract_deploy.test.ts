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
import { Web3Eth } from 'web3-eth';
import { FMT_BYTES, FMT_NUMBER } from 'web3-types';
import { Contract, createContractAddress } from '../../src';
import { sleep } from '../shared_fixtures/utils';
import { ERC721TokenAbi, ERC721TokenBytecode } from '../shared_fixtures/build/ERC721Token';
import { GreeterBytecode, GreeterAbi } from '../shared_fixtures/build/Greeter';
import { DeployRevertAbi, DeployRevertBytecode } from '../shared_fixtures/build/DeployRevert';
import {
	getSystemTestProvider,
	isWs,
	createTempAccount,
	createNewAccount,
	signTxAndSendEIP2930,
	signTxAndSendEIP1559,
	sendFewSampleTxs,
	closeOpenConnection,
	getSystemTestBackend,
	BACKEND,
	mapFormatToType,
} from '../fixtures/system_test_utils';

describe('contract', () => {
	describe('deploy', () => {
		let contract: Contract<typeof GreeterAbi>;
		let deployOptions: Record<string, unknown>;
		let sendOptions: Record<string, unknown>;
		let acc: { address: string; privateKey: string };
		let pkAccount: { address: string; privateKey: string };
		let web3Eth: Web3Eth;

		beforeAll(() => {
			web3Eth = new Web3Eth(getSystemTestProvider());
			contract = new Contract(GreeterAbi, undefined, {
				provider: getSystemTestProvider(),
			});
			deployOptions = {
				data: GreeterBytecode,
				arguments: ['My Greeting'],
			};
		});

		afterAll(async () => {
			await closeOpenConnection(web3Eth);
			await closeOpenConnection(contract);
		});

		beforeEach(async () => {
			acc = await createTempAccount();
			sendOptions = { from: acc.address, gas: '1000000' };
		});

		it('should get correct contract address before deploymet using CREATE', async () => {
			const nonce = await web3Eth.getTransactionCount(sendOptions.from as string);

			// get contract address before deployment
			const address = createContractAddress(sendOptions.from as string, nonce);

			const deployedContract = await contract.deploy(deployOptions).send(sendOptions);

			expect(deployedContract).toBeDefined();
			expect(deployedContract.options.address).toEqual(address);
		});

		describe('local account', () => {
			it.each([signTxAndSendEIP1559, signTxAndSendEIP2930])(
				'should deploy the contract %p',
				async signTxAndSend => {
					pkAccount = await createNewAccount({ refill: true });

					const deployData = contract.deploy(deployOptions);

					const res = await signTxAndSend(
						contract.provider,
						{
							data: deployData.encodeABI(),
						},
						pkAccount.privateKey,
					);
					expect(Number(res.status)).toBe(1);
				},
			);

			it.each([signTxAndSendEIP1559, signTxAndSendEIP2930])(
				'should deploy the contract with input%p',
				async signTxAndSend => {
					pkAccount = await createNewAccount({ refill: true });

					const deployData = contract.deploy(deployOptions);

					const res = await signTxAndSend(
						contract.provider,
						{
							input: deployData.encodeABI(),
						},
						pkAccount.privateKey,
					);
					expect(Number(res.status)).toBe(1);
				},
			);

			it('should return estimated gas of contract constructor %p', async () => {
				const testContract = new Contract(GreeterAbi, undefined, {
					provider: getSystemTestProvider(),
				});

				const estimatedGas = await testContract
					.deploy({
						data: GreeterBytecode,
						arguments: ['My Greeting'],
					})
					.estimateGas({
						from: acc.address,
						gas: '1000000',
					});

				expect(typeof estimatedGas).toBe('bigint');
				expect(Number(estimatedGas)).toBeGreaterThan(0);

				await closeOpenConnection(testContract);
			});

			it.each(Object.values(FMT_NUMBER))(
				'should return estimated gas of contract constructor %p with correct type',
				async format => {
					const returnFormat = { number: format as FMT_NUMBER, bytes: FMT_BYTES.HEX };

					const testContract = new Contract(
						GreeterAbi,
						{
							provider: getSystemTestProvider(),
						},
						returnFormat,
					);

					const estimatedGas = await testContract
						.deploy({
							data: GreeterBytecode,
							arguments: ['My Greeting'],
						})
						.estimateGas({
							from: acc.address,
							gas: '1000000',
						});

					expect(typeof estimatedGas).toBe(mapFormatToType[format as string]);
					expect(Number(estimatedGas)).toBeGreaterThan(0);

					await closeOpenConnection(testContract);
				},
			);

			it('should return estimated gas of contract constructor without arguments', async () => {
				const testContract = new Contract(ERC721TokenAbi, undefined, {
					provider: getSystemTestProvider(),
				});

				const estimatedGas = await testContract
					.deploy({
						data: ERC721TokenBytecode,
						arguments: [],
					})
					.estimateGas({
						from: acc.address,
						gas: '10000000',
					});

				expect(Number(estimatedGas)).toBeGreaterThan(0);

				await closeOpenConnection(testContract);
			});

			it('should return estimated gas of contract method', async () => {
				const contractDeployed = await contract.deploy(deployOptions).send(sendOptions);

				const estimatedGas = await contractDeployed.methods
					.setGreeting('Hello')
					.estimateGas({
						gas: '1000000',
						from: acc.address,
					});

				expect(Number(estimatedGas)).toBeGreaterThan(0);
			});

			it('should return estimated gas of contract method without arguments', async () => {
				const contractDeployed = await contract.deploy(deployOptions).send(sendOptions);

				const estimatedGas = await contractDeployed.methods.increment().estimateGas({
					gas: '1000000',
					from: acc.address,
				});
				expect(Number(estimatedGas)).toBeGreaterThan(0);
			});
		});

		it('should deploy the contract', async () => {
			const deployedContract = await contract.deploy(deployOptions).send(sendOptions);

			expect(deployedContract).toBeDefined();
		});

		it('should deploy the contract if data is provided at initiation', async () => {
			const testContract = new Contract(GreeterAbi, {
				provider: getSystemTestProvider(),
				data: GreeterBytecode,
				from: acc.address,
				gas: '1000000',
			});
			const deployedContract = await testContract
				.deploy({ arguments: ['Hello World'] })
				.send();

			expect(deployedContract).toBeDefined();

			await closeOpenConnection(testContract);
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
			contract.setConfig({ transactionConfirmationBlocks: 1 });
			await contract
				.deploy(deployOptions)
				.send(sendOptions)
				.on('confirmation', confirmationHandler);

			// Wait for some time to allow the transaction to be processed
			await sleep(500);

			// Deploy once again to trigger block mining to trigger confirmation
			// We can send any other transaction as well
			await contract.deploy(deployOptions).send(sendOptions);

			await sendFewSampleTxs(3);

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
			if (getSystemTestBackend() !== BACKEND.HARDHAT) {
				// eslint-disable-next-line jest/no-conditional-expect
				await expect(
					contract.deploy(deployOptions).send({ ...sendOptions, gas: '100' }),
				).rejects.toThrow('Returned error: intrinsic gas too low');
			} else {
				// eslint-disable-next-line jest/no-conditional-expect
				await expect(
					contract.deploy(deployOptions).send({ ...sendOptions, gas: '100' }),
				).rejects.toThrow(
					'Returned error: Transaction requires at least 109656 gas but got 100',
				);
			}
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
			if (getSystemTestBackend() !== BACKEND.HARDHAT) {
				// eslint-disable-next-line jest/no-conditional-expect
				await expect(
					revert
						.deploy({
							data: DeployRevertBytecode,
						})
						.send(sendOptions),
				).rejects.toThrow("code couldn't be stored");
			} else {
				// eslint-disable-next-line jest/no-conditional-expect
				await expect(
					revert
						.deploy({
							data: DeployRevertBytecode,
						})
						.send(sendOptions),
				).rejects.toThrow(
					'Error happened while trying to execute a function inside a smart contract',
				);
			}

			await closeOpenConnection(revert);
		});
	});
});
