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

import * as eth from 'web3-eth';
import {
	ValidChains,
	Hardfork,
	AccessListResult,
	Address,
	ETH_DATA_FORMAT,
	DEFAULT_RETURN_FORMAT,
} from 'web3-types';
import { Web3ContractError } from 'web3-errors';
import { Web3Context, Web3ConfigEvent } from 'web3-core';
import { Web3ValidatorError } from 'web3-validator';
import { AbiItem } from 'web3-utils';
import { stringify } from 'flatted';
import { Abi } from '../fixtures/AbiItem';
import { Contract } from '../../src';
import { sampleStorageContractABI } from '../fixtures/storage';
import { GreeterAbi, GreeterBytecode } from '../shared_fixtures/build/Greeter';
import {
	GreeterWithOverloadingAbi,
	GreeterWithOverloadingBytecode,
} from '../shared_fixtures/build/GreeterWithOverloading';
import { AllGetPastEventsData, getLogsData, getPastEventsData } from '../fixtures/unitTestFixtures';
import { erc721Abi } from '../fixtures/erc721';
import { ERC20TokenAbi } from '../shared_fixtures/build/ERC20Token';
import { processAsync } from '../shared_fixtures/utils';
import { ContractTransactionMiddleware } from "../fixtures/contract_transaction_middleware";

jest.mock('web3-eth', () => {
	const allAutoMocked = jest.createMockFromModule('web3-eth');
	const actual = jest.requireActual('web3-eth');
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return {
		__esModules: true,
		// @ts-expect-error ignore allAutoMocked type
		...allAutoMocked,
		decodeEventABI: actual.decodeEventABI,
	};
});

describe('Contract', () => {
	describe('constructor', () => {
		it('should init with only the abi', () => {
			const contract = new Contract([]);

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should throw if both options.data and options.input are provided', () => {
			expect(
				() =>
					new Contract([], {
						data: GreeterBytecode,
						input: GreeterBytecode,
					}),
			).toThrow(
				'You can\'t have "data" and "input" as properties of a contract at the same time, please use either "data" or "input" instead.',
			);
		});

		it('should init with abi and address', () => {
			const contract = new Contract([], '0x00000000219ab540356cBB839Cbe05303d7705Fa');

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should init with abi and options', () => {
			const contract = new Contract([], { gas: '123' });

			expect(contract).toBeInstanceOf(Contract);
		});

		it('method should have correct type by ABI', () => {
			const contractInstance = new Contract([
				{
					inputs: [
						{
							internalType: 'uint256',
							name: 'tokenId',
							type: 'uint256',
						},
					],
					name: 'tokenURI',
					outputs: [{ internalType: 'string', name: '', type: 'string' }],
					stateMutability: 'view',
					type: 'function',
				},
			] as const);

			const method = contractInstance.methods.tokenURI(123);

			expect(method).toBeDefined();
		});

		it('should init with abi, options and context', () => {
			const contract = new Contract(
				[],
				{ gas: '123' },
				{ config: { defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa' } },
			);

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should init with abiItem, options and context', () => {
			const contract = new Contract(
				[Abi as AbiItem],
				{ gas: '123' },
				{ config: { defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa' } },
			);

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should init with abi, address and options', () => {
			const contract = new Contract([], '0x00000000219ab540356cBB839Cbe05303d7705Fa', {
				gas: '123',
			});

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should init with abi, address, options and context', () => {
			const contract = new Contract(
				[],
				'0x00000000219ab540356cBB839Cbe05303d7705Fa',
				{ gas: '123' },
				{ config: { defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa' } },
			);

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should set the provider, from options, upon instantiation', () => {
			const provider = "http://127.0.0.1:4545";
			const contract = new Contract([], '', {
				provider,
			});

			expect(contract.provider).toEqual({
				clientUrl: provider,
				httpProviderOptions: undefined,
			});
		});

		it('should set the provider, from context, upon instantiation', () => {
			const provider = "http://127.0.0.1:4545";
			const contract = new Contract(
				[],
				'',
				{},
				{
					provider,
				},
			);

			expect(contract.provider).toEqual({
				clientUrl: provider,
				httpProviderOptions: undefined,
			});
		});

		it('should pass the returnDataFormat to `_parseAndSetAddress` and `_parseAndSetJsonInterface`', () => {
			const contract = new Contract([], '', ETH_DATA_FORMAT);

			// @ts-expect-error run protected method
			const parseAndSetAddressSpy = jest.spyOn(contract, '_parseAndSetAddress');
			contract.options.address = '0x6e599da0bff7a6598ac1224e4985430bf16458a4';

			expect(parseAndSetAddressSpy).toHaveBeenCalledWith(
				'0x6e599da0bff7a6598ac1224e4985430bf16458a4',
				ETH_DATA_FORMAT,
			);
			const parseAndSetJsonInterfaceSpy = jest.spyOn(
				contract,
				// @ts-expect-error run protected method
				'_parseAndSetJsonInterface',
			);
			contract.options.jsonInterface = [];
			expect(parseAndSetJsonInterfaceSpy).toHaveBeenCalledWith([], ETH_DATA_FORMAT);
		});

		it('should pass the returnDataFormat, as the constructor forth parameter, to `_parseAndSetAddress` and `_parseAndSetJsonInterface`', () => {
			const contract = new Contract([], '', {}, ETH_DATA_FORMAT);

			// @ts-expect-error run protected method
			const parseAndSetAddressSpy = jest.spyOn(contract, '_parseAndSetAddress');
			contract.options.address = '0x6e599da0bff7a6598ac1224e4985430bf16458a4';

			expect(parseAndSetAddressSpy).toHaveBeenCalledWith(
				'0x6e599da0bff7a6598ac1224e4985430bf16458a4',
				ETH_DATA_FORMAT,
			);
			const parseAndSetJsonInterfaceSpy = jest.spyOn(
				contract,
				// @ts-expect-error run protected method
				'_parseAndSetJsonInterface',
			);
			contract.options.jsonInterface = [];
			expect(parseAndSetJsonInterfaceSpy).toHaveBeenCalledWith([], ETH_DATA_FORMAT);
		});

		it('should pass the returnDataFormat, as the constructor fifth parameter, to `_parseAndSetAddress` and `_parseAndSetJsonInterface`', () => {
			const contract = new Contract([], '', {}, {}, ETH_DATA_FORMAT);

			// @ts-expect-error run protected method
			const parseAndSetAddressSpy = jest.spyOn(contract, '_parseAndSetAddress');
			contract.options.address = '0x6e599da0bff7a6598ac1224e4985430bf16458a4';

			expect(parseAndSetAddressSpy).toHaveBeenCalledWith(
				'0x6e599da0bff7a6598ac1224e4985430bf16458a4',
				ETH_DATA_FORMAT,
			);
			const parseAndSetJsonInterfaceSpy = jest.spyOn(
				contract,
				// @ts-expect-error run protected method
				'_parseAndSetJsonInterface',
			);
			contract.options.jsonInterface = [];
			expect(parseAndSetJsonInterfaceSpy).toHaveBeenCalledWith([], ETH_DATA_FORMAT);
		});
	});

	describe('Contract functions and defaults', () => {
		let sendOptions: Record<string, unknown>;
		const deployedAddr = '0x20bc23D0598b12c34cBDEf1fae439Ba8744DB426';

		beforeEach(() => {
			sendOptions = {
				from: '0x12364916b10Ae90076dDa6dE756EE1395BB69ec2',
				gas: '1000000',
			};
		});

		it('should deploy contract with input property', async () => {
			const input = `${GreeterBytecode}0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b4d79204772656574696e67000000000000000000000000000000000000000000`;
			const contract = new Contract(GreeterAbi);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const sendTransactionSpy = jest
				.spyOn(eth, 'sendTransaction')
				.mockImplementation((_objInstance, tx) => {
					expect(tx.to).toBeUndefined();
					expect(tx.gas).toStrictEqual(sendOptions.gas);
					expect(tx.gasPrice).toBeUndefined();
					expect(tx.from).toStrictEqual(sendOptions.from);
					expect(tx.input).toStrictEqual(input); // padded data

					const newContract = contract.clone();
					newContract.options.address = deployedAddr;

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(newContract) as any;
				});

			const deployedContract = await contract
				.deploy({
					input: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			expect(deployedContract).toBeDefined();
			expect(deployedContract.options.address).toStrictEqual(deployedAddr);
			sendTransactionSpy.mockClear();
		});

		it('should pass middleware to sendTransaction when middleware is there and deploy().send() is called', async () => {
			const contract = new Contract(GreeterAbi);
			const middleware = new ContractTransactionMiddleware();
			contract.setTransactionMiddleware(middleware)

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const sendTransactionSpy = jest
				.spyOn(eth, 'sendTransaction')
				.mockImplementation((_objInstance, _tx, _dataFormat, _options, _middleware) => {
					
					expect(_middleware).toBeDefined();
					const newContract = contract.clone();
					newContract.options.address = deployedAddr;

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(newContract) as any;
				});

			await contract
				.deploy({
					input: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);
			
			sendTransactionSpy.mockClear();
		});

		it('should pass middleware to sendTransaction when middleware is there and contract.method.send() is called', async () => {

			const contract = new Contract(GreeterAbi, '0x12264916b10Ae90076dDa6dE756EE1395BB69ec2');
			const middleware = new ContractTransactionMiddleware();
			contract.setTransactionMiddleware(middleware);

			const spyTx = jest
				.spyOn(eth, 'sendTransaction')
				.mockImplementation((_objInstance, _tx, _dataformat, _options, _middleware) => {

					expect(_middleware).toBeDefined();

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function
					return { status: '0x1', on: () => {} } as any;

				});

			const receipt = await contract.methods.setGreeting('Hello').send({
				from: '0x12364916b10Ae90076dDa6dE756EE1395BB69ec2',
				gas: '1000000'
			});

			expect(receipt.status).toBe('0x1');

			spyTx.mockClear();
		});

		it('should deploy contract with input property with no ABI', async () => {
			const input = `${GreeterBytecode}0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b4d79204772656574696e67000000000000000000000000000000000000000000`;
			const contract = new Contract([]);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const sendTransactionSpy = jest
				.spyOn(eth, 'sendTransaction')
				.mockImplementation((_objInstance, tx) => {
					expect(tx.to).toBeUndefined();
					expect(tx.gas).toStrictEqual(sendOptions.gas);
					expect(tx.gasPrice).toBeUndefined();
					expect(tx.from).toStrictEqual(sendOptions.from);
					expect(tx.input).toStrictEqual(input); // padded data

					const newContract = contract.clone();
					newContract.options.address = deployedAddr;

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(newContract) as any;
				});

			const deployedContract = await contract
				.deploy({
					input: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			expect(deployedContract).toBeDefined();
			expect(deployedContract.options.address).toStrictEqual(deployedAddr);
			sendTransactionSpy.mockClear();
		});

		it('should deploy contract with data property', async () => {
			const data = `${GreeterBytecode}0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b4d79204772656574696e67000000000000000000000000000000000000000000`;
			const contract = new Contract(GreeterAbi);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const sendTransactionSpy = jest
				.spyOn(eth, 'sendTransaction')
				.mockImplementation((_objInstance, tx) => {
					expect(tx.to).toBeUndefined();
					expect(tx.gas).toStrictEqual(sendOptions.gas);
					expect(tx.gasPrice).toBeUndefined();
					expect(tx.from).toStrictEqual(sendOptions.from);
					expect(tx.data).toStrictEqual(data); // padded data

					const newContract = contract.clone();
					newContract.options.address = deployedAddr;

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(newContract) as any;
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			expect(deployedContract).toBeDefined();
			expect(deployedContract.options.address).toStrictEqual(deployedAddr);
			sendTransactionSpy.mockClear();
		});

		// eslint-disable-next-line @typescript-eslint/require-await
		it('should not deploy contract with empty data', async () => {
			const contract = new Contract(GreeterAbi);

			expect(() => contract.deploy({ data: '' }).send(sendOptions)).toThrow(
				'contract creation without any data provided',
			);
		});

		// eslint-disable-next-line @typescript-eslint/require-await
		it('send method on deployed contract should work using input', async () => {
			const arg = 'Hello';
			const contract = new Contract(GreeterAbi);
			sendOptions = {
				from: '0x12364916b10Ae90076dDa6dE756EE1395BB69ec2',
				gas: '1000000',
			};
			const spyTx = jest
				.spyOn(eth, 'sendTransaction')
				.mockImplementation((_objInstance, _tx) => {
					const newContract = contract.clone();
					newContract.options.address = deployedAddr;
					expect(_tx.data).toBeDefined();
					if (
						_tx.data ===
						'0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000'
					) {
						// eslint-disable-next-line
						expect(_tx.to).toStrictEqual(deployedAddr);
						// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function
						return { status: '0x1', on: () => {} } as any;
					}

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function
					return Promise.resolve(Object.assign(newContract, { on: () => {} })) as any;
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);
			const receipt = await deployedContract.methods.setGreeting(arg).send(sendOptions);
			expect(receipt.status).toBe('0x1');

			spyTx.mockClear();
		});

		it('test calling overloaded solidity method', async () => {
			const arg = 'Hello';
			const contract = new Contract(GreeterWithOverloadingAbi);
			sendOptions = {
				from: '0x12364916b10Ae90076dDa6dE756EE1395BB69ec2',
				gas: '1000000',
			};
			const spyTx = jest
				.spyOn(eth, 'sendTransaction')
				.mockImplementation((_objInstance, _tx) => {
					const newContract = contract.clone();
					newContract.options.address = deployedAddr;
					expect(_tx.data).toBeDefined();
					if (
						_tx.data ===
							'0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000' ||
						_tx.data ===
							'0x4495ef8a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000'
					) {
						// eslint-disable-next-line
						expect(_tx.to).toStrictEqual(deployedAddr);
						// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function
						return { status: '0x1', on: () => {} } as any;
					}

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function
					return Object.assign(Promise.resolve(newContract), { on: () => {} }) as any;
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterWithOverloadingBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const receipt = await deployedContract.methods.setGreeting(arg).send(sendOptions);
			expect(receipt.status).toBe('0x1');

			const receipt2 = await deployedContract.methods
				.setGreeting(arg, true)
				.send(sendOptions);
			expect(receipt2.status).toBe('0x1');

			spyTx.mockClear();
		});

		it('test calling overloaded solidity method with incompatible parameters', async () => {
			const arg = 'Hello';
			const contract = new Contract(GreeterWithOverloadingAbi);
			sendOptions = {
				from: '0x12364916b10Ae90076dDa6dE756EE1395BB69ec2',
				gas: '1000000',
			};
			const spyTx = jest
				.spyOn(eth, 'sendTransaction')
				.mockImplementation((_objInstance, _tx) => {
					const newContract = contract.clone();
					newContract.options.address = deployedAddr;
					expect(_tx.data).toBeDefined();
					if (
						_tx.data ===
							'0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000' ||
						_tx.data ===
							'0x4495ef8a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000'
					) {
						// eslint-disable-next-line jest/no-conditional-expect
						expect(_tx.to).toStrictEqual(deployedAddr);
						// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function
						return { status: '0x1', on: () => {} } as any;
					}

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function
					return Object.assign(Promise.resolve(newContract), { on: () => {} }) as any;
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterWithOverloadingBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const receipt = await deployedContract.methods.setGreeting(arg).send(sendOptions);
			expect(receipt.status).toBe('0x1');

			// calling with correct parameters should pass
			const receipt2 = await deployedContract.methods
				.setGreeting(arg, true)
				.send(sendOptions);
			expect(receipt2.status).toBe('0x1');

			// calling with wrong parameters should throw
			try {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				await (deployedContract.methods.setGreeting as any)(arg, 'test').send(sendOptions);
				expect(true).toBe(false);
			} catch (error) {
				// eslint-disable-next-line jest/no-conditional-expect
				expect(error).toBeInstanceOf(Web3ValidatorError);
				// eslint-disable-next-line jest/no-conditional-expect
				expect((error as Web3ValidatorError).message).toBe(
					'Web3 validator found 1 error[s]:\nWeb3 validator found 1 error[s]:\nvalue "test" at "/1" must pass "bool" validation',
				);
			}

			// calling with wrong parameters should throw
			try {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				await (deployedContract.methods.setGreeting as any)(arg, true, 'test').send(
					sendOptions,
				);
				expect(true).toBe(false);
			} catch (error) {
				// eslint-disable-next-line jest/no-conditional-expect
				expect(error).toBeInstanceOf(Web3ValidatorError);
				// eslint-disable-next-line jest/no-conditional-expect
				expect((error as Web3ValidatorError).message).toBe(
					'Web3 validator found 2 error[s]:\nmust NOT have more than 1 items\nvalue "true" at "/1" must pass "string" validation',
				);
			}

			spyTx.mockClear();
		});

		it('send method on deployed contract should work using data (default)', async () => {
			const arg = 'Hello';
			const contract = new Contract(GreeterAbi);
			sendOptions = {
				from: '0x12364916b10Ae90076dDa6dE756EE1395BB69ec2',
				gas: '1000000',
				data: '0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000',
			};
			const spyTx = jest
				.spyOn(eth, 'sendTransaction')
				.mockImplementation((_objInstance, _tx) => {
					const newContract = contract.clone();
					newContract.options.address = deployedAddr;
					expect(_tx.data).toBeDefined();
					if (
						_tx.data ===
						'0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000'
					) {
						// eslint-disable-next-line
						expect(_tx.to).toStrictEqual(deployedAddr);
						// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function
						return { status: '0x1', on: () => {} } as any;
					}

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function
					return Promise.resolve(Object.assign(newContract, { on: () => {} })) as any;
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);
			const receipt = await deployedContract.methods.setGreeting(arg).send(sendOptions);
			expect(receipt.status).toBe('0x1');

			spyTx.mockClear();
		});

		it('should config change if the linked web3config emitted a config change event', async () => {
			const expectedProvider = 'http://127.0.0.1:8545';
			const web3Context = new Web3Context({
				provider: expectedProvider,
				config: {
					contractDataInputFill: 'data',
					defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa',
				},
			});
			const contract = new Contract(GreeterAbi, web3Context);
			web3Context.emit(Web3ConfigEvent.CONFIG_CHANGE, {
				name: 'contractDataInputFill',
				oldValue: 'data',
				newValue: 'input',
			});
			expect(contract.config.contractDataInputFill).toBe('input');
		});

		it('should send method on deployed contract should work with data using web3config', async () => {
			const expectedProvider = 'http://127.0.0.1:8545';
			const web3Context = new Web3Context({
				provider: expectedProvider,
				config: {
					contractDataInputFill: 'data',
					defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa',
				},
			});
			const arg = 'Hello';
			const contract = new Contract(GreeterAbi, web3Context);
			sendOptions = {
				from: '0x12364916b10Ae90076dDa6dE756EE1395BB69ec2',
				gas: '1000000',
			};
			const spyTx = jest
				.spyOn(eth, 'sendTransaction')
				.mockImplementation((_objInstance, _tx) => {
					const newContract = contract.clone();
					newContract.options.address = deployedAddr;
					if (
						_tx.data ===
						'0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000'
					) {
						// eslint-disable-next-line
						expect(_tx.to).toStrictEqual(deployedAddr);
						// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function
						return { status: '0x1', on: () => {} } as any;
					}

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function
					return Promise.resolve(Object.assign(newContract, { on: () => {} })) as any;
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);
			const receipt = await deployedContract.methods.setGreeting(arg).send(sendOptions);
			expect(receipt.status).toBe('0x1');

			spyTx.mockClear();
		});

		it('send method on deployed contract should work with both input and data using web3config', async () => {
			const expectedProvider = 'http://127.0.0.1:8545';
			const web3Context = new Web3Context({
				provider: expectedProvider,
				config: {
					contractDataInputFill: 'both',
					defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa',
				},
			});
			const arg = 'Hello';
			const contract = new Contract(GreeterAbi, web3Context);
			sendOptions = {
				from: '0x12364916b10Ae90076dDa6dE756EE1395BB69ec2',
				gas: '1000000',
			};
			const spyTx = jest
				.spyOn(eth, 'sendTransaction')
				.mockImplementation((_objInstance, _tx) => {
					const newContract = contract.clone();
					newContract.options.address = deployedAddr;
					if (
						_tx.data ===
						'0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000'
					) {
						// eslint-disable-next-line
						expect(_tx.input).toStrictEqual(
							'0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000',
						);
						// eslint-disable-next-line
						expect(_tx.to).toStrictEqual(deployedAddr);
						// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function
						return { status: '0x1', on: () => {} } as any;
					}

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function
					return Promise.resolve(Object.assign(newContract, { on: () => {} })) as any;
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);
			const receipt = await deployedContract.methods.setGreeting(arg).send(sendOptions);
			expect(receipt.status).toBe('0x1');

			spyTx.mockClear();
		});

		it('should send method on deployed contract should work with input using web3config', async () => {
			const expectedProvider = 'http://127.0.0.1:8545';
			const web3Context = new Web3Context({
				provider: expectedProvider,
				config: {
					contractDataInputFill: 'input',
					defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa',
				},
			});
			const arg = 'Hello';
			const contract = new Contract(GreeterAbi, web3Context);
			sendOptions = {
				from: '0x12364916b10Ae90076dDa6dE756EE1395BB69ec2',
				gas: '1000000',
			};
			const spyTx = jest
				.spyOn(eth, 'sendTransaction')
				.mockImplementation((_objInstance, _tx) => {
					const newContract = contract.clone();
					newContract.options.address = deployedAddr;
					if (
						_tx.input ===
						'0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000'
					) {
						// eslint-disable-next-line
						expect(_tx.to).toStrictEqual(deployedAddr);
						// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function
						return { status: '0x1', on: () => {} } as any;
					}

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function
					return Promise.resolve(Object.assign(newContract, { on: () => {} })) as any;
				});

			const deployedContract = await contract
				.deploy({
					input: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);
			const receipt = await deployedContract.methods.setGreeting(arg).send(sendOptions);
			expect(receipt.status).toBe('0x1');

			spyTx.mockClear();
		});

		it('call on deployed contract should decode result', async () => {
			const arg = 'Hello';
			const encodedArg =
				'0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000';
			const contract = new Contract(GreeterAbi);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyEthCall = jest.spyOn(eth, 'call').mockImplementation((_objInstance, _tx) => {
				expect(_tx.to).toStrictEqual(deployedAddr);
				expect(_tx.data).toBe('0xcfae3217');
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(encodedArg) as any; // contract class should decode encodedArg
			});
			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);
			const res = await deployedContract.methods.greet().call();
			expect(res).toStrictEqual(arg);

			spyTx.mockClear();
			spyEthCall.mockClear();
		});

		it('should clone pre deployed contract with address', () => {
			const contract = new Contract(
				sampleStorageContractABI,
				'0x00000000219ab540356cBB839Cbe05303d7705Fa',
				{ gas: '0x97254' },
			);
			contract.maxListenersWarningThreshold = 1000;
			
			const clonnedContract = contract.clone();
			expect(stringify(contract)).toStrictEqual(stringify(clonnedContract));

			contract.options.jsonInterface = GreeterAbi;
		});

		it('should clone new contract', () => {
			const contract = new Contract(sampleStorageContractABI);
			contract.maxListenersWarningThreshold = 1000;
			
			const clonnedContract = contract.clone();
			expect(stringify(contract)).toStrictEqual(stringify(clonnedContract));
		});

		it('should be able to update the jsonInterface', () => {
			const contract = new Contract(sampleStorageContractABI);

			expect(contract.methods.retrieveNum).toBeDefined();
			expect(contract.methods.storeNum).toBeDefined();

			expect(contract.methods.greet).toBeUndefined();
			expect(contract.methods.increment).toBeUndefined();
			expect(contract.methods.setGreeting).toBeUndefined();

			contract.options.jsonInterface = GreeterAbi;

			expect(contract.methods.retrieveNum).toBeUndefined();
			expect(contract.methods.storeNum).toBeUndefined();

			expect(contract.methods.greet).toBeDefined();
			expect(contract.methods.increment).toBeDefined();
			expect(contract.methods.setGreeting).toBeDefined();
		});

		it('should be able to set and get transaction middleware', () => {
			const contract = new Contract(sampleStorageContractABI);
			const middleware = new ContractTransactionMiddleware();

			expect(contract.getTransactionMiddleware()).toBeUndefined();

			contract.setTransactionMiddleware(middleware);
			expect(contract.getTransactionMiddleware()).toBeDefined();
			expect(contract.getTransactionMiddleware()).toEqual(middleware);
		});

		it('defaults set and get should work', () => {
			const contract = new Contract([], '0x00000000219ab540356cBB839Cbe05303d7705Fa');

			const defaultAddr = '0xd7E30ae310C1D1800F5B641Baa7af95b2e1FD98C';
			expect(contract.defaultAccount).toBeUndefined();
			contract.defaultAccount = defaultAddr;
			expect(contract.defaultAccount).toStrictEqual(defaultAddr);

			const defaultBlock = '0xC43A';
			expect(contract.defaultBlock).toBe('latest');
			contract.defaultBlock = defaultBlock;
			expect(contract.defaultBlock).toStrictEqual(defaultBlock);

			const defaultHardfork = 'constantinople';
			expect(contract.defaultHardfork).toBe('london');
			contract.defaultHardfork = defaultHardfork;
			expect(contract.defaultHardfork).toStrictEqual(defaultHardfork);

			const baseChain = 'mainnet' as ValidChains;
			contract.defaultChain = baseChain;
			expect(contract.defaultChain).toBe(baseChain);

			const defaultCommonDifferentHardfork = {
				customChain: { name: 'testnet', networkId: '5678', chainId: '5634' },
				baseChain,
				hardfork: 'petersburg' as Hardfork,
			};
			expect(contract.defaultCommon).toBeUndefined();

			// Test that defaultcommon will error when defaulthardfork is not matching
			// Has to be wrapped in another function to check Error
			expect(() => {
				contract.defaultCommon = defaultCommonDifferentHardfork;
			}).toThrow(
				new Error(
					'Web3Config hardfork doesnt match in defaultHardfork constantinople and common.hardfork petersburg',
				),
			);

			expect(contract.defaultCommon).toBeUndefined();

			// Should error when defaultCommon has different chain than defaultChain
			const defaultCommonDifferentChain = {
				customChain: { name: 'testnet', networkId: '5678', chainId: '5634' },
				baseChain: 'sepolia' as ValidChains,
				hardfork: 'constantinople' as Hardfork,
			};
			expect(() => {
				contract.defaultCommon = defaultCommonDifferentChain;
			}).toThrow(
				new Error(
					'Web3Config chain doesnt match in defaultHardfork mainnet and common.hardfork sepolia',
				),
			);

			expect(contract.defaultCommon).toBeUndefined();

			const defaultCommon = {
				customChain: { name: 'testnet', networkId: '5678', chainId: '5634' },
				baseChain: 'mainnet' as ValidChains,
				hardfork: 'constantinople' as Hardfork,
			};
			contract.defaultCommon = defaultCommon;
			expect(contract.defaultCommon).toBe(defaultCommon);

			const transactionBlockTimeout = 130;
			expect(contract.transactionBlockTimeout).toBe(50);
			contract.transactionBlockTimeout = transactionBlockTimeout;
			expect(contract.transactionBlockTimeout).toStrictEqual(transactionBlockTimeout);

			const transactionConfirmationBlocks = 30;
			expect(contract.transactionConfirmationBlocks).toBe(24);
			contract.transactionConfirmationBlocks = transactionConfirmationBlocks;
			expect(contract.transactionConfirmationBlocks).toStrictEqual(
				transactionConfirmationBlocks,
			);

			const transactionPollingInterval = 1000;
			expect(contract.transactionPollingInterval).toBe(1000);
			contract.transactionPollingInterval = transactionPollingInterval;
			expect(contract.transactionPollingInterval).toStrictEqual(transactionPollingInterval);

			const transactionPollingTimeout = 800000;
			expect(contract.transactionPollingTimeout).toBe(750000);
			contract.transactionPollingTimeout = transactionPollingTimeout;
			expect(contract.transactionPollingTimeout).toStrictEqual(transactionPollingTimeout);

			const transactionReceiptPollingInterval = 2000; // its new in 4.x
			expect(contract.transactionReceiptPollingInterval).toBe(1000);
			contract.transactionReceiptPollingInterval = transactionReceiptPollingInterval;
			expect(contract.transactionReceiptPollingInterval).toStrictEqual(
				transactionReceiptPollingInterval,
			);

			const transactionConfirmationPollingInterval = 2501; // its new in 4.x
			expect(contract.transactionConfirmationPollingInterval).toBe(1000);
			contract.transactionConfirmationPollingInterval =
				transactionConfirmationPollingInterval;
			expect(contract.transactionConfirmationPollingInterval).toStrictEqual(
				transactionConfirmationPollingInterval,
			);

			const transactionSendTimeout = 730000; // its new in 4.x
			expect(contract.transactionSendTimeout).toBe(750000);
			contract.transactionSendTimeout = transactionSendTimeout;
			expect(contract.transactionSendTimeout).toStrictEqual(transactionSendTimeout);

			const blockHeaderTimeout = 12;
			expect(contract.blockHeaderTimeout).toBe(10);
			contract.blockHeaderTimeout = blockHeaderTimeout;
			expect(contract.blockHeaderTimeout).toStrictEqual(blockHeaderTimeout);

			expect(contract.handleRevert).toBe(false);
			contract.handleRevert = true;
			expect(contract.handleRevert).toBe(true);
		});

		it('should set and get correct address', () => {
			const addr = '0x1230B93ffd14F2F022039675fA3fc3A46eE4C701';
			const contract = new Contract(
				[],
				'',
				{ gas: '123' },
				{ config: { defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa' } },
			);

			contract.options.address = addr;
			expect(contract.options.address).toStrictEqual(addr);
		});

		it('should set, at the constructor, and later get jsonInterface', () => {
			const contract = new Contract(
				sampleStorageContractABI,
				'0x1230B93ffd14F2F022039675fA3fc3A46eE4C701',
				{ gas: '123' },
				{ config: { defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa' } },
			);

			expect(contract.options.jsonInterface).toMatchObject(sampleStorageContractABI);
		});

		it('should set and get jsonInterface', () => {
			const contract = new Contract(
				sampleStorageContractABI,
				'0x1230B93ffd14F2F022039675fA3fc3A46eE4C701',
				{ gas: '123' },
				{ config: { defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa' } },
			);

			contract.options.jsonInterface = ERC20TokenAbi;
			expect(contract.options.jsonInterface).toMatchObject(ERC20TokenAbi);
		});

		it('should be able to call a payable method', async () => {
			const contract = new Contract(
				erc721Abi,
				'0x1230B93ffd14F2F022039675fA3fc3A46eE4C701',
				{ gas: '123' },
				{ config: { defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa' } },
			);

			// @ts-expect-error fix-types
			const spyEthCall = jest.spyOn(eth, 'call').mockImplementation((_objInstance, _tx) => {
				expect(_tx.to).toBe('0x1230B93ffd14F2F022039675fA3fc3A46eE4C701');
				expect(_tx.data).toBe(
					'0x095ea7b300000000000000000000000000000000219ab540356cbb839cbe05303d7705fa0000000000000000000000000000000000000000000000000000000000000001',
				);
				return '0x00';
			});

			await expect(
				contract.methods.approve('0x00000000219ab540356cBB839Cbe05303d7705Fa', 1).call(),
			).resolves.toBeTruthy();

			spyEthCall.mockClear();
		});

		it('should be able to call a payable method with data as a contract init option', async () => {
			const contract = new Contract(
				erc721Abi,
				'0x1230B93ffd14F2F022039675fA3fc3A46eE4C701',
				{ gas: '123', dataInputFill: 'data' },
				{ config: { defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa' } },
			);

			const spyEthCall = jest
				.spyOn(eth, 'call')
				.mockImplementation(async (_objInstance, _tx) => {
					expect(_tx.to).toBe('0x1230B93ffd14F2F022039675fA3fc3A46eE4C701');
					expect(_tx.data).toBe(
						'0x095ea7b300000000000000000000000000000000219ab540356cbb839cbe05303d7705fa0000000000000000000000000000000000000000000000000000000000000001',
					);
					return '0x00';
				});

			await expect(
				contract.methods.approve('0x00000000219ab540356cBB839Cbe05303d7705Fa', 1).call(),
			).resolves.toBeTruthy();

			spyEthCall.mockClear();
		});

		it('should be able to call a payable method with input as a contract init option', async () => {
			const contract = new Contract(
				erc721Abi,
				'0x1230B93ffd14F2F022039675fA3fc3A46eE4C701',
				{ gas: '123', dataInputFill: 'input' },
				{ config: { defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa' } },
			);

			const spyEthCall = jest
				.spyOn(eth, 'call')
				.mockImplementation(async (_objInstance, _tx) => {
					expect(_tx.to).toBe('0x1230B93ffd14F2F022039675fA3fc3A46eE4C701');
					expect(_tx.input).toBe(
						'0x095ea7b300000000000000000000000000000000219ab540356cbb839cbe05303d7705fa0000000000000000000000000000000000000000000000000000000000000001',
					);
					return '0x00';
				});

			await expect(
				contract.methods.approve('0x00000000219ab540356cBB839Cbe05303d7705Fa', 1).call(),
			).resolves.toBeTruthy();

			spyEthCall.mockClear();
		});

		it('should be able to call a payable method with data as a web3Context option', async () => {
			const expectedProvider = 'http://127.0.0.1:8545';
			const web3Context = new Web3Context({
				provider: expectedProvider,
				config: {
					contractDataInputFill: 'data',
					defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa',
				},
			});
			const contract = new Contract(
				erc721Abi,
				'0x1230B93ffd14F2F022039675fA3fc3A46eE4C701',
				{ gas: '123' },
				web3Context,
			);

			const spyEthCall = jest
				.spyOn(eth, 'call')
				.mockImplementation(async (_objInstance, _tx) => {
					expect(_tx.to).toBe('0x1230B93ffd14F2F022039675fA3fc3A46eE4C701');
					expect(_tx.data).toBe(
						'0x095ea7b300000000000000000000000000000000219ab540356cbb839cbe05303d7705fa0000000000000000000000000000000000000000000000000000000000000001',
					);
					return '0x00';
				});

			await expect(
				contract.methods.approve('0x00000000219ab540356cBB839Cbe05303d7705Fa', 1).call(),
			).resolves.toBeTruthy();

			spyEthCall.mockClear();
		});

		it('should be able to call a payable method with both data and input as a web3Context option', async () => {
			const expectedProvider = 'http://127.0.0.1:8545';
			const web3Context = new Web3Context({
				provider: expectedProvider,
				config: {
					contractDataInputFill: 'both',
					defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa',
				},
			});
			const contract = new Contract(
				erc721Abi,
				'0x1230B93ffd14F2F022039675fA3fc3A46eE4C701',
				{ gas: '123' },
				web3Context,
			);

			const spyEthCall = jest
				.spyOn(eth, 'call')
				.mockImplementation(async (_objInstance, _tx) => {
					expect(_tx.to).toBe('0x1230B93ffd14F2F022039675fA3fc3A46eE4C701');
					expect(_tx.data).toBe(
						'0x095ea7b300000000000000000000000000000000219ab540356cbb839cbe05303d7705fa0000000000000000000000000000000000000000000000000000000000000001',
					);
					expect(_tx.input).toBe(
						'0x095ea7b300000000000000000000000000000000219ab540356cbb839cbe05303d7705fa0000000000000000000000000000000000000000000000000000000000000001',
					);
					return '0x00';
				});

			await expect(
				contract.methods.approve('0x00000000219ab540356cBB839Cbe05303d7705Fa', 1).call(),
			).resolves.toBeTruthy();

			spyEthCall.mockClear();
		});

		it('getPastEvents with filter should work', async () => {
			const contract = new Contract<typeof GreeterAbi>(GreeterAbi);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyGetLogs = jest
				.spyOn(eth, 'getLogs')
				.mockImplementation((_objInstance, _params) => {
					expect(_params.address).toStrictEqual(deployedAddr.toLocaleLowerCase());
					expect(_params.fromBlock).toStrictEqual(getLogsData.request.fromBlock);
					expect(_params.toBlock).toStrictEqual(getLogsData.request.toBlock);
					expect(_params.topics).toStrictEqual(getLogsData.request.topics);

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(getLogsData.response) as any;
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const fromBlock = 'earliest';
			const toBlock = 'latest';
			const pastEvent = await deployedContract.getPastEvents(getPastEventsData.event as any, {
				fromBlock,
				toBlock,
			});

			expect(pastEvent).toStrictEqual(getPastEventsData.response);
			spyTx.mockClear();
			spyGetLogs.mockClear();
		});

		it('getPastEvents with filter by topics should work', async () => {
			const contract = new Contract<typeof GreeterAbi>(GreeterAbi);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyGetLogs = jest
				.spyOn(eth, 'getLogs')
				.mockImplementation((_objInstance, _params) => {
					expect(_params.address).toStrictEqual(deployedAddr.toLocaleLowerCase());
					expect(_params.fromBlock).toStrictEqual(getLogsData.request.fromBlock);
					expect(_params.toBlock).toStrictEqual(getLogsData.request.toBlock);

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve([getLogsData.response[0]]) as any;
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const fromBlock = 'earliest';
			const toBlock = 'latest';
			const pastEvent = await deployedContract.getPastEvents(getPastEventsData.event as any, {
				fromBlock,
				toBlock,
				topics: ['0x7d7846723bda52976e0286c6efffee937ee9f76817a867ec70531ad29fb1fc0e'],
			});

			expect(pastEvent).toStrictEqual(getPastEventsData.response);
			spyTx.mockClear();
			spyGetLogs.mockClear();
		});

		it('getPastEvents for all events should work', async () => {
			const contract = new Contract<typeof GreeterAbi>(GreeterAbi);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyGetLogs = jest
				.spyOn(eth, 'getLogs')
				.mockImplementation((_objInstance, _params) => {
					expect(_params.address).toStrictEqual(deployedAddr.toLocaleLowerCase());
					expect(_params.fromBlock).toBeUndefined();
					expect(_params.toBlock).toBeUndefined();
					expect(_params.topics).toBeUndefined();

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(AllGetPastEventsData.getLogsData) as any; // AllGetPastEventsData.getLogsData data test is for: assume two transactions sent to contract with contractInstance.methods.setGreeting("Hello") and contractInstance.methods.setGreeting("Another Greeting")
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const pastEvent = await deployedContract.getPastEvents('allEvents');

			expect(pastEvent).toStrictEqual(AllGetPastEventsData.response);
			spyTx.mockClear();
			spyGetLogs.mockClear();
		});

		it('getPastEvents for all events with filter should work', async () => {
			const contract = new Contract<typeof GreeterAbi>(GreeterAbi);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyGetLogs = jest
				.spyOn(eth, 'getLogs')
				.mockImplementation((_objInstance, _params) => {
					expect(_params.address).toStrictEqual(deployedAddr.toLocaleLowerCase());
					expect(_params.fromBlock).toBeUndefined();
					expect(_params.toBlock).toBeUndefined();
					expect(_params.topics).toBeUndefined();

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(AllGetPastEventsData.getLogsData) as any; // AllGetPastEventsData.getLogsData data test is for: assume two transactions sent to contract with contractInstance.methods.setGreeting("Hello") and contractInstance.methods.setGreeting("Another Greeting")
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const pastEvent = await deployedContract.getPastEvents('allEvents', {
				filter: {
					greeting: 'Another Greeting',
				},
			});

			expect(pastEvent).toHaveLength(1);
			expect(pastEvent[0]).toStrictEqual(AllGetPastEventsData.response[1]);

			const pastEventWithoutEventName = await deployedContract.getPastEvents({
				filter: {
					greeting: 'Another Greeting',
				},
			});

			expect(pastEventWithoutEventName).toHaveLength(1);
			expect(pastEventWithoutEventName[0]).toStrictEqual(AllGetPastEventsData.response[1]);

			const pastEventFilterArray = await deployedContract.getPastEvents({
				filter: {
					greeting: ['Another Greeting'],
				},
			});

			expect(pastEventFilterArray).toHaveLength(1);
			expect(pastEventFilterArray[0]).toStrictEqual(AllGetPastEventsData.response[1]);

			const pastEventFilterWithIncorrectParam = await deployedContract.getPastEvents({
				filter: {
					incorrectParam: 'test',
				},
			});
			expect(pastEventFilterWithIncorrectParam).toHaveLength(0);

			spyTx.mockClear();
			spyGetLogs.mockClear();
		});

		it('getPastEvents for all events with filter by topics should work', async () => {
			const contract = new Contract<typeof GreeterAbi>(GreeterAbi);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyGetLogs = jest
				.spyOn(eth, 'getLogs')
				.mockImplementation((_objInstance, _params) => {
					expect(_params.address).toStrictEqual(deployedAddr.toLocaleLowerCase());
					expect(_params.fromBlock).toBeUndefined();
					expect(_params.toBlock).toBeUndefined();

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve([AllGetPastEventsData.getLogsData[1]]) as any; // AllGetPastEventsData.getLogsData data test is for: assume two transactions sent to contract with contractInstance.methods.setGreeting("Hello") and contractInstance.methods.setGreeting("Another Greeting")
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const pastEvent = await deployedContract.getPastEvents({
				topics: ['0x7d7846723bda52976e0286c6efffee937ee9f76817a867ec70531ad29fb1fc0e'],
			});
			expect(pastEvent).toHaveLength(1);
			expect(pastEvent[0]).toStrictEqual(AllGetPastEventsData.response[1]);

			spyTx.mockClear();
			spyGetLogs.mockClear();
		});

		it('allEvents() should throw error with inner error', async () => {
			const contract = new Contract<typeof GreeterAbi>(GreeterAbi);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyGetLogs = jest
				.spyOn(eth, 'getLogs')
				.mockImplementation((_objInstance, _params) => {
					throw new Error('Inner error');
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			await expect(
				processAsync((resolve, reject) => {
					const event = deployedContract.events.allEvents({ fromBlock: 'earliest' });

					event.on('error', reject);
					event.on('data', resolve);
				}),
			).rejects.toThrow(
				expect.objectContaining({
					cause: expect.any(Error),
				}),
			);

			spyTx.mockClear();
			spyGetLogs.mockClear();
		});

		it('encodeABI should work for the deploy function using data', () => {
			const contract = new Contract(GreeterAbi);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const deploy = contract.deploy({
				data: GreeterBytecode,
				arguments: ['My Greeting'],
			});

			const result = deploy.encodeABI();
			expect(result).toBe(
				'0x60806040523480156200001157600080fd5b5060405162000ed038038062000ed08339818101604052810190620000379190620001ea565b806001908162000048919062000486565b5060008081905550506200056d565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620000c08262000075565b810181811067ffffffffffffffff82111715620000e257620000e162000086565b5b80604052505050565b6000620000f762000057565b9050620001058282620000b5565b919050565b600067ffffffffffffffff82111562000128576200012762000086565b5b620001338262000075565b9050602081019050919050565b60005b838110156200016057808201518184015260208101905062000143565b60008484015250505050565b6000620001836200017d846200010a565b620000eb565b905082815260208101848484011115620001a257620001a162000070565b5b620001af84828562000140565b509392505050565b600082601f830112620001cf57620001ce6200006b565b5b8151620001e18482602086016200016c565b91505092915050565b60006020828403121562000203576200020262000061565b5b600082015167ffffffffffffffff81111562000224576200022362000066565b5b6200023284828501620001b7565b91505092915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200028e57607f821691505b602082108103620002a457620002a362000246565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200030e7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620002cf565b6200031a8683620002cf565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600062000367620003616200035b8462000332565b6200033c565b62000332565b9050919050565b6000819050919050565b620003838362000346565b6200039b62000392826200036e565b848454620002dc565b825550505050565b600090565b620003b2620003a3565b620003bf81848462000378565b505050565b5b81811015620003e757620003db600082620003a8565b600181019050620003c5565b5050565b601f82111562000436576200040081620002aa565b6200040b84620002bf565b810160208510156200041b578190505b620004336200042a85620002bf565b830182620003c4565b50505b505050565b600082821c905092915050565b60006200045b600019846008026200043b565b1980831691505092915050565b600062000476838362000448565b9150826002028217905092915050565b62000491826200023b565b67ffffffffffffffff811115620004ad57620004ac62000086565b5b620004b9825462000275565b620004c6828285620003eb565b600060209050601f831160018114620004fe5760008415620004e9578287015190505b620004f5858262000468565b86555062000565565b601f1984166200050e86620002aa565b60005b82811015620005385784890151825560018201915060208501945060208101905062000511565b8683101562000558578489015162000554601f89168262000448565b8355505b6001600288020188555050505b505050505050565b610953806200057d6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063a413686214610046578063cfae321714610077578063d09de08a14610095575b600080fd5b610060600480360381019061005b91906103c0565b61009f565b60405161006e9291906104a3565b60405180910390f35b61007f6101bd565b60405161008c91906104d3565b60405180910390f35b61009d61024f565b005b600060607f0d363f2fba46ab11b6db8da0125b0d5484787c44e265b48810735998bab12b756001846040516100d59291906105ee565b60405180910390a182600190816100ec91906107c6565b507f7d7846723bda52976e0286c6efffee937ee9f76817a867ec70531ad29fb1fc0e600160405161011d9190610898565b60405180910390a160018080805461013490610524565b80601f016020809104026020016040519081016040528092919081815260200182805461016090610524565b80156101ad5780601f10610182576101008083540402835291602001916101ad565b820191906000526020600020905b81548152906001019060200180831161019057829003601f168201915b5050505050905091509150915091565b6060600180546101cc90610524565b80601f01602080910402602001604051908101604052809291908181526020018280546101f890610524565b80156102455780601f1061021a57610100808354040283529160200191610245565b820191906000526020600020905b81548152906001019060200180831161022857829003601f168201915b5050505050905090565b600160005461025e91906108e9565b600081905550565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6102cd82610284565b810181811067ffffffffffffffff821117156102ec576102eb610295565b5b80604052505050565b60006102ff610266565b905061030b82826102c4565b919050565b600067ffffffffffffffff82111561032b5761032a610295565b5b61033482610284565b9050602081019050919050565b82818337600083830152505050565b600061036361035e84610310565b6102f5565b90508281526020810184848401111561037f5761037e61027f565b5b61038a848285610341565b509392505050565b600082601f8301126103a7576103a661027a565b5b81356103b7848260208601610350565b91505092915050565b6000602082840312156103d6576103d5610270565b5b600082013567ffffffffffffffff8111156103f4576103f3610275565b5b61040084828501610392565b91505092915050565b60008115159050919050565b61041e81610409565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561045e578082015181840152602081019050610443565b60008484015250505050565b600061047582610424565b61047f818561042f565b935061048f818560208601610440565b61049881610284565b840191505092915050565b60006040820190506104b86000830185610415565b81810360208301526104ca818461046a565b90509392505050565b600060208201905081810360008301526104ed818461046a565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061053c57607f821691505b60208210810361054f5761054e6104f5565b5b50919050565b60008190508160005260206000209050919050565b6000815461057781610524565b610581818661042f565b9450600182166000811461059c57600181146105b2576105e5565b60ff1983168652811515602002860193506105e5565b6105bb85610555565b60005b838110156105dd578154818901526001820191506020810190506105be565b808801955050505b50505092915050565b60006040820190508181036000830152610608818561056a565b9050818103602083015261061c818461046a565b90509392505050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026106727fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610635565b61067c8683610635565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006106c36106be6106b984610694565b61069e565b610694565b9050919050565b6000819050919050565b6106dd836106a8565b6106f16106e9826106ca565b848454610642565b825550505050565b600090565b6107066106f9565b6107118184846106d4565b505050565b5b818110156107355761072a6000826106fe565b600181019050610717565b5050565b601f82111561077a5761074b81610555565b61075484610625565b81016020851015610763578190505b61077761076f85610625565b830182610716565b50505b505050565b600082821c905092915050565b600061079d6000198460080261077f565b1980831691505092915050565b60006107b6838361078c565b9150826002028217905092915050565b6107cf82610424565b67ffffffffffffffff8111156107e8576107e7610295565b5b6107f28254610524565b6107fd828285610739565b600060209050601f831160018114610830576000841561081e578287015190505b61082885826107aa565b865550610890565b601f19841661083e86610555565b60005b8281101561086657848901518255600182019150602085019450602081019050610841565b86831015610883578489015161087f601f89168261078c565b8355505b6001600288020188555050505b505050505050565b600060208201905081810360008301526108b2818461056a565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006108f482610694565b91506108ff83610694565b9250828201905080821115610917576109166108ba565b5b9291505056fea26469706673582212207e5ba44159ffb37af8e8a9e7c5b6fb5ce81ea195b62ae3ac36288f2cf72c18a764736f6c634300081000330000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b4d79204772656574696e67000000000000000000000000000000000000000000',
			);

			spyTx.mockClear();
		});

		it('decodeData should work for the deploy function', () => {
			const contract = new Contract(GreeterAbi);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const deploy = contract.deploy({
				data: GreeterBytecode,
				arguments: ['My Greeting'],
			});

			const result = deploy.encodeABI();
			expect(result).toBe(
				'0x60806040523480156200001157600080fd5b5060405162000ed038038062000ed08339818101604052810190620000379190620001ea565b806001908162000048919062000486565b5060008081905550506200056d565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620000c08262000075565b810181811067ffffffffffffffff82111715620000e257620000e162000086565b5b80604052505050565b6000620000f762000057565b9050620001058282620000b5565b919050565b600067ffffffffffffffff82111562000128576200012762000086565b5b620001338262000075565b9050602081019050919050565b60005b838110156200016057808201518184015260208101905062000143565b60008484015250505050565b6000620001836200017d846200010a565b620000eb565b905082815260208101848484011115620001a257620001a162000070565b5b620001af84828562000140565b509392505050565b600082601f830112620001cf57620001ce6200006b565b5b8151620001e18482602086016200016c565b91505092915050565b60006020828403121562000203576200020262000061565b5b600082015167ffffffffffffffff81111562000224576200022362000066565b5b6200023284828501620001b7565b91505092915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200028e57607f821691505b602082108103620002a457620002a362000246565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200030e7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620002cf565b6200031a8683620002cf565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600062000367620003616200035b8462000332565b6200033c565b62000332565b9050919050565b6000819050919050565b620003838362000346565b6200039b62000392826200036e565b848454620002dc565b825550505050565b600090565b620003b2620003a3565b620003bf81848462000378565b505050565b5b81811015620003e757620003db600082620003a8565b600181019050620003c5565b5050565b601f82111562000436576200040081620002aa565b6200040b84620002bf565b810160208510156200041b578190505b620004336200042a85620002bf565b830182620003c4565b50505b505050565b600082821c905092915050565b60006200045b600019846008026200043b565b1980831691505092915050565b600062000476838362000448565b9150826002028217905092915050565b62000491826200023b565b67ffffffffffffffff811115620004ad57620004ac62000086565b5b620004b9825462000275565b620004c6828285620003eb565b600060209050601f831160018114620004fe5760008415620004e9578287015190505b620004f5858262000468565b86555062000565565b601f1984166200050e86620002aa565b60005b82811015620005385784890151825560018201915060208501945060208101905062000511565b8683101562000558578489015162000554601f89168262000448565b8355505b6001600288020188555050505b505050505050565b610953806200057d6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063a413686214610046578063cfae321714610077578063d09de08a14610095575b600080fd5b610060600480360381019061005b91906103c0565b61009f565b60405161006e9291906104a3565b60405180910390f35b61007f6101bd565b60405161008c91906104d3565b60405180910390f35b61009d61024f565b005b600060607f0d363f2fba46ab11b6db8da0125b0d5484787c44e265b48810735998bab12b756001846040516100d59291906105ee565b60405180910390a182600190816100ec91906107c6565b507f7d7846723bda52976e0286c6efffee937ee9f76817a867ec70531ad29fb1fc0e600160405161011d9190610898565b60405180910390a160018080805461013490610524565b80601f016020809104026020016040519081016040528092919081815260200182805461016090610524565b80156101ad5780601f10610182576101008083540402835291602001916101ad565b820191906000526020600020905b81548152906001019060200180831161019057829003601f168201915b5050505050905091509150915091565b6060600180546101cc90610524565b80601f01602080910402602001604051908101604052809291908181526020018280546101f890610524565b80156102455780601f1061021a57610100808354040283529160200191610245565b820191906000526020600020905b81548152906001019060200180831161022857829003601f168201915b5050505050905090565b600160005461025e91906108e9565b600081905550565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6102cd82610284565b810181811067ffffffffffffffff821117156102ec576102eb610295565b5b80604052505050565b60006102ff610266565b905061030b82826102c4565b919050565b600067ffffffffffffffff82111561032b5761032a610295565b5b61033482610284565b9050602081019050919050565b82818337600083830152505050565b600061036361035e84610310565b6102f5565b90508281526020810184848401111561037f5761037e61027f565b5b61038a848285610341565b509392505050565b600082601f8301126103a7576103a661027a565b5b81356103b7848260208601610350565b91505092915050565b6000602082840312156103d6576103d5610270565b5b600082013567ffffffffffffffff8111156103f4576103f3610275565b5b61040084828501610392565b91505092915050565b60008115159050919050565b61041e81610409565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561045e578082015181840152602081019050610443565b60008484015250505050565b600061047582610424565b61047f818561042f565b935061048f818560208601610440565b61049881610284565b840191505092915050565b60006040820190506104b86000830185610415565b81810360208301526104ca818461046a565b90509392505050565b600060208201905081810360008301526104ed818461046a565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061053c57607f821691505b60208210810361054f5761054e6104f5565b5b50919050565b60008190508160005260206000209050919050565b6000815461057781610524565b610581818661042f565b9450600182166000811461059c57600181146105b2576105e5565b60ff1983168652811515602002860193506105e5565b6105bb85610555565b60005b838110156105dd578154818901526001820191506020810190506105be565b808801955050505b50505092915050565b60006040820190508181036000830152610608818561056a565b9050818103602083015261061c818461046a565b90509392505050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026106727fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610635565b61067c8683610635565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006106c36106be6106b984610694565b61069e565b610694565b9050919050565b6000819050919050565b6106dd836106a8565b6106f16106e9826106ca565b848454610642565b825550505050565b600090565b6107066106f9565b6107118184846106d4565b505050565b5b818110156107355761072a6000826106fe565b600181019050610717565b5050565b601f82111561077a5761074b81610555565b61075484610625565b81016020851015610763578190505b61077761076f85610625565b830182610716565b50505b505050565b600082821c905092915050565b600061079d6000198460080261077f565b1980831691505092915050565b60006107b6838361078c565b9150826002028217905092915050565b6107cf82610424565b67ffffffffffffffff8111156107e8576107e7610295565b5b6107f28254610524565b6107fd828285610739565b600060209050601f831160018114610830576000841561081e578287015190505b61082885826107aa565b865550610890565b601f19841661083e86610555565b60005b8281101561086657848901518255600182019150602085019450602081019050610841565b86831015610883578489015161087f601f89168261078c565b8355505b6001600288020188555050505b505050505050565b600060208201905081810360008301526108b2818461056a565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006108f482610694565b91506108ff83610694565b9250828201905080821115610917576109166108ba565b5b9291505056fea26469706673582212207e5ba44159ffb37af8e8a9e7c5b6fb5ce81ea195b62ae3ac36288f2cf72c18a764736f6c634300081000330000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b4d79204772656574696e67000000000000000000000000000000000000000000',
			);

			const params = deploy.decodeData(result);
			expect(params).toMatchObject({
				__method__: 'constructor',
				__length__: 1,
				'0': 'My Greeting',
				_greeting: 'My Greeting',
			});

			spyTx.mockClear();
		});

		it('decodeMethodData should decode data for methods', async () => {
			const arg = 'Hello';

			const contract = new Contract(GreeterAbi, { data: GreeterBytecode });

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const deployedContract = await contract
				.deploy({
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const result = deployedContract.methods.setGreeting(arg).encodeABI();

			expect(result).toBe(
				'0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000',
			);

			// const params = deployedContract.methods.setGreeting(arg).decodeData(result);

			const params = deployedContract.decodeMethodData(result);
			expect(params).toMatchObject({
				__method__: 'setGreeting(string)',
				__length__: 1,
				'0': 'Hello',
				_greeting: 'Hello',
			});

			spyTx.mockClear();
		});

		it.skip('estimateGas should use DEFAULT_RETURN_FORMAT by default', async () => {
			const contract = new Contract(GreeterAbi);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyEstimateGas = jest
				.spyOn(eth, 'estimateGas')
				.mockImplementationOnce(async (_objInstance, _tx, _block, returnFormat) => {
					expect(_block).toBe('latest');
					expect(_tx.to).toBeUndefined();
					expect(_tx.from).toStrictEqual(sendOptions.from);
					expect(_tx.input).toBe(
						'0x60806040523480156200001157600080fd5b5060405162000ed038038062000ed08339818101604052810190620000379190620001ea565b806001908162000048919062000486565b5060008081905550506200056d565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620000c08262000075565b810181811067ffffffffffffffff82111715620000e257620000e162000086565b5b80604052505050565b6000620000f762000057565b9050620001058282620000b5565b919050565b600067ffffffffffffffff82111562000128576200012762000086565b5b620001338262000075565b9050602081019050919050565b60005b838110156200016057808201518184015260208101905062000143565b60008484015250505050565b6000620001836200017d846200010a565b620000eb565b905082815260208101848484011115620001a257620001a162000070565b5b620001af84828562000140565b509392505050565b600082601f830112620001cf57620001ce6200006b565b5b8151620001e18482602086016200016c565b91505092915050565b60006020828403121562000203576200020262000061565b5b600082015167ffffffffffffffff81111562000224576200022362000066565b5b6200023284828501620001b7565b91505092915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200028e57607f821691505b602082108103620002a457620002a362000246565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200030e7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620002cf565b6200031a8683620002cf565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600062000367620003616200035b8462000332565b6200033c565b62000332565b9050919050565b6000819050919050565b620003838362000346565b6200039b62000392826200036e565b848454620002dc565b825550505050565b600090565b620003b2620003a3565b620003bf81848462000378565b505050565b5b81811015620003e757620003db600082620003a8565b600181019050620003c5565b5050565b601f82111562000436576200040081620002aa565b6200040b84620002bf565b810160208510156200041b578190505b620004336200042a85620002bf565b830182620003c4565b50505b505050565b600082821c905092915050565b60006200045b600019846008026200043b565b1980831691505092915050565b600062000476838362000448565b9150826002028217905092915050565b62000491826200023b565b67ffffffffffffffff811115620004ad57620004ac62000086565b5b620004b9825462000275565b620004c6828285620003eb565b600060209050601f831160018114620004fe5760008415620004e9578287015190505b620004f5858262000468565b86555062000565565b601f1984166200050e86620002aa565b60005b82811015620005385784890151825560018201915060208501945060208101905062000511565b8683101562000558578489015162000554601f89168262000448565b8355505b6001600288020188555050505b505050505050565b610953806200057d6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063a413686214610046578063cfae321714610077578063d09de08a14610095575b600080fd5b610060600480360381019061005b91906103c0565b61009f565b60405161006e9291906104a3565b60405180910390f35b61007f6101bd565b60405161008c91906104d3565b60405180910390f35b61009d61024f565b005b600060607f0d363f2fba46ab11b6db8da0125b0d5484787c44e265b48810735998bab12b756001846040516100d59291906105ee565b60405180910390a182600190816100ec91906107c6565b507f7d7846723bda52976e0286c6efffee937ee9f76817a867ec70531ad29fb1fc0e600160405161011d9190610898565b60405180910390a160018080805461013490610524565b80601f016020809104026020016040519081016040528092919081815260200182805461016090610524565b80156101ad5780601f10610182576101008083540402835291602001916101ad565b820191906000526020600020905b81548152906001019060200180831161019057829003601f168201915b5050505050905091509150915091565b6060600180546101cc90610524565b80601f01602080910402602001604051908101604052809291908181526020018280546101f890610524565b80156102455780601f1061021a57610100808354040283529160200191610245565b820191906000526020600020905b81548152906001019060200180831161022857829003601f168201915b5050505050905090565b600160005461025e91906108e9565b600081905550565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6102cd82610284565b810181811067ffffffffffffffff821117156102ec576102eb610295565b5b80604052505050565b60006102ff610266565b905061030b82826102c4565b919050565b600067ffffffffffffffff82111561032b5761032a610295565b5b61033482610284565b9050602081019050919050565b82818337600083830152505050565b600061036361035e84610310565b6102f5565b90508281526020810184848401111561037f5761037e61027f565b5b61038a848285610341565b509392505050565b600082601f8301126103a7576103a661027a565b5b81356103b7848260208601610350565b91505092915050565b6000602082840312156103d6576103d5610270565b5b600082013567ffffffffffffffff8111156103f4576103f3610275565b5b61040084828501610392565b91505092915050565b60008115159050919050565b61041e81610409565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561045e578082015181840152602081019050610443565b60008484015250505050565b600061047582610424565b61047f818561042f565b935061048f818560208601610440565b61049881610284565b840191505092915050565b60006040820190506104b86000830185610415565b81810360208301526104ca818461046a565b90509392505050565b600060208201905081810360008301526104ed818461046a565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061053c57607f821691505b60208210810361054f5761054e6104f5565b5b50919050565b60008190508160005260206000209050919050565b6000815461057781610524565b610581818661042f565b9450600182166000811461059c57600181146105b2576105e5565b60ff1983168652811515602002860193506105e5565b6105bb85610555565b60005b838110156105dd578154818901526001820191506020810190506105be565b808801955050505b50505092915050565b60006040820190508181036000830152610608818561056a565b9050818103602083015261061c818461046a565b90509392505050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026106727fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610635565b61067c8683610635565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006106c36106be6106b984610694565b61069e565b610694565b9050919050565b6000819050919050565b6106dd836106a8565b6106f16106e9826106ca565b848454610642565b825550505050565b600090565b6107066106f9565b6107118184846106d4565b505050565b5b818110156107355761072a6000826106fe565b600181019050610717565b5050565b601f82111561077a5761074b81610555565b61075484610625565b81016020851015610763578190505b61077761076f85610625565b830182610716565b50505b505050565b600082821c905092915050565b600061079d6000198460080261077f565b1980831691505092915050565b60006107b6838361078c565b9150826002028217905092915050565b6107cf82610424565b67ffffffffffffffff8111156107e8576107e7610295565b5b6107f28254610524565b6107fd828285610739565b600060209050601f831160018114610830576000841561081e578287015190505b61082885826107aa565b865550610890565b601f19841661083e86610555565b60005b8281101561086657848901518255600182019150602085019450602081019050610841565b86831015610883578489015161087f601f89168261078c565b8355505b6001600288020188555050505b505050505050565b600060208201905081810360008301526108b2818461056a565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006108f482610694565b91506108ff83610694565b9250828201905080821115610917576109166108ba565b5b9291505056fea26469706673582212207e5ba44159ffb37af8e8a9e7c5b6fb5ce81ea195b62ae3ac36288f2cf72c18a764736f6c634300081000330000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b4d79204772656574696e67000000000000000000000000000000000000000000',
					);
					expect(returnFormat).toBe(DEFAULT_RETURN_FORMAT);

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(BigInt(36916));
				});

			const deploy = contract.deploy({
				input: GreeterBytecode,
				arguments: ['My Greeting'],
			});

			const result = await deploy.estimateGas(sendOptions);
			expect(result).toStrictEqual(BigInt(36916));

			spyTx.mockClear();
			spyEstimateGas.mockClear();
		});

		it('estimateGas should work for the deploy function using input', async () => {
			const contract = new Contract(GreeterAbi);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyEstimateGas = jest
				.spyOn(eth, 'estimateGas')
				.mockImplementationOnce((_objInstance, _tx, _block, returnFormat) => {
					expect(_block).toBe('latest');
					expect(_tx.to).toBeUndefined();
					expect(_tx.from).toStrictEqual(sendOptions.from);
					expect(_tx.input).toBe(
						'0x60806040523480156200001157600080fd5b5060405162000ed038038062000ed08339818101604052810190620000379190620001ea565b806001908162000048919062000486565b5060008081905550506200056d565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620000c08262000075565b810181811067ffffffffffffffff82111715620000e257620000e162000086565b5b80604052505050565b6000620000f762000057565b9050620001058282620000b5565b919050565b600067ffffffffffffffff82111562000128576200012762000086565b5b620001338262000075565b9050602081019050919050565b60005b838110156200016057808201518184015260208101905062000143565b60008484015250505050565b6000620001836200017d846200010a565b620000eb565b905082815260208101848484011115620001a257620001a162000070565b5b620001af84828562000140565b509392505050565b600082601f830112620001cf57620001ce6200006b565b5b8151620001e18482602086016200016c565b91505092915050565b60006020828403121562000203576200020262000061565b5b600082015167ffffffffffffffff81111562000224576200022362000066565b5b6200023284828501620001b7565b91505092915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200028e57607f821691505b602082108103620002a457620002a362000246565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200030e7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620002cf565b6200031a8683620002cf565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600062000367620003616200035b8462000332565b6200033c565b62000332565b9050919050565b6000819050919050565b620003838362000346565b6200039b62000392826200036e565b848454620002dc565b825550505050565b600090565b620003b2620003a3565b620003bf81848462000378565b505050565b5b81811015620003e757620003db600082620003a8565b600181019050620003c5565b5050565b601f82111562000436576200040081620002aa565b6200040b84620002bf565b810160208510156200041b578190505b620004336200042a85620002bf565b830182620003c4565b50505b505050565b600082821c905092915050565b60006200045b600019846008026200043b565b1980831691505092915050565b600062000476838362000448565b9150826002028217905092915050565b62000491826200023b565b67ffffffffffffffff811115620004ad57620004ac62000086565b5b620004b9825462000275565b620004c6828285620003eb565b600060209050601f831160018114620004fe5760008415620004e9578287015190505b620004f5858262000468565b86555062000565565b601f1984166200050e86620002aa565b60005b82811015620005385784890151825560018201915060208501945060208101905062000511565b8683101562000558578489015162000554601f89168262000448565b8355505b6001600288020188555050505b505050505050565b610953806200057d6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063a413686214610046578063cfae321714610077578063d09de08a14610095575b600080fd5b610060600480360381019061005b91906103c0565b61009f565b60405161006e9291906104a3565b60405180910390f35b61007f6101bd565b60405161008c91906104d3565b60405180910390f35b61009d61024f565b005b600060607f0d363f2fba46ab11b6db8da0125b0d5484787c44e265b48810735998bab12b756001846040516100d59291906105ee565b60405180910390a182600190816100ec91906107c6565b507f7d7846723bda52976e0286c6efffee937ee9f76817a867ec70531ad29fb1fc0e600160405161011d9190610898565b60405180910390a160018080805461013490610524565b80601f016020809104026020016040519081016040528092919081815260200182805461016090610524565b80156101ad5780601f10610182576101008083540402835291602001916101ad565b820191906000526020600020905b81548152906001019060200180831161019057829003601f168201915b5050505050905091509150915091565b6060600180546101cc90610524565b80601f01602080910402602001604051908101604052809291908181526020018280546101f890610524565b80156102455780601f1061021a57610100808354040283529160200191610245565b820191906000526020600020905b81548152906001019060200180831161022857829003601f168201915b5050505050905090565b600160005461025e91906108e9565b600081905550565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6102cd82610284565b810181811067ffffffffffffffff821117156102ec576102eb610295565b5b80604052505050565b60006102ff610266565b905061030b82826102c4565b919050565b600067ffffffffffffffff82111561032b5761032a610295565b5b61033482610284565b9050602081019050919050565b82818337600083830152505050565b600061036361035e84610310565b6102f5565b90508281526020810184848401111561037f5761037e61027f565b5b61038a848285610341565b509392505050565b600082601f8301126103a7576103a661027a565b5b81356103b7848260208601610350565b91505092915050565b6000602082840312156103d6576103d5610270565b5b600082013567ffffffffffffffff8111156103f4576103f3610275565b5b61040084828501610392565b91505092915050565b60008115159050919050565b61041e81610409565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561045e578082015181840152602081019050610443565b60008484015250505050565b600061047582610424565b61047f818561042f565b935061048f818560208601610440565b61049881610284565b840191505092915050565b60006040820190506104b86000830185610415565b81810360208301526104ca818461046a565b90509392505050565b600060208201905081810360008301526104ed818461046a565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061053c57607f821691505b60208210810361054f5761054e6104f5565b5b50919050565b60008190508160005260206000209050919050565b6000815461057781610524565b610581818661042f565b9450600182166000811461059c57600181146105b2576105e5565b60ff1983168652811515602002860193506105e5565b6105bb85610555565b60005b838110156105dd578154818901526001820191506020810190506105be565b808801955050505b50505092915050565b60006040820190508181036000830152610608818561056a565b9050818103602083015261061c818461046a565b90509392505050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026106727fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610635565b61067c8683610635565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006106c36106be6106b984610694565b61069e565b610694565b9050919050565b6000819050919050565b6106dd836106a8565b6106f16106e9826106ca565b848454610642565b825550505050565b600090565b6107066106f9565b6107118184846106d4565b505050565b5b818110156107355761072a6000826106fe565b600181019050610717565b5050565b601f82111561077a5761074b81610555565b61075484610625565b81016020851015610763578190505b61077761076f85610625565b830182610716565b50505b505050565b600082821c905092915050565b600061079d6000198460080261077f565b1980831691505092915050565b60006107b6838361078c565b9150826002028217905092915050565b6107cf82610424565b67ffffffffffffffff8111156107e8576107e7610295565b5b6107f28254610524565b6107fd828285610739565b600060209050601f831160018114610830576000841561081e578287015190505b61082885826107aa565b865550610890565b601f19841661083e86610555565b60005b8281101561086657848901518255600182019150602085019450602081019050610841565b86831015610883578489015161087f601f89168261078c565b8355505b6001600288020188555050505b505050505050565b600060208201905081810360008301526108b2818461056a565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006108f482610694565b91506108ff83610694565b9250828201905080821115610917576109166108ba565b5b9291505056fea26469706673582212207e5ba44159ffb37af8e8a9e7c5b6fb5ce81ea195b62ae3ac36288f2cf72c18a764736f6c634300081000330000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b4d79204772656574696e67000000000000000000000000000000000000000000',
					);
					expect(returnFormat).toBe(ETH_DATA_FORMAT);

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(BigInt(36916)) as any;
				});

			const deploy = contract.deploy({
				input: GreeterBytecode,
				arguments: ['My Greeting'],
			});

			const result = await deploy.estimateGas(sendOptions, ETH_DATA_FORMAT);
			expect(result).toStrictEqual(BigInt(36916));

			spyTx.mockClear();
			spyEstimateGas.mockClear();
		});

		it('estimateGas should work for the deploy function using data', async () => {
			const contract = new Contract(GreeterAbi);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyEstimateGas = jest
				.spyOn(eth, 'estimateGas')
				.mockImplementationOnce((_objInstance, _tx, _block, returnFormat) => {
					expect(_block).toBe('latest');
					expect(_tx.to).toBeUndefined();
					expect(_tx.from).toStrictEqual(sendOptions.from);
					expect(_tx.data).toBe(
						'0x60806040523480156200001157600080fd5b5060405162000ed038038062000ed08339818101604052810190620000379190620001ea565b806001908162000048919062000486565b5060008081905550506200056d565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620000c08262000075565b810181811067ffffffffffffffff82111715620000e257620000e162000086565b5b80604052505050565b6000620000f762000057565b9050620001058282620000b5565b919050565b600067ffffffffffffffff82111562000128576200012762000086565b5b620001338262000075565b9050602081019050919050565b60005b838110156200016057808201518184015260208101905062000143565b60008484015250505050565b6000620001836200017d846200010a565b620000eb565b905082815260208101848484011115620001a257620001a162000070565b5b620001af84828562000140565b509392505050565b600082601f830112620001cf57620001ce6200006b565b5b8151620001e18482602086016200016c565b91505092915050565b60006020828403121562000203576200020262000061565b5b600082015167ffffffffffffffff81111562000224576200022362000066565b5b6200023284828501620001b7565b91505092915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200028e57607f821691505b602082108103620002a457620002a362000246565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200030e7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620002cf565b6200031a8683620002cf565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600062000367620003616200035b8462000332565b6200033c565b62000332565b9050919050565b6000819050919050565b620003838362000346565b6200039b62000392826200036e565b848454620002dc565b825550505050565b600090565b620003b2620003a3565b620003bf81848462000378565b505050565b5b81811015620003e757620003db600082620003a8565b600181019050620003c5565b5050565b601f82111562000436576200040081620002aa565b6200040b84620002bf565b810160208510156200041b578190505b620004336200042a85620002bf565b830182620003c4565b50505b505050565b600082821c905092915050565b60006200045b600019846008026200043b565b1980831691505092915050565b600062000476838362000448565b9150826002028217905092915050565b62000491826200023b565b67ffffffffffffffff811115620004ad57620004ac62000086565b5b620004b9825462000275565b620004c6828285620003eb565b600060209050601f831160018114620004fe5760008415620004e9578287015190505b620004f5858262000468565b86555062000565565b601f1984166200050e86620002aa565b60005b82811015620005385784890151825560018201915060208501945060208101905062000511565b8683101562000558578489015162000554601f89168262000448565b8355505b6001600288020188555050505b505050505050565b610953806200057d6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063a413686214610046578063cfae321714610077578063d09de08a14610095575b600080fd5b610060600480360381019061005b91906103c0565b61009f565b60405161006e9291906104a3565b60405180910390f35b61007f6101bd565b60405161008c91906104d3565b60405180910390f35b61009d61024f565b005b600060607f0d363f2fba46ab11b6db8da0125b0d5484787c44e265b48810735998bab12b756001846040516100d59291906105ee565b60405180910390a182600190816100ec91906107c6565b507f7d7846723bda52976e0286c6efffee937ee9f76817a867ec70531ad29fb1fc0e600160405161011d9190610898565b60405180910390a160018080805461013490610524565b80601f016020809104026020016040519081016040528092919081815260200182805461016090610524565b80156101ad5780601f10610182576101008083540402835291602001916101ad565b820191906000526020600020905b81548152906001019060200180831161019057829003601f168201915b5050505050905091509150915091565b6060600180546101cc90610524565b80601f01602080910402602001604051908101604052809291908181526020018280546101f890610524565b80156102455780601f1061021a57610100808354040283529160200191610245565b820191906000526020600020905b81548152906001019060200180831161022857829003601f168201915b5050505050905090565b600160005461025e91906108e9565b600081905550565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6102cd82610284565b810181811067ffffffffffffffff821117156102ec576102eb610295565b5b80604052505050565b60006102ff610266565b905061030b82826102c4565b919050565b600067ffffffffffffffff82111561032b5761032a610295565b5b61033482610284565b9050602081019050919050565b82818337600083830152505050565b600061036361035e84610310565b6102f5565b90508281526020810184848401111561037f5761037e61027f565b5b61038a848285610341565b509392505050565b600082601f8301126103a7576103a661027a565b5b81356103b7848260208601610350565b91505092915050565b6000602082840312156103d6576103d5610270565b5b600082013567ffffffffffffffff8111156103f4576103f3610275565b5b61040084828501610392565b91505092915050565b60008115159050919050565b61041e81610409565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561045e578082015181840152602081019050610443565b60008484015250505050565b600061047582610424565b61047f818561042f565b935061048f818560208601610440565b61049881610284565b840191505092915050565b60006040820190506104b86000830185610415565b81810360208301526104ca818461046a565b90509392505050565b600060208201905081810360008301526104ed818461046a565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061053c57607f821691505b60208210810361054f5761054e6104f5565b5b50919050565b60008190508160005260206000209050919050565b6000815461057781610524565b610581818661042f565b9450600182166000811461059c57600181146105b2576105e5565b60ff1983168652811515602002860193506105e5565b6105bb85610555565b60005b838110156105dd578154818901526001820191506020810190506105be565b808801955050505b50505092915050565b60006040820190508181036000830152610608818561056a565b9050818103602083015261061c818461046a565b90509392505050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026106727fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610635565b61067c8683610635565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006106c36106be6106b984610694565b61069e565b610694565b9050919050565b6000819050919050565b6106dd836106a8565b6106f16106e9826106ca565b848454610642565b825550505050565b600090565b6107066106f9565b6107118184846106d4565b505050565b5b818110156107355761072a6000826106fe565b600181019050610717565b5050565b601f82111561077a5761074b81610555565b61075484610625565b81016020851015610763578190505b61077761076f85610625565b830182610716565b50505b505050565b600082821c905092915050565b600061079d6000198460080261077f565b1980831691505092915050565b60006107b6838361078c565b9150826002028217905092915050565b6107cf82610424565b67ffffffffffffffff8111156107e8576107e7610295565b5b6107f28254610524565b6107fd828285610739565b600060209050601f831160018114610830576000841561081e578287015190505b61082885826107aa565b865550610890565b601f19841661083e86610555565b60005b8281101561086657848901518255600182019150602085019450602081019050610841565b86831015610883578489015161087f601f89168261078c565b8355505b6001600288020188555050505b505050505050565b600060208201905081810360008301526108b2818461056a565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006108f482610694565b91506108ff83610694565b9250828201905080821115610917576109166108ba565b5b9291505056fea26469706673582212207e5ba44159ffb37af8e8a9e7c5b6fb5ce81ea195b62ae3ac36288f2cf72c18a764736f6c634300081000330000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b4d79204772656574696e67000000000000000000000000000000000000000000',
					);
					expect(returnFormat).toBe(ETH_DATA_FORMAT);

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(BigInt(36916)) as any;
				});

			const deploy = contract.deploy({
				data: GreeterBytecode,
				arguments: ['My Greeting'],
			});

			const result = await deploy.estimateGas(sendOptions, ETH_DATA_FORMAT);
			expect(result).toStrictEqual(BigInt(36916));

			spyTx.mockClear();
			spyEstimateGas.mockClear();
		});

		it('estimateGas should work for the deploy function using both data and input web3config', async () => {
			const expectedProvider = 'http://127.0.0.1:8545';
			const web3Context = new Web3Context({
				provider: expectedProvider,
				config: { contractDataInputFill: 'both' },
			});

			const contract = new Contract(GreeterAbi, web3Context);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyEstimateGas = jest
				.spyOn(eth, 'estimateGas')
				.mockImplementationOnce((_objInstance, _tx, _block, returnFormat) => {
					expect(_block).toBe('latest');
					expect(_tx.to).toBeUndefined();
					expect(_tx.from).toStrictEqual(sendOptions.from);
					expect(_tx.data).toBe(
						'0x60806040523480156200001157600080fd5b5060405162000ed038038062000ed08339818101604052810190620000379190620001ea565b806001908162000048919062000486565b5060008081905550506200056d565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620000c08262000075565b810181811067ffffffffffffffff82111715620000e257620000e162000086565b5b80604052505050565b6000620000f762000057565b9050620001058282620000b5565b919050565b600067ffffffffffffffff82111562000128576200012762000086565b5b620001338262000075565b9050602081019050919050565b60005b838110156200016057808201518184015260208101905062000143565b60008484015250505050565b6000620001836200017d846200010a565b620000eb565b905082815260208101848484011115620001a257620001a162000070565b5b620001af84828562000140565b509392505050565b600082601f830112620001cf57620001ce6200006b565b5b8151620001e18482602086016200016c565b91505092915050565b60006020828403121562000203576200020262000061565b5b600082015167ffffffffffffffff81111562000224576200022362000066565b5b6200023284828501620001b7565b91505092915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200028e57607f821691505b602082108103620002a457620002a362000246565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200030e7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620002cf565b6200031a8683620002cf565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600062000367620003616200035b8462000332565b6200033c565b62000332565b9050919050565b6000819050919050565b620003838362000346565b6200039b62000392826200036e565b848454620002dc565b825550505050565b600090565b620003b2620003a3565b620003bf81848462000378565b505050565b5b81811015620003e757620003db600082620003a8565b600181019050620003c5565b5050565b601f82111562000436576200040081620002aa565b6200040b84620002bf565b810160208510156200041b578190505b620004336200042a85620002bf565b830182620003c4565b50505b505050565b600082821c905092915050565b60006200045b600019846008026200043b565b1980831691505092915050565b600062000476838362000448565b9150826002028217905092915050565b62000491826200023b565b67ffffffffffffffff811115620004ad57620004ac62000086565b5b620004b9825462000275565b620004c6828285620003eb565b600060209050601f831160018114620004fe5760008415620004e9578287015190505b620004f5858262000468565b86555062000565565b601f1984166200050e86620002aa565b60005b82811015620005385784890151825560018201915060208501945060208101905062000511565b8683101562000558578489015162000554601f89168262000448565b8355505b6001600288020188555050505b505050505050565b610953806200057d6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063a413686214610046578063cfae321714610077578063d09de08a14610095575b600080fd5b610060600480360381019061005b91906103c0565b61009f565b60405161006e9291906104a3565b60405180910390f35b61007f6101bd565b60405161008c91906104d3565b60405180910390f35b61009d61024f565b005b600060607f0d363f2fba46ab11b6db8da0125b0d5484787c44e265b48810735998bab12b756001846040516100d59291906105ee565b60405180910390a182600190816100ec91906107c6565b507f7d7846723bda52976e0286c6efffee937ee9f76817a867ec70531ad29fb1fc0e600160405161011d9190610898565b60405180910390a160018080805461013490610524565b80601f016020809104026020016040519081016040528092919081815260200182805461016090610524565b80156101ad5780601f10610182576101008083540402835291602001916101ad565b820191906000526020600020905b81548152906001019060200180831161019057829003601f168201915b5050505050905091509150915091565b6060600180546101cc90610524565b80601f01602080910402602001604051908101604052809291908181526020018280546101f890610524565b80156102455780601f1061021a57610100808354040283529160200191610245565b820191906000526020600020905b81548152906001019060200180831161022857829003601f168201915b5050505050905090565b600160005461025e91906108e9565b600081905550565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6102cd82610284565b810181811067ffffffffffffffff821117156102ec576102eb610295565b5b80604052505050565b60006102ff610266565b905061030b82826102c4565b919050565b600067ffffffffffffffff82111561032b5761032a610295565b5b61033482610284565b9050602081019050919050565b82818337600083830152505050565b600061036361035e84610310565b6102f5565b90508281526020810184848401111561037f5761037e61027f565b5b61038a848285610341565b509392505050565b600082601f8301126103a7576103a661027a565b5b81356103b7848260208601610350565b91505092915050565b6000602082840312156103d6576103d5610270565b5b600082013567ffffffffffffffff8111156103f4576103f3610275565b5b61040084828501610392565b91505092915050565b60008115159050919050565b61041e81610409565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561045e578082015181840152602081019050610443565b60008484015250505050565b600061047582610424565b61047f818561042f565b935061048f818560208601610440565b61049881610284565b840191505092915050565b60006040820190506104b86000830185610415565b81810360208301526104ca818461046a565b90509392505050565b600060208201905081810360008301526104ed818461046a565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061053c57607f821691505b60208210810361054f5761054e6104f5565b5b50919050565b60008190508160005260206000209050919050565b6000815461057781610524565b610581818661042f565b9450600182166000811461059c57600181146105b2576105e5565b60ff1983168652811515602002860193506105e5565b6105bb85610555565b60005b838110156105dd578154818901526001820191506020810190506105be565b808801955050505b50505092915050565b60006040820190508181036000830152610608818561056a565b9050818103602083015261061c818461046a565b90509392505050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026106727fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610635565b61067c8683610635565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006106c36106be6106b984610694565b61069e565b610694565b9050919050565b6000819050919050565b6106dd836106a8565b6106f16106e9826106ca565b848454610642565b825550505050565b600090565b6107066106f9565b6107118184846106d4565b505050565b5b818110156107355761072a6000826106fe565b600181019050610717565b5050565b601f82111561077a5761074b81610555565b61075484610625565b81016020851015610763578190505b61077761076f85610625565b830182610716565b50505b505050565b600082821c905092915050565b600061079d6000198460080261077f565b1980831691505092915050565b60006107b6838361078c565b9150826002028217905092915050565b6107cf82610424565b67ffffffffffffffff8111156107e8576107e7610295565b5b6107f28254610524565b6107fd828285610739565b600060209050601f831160018114610830576000841561081e578287015190505b61082885826107aa565b865550610890565b601f19841661083e86610555565b60005b8281101561086657848901518255600182019150602085019450602081019050610841565b86831015610883578489015161087f601f89168261078c565b8355505b6001600288020188555050505b505050505050565b600060208201905081810360008301526108b2818461056a565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006108f482610694565b91506108ff83610694565b9250828201905080821115610917576109166108ba565b5b9291505056fea26469706673582212207e5ba44159ffb37af8e8a9e7c5b6fb5ce81ea195b62ae3ac36288f2cf72c18a764736f6c634300081000330000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b4d79204772656574696e67000000000000000000000000000000000000000000',
					);
					expect(_tx.input).toBe(
						'0x60806040523480156200001157600080fd5b5060405162000ed038038062000ed08339818101604052810190620000379190620001ea565b806001908162000048919062000486565b5060008081905550506200056d565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620000c08262000075565b810181811067ffffffffffffffff82111715620000e257620000e162000086565b5b80604052505050565b6000620000f762000057565b9050620001058282620000b5565b919050565b600067ffffffffffffffff82111562000128576200012762000086565b5b620001338262000075565b9050602081019050919050565b60005b838110156200016057808201518184015260208101905062000143565b60008484015250505050565b6000620001836200017d846200010a565b620000eb565b905082815260208101848484011115620001a257620001a162000070565b5b620001af84828562000140565b509392505050565b600082601f830112620001cf57620001ce6200006b565b5b8151620001e18482602086016200016c565b91505092915050565b60006020828403121562000203576200020262000061565b5b600082015167ffffffffffffffff81111562000224576200022362000066565b5b6200023284828501620001b7565b91505092915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200028e57607f821691505b602082108103620002a457620002a362000246565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200030e7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620002cf565b6200031a8683620002cf565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600062000367620003616200035b8462000332565b6200033c565b62000332565b9050919050565b6000819050919050565b620003838362000346565b6200039b62000392826200036e565b848454620002dc565b825550505050565b600090565b620003b2620003a3565b620003bf81848462000378565b505050565b5b81811015620003e757620003db600082620003a8565b600181019050620003c5565b5050565b601f82111562000436576200040081620002aa565b6200040b84620002bf565b810160208510156200041b578190505b620004336200042a85620002bf565b830182620003c4565b50505b505050565b600082821c905092915050565b60006200045b600019846008026200043b565b1980831691505092915050565b600062000476838362000448565b9150826002028217905092915050565b62000491826200023b565b67ffffffffffffffff811115620004ad57620004ac62000086565b5b620004b9825462000275565b620004c6828285620003eb565b600060209050601f831160018114620004fe5760008415620004e9578287015190505b620004f5858262000468565b86555062000565565b601f1984166200050e86620002aa565b60005b82811015620005385784890151825560018201915060208501945060208101905062000511565b8683101562000558578489015162000554601f89168262000448565b8355505b6001600288020188555050505b505050505050565b610953806200057d6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063a413686214610046578063cfae321714610077578063d09de08a14610095575b600080fd5b610060600480360381019061005b91906103c0565b61009f565b60405161006e9291906104a3565b60405180910390f35b61007f6101bd565b60405161008c91906104d3565b60405180910390f35b61009d61024f565b005b600060607f0d363f2fba46ab11b6db8da0125b0d5484787c44e265b48810735998bab12b756001846040516100d59291906105ee565b60405180910390a182600190816100ec91906107c6565b507f7d7846723bda52976e0286c6efffee937ee9f76817a867ec70531ad29fb1fc0e600160405161011d9190610898565b60405180910390a160018080805461013490610524565b80601f016020809104026020016040519081016040528092919081815260200182805461016090610524565b80156101ad5780601f10610182576101008083540402835291602001916101ad565b820191906000526020600020905b81548152906001019060200180831161019057829003601f168201915b5050505050905091509150915091565b6060600180546101cc90610524565b80601f01602080910402602001604051908101604052809291908181526020018280546101f890610524565b80156102455780601f1061021a57610100808354040283529160200191610245565b820191906000526020600020905b81548152906001019060200180831161022857829003601f168201915b5050505050905090565b600160005461025e91906108e9565b600081905550565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6102cd82610284565b810181811067ffffffffffffffff821117156102ec576102eb610295565b5b80604052505050565b60006102ff610266565b905061030b82826102c4565b919050565b600067ffffffffffffffff82111561032b5761032a610295565b5b61033482610284565b9050602081019050919050565b82818337600083830152505050565b600061036361035e84610310565b6102f5565b90508281526020810184848401111561037f5761037e61027f565b5b61038a848285610341565b509392505050565b600082601f8301126103a7576103a661027a565b5b81356103b7848260208601610350565b91505092915050565b6000602082840312156103d6576103d5610270565b5b600082013567ffffffffffffffff8111156103f4576103f3610275565b5b61040084828501610392565b91505092915050565b60008115159050919050565b61041e81610409565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561045e578082015181840152602081019050610443565b60008484015250505050565b600061047582610424565b61047f818561042f565b935061048f818560208601610440565b61049881610284565b840191505092915050565b60006040820190506104b86000830185610415565b81810360208301526104ca818461046a565b90509392505050565b600060208201905081810360008301526104ed818461046a565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061053c57607f821691505b60208210810361054f5761054e6104f5565b5b50919050565b60008190508160005260206000209050919050565b6000815461057781610524565b610581818661042f565b9450600182166000811461059c57600181146105b2576105e5565b60ff1983168652811515602002860193506105e5565b6105bb85610555565b60005b838110156105dd578154818901526001820191506020810190506105be565b808801955050505b50505092915050565b60006040820190508181036000830152610608818561056a565b9050818103602083015261061c818461046a565b90509392505050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026106727fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610635565b61067c8683610635565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006106c36106be6106b984610694565b61069e565b610694565b9050919050565b6000819050919050565b6106dd836106a8565b6106f16106e9826106ca565b848454610642565b825550505050565b600090565b6107066106f9565b6107118184846106d4565b505050565b5b818110156107355761072a6000826106fe565b600181019050610717565b5050565b601f82111561077a5761074b81610555565b61075484610625565b81016020851015610763578190505b61077761076f85610625565b830182610716565b50505b505050565b600082821c905092915050565b600061079d6000198460080261077f565b1980831691505092915050565b60006107b6838361078c565b9150826002028217905092915050565b6107cf82610424565b67ffffffffffffffff8111156107e8576107e7610295565b5b6107f28254610524565b6107fd828285610739565b600060209050601f831160018114610830576000841561081e578287015190505b61082885826107aa565b865550610890565b601f19841661083e86610555565b60005b8281101561086657848901518255600182019150602085019450602081019050610841565b86831015610883578489015161087f601f89168261078c565b8355505b6001600288020188555050505b505050505050565b600060208201905081810360008301526108b2818461056a565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006108f482610694565b91506108ff83610694565b9250828201905080821115610917576109166108ba565b5b9291505056fea26469706673582212207e5ba44159ffb37af8e8a9e7c5b6fb5ce81ea195b62ae3ac36288f2cf72c18a764736f6c634300081000330000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b4d79204772656574696e67000000000000000000000000000000000000000000',
					);
					expect(returnFormat).toBe(ETH_DATA_FORMAT);

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(BigInt(36916)) as any;
				});

			const deploy = contract.deploy({
				data: GreeterBytecode,
				arguments: ['My Greeting'],
			});

			const result = await deploy.estimateGas(sendOptions, ETH_DATA_FORMAT);
			expect(result).toStrictEqual(BigInt(36916));

			spyTx.mockClear();
			spyEstimateGas.mockClear();
		});
		it('estimateGas should work for the deploy function using data web3config', async () => {
			const expectedProvider = 'http://127.0.0.1:8545';
			const web3Context = new Web3Context({
				provider: expectedProvider,
				config: { contractDataInputFill: 'data' },
			});

			const contract = new Contract(GreeterAbi, web3Context);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyEstimateGas = jest
				.spyOn(eth, 'estimateGas')
				.mockImplementationOnce((_objInstance, _tx, _block, returnFormat) => {
					expect(_block).toBe('latest');
					expect(_tx.to).toBeUndefined();
					expect(_tx.from).toStrictEqual(sendOptions.from);
					expect(_tx.data).toBe(
						'0x60806040523480156200001157600080fd5b5060405162000ed038038062000ed08339818101604052810190620000379190620001ea565b806001908162000048919062000486565b5060008081905550506200056d565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620000c08262000075565b810181811067ffffffffffffffff82111715620000e257620000e162000086565b5b80604052505050565b6000620000f762000057565b9050620001058282620000b5565b919050565b600067ffffffffffffffff82111562000128576200012762000086565b5b620001338262000075565b9050602081019050919050565b60005b838110156200016057808201518184015260208101905062000143565b60008484015250505050565b6000620001836200017d846200010a565b620000eb565b905082815260208101848484011115620001a257620001a162000070565b5b620001af84828562000140565b509392505050565b600082601f830112620001cf57620001ce6200006b565b5b8151620001e18482602086016200016c565b91505092915050565b60006020828403121562000203576200020262000061565b5b600082015167ffffffffffffffff81111562000224576200022362000066565b5b6200023284828501620001b7565b91505092915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200028e57607f821691505b602082108103620002a457620002a362000246565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200030e7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620002cf565b6200031a8683620002cf565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600062000367620003616200035b8462000332565b6200033c565b62000332565b9050919050565b6000819050919050565b620003838362000346565b6200039b62000392826200036e565b848454620002dc565b825550505050565b600090565b620003b2620003a3565b620003bf81848462000378565b505050565b5b81811015620003e757620003db600082620003a8565b600181019050620003c5565b5050565b601f82111562000436576200040081620002aa565b6200040b84620002bf565b810160208510156200041b578190505b620004336200042a85620002bf565b830182620003c4565b50505b505050565b600082821c905092915050565b60006200045b600019846008026200043b565b1980831691505092915050565b600062000476838362000448565b9150826002028217905092915050565b62000491826200023b565b67ffffffffffffffff811115620004ad57620004ac62000086565b5b620004b9825462000275565b620004c6828285620003eb565b600060209050601f831160018114620004fe5760008415620004e9578287015190505b620004f5858262000468565b86555062000565565b601f1984166200050e86620002aa565b60005b82811015620005385784890151825560018201915060208501945060208101905062000511565b8683101562000558578489015162000554601f89168262000448565b8355505b6001600288020188555050505b505050505050565b610953806200057d6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063a413686214610046578063cfae321714610077578063d09de08a14610095575b600080fd5b610060600480360381019061005b91906103c0565b61009f565b60405161006e9291906104a3565b60405180910390f35b61007f6101bd565b60405161008c91906104d3565b60405180910390f35b61009d61024f565b005b600060607f0d363f2fba46ab11b6db8da0125b0d5484787c44e265b48810735998bab12b756001846040516100d59291906105ee565b60405180910390a182600190816100ec91906107c6565b507f7d7846723bda52976e0286c6efffee937ee9f76817a867ec70531ad29fb1fc0e600160405161011d9190610898565b60405180910390a160018080805461013490610524565b80601f016020809104026020016040519081016040528092919081815260200182805461016090610524565b80156101ad5780601f10610182576101008083540402835291602001916101ad565b820191906000526020600020905b81548152906001019060200180831161019057829003601f168201915b5050505050905091509150915091565b6060600180546101cc90610524565b80601f01602080910402602001604051908101604052809291908181526020018280546101f890610524565b80156102455780601f1061021a57610100808354040283529160200191610245565b820191906000526020600020905b81548152906001019060200180831161022857829003601f168201915b5050505050905090565b600160005461025e91906108e9565b600081905550565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6102cd82610284565b810181811067ffffffffffffffff821117156102ec576102eb610295565b5b80604052505050565b60006102ff610266565b905061030b82826102c4565b919050565b600067ffffffffffffffff82111561032b5761032a610295565b5b61033482610284565b9050602081019050919050565b82818337600083830152505050565b600061036361035e84610310565b6102f5565b90508281526020810184848401111561037f5761037e61027f565b5b61038a848285610341565b509392505050565b600082601f8301126103a7576103a661027a565b5b81356103b7848260208601610350565b91505092915050565b6000602082840312156103d6576103d5610270565b5b600082013567ffffffffffffffff8111156103f4576103f3610275565b5b61040084828501610392565b91505092915050565b60008115159050919050565b61041e81610409565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561045e578082015181840152602081019050610443565b60008484015250505050565b600061047582610424565b61047f818561042f565b935061048f818560208601610440565b61049881610284565b840191505092915050565b60006040820190506104b86000830185610415565b81810360208301526104ca818461046a565b90509392505050565b600060208201905081810360008301526104ed818461046a565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061053c57607f821691505b60208210810361054f5761054e6104f5565b5b50919050565b60008190508160005260206000209050919050565b6000815461057781610524565b610581818661042f565b9450600182166000811461059c57600181146105b2576105e5565b60ff1983168652811515602002860193506105e5565b6105bb85610555565b60005b838110156105dd578154818901526001820191506020810190506105be565b808801955050505b50505092915050565b60006040820190508181036000830152610608818561056a565b9050818103602083015261061c818461046a565b90509392505050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026106727fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610635565b61067c8683610635565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006106c36106be6106b984610694565b61069e565b610694565b9050919050565b6000819050919050565b6106dd836106a8565b6106f16106e9826106ca565b848454610642565b825550505050565b600090565b6107066106f9565b6107118184846106d4565b505050565b5b818110156107355761072a6000826106fe565b600181019050610717565b5050565b601f82111561077a5761074b81610555565b61075484610625565b81016020851015610763578190505b61077761076f85610625565b830182610716565b50505b505050565b600082821c905092915050565b600061079d6000198460080261077f565b1980831691505092915050565b60006107b6838361078c565b9150826002028217905092915050565b6107cf82610424565b67ffffffffffffffff8111156107e8576107e7610295565b5b6107f28254610524565b6107fd828285610739565b600060209050601f831160018114610830576000841561081e578287015190505b61082885826107aa565b865550610890565b601f19841661083e86610555565b60005b8281101561086657848901518255600182019150602085019450602081019050610841565b86831015610883578489015161087f601f89168261078c565b8355505b6001600288020188555050505b505050505050565b600060208201905081810360008301526108b2818461056a565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006108f482610694565b91506108ff83610694565b9250828201905080821115610917576109166108ba565b5b9291505056fea26469706673582212207e5ba44159ffb37af8e8a9e7c5b6fb5ce81ea195b62ae3ac36288f2cf72c18a764736f6c634300081000330000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b4d79204772656574696e67000000000000000000000000000000000000000000',
					);
					expect(returnFormat).toBe(ETH_DATA_FORMAT);

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(BigInt(36916)) as any;
				});

			const deploy = contract.deploy({
				data: GreeterBytecode,
				arguments: ['My Greeting'],
			});

			const result = await deploy.estimateGas(sendOptions, ETH_DATA_FORMAT);
			expect(result).toStrictEqual(BigInt(36916));

			spyTx.mockClear();
			spyEstimateGas.mockClear();
		});

		it('estimateGas should work for contract method', async () => {
			const arg = 'Hello';

			const contract = new Contract(GreeterAbi, { data: GreeterBytecode });

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyEstimateGas = jest
				.spyOn(eth, 'estimateGas')
				.mockImplementationOnce((_objInstance, _tx, _block) => {
					expect(_block).toBe('latest');
					expect(_tx.to).toStrictEqual(deployedAddr);
					expect(_tx.from).toStrictEqual(sendOptions.from);
					expect(_tx.data).toBe(
						'0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000',
					);

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(BigInt(36916)) as any;
				});

			const deployedContract = await contract
				.deploy({
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const result = await deployedContract.methods.setGreeting(arg).estimateGas(sendOptions);
			expect(result).toStrictEqual(BigInt(36916));

			spyTx.mockClear();
			spyEstimateGas.mockClear();
		});

		it('encodeABI should work for contract method', async () => {
			const arg = 'Hello';

			const contract = new Contract(GreeterAbi, { data: GreeterBytecode });

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const deployedContract = await contract
				.deploy({
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const result = deployedContract.methods.setGreeting(arg).encodeABI();

			expect(result).toBe(
				'0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000',
			);

			spyTx.mockClear();
		});

		it('contract method send without contract address should throw error', async () => {
			const arg = 'Hello';

			const contract = new Contract(GreeterAbi);

			await expect(async () => {
				await contract.methods.setGreeting(arg).send(sendOptions);
			}).rejects.toThrow(new Web3ContractError('Contract address not specified'));
		});

		it('contract method send without from address should throw error', async () => {
			const gas = '1000000';
			const sendOptionsSpecial = { gas };
			const arg = 'Hello';

			const contract = new Contract(GreeterAbi);
			contract.options.address = '0x12364916b10Ae90076dDa6dE756EE1395BB69ec2';

			/* eslint-disable no-useless-escape */
			await expect(async () => {
				await contract.methods.setGreeting(arg).send(sendOptionsSpecial);
			}).rejects.toThrow('Contract "from" address not specified');
		});

		it('contract method createAccessList should work', async () => {
			const fromAddr: Address = '0x20bc23D0598b12c34cBDEf1fae439Ba8744DB426';
			const result: AccessListResult = {
				accessList: [
					{
						address: deployedAddr,
						storageKeys: [
							'0x0000000000000000000000000000000000000000000000000000000000000001',
						],
					},
				],
				gasUsed: '0x644e',
			};

			const contract = new Contract(GreeterAbi, deployedAddr);

			const spyEthCall = jest
				.spyOn(eth, 'createAccessList')
				.mockImplementation((_objInstance, _tx) => {
					expect(_tx.to).toStrictEqual(deployedAddr);
					expect(_tx.data).toBe('0xcfae3217');
					expect(_tx.from).toBe(fromAddr);
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(result) as any; // contract class should decode encodedArg
				});

			const res = await contract.methods.greet().createAccessList({ from: fromAddr });
			expect(res).toStrictEqual(result);

			spyEthCall.mockClear();
		});

		it('contract method createAccessList should work using data with web3config', async () => {
			const expectedProvider = 'http://127.0.0.1:8545';
			const web3Context = new Web3Context({
				provider: expectedProvider,
				config: { contractDataInputFill: 'data' },
			});
			const fromAddr: Address = '0x20bc23D0598b12c34cBDEf1fae439Ba8744DB426';
			const result: AccessListResult = {
				accessList: [
					{
						address: deployedAddr,
						storageKeys: [
							'0x0000000000000000000000000000000000000000000000000000000000000001',
						],
					},
				],
				gasUsed: '0x644e',
			};

			const contract = new Contract(GreeterAbi, deployedAddr, web3Context);

			const spyEthCall = jest
				.spyOn(eth, 'createAccessList')
				.mockImplementation((_objInstance, _tx) => {
					expect(_tx.to).toStrictEqual(deployedAddr);
					expect(_tx.data).toBe('0xcfae3217');
					expect(_tx.from).toBe(fromAddr);
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(result) as any; // contract class should decode encodedArg
				});

			const res = await contract.methods.greet().createAccessList({ from: fromAddr });
			expect(res).toStrictEqual(result);

			spyEthCall.mockClear();
		});
		it('contract method createAccessList should work using data with web3config with both input and data', async () => {
			const expectedProvider = 'http://127.0.0.1:8545';
			const web3Context = new Web3Context({
				provider: expectedProvider,
				config: { contractDataInputFill: 'both' },
			});
			const fromAddr: Address = '0x20bc23D0598b12c34cBDEf1fae439Ba8744DB426';
			const result: AccessListResult = {
				accessList: [
					{
						address: deployedAddr,
						storageKeys: [
							'0x0000000000000000000000000000000000000000000000000000000000000001',
						],
					},
				],
				gasUsed: '0x644e',
			};

			const contract = new Contract(GreeterAbi, deployedAddr, web3Context);

			const spyEthCall = jest
				.spyOn(eth, 'createAccessList')
				.mockImplementation((_objInstance, _tx) => {
					expect(_tx.to).toStrictEqual(deployedAddr);
					expect(_tx.data).toBe('0xcfae3217');
					expect(_tx.input).toBe('0xcfae3217');
					expect(_tx.from).toBe(fromAddr);
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(result) as any; // contract class should decode encodedArg
				});

			const res = await contract.methods.greet().createAccessList({ from: fromAddr });
			expect(res).toStrictEqual(result);

			spyEthCall.mockClear();
		});

		it('should correctly apply provided Web3Context to new Contract instance', () => {
			const expectedProvider = 'http://127.0.0.1:8545';
			const web3Context = new Web3Context({
				provider: expectedProvider,
				config: { handleRevert: true, defaultTransactionType: '0x2' },
			});
			const contract = new Contract(GreeterAbi, web3Context);
			expect(contract.config).toStrictEqual(web3Context.config);
		});

		it('should populate method to tx object', () => {
			const expectedProvider = 'http://127.0.0.1:8545';
			const web3Context = new Web3Context({
				provider: expectedProvider,
				config: { handleRevert: true, defaultTransactionType: '0x2' },
			});
			const contract = new Contract(
				GreeterAbi,
				'0x00000000219ab540356cBB839Cbe05303d7705F1',
				web3Context,
			);

			const tx = contract.methods
				.greet()
				.populateTransaction({ from: '0x00000000219ab540356cBB839Cbe05303d7705F2' });
			expect(tx).toEqual({
				to: '0x00000000219AB540356cBb839cbe05303D7705F1',
				gas: undefined,
				gasPrice: undefined,
				from: '0x00000000219ab540356cBB839Cbe05303d7705F2',
				input: undefined,
				maxPriorityFeePerGas: undefined,
				maxFeePerGas: undefined,
				data: '0xcfae3217',
			});
		});
	});
});
