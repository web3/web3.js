import { Iban } from '../../src/iban';
import {} from '../fixtures/iban';

describe('iban', () => {
	describe('create', () => {
		describe('valid cases', () => {
			it('%s', () => {
				const iban = new Iban('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS');
				expect(typeof iban).toBe('object');
			});
		});
	});

	describe('toAddress', () => {
		describe('valid cases', () => {
			it('%s', () => {
				const iban = new Iban('XE65GB6LDNXYOFTX0NSV3FUWKOWIXAMJK36');
				expect(iban.toAddress()).toBe('0x8ba1f109551bD432803012645Ac136ddd64DBA72');

				const iban2 = new Iban('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS');
				expect(iban2.toAddress()).toBe('0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8');
			});
		});
	});

	describe('toAddress static method', () => {
		describe('valid cases', () => {
			it('%s', () => {
				expect(Iban.toAddress('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS')).toBe(
					'0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8',
				);

				expect(Iban.toAddress('XE65GB6LDNXYOFTX0NSV3FUWKOWIXAMJK36')).toBe(
					'0x8ba1f109551bD432803012645Ac136ddd64DBA72',
				);
			});
		});
	});

	describe('toIban', () => {
		describe('valid cases', () => {
			it('%s', () => {
				expect(Iban.toIban('0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8')).toBe(
					'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS',
				);
				expect(Iban.toIban('0x8ba1f109551bD432803012645Ac136ddd64DBA72')).toBe(
					'XE65GB6LDNXYOFTX0NSV3FUWKOWIXAMJK36',
				);
			});
		});
	});

	describe('fromAddress', () => {
		describe('valid cases', () => {
			it('%s', () => {
				expect(
					Iban.fromAddress('0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8').toString(),
				).toBe('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS');
				expect(
					Iban.fromAddress('0x8ba1f109551bD432803012645Ac136ddd64DBA72').toString(),
				).toBe('XE65GB6LDNXYOFTX0NSV3FUWKOWIXAMJK36');
			});
		});
	});

	describe('fromBban', () => {
		describe('valid cases', () => {
			it('%s', () => {
				expect(Iban.fromBban('ETHXREGGAVOFYORK').toString()).toBe('XE81ETHXREGGAVOFYORK');
			});
		});
	});
});
