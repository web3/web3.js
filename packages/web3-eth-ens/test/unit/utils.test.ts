import { namehash } from '../../src/utils';
import { namehashValidData } from '../fixtures/utils';

describe('ens utils', () => {
	describe('namehash', () => {
		describe('valid cases', () => {
			it.each(namehashValidData)('%s', (input, output) => {
				expect(namehash(input)).toEqual(output);
			});
		});
	});
});
