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
import { Registry } from '../../src/registry';
import { Resolver } from '../../src/resolver';
import { ENS } from '../../src/ens';
import { registryAddresses } from '../../src/config';

describe('ens', () => {
	let object: Web3ContextObject;

	beforeAll(() => {
		const context = new Web3Context('http://test.com');
		object = context.getContextObject() as Web3ContextObject;
	});
	it('should construct registry with expected methods', () => {
		const registry = new Registry(object);

		expect(registry.getOwner).toBeDefined();
		expect(registry.getResolver).toBeDefined();
		expect(registry.getTTL).toBeDefined();
		expect(registry.isApprovedForAll).toBeDefined();
		expect(registry.recordExists).toBeDefined();
		expect(registry.setApprovalForAll).toBeDefined();
		expect(registry.setOwner).toBeDefined();
		expect(registry.setResolver).toBeDefined();
		expect(registry.setSubnodeOwner).toBeDefined();
		expect(registry.setSubnodeRecord).toBeDefined();
		expect(registry.setTTL).toBeDefined();
	});

	it('should construct resolver with expected methods', () => {
		const registry = new Registry(object);
		const resolver = new Resolver(registry);

		expect(resolver.getAddress).toBeDefined();
		expect(resolver.checkInterfaceSupport).toBeDefined();
		expect(resolver.setAddress).toBeDefined();
		expect(resolver.setPubkey).toBeDefined();
		expect(resolver.setContenthash).toBeDefined();
		expect(resolver.supportsInterface).toBeDefined();
		expect(resolver.getPubkey).toBeDefined();
		expect(resolver.getContenthash).toBeDefined();
	});

	it('should construct main ens class with expected methods', () => {
		const ens = new ENS(registryAddresses.main, 'http://127.0.0.1:8545');

		expect(ens.getResolver).toBeDefined();
		expect(ens.setResolver).toBeDefined();
		expect(ens.setSubnodeOwner).toBeDefined();
		expect(ens.setApprovalForAll).toBeDefined();
		expect(ens.isApprovedForAll).toBeDefined();
		expect(ens.recordExists).toBeDefined();
		expect(ens.setSubnodeOwner).toBeDefined();
		expect(ens.getTTL).toBeDefined();
		expect(ens.getOwner).toBeDefined();
		expect(ens.setOwner).toBeDefined();
		expect(ens.setRecord).toBeDefined();
		expect(ens.setAddress).toBeDefined();
		expect(ens.setPubkey).toBeDefined();
		expect(ens.setContenthash).toBeDefined();
		expect(ens.getAddress).toBeDefined();
		expect(ens.getPubkey).toBeDefined();
		expect(ens.getContenthash).toBeDefined();
		expect(ens.checkNetwork).toBeDefined();
		expect(ens.supportsInterface).toBeDefined();
	});
});
