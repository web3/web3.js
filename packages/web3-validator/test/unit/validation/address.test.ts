import { checkAddressCheckSum, isAddress } from '../../../src/validation/address';
import {
	validCheckAddressCheckSumData,
	invalidAddressData,
	validAddressData,
} from '../../fixtures/validation';

describe('validation', () => {
	describe('address', () => {
		describe('isAddress', () => {
			describe('valid cases', () => {
				it.each(validAddressData)('%s', input => {
					expect(isAddress(input)).toBeTruthy();
				});
			});

			describe('invalid cases', () => {
				it.each(invalidAddressData)('%s', input => {
					expect(isAddress(input)).toBeFalsy();
				});
			});
		});

		describe('checkAddressCheckSum', () => {
			describe('valid cases', () => {
				it.each(validCheckAddressCheckSumData)('%s', input => {
					expect(checkAddressCheckSum(input)).toBeTruthy();
				});
			});
		});
	});
});
