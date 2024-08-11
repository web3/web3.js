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

import { Web3Context, Web3ContextObject, Web3PromiEvent } from 'web3-core';
import { ENSNetworkNotSyncedError, ENSUnsupportedNetworkError } from 'web3-errors';
import { Contract } from 'web3-eth-contract';
import { PublicResolverAbi } from '../../src/abi/ens/PublicResolver';
import { registryAddresses } from '../../src/config';

import { ENS } from '../../src/ens';

jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

jest.mock('web3-eth', () => ({
	__esModule: true,
	isSyncing: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const { isSyncing } = require('web3-eth');

const expectedNetworkId = '0x1';
jest.mock('web3-net', () => ({
	getId: jest.fn(),
}));
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const { getId } = require('web3-net');

describe('ens', () => {
	let object: Web3ContextObject;
	let resolverContract: Contract<typeof PublicResolverAbi>;
	const mockAddress = '0x0000000000000000000000000000000000000000';
	const ENS_NAME = 'web3js.eth';
	let ens: ENS;

	beforeAll(() => {
		const context = new Web3Context('http://test.com');
		object = context.getContextObject();

		resolverContract = new Contract(PublicResolverAbi, mockAddress);
		ens = new ENS(registryAddresses.main, object);
	});

	describe('Resolver', () => {
		it('getResolver', async () => {
			const getResolverMock = jest
				.spyOn(ens['_registry'], 'getResolver')
				.mockResolvedValue(resolverContract);

			await ens.getResolver(ENS_NAME);

			expect(getResolverMock).toHaveBeenCalledWith(ENS_NAME);
		});
	});

	describe('Record', () => {
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
			expect(setAddressMock).toHaveBeenCalledWith(ENS_NAME, mockAddress, sendOptions);
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

	describe('events', () => {
		it('get events', async () => {
			const { events } = ens;
			expect(typeof events.NewOwner).toBe('function');
			expect(typeof events.allEvents).toBe('function');
			expect(typeof events.NewResolver).toBe('function');
			expect(typeof events.Transfer).toBe('function');
		});
	});

	describe('constructor', () => {
		it('default params', async () => {
			const localEns = new ENS();
			expect(localEns.provider).toBeUndefined();
			expect(localEns.registryAddress).toBe(registryAddresses.main);
		});
		it('set params', async () => {
			const localEns = new ENS(registryAddresses.goerli, 'http://127.0.0.1:8545');
			// @ts-expect-error check clientUrl field
			expect(localEns.provider?.clientUrl).toBe('http://127.0.0.1:8545');
			expect(localEns.registryAddress).toBe(registryAddresses.goerli);
		});
	});

	describe('pubkey', () => {
		it('getPubkey', async () => {
			const pubkeyMock = jest.spyOn(ens['_resolver'], 'getPubkey').mockReturnValue({
				call: jest.fn(),
			} as unknown as Web3PromiEvent<any, any>);

			await ens.getPubkey(ENS_NAME);
			expect(pubkeyMock).toHaveBeenCalledWith(ENS_NAME);
		});

		describe('Contenthash', () => {
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

		expect(supportsInterfaceMock).toHaveBeenCalledWith(ENS_NAME, interfaceId);
	});

	describe('CheckNetwork', () => {
		beforeEach(() => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			getId.mockReset();
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			isSyncing.mockReset();
		});
		it('Not last sync/ENSNetworkNotSyncedError', async () => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			getId.mockImplementation(() => expectedNetworkId);

			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			isSyncing.mockImplementation(() => {
				return {
					startingBlock: 100,
					currentBlock: 312,
					highestBlock: 51266,
				} as unknown;
			});
			await expect(ens.checkNetwork()).rejects.toThrow(new ENSNetworkNotSyncedError());
		});

		it('Threshold exceeded from previous check/ENSNetworkNotSyncedError', async () => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			getId.mockImplementation(() => expectedNetworkId);

			// An initial check, in order to update `_lastSyncCheck`
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			isSyncing.mockImplementation(() => {
				return false;
			});
			// update `_lastSyncCheck`
			await ens.checkNetwork();

			// now - this._lastSyncCheck > 3600)
			jest.useFakeTimers().setSystemTime(new Date('2020-01-01').getTime() + 3601000); // (3600 + 1) * 1000
			await expect(ens.checkNetwork()).resolves.not.toThrow();
		});

		it('ENSUnsupportedNetworkError', async () => {
			// reset from previous check
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			ens['_detectedAddress'] = undefined;

			const network = 'AnUnsupportedNetwork';

			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			getId.mockImplementation(() => network);

			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			isSyncing.mockImplementation(() => {
				return {
					startingBlock: 100,
					currentBlock: 312,
					highestBlock: 51266,
				} as unknown;
			});

			await expect(ens.checkNetwork()).rejects.toThrow(
				new ENSUnsupportedNetworkError(network),
			);
		});
	});
});
