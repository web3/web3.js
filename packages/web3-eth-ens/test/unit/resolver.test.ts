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
import { Registry } from '../../src/registry';
import { Resolver } from '../../src/resolver';
// import { ENS } from '../../src/ens';
import { PublicResolverAbi } from '../../src/abi/ens/PublicResolver';
// import { PublicResolverBytecode } from '../fixtures/ens/bytecode/PublicResolverBytecode';
import { methodsInInterface, interfaceIds } from '../../src/config';

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

	beforeAll(() => {
		const context = new Web3Context('http://test.com');
		object = context.getContextObject() as Web3ContextObject;

		registry = new Registry(object);
		resolver = new Resolver(registry);
		contract = new Contract(PublicResolverAbi, mockAddress);

		// const setAddr = jest.spyOn(contract.methods, 'setAddr');
		// jest.jest.mo;
		// setAddr.send = jest.fn();
		// [''],
		// '',
		// new Contract.providers.HttpProvider('http://test.com'),
		// );
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

			await resolver.setAddress('name.eth', mockAddress, { from: mockAddress });
			expect(checkInteraface).toHaveBeenCalled();
			// expect(getResolverContractAdapter).toHaveBeenCalledWith('name.eth');
		});
	});

	// it('should', () => {
	// 	const registry = new Registry(object);
	// 	const resolver = new Resolver(registry);

	// 	expect(resolver.getAddress).toBeDefined();
	// 	expect(resolver.checkInterfaceSupport).toBeDefined();
	// 	expect(resolver.setAddress).toBeDefined();
	// 	expect(resolver.setPubkey).toBeDefined();
	// 	expect(resolver.setContenthash).toBeDefined();
	// 	expect(resolver.supportsInterface).toBeDefined();
	// 	expect(resolver.getPubkey).toBeDefined();
	// 	expect(resolver.getContenthash).toBeDefined();
	// });
});
