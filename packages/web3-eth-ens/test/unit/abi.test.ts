import Registry from '../../src/abi/registry';
import ReverseRegistrar from '../../src/abi/reverse_registrar';
import * as ENSRegistry from '../fixtures/ens/registry.json';
import * as ENSReverseRegistrar from '../fixtures/ens/reverse_registrar.json';

describe('ABI', () => {
	describe('Registry', () => {
		it('should have valid ABI', () => {
			expect(JSON.parse(ENSRegistry.result)).toEqual(Registry);
		});
	});

	describe('ReverseRegistrar', () => {
		it('should have valid ABI', () => {
			expect(JSON.parse(ENSReverseRegistrar.result)).toEqual(ReverseRegistrar);
		});
	});
});
