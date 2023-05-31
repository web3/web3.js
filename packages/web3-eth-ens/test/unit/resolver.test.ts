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

import { Web3Context, Web3ContextObject } from 'web3-core';
import { ResolverMethodMissingError } from 'web3-errors';
import { Contract, NonPayableMethodObject } from 'web3-eth-contract';
import { sha3 } from 'web3-utils';
import { PublicResolverAbi } from '../../src/abi/ens/PublicResolver';
import { interfaceIds, methodsInInterface } from '../../src/config';
import { Registry } from '../../src/registry';
import { Resolver } from '../../src/resolver';
import { namehash } from '../../src/utils';

describe('resolver', () => {
	let object: Web3ContextObject;
	let registry: Registry;
	let resolver: Resolver;
	let contract: Contract<typeof PublicResolverAbi>;
	const mockAddress = '0x0000000000000000000000000000000000000000';
	const ENS_NAME = 'web3js.eth';

	beforeAll(() => {
		const context = new Web3Context('http://test.com');
		object = context.getContextObject();

		registry = new Registry(object);
		resolver = new Resolver(registry);
		contract = new Contract(PublicResolverAbi, mockAddress);
	});

	describe('checkInterfaceSupport', () => {
		it('isNullish interface', async () => {
			const methodName = 'nullish';
			await expect(resolver.checkInterfaceSupport(contract, methodName)).rejects.toThrow(
				new ResolverMethodMissingError(mockAddress, methodName),
			);
		});
		it('isNullish interface with no address', async () => {
			const methodName = 'nullish';
			const localContract = new Contract(PublicResolverAbi);
			await expect(resolver.checkInterfaceSupport(localContract, methodName)).rejects.toThrow(
				new ResolverMethodMissingError('', methodName),
			);
		});

		it('Doesn"t support interface', async () => {
			const methodName = methodsInInterface.setAddr; // Just a method to pass first check

			const supportsInterfaceMock = jest
				.spyOn(contract.methods, 'supportsInterface')
				.mockReturnValue({
					call: jest.fn().mockReturnValue(false),
				} as unknown as NonPayableMethodObject<any, any>);

			await expect(resolver.checkInterfaceSupport(contract, methodName)).rejects.toThrow(
				new ResolverMethodMissingError(mockAddress, methodName),
			);

			expect(supportsInterfaceMock).toHaveBeenCalledWith(interfaceIds[methodName]);
		});
		it('Doesn"t support interface with no address', async () => {
			const methodName = methodsInInterface.setAddr; // Just a method to pass first check
			const localContract = new Contract(PublicResolverAbi);
			const supportsInterfaceMock = jest
				.spyOn(localContract.methods, 'supportsInterface')
				.mockReturnValue({
					call: jest.fn().mockReturnValue(false),
				} as unknown as NonPayableMethodObject<any, any>);

			await expect(resolver.checkInterfaceSupport(localContract, methodName)).rejects.toThrow(
				new ResolverMethodMissingError('', methodName),
			);
			expect(supportsInterfaceMock).toHaveBeenCalledWith(interfaceIds[methodName]);
		});

		it.each(Object.values(methodsInInterface))(
			'supported interface for %s',
			async methodName => {
				const supportsInterfaceMock = jest
					.spyOn(contract.methods, 'supportsInterface')
					.mockReturnValue({
						call: jest.fn().mockReturnValue(true),
					} as unknown as NonPayableMethodObject<any, any>);

				await expect(
					resolver.checkInterfaceSupport(contract, methodName),
				).resolves.not.toThrow();

				expect(supportsInterfaceMock).toHaveBeenCalledWith(interfaceIds[methodName]);
			},
		);
	});
	describe('addr', () => {
		it('getAddress', async () => {
			const supportsInterfaceMock = jest
				.spyOn(contract.methods, 'supportsInterface')
				.mockReturnValue({
					call: async () => Promise.resolve(true),
				} as unknown as NonPayableMethodObject<any, any>);

			const addrMock = jest.spyOn(contract.methods, 'addr').mockReturnValue({
				call: async () => Promise.resolve(true),
			} as unknown as NonPayableMethodObject<any, any>);

			// todo when moving this mock in beforeAll, jest calls the actual implementation, how to fix that
			// I use this in many places
			jest.spyOn(registry, 'getResolver').mockImplementation(async () => {
				return new Promise(resolve => {
					resolve(contract);
				});
			});

			await resolver.getAddress(ENS_NAME);
			expect(supportsInterfaceMock).toHaveBeenCalledWith(
				interfaceIds[methodsInInterface.addr],
			);
			expect(addrMock).toHaveBeenCalledWith(namehash(ENS_NAME), 60);
		});
	});

	describe('pubkey', () => {
		it('getPubkey', async () => {
			const supportsInterfaceMock = jest
				.spyOn(contract.methods, 'supportsInterface')
				.mockReturnValue({
					call: async () => Promise.resolve(true),
				} as unknown as NonPayableMethodObject<any, any>);

			const pubkeyMock = jest.spyOn(contract.methods, 'pubkey').mockReturnValue({
				call: jest.fn(),
			} as unknown as NonPayableMethodObject<any, any>);

			// todo when moving this mock in beforeAll, jest calls the actual implementation, how to fix that
			// I use this in many places
			jest.spyOn(registry, 'getResolver').mockImplementation(async () => {
				return new Promise(resolve => {
					resolve(contract);
				});
			});

			await resolver.getPubkey(ENS_NAME);
			expect(supportsInterfaceMock).toHaveBeenCalledWith(
				interfaceIds[methodsInInterface.pubkey],
			);
			expect(pubkeyMock).toHaveBeenCalledWith(namehash(ENS_NAME));
		});
	});

	describe('Contenthash', () => {
		it('getContenthash', async () => {
			const supportsInterfaceMock = jest
				.spyOn(contract.methods, 'supportsInterface')
				.mockReturnValue({
					call: async () => Promise.resolve(true),
				} as unknown as NonPayableMethodObject<any, any>);

			const contenthashMock = jest.spyOn(contract.methods, 'contenthash').mockReturnValue({
				call: jest.fn(),
			} as unknown as NonPayableMethodObject<any, any>);

			// todo when moving this mock in beforeAll, jest calls the actual implementation, how to fix that
			// I use this in many places
			jest.spyOn(registry, 'getResolver').mockImplementation(async () => {
				return new Promise(resolve => {
					resolve(contract);
				});
			});

			await resolver.getContenthash(ENS_NAME);
			expect(supportsInterfaceMock).toHaveBeenCalledWith(
				interfaceIds[methodsInInterface.contenthash],
			);
			expect(contenthashMock).toHaveBeenCalledWith(namehash(ENS_NAME));
		});
	});

	describe('supportsInterface', () => {
		it('check supportsInterface for non strict hex id', async () => {
			const interfaceId = 'setAddr';
			jest.spyOn(registry, 'getResolver').mockImplementation(async () => {
				return new Promise(resolve => {
					resolve(contract);
				});
			});

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const call = jest.spyOn({ call: () => {} }, 'call');

			const supportsInterfaceMock = jest
				.spyOn(contract.methods, 'supportsInterface')
				.mockReturnValue({
					call,
				} as unknown as NonPayableMethodObject<any, any>);

			await expect(resolver.supportsInterface(ENS_NAME, interfaceId)).resolves.not.toThrow();

			// expect(setContenthashMock).toHaveBeenCalledWith(namehash(ENS_NAME), hash);
			expect(supportsInterfaceMock).toHaveBeenCalledWith(sha3(interfaceId)?.substring(0, 10));
			expect(call).toHaveBeenCalled();
		});

		it('check supportsInterface for empty non strict hex id', async () => {
			const interfaceId = ''; // empty
			jest.spyOn(registry, 'getResolver').mockImplementation(async () => {
				return new Promise(resolve => {
					resolve(contract);
				});
			});

			await expect(resolver.supportsInterface(ENS_NAME, interfaceId)).rejects.toThrow(
				new Error('Invalid interface Id'),
			);
		});

		it.each(Object.values(interfaceIds))(
			'check supportsInterface for valid hex ids',
			async () => {
				const interfaceId = 'setAddr';
				jest.spyOn(registry, 'getResolver').mockImplementation(async () => {
					return new Promise(resolve => {
						resolve(contract);
					});
				});

				// eslint-disable-next-line @typescript-eslint/no-empty-function
				const call = jest.spyOn({ call: () => {} }, 'call');

				const supportsInterfaceMock = jest
					.spyOn(contract.methods, 'supportsInterface')
					.mockReturnValue({
						call,
					} as unknown as NonPayableMethodObject<any, any>);

				await expect(
					resolver.supportsInterface(ENS_NAME, interfaceId),
				).resolves.not.toThrow();

				// expect(setContenthashMock).toHaveBeenCalledWith(namehash(ENS_NAME), hash);
				expect(supportsInterfaceMock).toHaveBeenCalledWith(
					sha3(interfaceId)?.substring(0, 10),
				);
				expect(call).toHaveBeenCalled();
			},
		);
	});
});
