import { Registry } from '../../src/registry';

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
