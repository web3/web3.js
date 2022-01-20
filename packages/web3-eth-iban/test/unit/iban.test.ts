import {
    Iban
} from '../../src/iban';
import {

} from '../fixtures/iban';

describe('iban', () => {
	describe('create', () => {
		describe('valid cases', () => {
            it('%s', () => {
				const iban = new Iban("XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS")
                expect(typeof iban).toBe(Iban);
			});

		});


	});
});
