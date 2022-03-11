import { Registry } from '../../src/registry';
import { Resolver } from '../../src/resolver';
import { ENS } from '../../src/ens';
import { registryAddresses } from '../../src/config';

describe('registry', () => {
	it('should construct with expected methods', () => {
		const registry = new Registry();

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
});

describe('resolver', () => {
	it('should construct with expected methods', () => {
		const registry = new Registry();
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
});

describe('ens', () => {
	it('should construct with expected methods', () => {
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
