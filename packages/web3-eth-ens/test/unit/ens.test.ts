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

import { Web3Context, Web3ContextObject, Web3EventMap, Web3PromiEvent } from 'web3-core';
import { NonPayableMethodObject, Contract } from 'web3-eth-contract';
import { ResolverMethodMissingError } from 'web3-errors';
import { sha3Raw, sha3, DEFAULT_RETURN_FORMAT, DataFormat } from 'web3-utils';
import { Address, Bytes } from 'web3-types';
import { Registry } from '../../src/registry';
import { ENSRegistryAbi } from '../../src/abi/ens/ENSRegistry';
import { methodsInInterface, interfaceIds, registryAddresses } from '../../src/config';
import { namehash } from '../../src/utils';
import { ENS } from '../../src/ens';
import { PublicResolverAbi } from '../../src/abi/ens/PublicResolver';
import { Resolver } from '../../src/resolver';

/* eslint-disable @typescript-eslint/no-unused-vars */
describe('ens', () => {
	const TTL = 3600;
	let object: Web3ContextObject;
	let registry: Registry;
	// let contract: Contract<typeof PublicResolverAbi>;
	let resolver: Resolver;
	let contract: Contract<typeof ENSRegistryAbi>;
	let resolverContract: Contract<typeof PublicResolverAbi>;
	const mockAddress = '0x0000000000000000000000000000000000000000';
	const ENS_NAME = 'web3js.eth';
	const x = '0x1000000000000000000000000000000000000000000000000000000000000000';
	const y = '0x2000000000000000000000000000000000000000000000000000000000000000';
	let ens: ENS;

	beforeAll(() => {
		const context = new Web3Context('http://test.com');
		object = context.getContextObject() as Web3ContextObject;

		registry = new Registry(object);
		resolver = new Resolver(registry);
		contract = new Contract(ENSRegistryAbi, mockAddress);
		resolverContract = new Contract(PublicResolverAbi, mockAddress);
		ens = new ENS(registryAddresses.main, object);
	});

	// afterEach(() => {
	// 	jest.clearAllMocks();
	// });

	describe('Resolver', () => {
		it('setResolver', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const setResolverMock = jest.spyOn(ens['_registry'], 'setResolver').mockReturnValue({
				send,
			} as unknown as Web3PromiEvent<any, any>);

			const sendOptions = { from: mockAddress };
			await ens.setResolver(ENS_NAME, mockAddress, sendOptions);
			// await registry.setOwner(ENS_NAME, mockAddress, sendOptions);
			expect(setResolverMock).toHaveBeenCalledWith(
				ENS_NAME,
				mockAddress,
				sendOptions,
				DEFAULT_RETURN_FORMAT,
			);
		});

		it('getResolver', async () => {
			const getResolverMock = jest
				.spyOn(ens['_registry'], 'getResolver')
				.mockResolvedValue(resolverContract);

			await ens.getResolver(ENS_NAME);

			expect(getResolverMock).toHaveBeenCalledWith(ENS_NAME);
		});
	});

	describe('Subnode', () => {
		it('setSubnodeRecord', async () => {
			const label = sha3Raw(ENS_NAME);

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const setSubnodeRecordMock = jest
				.spyOn(ens['_registry'], 'setSubnodeRecord')
				.mockReturnValue({
					send,
				} as unknown as Web3PromiEvent<any, any>);

			const sendOptions = { from: mockAddress };
			await ens.setSubnodeRecord(ENS_NAME, label, mockAddress, mockAddress, TTL, sendOptions);

			expect(setSubnodeRecordMock).toHaveBeenCalledWith(
				ENS_NAME,
				label,
				mockAddress,
				mockAddress,
				TTL,
				sendOptions,
				DEFAULT_RETURN_FORMAT,
			);
		});
		it('setSubnodeOwner', async () => {
			const label = sha3Raw(ENS_NAME);
			const node = namehash(ENS_NAME);

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const setSubnodeOwnerMock = jest
				.spyOn(ens['_registry'], 'setSubnodeOwner')
				.mockReturnValue({
					send,
				} as unknown as Web3PromiEvent<any, any>);

			const sendOptions = { from: mockAddress };
			await ens.setSubnodeOwner(
				ENS_NAME,
				label,
				mockAddress,
				sendOptions,
				DEFAULT_RETURN_FORMAT,
			);

			expect(setSubnodeOwnerMock).toHaveBeenCalledWith(
				ENS_NAME,
				label,
				mockAddress,
				sendOptions,
				DEFAULT_RETURN_FORMAT,
			);
		});
	});

	describe('ApprovalForAll', () => {
		it('setApprovalForAll', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const setApprovalForAllMock = jest
				.spyOn(ens['_registry'], 'setApprovalForAll')
				.mockReturnValue({
					send,
				} as unknown as Web3PromiEvent<any, any>);

			const sendOptions = { from: mockAddress };
			await ens.setApprovalForAll(ENS_NAME, true, sendOptions);
			// await registry.setOwner(ENS_NAME, mockAddress, sendOptions);
			expect(setApprovalForAllMock).toHaveBeenCalledWith(ENS_NAME, true, sendOptions);
		});

		it('isApprovedForAll', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const isApprovedForAllMock = jest
				.spyOn(ens['_registry'], 'isApprovedForAll')
				.mockReturnValue({
					send,
				} as unknown as Web3PromiEvent<any, any>);
			await ens.isApprovedForAll(mockAddress, mockAddress, DEFAULT_RETURN_FORMAT);

			expect(isApprovedForAllMock).toHaveBeenCalledWith(
				mockAddress,
				mockAddress,
				DEFAULT_RETURN_FORMAT,
			);
		});
	});

	describe('Record', () => {
		it('setRecord', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const setRecordMock = jest.spyOn(ens['_registry'], 'setRecord').mockReturnValue({
				send,
			} as unknown as Web3PromiEvent<any, any>);

			const sendOptions = { from: mockAddress };
			await ens.setRecord(ENS_NAME, mockAddress, mockAddress, TTL, sendOptions);
			expect(setRecordMock).toHaveBeenCalledWith(
				ENS_NAME,
				mockAddress,
				mockAddress,
				TTL,
				sendOptions,
			);
		});

		it('recordExists', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const call = jest.spyOn({ call: () => {} }, 'call');

			const recordExistsMock = jest.spyOn(ens['_registry'], 'recordExists').mockReturnValue({
				call,
			} as unknown as Web3PromiEvent<any, any>);
			await ens.recordExists(ENS_NAME);

			expect(recordExistsMock).toHaveBeenCalledWith(ENS_NAME);
		});
	});

	describe('ttl', () => {
		it('setTTL', async () => {
			// const checkInteraface = jest.spyOn(resolver, 'checkInterfaceSupport');

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const setTTLMock = jest.spyOn(ens['_registry'], 'setTTL').mockReturnValue({
				send,
			} as unknown as Web3PromiEvent<any, any>);

			const sendOptions = { from: mockAddress };
			await ens.setTTL(ENS_NAME, TTL, sendOptions);
			expect(setTTLMock).toHaveBeenCalledWith(ENS_NAME, TTL, sendOptions);
		});

		it('getTTL', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const call = jest.spyOn({ call: () => {} }, 'call');

			const getTTLMock = jest.spyOn(ens['_registry'], 'getTTL').mockReturnValue({
				call,
			} as unknown as Web3PromiEvent<any, any>);

			await ens.getTTL(ENS_NAME);
			expect(getTTLMock).toHaveBeenCalledWith(ENS_NAME);
		});
	});

	describe('owner', () => {
		it('setOwner', async () => {
			// const checkInteraface = jest.spyOn(resolver, 'checkInterfaceSupport');

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const setOwnerMock = jest.spyOn(ens['_registry'], 'setOwner').mockReturnValue({
				send,
			} as unknown as Web3PromiEvent<any, any>);

			const sendOptions = { from: mockAddress };
			await ens.setOwner(ENS_NAME, mockAddress, sendOptions);
			expect(setOwnerMock).toHaveBeenCalledWith(
				ENS_NAME,
				mockAddress,
				sendOptions,
				DEFAULT_RETURN_FORMAT,
			);
		});

		it('getOwner', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const call = jest.spyOn({ call: () => {} }, 'call');

			const getOwnerMock = jest.spyOn(ens['_registry'], 'getOwner').mockReturnValue({
				call,
			} as unknown as Web3PromiEvent<any, any>);

			await ens.getOwner(ENS_NAME);
			expect(getOwnerMock).toHaveBeenCalledWith(ENS_NAME);
		});
	});

	describe('addr', () => {
		it('setAddr valid', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const setAddressMock = jest.spyOn(ens['_resolver'], 'setAddress').mockReturnValue({
				send,
			} as unknown as Web3PromiEvent<any, any>);

			const sendOptions = { from: mockAddress };
			await ens.setAddress(ENS_NAME, mockAddress, sendOptions);
			expect(setAddressMock).toHaveBeenCalledWith(
				ENS_NAME,
				mockAddress,
				sendOptions,
				DEFAULT_RETURN_FORMAT,
			);
		});

		it('getAddress', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const call = jest.spyOn({ call: () => {} }, 'call');

			const addrMock = jest.spyOn(ens['_resolver'], 'getAddress').mockReturnValue({
				call,
			} as unknown as Web3PromiEvent<any, any>);

			await ens.getAddress(ENS_NAME);

			expect(addrMock).toHaveBeenCalledWith(ENS_NAME, 60);
		});
	});
	describe('pubkey', () => {
		it('setPubkey', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const setPubKeyMock = jest.spyOn(ens['_resolver'], 'setPubkey').mockReturnValue({
				send,
			} as unknown as Web3PromiEvent<any, any>);

			const sendOptions = { from: mockAddress };
			await expect(ens.setPubkey(ENS_NAME, x, y, sendOptions)).resolves.not.toThrow();

			expect(setPubKeyMock).toHaveBeenCalledWith(ENS_NAME, x, y, sendOptions);
		});

		it('getPubkey', async () => {
			const pubkeyMock = jest.spyOn(ens['_resolver'], 'getPubkey').mockReturnValue({
				call: jest.fn(),
			} as unknown as Web3PromiEvent<any, any>);

			await ens.getPubkey(ENS_NAME);
			expect(pubkeyMock).toHaveBeenCalledWith(ENS_NAME);
		});

		describe('Contenthash', () => {
			it('setContenthash', async () => {
				const setContenthashMethod = methodsInInterface.setContenthash;
				const hash = sha3Raw('justToHash');

				// eslint-disable-next-line @typescript-eslint/no-empty-function
				const send = jest.spyOn({ send: () => {} }, 'send');

				const setContenthashMock = jest
					.spyOn(ens['_resolver'], 'setContenthash')
					.mockReturnValue({
						send,
					} as unknown as Web3PromiEvent<any, any>);

				const sendOptions = { from: mockAddress };
				await ens.setContenthash(ENS_NAME, hash, sendOptions);
				expect(setContenthashMock).toHaveBeenCalledWith(ENS_NAME, hash, sendOptions);
			});

			it('getContenthash', async () => {
				const contenthashMock = jest
					.spyOn(ens['_resolver'], 'getContenthash')
					.mockReturnValue({
						call: jest.fn(),
					} as unknown as Web3PromiEvent<any, any>);

				await ens.getContenthash(ENS_NAME);

				expect(contenthashMock).toHaveBeenCalledWith(ENS_NAME);
			});
		});
	});

	it('supportsInterface', async () => {
		const interfaceId = 'setAddr';
		const supportsInterfaceMock = jest
			.spyOn(ens['_resolver'], 'supportsInterface')
			.mockReturnValue({
				call: jest.fn(),
			} as unknown as Web3PromiEvent<any, any>);

		await ens.supportsInterface(ENS_NAME, interfaceId);

		expect(supportsInterfaceMock).toHaveBeenCalledWith(ENS_NAME, methodsInInterface);
	});

	describe('CheckNetwork', () => {
		it('checkNetwork', async () => {});
	});
});
