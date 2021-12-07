/* eslint-disable jest/no-conditional-expect */

import {
	InvalidAddressError,
	InvalidBlockError,
	InvalidBlockNumberOrTagError,
	InvalidBloomError,
	InvalidBooleanError,
	InvalidFilterError,
	InvalidHexStringError,
} from '../../src/errors';
import {
	isHex,
	isHexStrict,
	checkAddressCheckSum,
	isAddress,
	compareBlockNumbers,
	validateHexStringInput,
	validateBytesInput,
	validateNumbersInput,
	validateStringInput,
	isBloom,
	isInBloom,
	isUserEthereumAddressInBloom,
	isTopic,
	isTopicInBloom,
	isContractAddressInBloom,
	isBigInt,
	isBlockTag,
	validateAddress,
	isBlockNumber,
	isBlockNumberOrTag,
	validateBlockNumberOrTag,
	isHexString8Bytes,
	validateHexString8Bytes,
	isHexString32Bytes,
	validateHexString32Bytes,
	isBoolean,
	validateBoolean,
	isFilterObject,
	validateFilterObject,
} from '../../src/validation';
import {
	checkAddressCheckSumValidData,
	isAddressValidData,
	compareBlockNumbersValidData,
	compareBlockNumbersInvalidData,
	validateHexStringInputInvalidData,
	validateBytesInputInvalidData,
	validateNumbersInputInvalidData,
	validateStringInputInvalidData,
	isBloomValidData,
	isInBloomValidData,
	isInBloomInvalidData,
	isUserEthereumAddressInBloomValidData,
	isTopicValidData,
	isTopicInBloomValidData,
	isUserEthereumAddressInBloomInvalidData,
	isBigIntValidData,
	isBlockTagValidData,
	isBlockTagInvalidData,
	isAddressInvalidData,
	isHexValidData,
	isHexInvalidData,
	isHexStrictValidData,
	isHexStrictInvalidData,
	validateAddressInvalidData,
	isBlockNumberValidData,
	isBlockNumberInvalidData,
	validateBlockNumberOrTagInvalidData,
	isHexString32BytesValidData,
	validateHexString32BytesInvalidData,
	isBooleanInvalidData,
	validateBooleanInvalidData,
	isFilterObjectValidData,
	validateFilterObjectInvalidData,
	isHexString8BytesValidData,
	validateHexString8BytesInvalidData,
} from '../fixtures/validation';

describe('validation', () => {
	describe('isHexStrict', () => {
		it.each([...isHexStrictValidData, ...isHexStrictInvalidData])('%s', (input, output) => {
			expect(isHexStrict(input)).toEqual(output);
		});
	});
	describe('isHex', () => {
		it.each([...isHexValidData, ...isHexInvalidData])('%s', (input, output) => {
			expect(isHex(input)).toEqual(output);
		});
	});
	describe('validateHexStringInput', () => {
		it.each([...isHexStrictValidData, ...validateHexStringInputInvalidData()])(
			'%s',
			(input, output) => {
				if (output instanceof InvalidHexStringError) {
					expect(() => validateHexStringInput(input)).toThrow(output);
				} else {
					expect(() => validateHexStringInput(input)).not.toThrow();
				}
			},
		);
	});
	describe('validateBytesInput', () => {
		it.each(validateBytesInputInvalidData)('%s', (input, output) => {
			expect(() => validateBytesInput(input)).toThrow(output);
		});
	});
	describe('validateNumbersInput', () => {
		it.each(validateNumbersInputInvalidData)('%s', (input, output) => {
			expect(() => validateNumbersInput(input[0], input[1])).toThrow(output);
		});
	});
	describe('validateStringInput', () => {
		it.each(validateStringInputInvalidData)('%s', (input, output) => {
			expect(() => validateStringInput(input)).toThrow(output);
		});
	});
	describe('compareBlockNumbers', () => {
		it.each([...compareBlockNumbersValidData, ...compareBlockNumbersInvalidData])(
			'%s',
			(input, output) => {
				if (output instanceof InvalidBlockError) {
					expect(() => compareBlockNumbers(input[0], input[1])).toThrow(output);
				} else {
					expect(compareBlockNumbers(input[0], input[1])).toEqual(output);
				}
			},
		);
	});
	describe('checkAddressCheckSum', () => {
		it.each(checkAddressCheckSumValidData)('%s', (input, output) => {
			expect(checkAddressCheckSum(input)).toEqual(output);
		});
	});
	describe('isAddress', () => {
		it.each([...isAddressValidData, ...isAddressInvalidData])('%s', (input, output) => {
			expect(isAddress(input)).toEqual(output);
		});
	});
	describe('validateAddress', () => {
		it.each([...isAddressValidData, ...validateAddressInvalidData])('%s', (input, output) => {
			if (output instanceof InvalidAddressError) {
				expect(() => validateAddress(input)).toThrow(output);
			} else {
				expect(() => validateAddress(input)).not.toThrow();
			}
		});
	});
	describe('isBigInt', () => {
		it.each(isBigIntValidData)('%s', (input, output) => {
			expect(isBigInt(input)).toEqual(output);
		});
	});
	describe('isBloom', () => {
		it.each(isBloomValidData)('%s', (input, output) => {
			expect(isBloom(input)).toEqual(output);
		});
	});
	describe('isInBloom', () => {
		it.each([...isInBloomValidData, ...isInBloomInvalidData])('%s', (input, output) => {
			if (output instanceof InvalidHexStringError || output instanceof InvalidBloomError) {
				expect(() => isInBloom(input[0], input[1])).toThrow(output);
			} else {
				expect(isInBloom(input[0], input[1])).toEqual(output);
			}
		});
	});
	describe('isUserEthereumAddressInBloom', () => {
		it.each([
			...isUserEthereumAddressInBloomValidData,
			...isUserEthereumAddressInBloomInvalidData,
		])('%s', (input, output) => {
			if (output instanceof InvalidBloomError || output instanceof InvalidAddressError) {
				expect(() => isUserEthereumAddressInBloom(input[0], input[1])).toThrow(output);
			} else {
				expect(isUserEthereumAddressInBloom(input[0], input[1])).toEqual(output);
			}
		});
	});
	describe('isContractAddressInBloom', () => {
		it.each(isInBloomValidData)('%s', (input, output) => {
			expect(isContractAddressInBloom(input[0], input[1])).toEqual(output);
		});
	});
	describe('isTopic', () => {
		it.each(isTopicValidData)('%s', (input, output) => {
			expect(isTopic(input)).toEqual(output);
		});
	});
	describe('isTopicInBloom', () => {
		it.each(isTopicInBloomValidData)('%s', (input, output) => {
			expect(isTopicInBloom(input[0], input[1])).toEqual(output);
		});
	});
	describe('isBlockNumber', () => {
		it.each([...isBlockNumberValidData, ...isBlockNumberInvalidData])('%s', (input, output) => {
			expect(isBlockNumber(input)).toEqual(output);
		});
	});
	describe('isBlockTag', () => {
		it.each([...isBlockTagValidData, ...isBlockTagInvalidData])('%s', (input, output) => {
			expect(isBlockTag(input)).toEqual(output);
		});
	});
	describe('isBlockNumberOrTag', () => {
		it.each([
			...isBlockTagValidData,
			...isBlockTagInvalidData,
			...isBlockNumberValidData,
			...isBlockNumberInvalidData,
		])('%s', (input, output) => {
			expect(isBlockNumberOrTag(input)).toEqual(output);
		});
	});
	describe('validateBlockNumberOrTag', () => {
		it.each([
			...isBlockTagValidData,
			...isBlockNumberValidData,
			...validateBlockNumberOrTagInvalidData(),
		])('%s', (input, output) => {
			if (output instanceof InvalidBlockNumberOrTagError) {
				expect(() => validateBlockNumberOrTag(input)).toThrow(output);
			} else {
				expect(() => validateBlockNumberOrTag(input)).not.toThrow();
			}
		});
	});
	describe('isHexString8Bytes', () => {
		it.each([...isHexString8BytesValidData, ...isHexStrictInvalidData])(
			'%s',
			(input, output) => {
				if (Array.isArray(input)) {
					expect(isHexString8Bytes(input[0], input[1])).toEqual(output);
				} else {
					expect(isHexString8Bytes(input)).toEqual(output);
				}
			},
		);
	});
	describe('validateHexString8Bytes', () => {
		it.each([...isHexString8BytesValidData, ...validateHexString8BytesInvalidData()])(
			'%s',
			(input, output) => {
				if (output instanceof InvalidHexStringError) {
					expect(() => validateHexString8Bytes(input)).toThrow(output);
				} else if (Array.isArray(input)) {
					expect(() => validateHexString8Bytes(input[0], input[1])).not.toThrow();
				} else {
					expect(() => validateHexString8Bytes(input)).not.toThrow();
				}
			},
		);
	});
	describe('isHexString32Bytes', () => {
		it.each([...isHexString32BytesValidData, ...isHexStrictInvalidData])(
			'%s',
			(input, output) => {
				if (Array.isArray(input)) {
					expect(isHexString32Bytes(input[0], input[1])).toEqual(output);
				} else {
					expect(isHexString32Bytes(input)).toEqual(output);
				}
			},
		);
	});
	describe('validateHexString32Bytes', () => {
		it.each([...isHexString32BytesValidData, ...validateHexString32BytesInvalidData()])(
			'%s',
			(input, output) => {
				if (output instanceof InvalidHexStringError) {
					expect(() => validateHexString32Bytes(input)).toThrow(output);
				} else if (Array.isArray(input)) {
					expect(() => validateHexString32Bytes(input[0], input[1])).not.toThrow();
				} else {
					expect(() => validateHexString32Bytes(input)).not.toThrow();
				}
			},
		);
	});
	describe('isFilterObject', () => {
		it.each([...isFilterObjectValidData])('%s', (input, output) => {
			expect(isFilterObject(input)).toEqual(output);
		});
	});
	describe('validateFilterObject', () => {
		it.each([...isFilterObjectValidData, ...validateFilterObjectInvalidData()])(
			'%s',
			(input, output) => {
				if (output instanceof InvalidFilterError) {
					expect(() => validateFilterObject(input)).toThrow(output);
				} else {
					expect(() => validateFilterObject(input)).not.toThrow();
				}
			},
		);
	});
	describe('isBoolean', () => {
		it.each([[true, true], [false, true], ...isBooleanInvalidData])('%s', (input, output) => {
			expect(isBoolean(input)).toEqual(output);
		});
	});
	describe('validateBoolean', () => {
		it.each([[true, true], [false, true], ...validateBooleanInvalidData()])(
			'%s',
			(input, output) => {
				if (output instanceof InvalidBooleanError) {
					expect(() => validateBoolean(input)).toThrow(output);
				} else {
					expect(() => validateBoolean(input)).not.toThrow();
				}
			},
		);
	});
});
