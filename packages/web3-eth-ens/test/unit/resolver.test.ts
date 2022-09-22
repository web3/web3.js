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
import { Contract, NonPayableMethodObject } from 'web3-eth-contract';
// import { resolve } from 'path';
import { ResolverMethodMissingError } from 'web3-errors';
// import { Bytes, Address, DataFormat } from 'web3-utils';
// import { DEFAULT_RETURN_FORMAT } from 'web3-utils';
import { sha3Raw } from 'web3-utils';
import { Registry } from '../../src/registry';
import { Resolver } from '../../src/resolver';
// import { ENS } from '../../src/ens';
import { PublicResolverAbi } from '../../src/abi/ens/PublicResolver';
// import { PublicResolverBytecode } from '../fixtures/ens/bytecode/PublicResolverBytecode';
import { methodsInInterface, interfaceIds } from '../../src/config';
import { namehash } from '../../src/utils';

describe('resolver', () => {
	// class ResolverExtended extends Resolver {
	// 	public async getResolverContractAdapterExtended(ENSName: string) {
	// 		//  TODO : (Future 4.1.0 TDB) cache resolver contract if frequently queried same ENS name, refresh cache based on TTL and usage, also limit cache size, optional cache with a flag
	// 		return this.getResolverContractAdapter(ENSName);
	// 	}
	// } // so we can mock getResolverContractAdapter

	let object: Web3ContextObject;
	let registry: Registry;
	let resolver: Resolver;
	// let registryResolver: Resolver;
	let contract: Contract<typeof PublicResolverAbi>;
	const mockAddress = '0x0000000000000000000000000000000000000000';
	const ENS_NAME = 'web3js.eth';
	const x = '0x1000000000000000000000000000000000000000000000000000000000000000';
	const y = '0x2000000000000000000000000000000000000000000000000000000000000000';

	beforeAll(() => {
		const context = new Web3Context('http://test.com');
		object = context.getContextObject() as Web3ContextObject;

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
	describe('setAddress', () => {
		it('valid', async () => {
			const checkInteraface = jest.spyOn(resolver, 'checkInterfaceSupport');
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call

			jest.spyOn(contract.methods, 'setAddr').mockReturnValue({
				send: jest.fn(),
			} as unknown as NonPayableMethodObject<any, any>);

			jest.spyOn(contract.methods, 'supportsInterface').mockReturnValue({
				call: jest.fn().mockReturnValue(true),
			} as unknown as NonPayableMethodObject<any, any>);

			jest.spyOn(registry, 'getResolver').mockImplementation(async () => {
				return new Promise(resolve => {
					resolve(contract);
				});
			});

			// todo add expect for ENS_NAME
			await resolver.setAddress(ENS_NAME, mockAddress, { from: mockAddress });
			expect(checkInteraface).toHaveBeenCalled();
			// expect(getResolverContractAdapter).toHaveBeenCalledWith('name.eth');
		});
	});

	describe('setPubkey', () => {
		it('should set Pubkey', async () => {
			const setPubKeyMethod = methodsInInterface.setPubkey;

			jest.spyOn(registry, 'getResolver').mockImplementation(async () => {
				return new Promise(resolve => {
					resolve(contract);
				});
			});

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const setPubKeyMock = jest.spyOn(contract.methods, 'setPubkey').mockReturnValue({
				send,
			} as unknown as NonPayableMethodObject<any, any>);

			const supportsInterfaceMock = jest
				.spyOn(contract.methods, 'supportsInterface')
				.mockReturnValue({
					call: jest.fn().mockReturnValue(true),
				} as unknown as NonPayableMethodObject<any, any>);

			const sendOptions = { from: mockAddress };
			await expect(resolver.setPubkey(ENS_NAME, x, y, sendOptions)).resolves.not.toThrow();

			expect(setPubKeyMock).toHaveBeenCalledWith(
				namehash(ENS_NAME),
				namehash(x),
				namehash(y),
			);
			expect(supportsInterfaceMock).toHaveBeenCalledWith(interfaceIds[setPubKeyMethod]);
			expect(send).toHaveBeenCalledWith(sendOptions);
		});
	});

	describe('setContenthash', () => {
		it('should set contenthash', async () => {
			const setContenthashMethod = methodsInInterface.setContenthash;
			const hash = sha3Raw('justToHash');

			jest.spyOn(registry, 'getResolver').mockImplementation(async () => {
				return new Promise(resolve => {
					resolve(contract);
				});
			});

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const setContenthashMock = jest
				.spyOn(contract.methods, 'setContenthash')
				.mockReturnValue({
					send,
				} as unknown as NonPayableMethodObject<any, any>);

			const supportsInterfaceMock = jest
				.spyOn(contract.methods, 'supportsInterface')
				.mockReturnValue({
					call: jest.fn().mockReturnValue(true),
				} as unknown as NonPayableMethodObject<any, any>);

			// await expect(
			// 	resolver.checkInterfaceSupport(contract, setPubKeyMethod),
			// ).resolves.not.toThrow();

			const sendOptions = { from: mockAddress };
			await expect(
				resolver.setContenthash(ENS_NAME, hash, sendOptions),
			).resolves.not.toThrow();

			expect(setContenthashMock).toHaveBeenCalledWith(namehash(ENS_NAME), hash);
			expect(supportsInterfaceMock).toHaveBeenCalledWith(interfaceIds[setContenthashMethod]);
			expect(send).toHaveBeenCalledWith(sendOptions);
		});
	});
});
