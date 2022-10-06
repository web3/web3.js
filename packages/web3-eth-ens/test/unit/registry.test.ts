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
import { ResolverMethodMissingError } from 'web3-errors';
import { sha3Raw, sha3, DEFAULT_RETURN_FORMAT } from 'web3-utils';
import { Registry } from '../../src/registry';
import { ENSRegistryAbi } from '../../src/abi/ens/ENSRegistry';
import { methodsInInterface, interfaceIds } from '../../src/config';
import { namehash } from '../../src/utils';

describe('registry', () => {
	let object: Web3ContextObject;
	let registry: Registry;
	let contract: Contract<typeof ENSRegistryAbi>;
	const mockAddress = '0x0000000000000000000000000000000000000000';
	const ENS_NAME = 'web3js.eth';
	const x = '0x1000000000000000000000000000000000000000000000000000000000000000';
	const y = '0x2000000000000000000000000000000000000000000000000000000000000000';

	beforeAll(() => {
		const context = new Web3Context('http://test.com');
		object = context.getContextObject() as Web3ContextObject;

		registry = new Registry(object);
		contract = new Contract(ENSRegistryAbi, mockAddress);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('constructor with custom address', async () => {
		const tempRegistry = new Registry(object, mockAddress);

		expect(tempRegistry).toBeInstanceOf(Registry);
	});

	describe('owner', () => {
		it('setOwner', async () => {
			// const checkInteraface = jest.spyOn(resolver, 'checkInterfaceSupport');

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const setOwnerMock = jest
				.spyOn(registry['contract'].methods, 'setOwner')
				.mockReturnValue({
					send,
				} as unknown as NonPayableMethodObject<any, any>);

			const sendOptions = { from: mockAddress };
			await registry.setOwner(ENS_NAME, mockAddress, sendOptions);
			expect(setOwnerMock).toHaveBeenCalledWith(namehash(ENS_NAME), mockAddress);
			expect(send).toHaveBeenCalledWith(sendOptions);
		});

		it('setOwner throw (transaction reverted)', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send').mockImplementation(() => {
				throw new Error();
			});

			const setOwnerMock = jest
				.spyOn(registry['contract'].methods, 'setOwner')
				.mockReturnValue({ send } as unknown as NonPayableMethodObject<any, any>);

			const sendOptions = { from: mockAddress };
			await expect(async () => {
				await registry.setOwner(ENS_NAME, mockAddress, sendOptions);
			}).rejects.toThrow(new Error());
			expect(setOwnerMock).toHaveBeenCalledWith(namehash(ENS_NAME), mockAddress);
			expect(send).toHaveBeenCalledWith(sendOptions);
		});
		it('getOwner', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const call = jest.spyOn({ call: () => {} }, 'call');

			const getOwnerMock = jest.spyOn(registry['contract'].methods, 'owner').mockReturnValue({
				call,
			} as unknown as NonPayableMethodObject<any, any>);

			await registry.getOwner(ENS_NAME);
			expect(getOwnerMock).toHaveBeenCalledWith(namehash(ENS_NAME));
			expect(call).toHaveBeenCalled();
		});
		it('getOwner throw (transaction reverted)', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const call = jest.spyOn({ call: () => {} }, 'call').mockImplementation(() => {
				throw new Error();
			});

			const getOwnerMock = jest
				.spyOn(registry['contract'].methods, 'owner')
				.mockReturnValue({ call } as unknown as NonPayableMethodObject<any, any>);

			await expect(async () => {
				await registry.getOwner(ENS_NAME);
			}).rejects.toThrow(new Error());
			expect(getOwnerMock).toHaveBeenCalledWith(namehash(ENS_NAME));
			expect(call).toHaveBeenCalled();
		});
	});

	describe('ttl', () => {
		const TTL = 3600;
		it('setTTL', async () => {
			// const checkInteraface = jest.spyOn(resolver, 'checkInterfaceSupport');

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const setTTLMock = jest.spyOn(registry['contract'].methods, 'setTTL').mockReturnValue({
				send,
			} as unknown as NonPayableMethodObject<any, any>);

			const sendOptions = { from: mockAddress };
			await registry.setTTL(ENS_NAME, TTL, sendOptions);
			expect(setTTLMock).toHaveBeenCalledWith(namehash(ENS_NAME), TTL);
			expect(send).toHaveBeenCalledWith(sendOptions);
		});

		it('setTTL throw (transaction reverted)', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send').mockImplementation(() => {
				throw new Error();
			});

			const setTTLMock = jest
				.spyOn(registry['contract'].methods, 'setTTL')
				.mockReturnValue({ send } as unknown as NonPayableMethodObject<any, any>);

			const sendOptions = { from: mockAddress };
			await expect(async () => {
				await registry.setTTL(ENS_NAME, TTL, sendOptions);
			}).rejects.toThrow(new Error());
			expect(setTTLMock).toHaveBeenCalledWith(namehash(ENS_NAME), TTL);
			expect(send).toHaveBeenCalledWith(sendOptions);
		});
		it('getTTL', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const call = jest.spyOn({ call: () => {} }, 'call');

			const getTTLMock = jest.spyOn(registry['contract'].methods, 'ttl').mockReturnValue({
				call,
			} as unknown as NonPayableMethodObject<any, any>);

			await registry.getTTL(ENS_NAME);
			expect(getTTLMock).toHaveBeenCalledWith(namehash(ENS_NAME));
			expect(call).toHaveBeenCalled();
		});
		it('getTTL throw (transaction reverted)', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const call = jest.spyOn({ call: () => {} }, 'call').mockImplementation(() => {
				throw new Error();
			});

			const getTTLMock = jest
				.spyOn(registry['contract'].methods, 'ttl')
				.mockReturnValue({ call } as unknown as NonPayableMethodObject<any, any>);

			await expect(async () => {
				await registry.getTTL(ENS_NAME);
			}).rejects.toThrow(new Error());
			expect(getTTLMock).toHaveBeenCalledWith(namehash(ENS_NAME));
			expect(call).toHaveBeenCalled();
		});
	});
	describe('SubnodeOwner', () => {
		const label = sha3Raw(ENS_NAME);

		it('setSubnodeOwner', async () => {
			// const checkInteraface = jest.spyOn(resolver, 'checkInterfaceSupport');

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const setSubnodeOwnerMock = jest
				.spyOn(registry['contract'].methods, 'setSubnodeOwner')
				.mockReturnValue({
					send,
				} as unknown as NonPayableMethodObject<any, any>);

			const sendOptions = { from: mockAddress };
			await registry.setSubnodeOwner(ENS_NAME, label, mockAddress, sendOptions);
			expect(setSubnodeOwnerMock).toHaveBeenCalledWith(
				namehash(ENS_NAME),
				label,
				mockAddress,
			);
			expect(send).toHaveBeenCalledWith(sendOptions);
		});
		it('setSubnodeOwner with non strict hex label', async () => {
			// const checkInteraface = jest.spyOn(resolver, 'checkInterfaceSupport');

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const setSubnodeOwnerMock = jest
				.spyOn(registry['contract'].methods, 'setSubnodeOwner')
				.mockReturnValue({
					send,
				} as unknown as NonPayableMethodObject<any, any>);

			const sendOptions = { from: mockAddress };
			await registry.setSubnodeOwner(ENS_NAME, ENS_NAME, mockAddress, sendOptions);
			expect(setSubnodeOwnerMock).toHaveBeenCalledWith(
				namehash(ENS_NAME),
				label,
				mockAddress,
			);
			expect(send).toHaveBeenCalledWith(sendOptions);
		});

		it('setSubnodeOwner throw (transaction reverted)', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send').mockImplementation(() => {
				throw new Error();
			});

			const setSubnodeOwnerMock = jest
				.spyOn(registry['contract'].methods, 'setSubnodeOwner')
				.mockReturnValue({ send } as unknown as NonPayableMethodObject<any, any>);

			const sendOptions = { from: mockAddress };
			await expect(async () => {
				await registry.setSubnodeOwner(ENS_NAME, label, mockAddress, sendOptions);
			}).rejects.toThrow(new Error());
			expect(setSubnodeOwnerMock).toHaveBeenCalledWith(
				namehash(ENS_NAME),
				label,
				mockAddress,
			);
			expect(send).toHaveBeenCalledWith(sendOptions);
		});
	});

	describe('SubnodeRecord', () => {
		const label = sha3Raw(ENS_NAME);
		const TTL = 3600;

		it('setSubnodeRecord', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const setSubnodeRecordMock = jest
				.spyOn(registry['contract'].methods, 'setSubnodeRecord')
				.mockReturnValue({
					send,
				} as unknown as NonPayableMethodObject<any, any>);

			const sendOptions = { from: mockAddress };
			await registry.setSubnodeRecord(
				ENS_NAME,
				label,
				mockAddress,
				mockAddress,
				TTL,
				sendOptions,
			);
			expect(setSubnodeRecordMock).toHaveBeenCalledWith(
				namehash(ENS_NAME),
				label,
				mockAddress,
				mockAddress,
				TTL,
			);
			expect(send).toHaveBeenCalledWith(sendOptions);
		});

		it('setSubnodeRecord with non strict hex label', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const setSubnodeRecordMock = jest
				.spyOn(registry['contract'].methods, 'setSubnodeRecord')
				.mockReturnValue({
					send,
				} as unknown as NonPayableMethodObject<any, any>);

			const sendOptions = { from: mockAddress };
			await registry.setSubnodeRecord(
				ENS_NAME,
				ENS_NAME,
				mockAddress,
				mockAddress,
				TTL,
				sendOptions,
			);
			expect(setSubnodeRecordMock).toHaveBeenCalledWith(
				namehash(ENS_NAME),
				label,
				mockAddress,
				mockAddress,
				TTL,
			);
			expect(send).toHaveBeenCalledWith(sendOptions);
		});
		it('setSubnodeRecord throw (transaction reverted)', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send').mockImplementation(() => {
				throw new Error();
			});

			const setSubnodeRecordMock = jest
				.spyOn(registry['contract'].methods, 'setSubnodeRecord')
				.mockReturnValue({
					send,
				} as unknown as NonPayableMethodObject<any, any>);

			const sendOptions = { from: mockAddress };

			await expect(async () => {
				await registry.setSubnodeRecord(
					ENS_NAME,
					label,
					mockAddress,
					mockAddress,
					TTL,
					sendOptions,
				);
			}).rejects.toThrow(new Error());
			expect(setSubnodeRecordMock).toHaveBeenCalledWith(
				namehash(ENS_NAME),
				label,
				mockAddress,
				mockAddress,
				TTL,
			);
			expect(send).toHaveBeenCalledWith(sendOptions);
		});
	});
	describe('ApprovalForAll', () => {
		it('setApprovalForAll', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const setApprovalForAllMock = jest
				.spyOn(registry['contract'].methods, 'setApprovalForAll')
				.mockReturnValue({
					send,
				} as unknown as NonPayableMethodObject<any, any>);

			const sendOptions = { from: mockAddress };
			await registry.setApprovalForAll(ENS_NAME, true, sendOptions);
			expect(setApprovalForAllMock).toHaveBeenCalledWith(ENS_NAME, true);
			expect(send).toHaveBeenCalledWith(sendOptions);
		});

		it('setApprovalForAll throw (transaction reverted)', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send').mockImplementation(() => {
				throw new Error();
			});

			const setApprovalForAllMock = jest
				.spyOn(registry['contract'].methods, 'setApprovalForAll')
				.mockReturnValue({
					send,
				} as unknown as NonPayableMethodObject<any, any>);

			const sendOptions = { from: mockAddress };
			await expect(async () => {
				await registry.setApprovalForAll(ENS_NAME, true, sendOptions);
			}).rejects.toThrow(new Error());
			expect(setApprovalForAllMock).toHaveBeenCalledWith(ENS_NAME, true);
			expect(send).toHaveBeenCalledWith(sendOptions);
		});

		it('isApprovedForAll', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const call = jest.spyOn({ call: () => {} }, 'call');

			const isApprovedForAllMock = jest
				.spyOn(registry['contract'].methods, 'isApprovedForAll')
				.mockReturnValue({
					call,
				} as unknown as NonPayableMethodObject<any, any>);

			await registry.isApprovedForAll(ENS_NAME, ENS_NAME);
			expect(isApprovedForAllMock).toHaveBeenCalledWith(ENS_NAME, ENS_NAME);
			expect(call).toHaveBeenCalled();
		});
		it('isApprovedForAll throw (transaction reverted)', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const call = jest.spyOn({ call: () => {} }, 'call').mockImplementation(() => {
				throw new Error();
			});
			const isApprovedForAllMock = jest
				.spyOn(registry['contract'].methods, 'isApprovedForAll')
				.mockReturnValue({
					call,
				} as unknown as NonPayableMethodObject<any, any>);

			await expect(async () => {
				await registry.isApprovedForAll(ENS_NAME, ENS_NAME);
			}).rejects.toThrow(new Error());
			expect(isApprovedForAllMock).toHaveBeenCalledWith(ENS_NAME, ENS_NAME);
			expect(call).toHaveBeenCalled();
		});
	});

	describe('record', () => {
		const TTL = 3600;
		it('setRecord', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send');

			const setRecordMock = jest
				.spyOn(registry['contract'].methods, 'setRecord')
				.mockReturnValue({
					send,
				} as unknown as NonPayableMethodObject<any, any>);

			const sendOptions = { from: mockAddress };
			await registry.setRecord(ENS_NAME, mockAddress, mockAddress, TTL, sendOptions);
			expect(setRecordMock).toHaveBeenCalledWith(
				namehash(ENS_NAME),
				mockAddress,
				mockAddress,
				TTL,
			);
			expect(send).toHaveBeenCalledWith(sendOptions);
		});
		it('setRecord throw (transaction reverted)', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send').mockImplementation(() => {
				throw new Error();
			});

			const setRecordMock = jest
				.spyOn(registry['contract'].methods, 'setRecord')
				.mockReturnValue({
					send,
				} as unknown as NonPayableMethodObject<any, any>);

			const sendOptions = { from: mockAddress };

			await expect(async () => {
				await registry.setRecord(ENS_NAME, mockAddress, mockAddress, TTL, sendOptions);
			}).rejects.toThrow(new Error());
			expect(setRecordMock).toHaveBeenCalledWith(
				namehash(ENS_NAME),
				mockAddress,
				mockAddress,
				TTL,
			);
			expect(send).toHaveBeenCalledWith(sendOptions);
		});
		it('recordExists', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const call = jest.spyOn({ call: () => {} }, 'call');

			const setRecordMock = jest
				.spyOn(registry['contract'].methods, 'recordExists')
				.mockReturnValue({
					call,
				} as unknown as NonPayableMethodObject<any, any>);

			await registry.recordExists(ENS_NAME);
			expect(setRecordMock).toHaveBeenCalledWith(namehash(ENS_NAME));
			expect(call).toHaveBeenCalled();
		});
		it('recordExists throw (transaction reverted)', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const call = jest.spyOn({ call: () => {} }, 'call').mockImplementation(() => {
				throw new Error();
			});

			const setRecordMock = jest
				.spyOn(registry['contract'].methods, 'recordExists')
				.mockReturnValue({
					call,
				} as unknown as NonPayableMethodObject<any, any>);

			await expect(async () => {
				await registry.recordExists(ENS_NAME);
			}).rejects.toThrow(new Error());
			expect(setRecordMock).toHaveBeenCalledWith(namehash(ENS_NAME));
			expect(call).toHaveBeenCalled();
		});
	});

	describe('resolver', () => {
		it('setResolver', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: async () => {} }, 'send');

			const setResolverMock = jest
				.spyOn(registry['contract'].methods, 'setResolver')
				.mockReturnValue({
					send,
				} as unknown as NonPayableMethodObject<any, any>);

			const sendOptions = { from: mockAddress };
			await registry.setResolver(ENS_NAME, mockAddress, sendOptions);
			expect(setResolverMock).toHaveBeenCalledWith(namehash(ENS_NAME), mockAddress);
			expect(send).toHaveBeenCalledWith(sendOptions);
		});
		it('setResolver throw (transaction reverted)', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const send = jest.spyOn({ send: () => {} }, 'send').mockImplementation(() => {
				throw new Error();
			});

			const setResolverMock = jest
				.spyOn(registry['contract'].methods, 'setResolver')
				.mockReturnValue({
					send,
				} as unknown as NonPayableMethodObject<any, any>);

			const sendOptions = { from: mockAddress };

			await expect(async () => {
				await registry.setResolver(ENS_NAME, mockAddress, sendOptions);
			}).rejects.toThrow(new Error());
			expect(setResolverMock).toHaveBeenCalledWith(namehash(ENS_NAME), mockAddress);
			expect(send).toHaveBeenCalledWith(sendOptions);
		});

		it('resolver', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const call = jest
				.spyOn(
					{
						call: async () => {
							return mockAddress;
						},
					},
					'call',
				)
				.mockReturnValue(Promise.resolve(mockAddress));

			const resolverMock = jest
				.spyOn(registry['contract'].methods, 'resolver')
				.mockReturnValue({
					call,
				} as unknown as NonPayableMethodObject<any, any>);

			await registry.getResolver(ENS_NAME);
			expect(resolverMock).toHaveBeenCalledWith(namehash(ENS_NAME));
			expect(call).toHaveBeenCalled();
		});

		it('resolver (return non string)', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const call = jest
				.spyOn(
					{
						call: async () => {
							return 5; // something that is not string
						},
					},
					'call',
				)
				.mockReturnValue(Promise.resolve(5)); // something that is not string

			const resolverMock = jest
				.spyOn(registry['contract'].methods, 'resolver')
				.mockReturnValue({
					call,
				} as unknown as NonPayableMethodObject<any, any>);

			await expect(async () => {
				await registry.getResolver(ENS_NAME);
			}).rejects.toThrow(new Error());
			expect(resolverMock).toHaveBeenCalledWith(namehash(ENS_NAME));
			expect(call).toHaveBeenCalled();
		});

		it('resolver throw (transaction reverted)', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const call = jest.spyOn({ call: () => {} }, 'call').mockImplementation(() => {
				throw new Error();
			});
			const resolverMock = jest
				.spyOn(registry['contract'].methods, 'resolver')
				.mockReturnValue({
					call,
				} as unknown as NonPayableMethodObject<any, any>);

			await expect(async () => {
				await registry.getResolver(ENS_NAME);
			}).rejects.toThrow(new Error());
			expect(resolverMock).toHaveBeenCalledWith(namehash(ENS_NAME));
			expect(call).toHaveBeenCalled();
		});
	});
	// it('Doesn"t support interface', async () => {
	// 	const methodName = methodsInInterface.setAddr; // Just a method to pass first check

	// 	const supportsInterfaceMock = jest
	// 		.spyOn(contract.methods, 'supportsInterface')
	// 		.mockReturnValue({
	// 			call: jest.fn().mockReturnValue(false),
	// 		} as unknown as NonPayableMethodObject<any, any>);

	// 	await expect(resolver.checkInterfaceSupport(contract, methodName)).rejects.toThrow(
	// 		new ResolverMethodMissingError(mockAddress, methodName),
	// 	);

	// 	expect(supportsInterfaceMock).toHaveBeenCalledWith(interfaceIds[methodName]);
	// });

	// it.each(Object.values(methodsInInterface))('supported interface for %s', async methodName => {
	// 	const supportsInterfaceMock = jest
	// 		.spyOn(contract.methods, 'supportsInterface')
	// 		.mockReturnValue({
	// 			call: jest.fn().mockReturnValue(true),
	// 		} as unknown as NonPayableMethodObject<any, any>);

	// 	await expect(resolver.checkInterfaceSupport(contract, methodName)).resolves.not.toThrow();

	// 	expect(supportsInterfaceMock).toHaveBeenCalledWith(interfaceIds[methodName]);
	// });
	// describe('addr', () => {
	// 	it('setAddr valid', async () => {
	// 		const checkInteraface = jest.spyOn(resolver, 'checkInterfaceSupport');

	// 		const setAddrMock = jest.spyOn(contract.methods, 'setAddr').mockReturnValue({
	// 			send: jest.fn(),
	// 		} as unknown as NonPayableMethodObject<any, any>);

	// 		jest.spyOn(contract.methods, 'supportsInterface').mockReturnValue({
	// 			call: jest.fn().mockReturnValue(true),
	// 		} as unknown as NonPayableMethodObject<any, any>);

	// 		// todo when moving this mock in beforeAll, jest calls the actual implementation, how to fix that
	// 		// I use this in many places
	// 		jest.spyOn(registry, 'getResolver').mockImplementation(async () => {
	// 			return new Promise(resolve => {
	// 				resolve(contract);
	// 			});
	// 		});

	// 		await resolver.setAddress(ENS_NAME, mockAddress, { from: mockAddress });
	// 		expect(checkInteraface).toHaveBeenCalled();
	// 		expect(setAddrMock).toHaveBeenCalledWith(namehash(ENS_NAME), mockAddress);
	// 	});

	// 	it('getAddress', async () => {
	// 		const supportsInterfaceMock = jest
	// 			.spyOn(contract.methods, 'supportsInterface')
	// 			.mockReturnValue({
	// 				call: async () => Promise.resolve(true),
	// 			} as unknown as NonPayableMethodObject<any, any>);

	// 		const addrMock = jest.spyOn(contract.methods, 'addr').mockReturnValue({
	// 			call: async () => Promise.resolve(true),
	// 		} as unknown as NonPayableMethodObject<any, any>);

	// 		// todo when moving this mock in beforeAll, jest calls the actual implementation, how to fix that
	// 		// I use this in many places
	// 		jest.spyOn(registry, 'getResolver').mockImplementation(async () => {
	// 			return new Promise(resolve => {
	// 				resolve(contract);
	// 			});
	// 		});

	// 		await resolver.getAddress(ENS_NAME);
	// 		expect(supportsInterfaceMock).toHaveBeenCalledWith(
	// 			interfaceIds[methodsInInterface.addr],
	// 		);
	// 		expect(addrMock).toHaveBeenCalledWith(namehash(ENS_NAME), 60);
	// 	});
	// });

	// describe('pubkey', () => {
	// 	it('setPubkey', async () => {
	// 		const setPubKeyMethod = methodsInInterface.setPubkey;

	// 		jest.spyOn(registry, 'getResolver').mockImplementation(async () => {
	// 			return new Promise(resolve => {
	// 				resolve(contract);
	// 			});
	// 		});

	// 		// eslint-disable-next-line @typescript-eslint/no-empty-function
	// 		const send = jest.spyOn({ send: () => {} }, 'send');

	// 		const setPubKeyMock = jest.spyOn(contract.methods, 'setPubkey').mockReturnValue({
	// 			send,
	// 		} as unknown as NonPayableMethodObject<any, any>);

	// 		const supportsInterfaceMock = jest
	// 			.spyOn(contract.methods, 'supportsInterface')
	// 			.mockReturnValue({
	// 				call: jest.fn().mockReturnValue(true),
	// 			} as unknown as NonPayableMethodObject<any, any>);

	// 		const sendOptions = { from: mockAddress };
	// 		await expect(resolver.setPubkey(ENS_NAME, x, y, sendOptions)).resolves.not.toThrow();

	// 		expect(setPubKeyMock).toHaveBeenCalledWith(
	// 			namehash(ENS_NAME),
	// 			namehash(x),
	// 			namehash(y),
	// 		);
	// 		expect(supportsInterfaceMock).toHaveBeenCalledWith(interfaceIds[setPubKeyMethod]);
	// 		expect(send).toHaveBeenCalledWith(sendOptions);
	// 	});

	// 	it('getPubkey', async () => {
	// 		const supportsInterfaceMock = jest
	// 			.spyOn(contract.methods, 'supportsInterface')
	// 			.mockReturnValue({
	// 				call: async () => Promise.resolve(true),
	// 			} as unknown as NonPayableMethodObject<any, any>);

	// 		const pubkeyMock = jest.spyOn(contract.methods, 'pubkey').mockReturnValue({
	// 			call: jest.fn(),
	// 		} as unknown as NonPayableMethodObject<any, any>);

	// 		// todo when moving this mock in beforeAll, jest calls the actual implementation, how to fix that
	// 		// I use this in many places
	// 		jest.spyOn(registry, 'getResolver').mockImplementation(async () => {
	// 			return new Promise(resolve => {
	// 				resolve(contract);
	// 			});
	// 		});

	// 		await resolver.getPubkey(ENS_NAME);
	// 		expect(supportsInterfaceMock).toHaveBeenCalledWith(
	// 			interfaceIds[methodsInInterface.pubkey],
	// 		);
	// 		expect(pubkeyMock).toHaveBeenCalledWith(namehash(ENS_NAME));
	// 	});
	// });

	// describe('Contenthash', () => {
	// 	it('setContenthash', async () => {
	// 		const setContenthashMethod = methodsInInterface.setContenthash;
	// 		const hash = sha3Raw('justToHash');

	// 		jest.spyOn(registry, 'getResolver').mockImplementation(async () => {
	// 			return new Promise(resolve => {
	// 				resolve(contract);
	// 			});
	// 		});

	// 		// eslint-disable-next-line @typescript-eslint/no-empty-function
	// 		const send = jest.spyOn({ send: () => {} }, 'send');

	// 		const setContenthashMock = jest
	// 			.spyOn(contract.methods, 'setContenthash')
	// 			.mockReturnValue({
	// 				send,
	// 			} as unknown as NonPayableMethodObject<any, any>);

	// 		const supportsInterfaceMock = jest
	// 			.spyOn(contract.methods, 'supportsInterface')
	// 			.mockReturnValue({
	// 				call: jest.fn().mockReturnValue(true),
	// 			} as unknown as NonPayableMethodObject<any, any>);

	// 		const sendOptions = { from: mockAddress };
	// 		await expect(
	// 			resolver.setContenthash(ENS_NAME, hash, sendOptions),
	// 		).resolves.not.toThrow();

	// 		expect(setContenthashMock).toHaveBeenCalledWith(namehash(ENS_NAME), hash);
	// 		expect(supportsInterfaceMock).toHaveBeenCalledWith(interfaceIds[setContenthashMethod]);
	// 		expect(send).toHaveBeenCalledWith(sendOptions);
	// 	});

	// 	it('getContenthash', async () => {
	// 		const supportsInterfaceMock = jest
	// 			.spyOn(contract.methods, 'supportsInterface')
	// 			.mockReturnValue({
	// 				call: async () => Promise.resolve(true),
	// 			} as unknown as NonPayableMethodObject<any, any>);

	// 		const contenthashMock = jest.spyOn(contract.methods, 'contenthash').mockReturnValue({
	// 			call: jest.fn(),
	// 		} as unknown as NonPayableMethodObject<any, any>);

	// 		// todo when moving this mock in beforeAll, jest calls the actual implementation, how to fix that
	// 		// I use this in many places
	// 		jest.spyOn(registry, 'getResolver').mockImplementation(async () => {
	// 			return new Promise(resolve => {
	// 				resolve(contract);
	// 			});
	// 		});

	// 		await resolver.getContenthash(ENS_NAME);
	// 		expect(supportsInterfaceMock).toHaveBeenCalledWith(
	// 			interfaceIds[methodsInInterface.contenthash],
	// 		);
	// 		expect(contenthashMock).toHaveBeenCalledWith(namehash(ENS_NAME));
	// 	});
	// });

	// describe('supportsInterface', () => {
	// 	it('check supportsInterface for non strict hex id', async () => {
	// 		const interfaceId = 'setAddr';
	// 		jest.spyOn(registry, 'getResolver').mockImplementation(async () => {
	// 			return new Promise(resolve => {
	// 				resolve(contract);
	// 			});
	// 		});

	// 		// eslint-disable-next-line @typescript-eslint/no-empty-function
	// 		const call = jest.spyOn({ call: () => {} }, 'call');

	// 		const supportsInterfaceMock = jest
	// 			.spyOn(contract.methods, 'supportsInterface')
	// 			.mockReturnValue({
	// 				call,
	// 			} as unknown as NonPayableMethodObject<any, any>);

	// 		await expect(resolver.supportsInterface(ENS_NAME, interfaceId)).resolves.not.toThrow();

	// 		// expect(setContenthashMock).toHaveBeenCalledWith(namehash(ENS_NAME), hash);
	// 		expect(supportsInterfaceMock).toHaveBeenCalledWith(sha3(interfaceId)?.substring(0, 10));
	// 		expect(call).toHaveBeenCalled();
	// 	});

	// 	it('check supportsInterface for empty non strict hex id', async () => {
	// 		const interfaceId = ''; // empty
	// 		jest.spyOn(registry, 'getResolver').mockImplementation(async () => {
	// 			return new Promise(resolve => {
	// 				resolve(contract);
	// 			});
	// 		});

	// 		await expect(resolver.supportsInterface(ENS_NAME, interfaceId)).rejects.toThrow(
	// 			new Error('Invalid interface Id'),
	// 		);
	// 	});

	// 	it.each(Object.values(interfaceIds))(
	// 		'check supportsInterface for valid hex ids',
	// 		async () => {
	// 			const interfaceId = 'setAddr';
	// 			jest.spyOn(registry, 'getResolver').mockImplementation(async () => {
	// 				return new Promise(resolve => {
	// 					resolve(contract);
	// 				});
	// 			});

	// 			// eslint-disable-next-line @typescript-eslint/no-empty-function
	// 			const call = jest.spyOn({ call: () => {} }, 'call');

	// 			const supportsInterfaceMock = jest
	// 				.spyOn(contract.methods, 'supportsInterface')
	// 				.mockReturnValue({
	// 					call,
	// 				} as unknown as NonPayableMethodObject<any, any>);

	// 			await expect(
	// 				resolver.supportsInterface(ENS_NAME, interfaceId),
	// 			).resolves.not.toThrow();

	// 			// expect(setContenthashMock).toHaveBeenCalledWith(namehash(ENS_NAME), hash);
	// 			expect(supportsInterfaceMock).toHaveBeenCalledWith(
	// 				sha3(interfaceId)?.substring(0, 10),
	// 			);
	// 			expect(call).toHaveBeenCalled();
	// 		},
	// 	);
	// });
});
