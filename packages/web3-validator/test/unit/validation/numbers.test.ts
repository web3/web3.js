import { isBigInt, isInt, isUInt } from '../../../src/validation/numbers';
import {
	validBigIntData,
	invalidBigIntData,
	validUintData,
	invalidUintData,
	validUintDataWithSize,
	invalidUintDataWithSize,
	validUintDataWithAbiType,
	invalidUintDataWithAbiType,
	validIntData,
	invalidIntData,
	validIntDataWithSize,
	invalidIntDataWithSize,
	validIntDataWithAbiType,
	invalidIntDataWithAbiType,
} from '../../fixtures/validation';

describe('validation', () => {
	describe('numbers', () => {
		describe('isBigInt', () => {
			describe('valid cases', () => {
				it.each(validBigIntData)('%s', value => {
					expect(isBigInt(value)).toBeTruthy();
				});
			});

			describe('invalid cases', () => {
				it.each(invalidBigIntData)('%s', value => {
					expect(isBigInt(value)).toBeFalsy();
				});
			});
		});

		describe('isUInt', () => {
			describe('raw number', () => {
				describe('valid cases', () => {
					it.each(validUintData)('%s', value => {
						expect(isUInt(value)).toBeTruthy();
					});
				});

				describe('invalid cases', () => {
					it.each(invalidUintData)('%s', value => {
						expect(isUInt(value)).toBeFalsy();
					});
				});
			});

			describe('number with size', () => {
				describe('valid cases', () => {
					it.each(validUintDataWithSize)('%s', (value, bitSize) => {
						expect(isUInt(value, { bitSize })).toBeTruthy();
					});
				});

				describe('invalid cases', () => {
					it.each(invalidUintDataWithSize)('%s', (value, bitSize) => {
						expect(isUInt(value, { bitSize })).toBeFalsy();
					});
				});
			});

			describe('number with abi type', () => {
				describe('valid cases', () => {
					it.each(validUintDataWithAbiType)('%s', (value, abiType) => {
						expect(isUInt(value, { abiType })).toBeTruthy();
					});
				});

				describe('invalid cases', () => {
					it.each(invalidUintDataWithAbiType)('%s', (value, abiType) => {
						expect(isUInt(value, { abiType })).toBeFalsy();
					});
				});
			});
		});

		describe('isInt', () => {
			describe('raw number', () => {
				describe('valid cases', () => {
					it.each(validIntData)('%s', value => {
						expect(isInt(value)).toBeTruthy();
					});
				});

				describe('invalid cases', () => {
					it.each(invalidIntData)('%s', value => {
						expect(isInt(value)).toBeFalsy();
					});
				});
			});

			describe('number with size', () => {
				describe('valid cases', () => {
					it.each(validIntDataWithSize)('%s', (value, bitSize) => {
						expect(isInt(value, { bitSize })).toBeTruthy();
					});
				});

				describe('invalid cases', () => {
					it.each(invalidIntDataWithSize)('%s', (value, bitSize) => {
						expect(isInt(value, { bitSize })).toBeFalsy();
					});
				});
			});

			describe('number with abi type', () => {
				describe('valid cases', () => {
					it.each(validIntDataWithAbiType)('%s', (value, abiType) => {
						expect(isInt(value, { abiType })).toBeTruthy();
					});
				});

				describe('invalid cases', () => {
					it.each(invalidIntDataWithAbiType)('%s', (value, abiType) => {
						expect(isInt(value, { abiType })).toBeFalsy();
					});
				});
			});
		});
	});
});
