import {
	isBloom,
	isContractAddressInBloom,
	isInBloom,
	isUserEthereumAddressInBloom,
} from '../../../src/validation/bloom';
import {
	validBloomData,
	invalidInBloomData,
	validInBloomData,
	invalidUserEthereumAddressInBloomData,
	validUserEthereumAddressInBloomData,
} from '../../fixtures/validation';

describe('validation', () => {
	describe('bloom', () => {
		describe('isBloom', () => {
			describe('valid cases', () => {
				it.each(validBloomData)('%s', input => {
					expect(isBloom(input)).toBeTruthy();
				});
			});
		});

		describe('isInBloom', () => {
			describe('valid cases', () => {
				it.each(validInBloomData)('%s', (bloom, value) => {
					expect(isInBloom(bloom, value)).toBeTruthy();
				});
			});

			describe('invalid cases', () => {
				it.each(invalidInBloomData)('%s', (bloom, value) => {
					expect(isInBloom(bloom, value)).toBeFalsy();
				});
			});
		});

		describe('isUserEthereumAddressInBloom', () => {
			describe('valid cases', () => {
				it.each(validUserEthereumAddressInBloomData)('%s', (bloom, address) => {
					expect(isUserEthereumAddressInBloom(bloom, address)).toBeTruthy();
				});
			});

			describe('invalid cases', () => {
				it.each(invalidUserEthereumAddressInBloomData)('%s', (bloom, address) => {
					expect(isUserEthereumAddressInBloom(bloom, address)).toBeFalsy();
				});
			});
		});

		describe('isContractAddressInBloom', () => {
			describe('valid cases', () => {
				it.each(validInBloomData)('%s', (bloom, address) => {
					expect(isContractAddressInBloom(bloom, address)).toBeTruthy();
				});
			});
		});
	});
});
