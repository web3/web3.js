import { InvalidAddressError, InvalidBlockError, InvalidBloomError, InvalidHexStringError } from '../../src/errors';
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
} from '../fixtures/validation';

describe('validation', () => {
	describe('isHex', () => {
		it.each([...isHexValidData, ...isHexInvalidData])('%s', (input, output) => {
            expect(isHex(input)).toEqual(output);
        });
	});
	describe('isHexStrict', () => {
		it.each([...isHexStrictValidData, ...isHexStrictInvalidData])('%s', (input, output) => {
            expect(isHexStrict(input)).toEqual(output);
        });
	});
	describe('validateHexString', () => {
		describe('invalid cases', () => {
			it.each(validateHexStringInputInvalidData)('%s', (input, output) => {
				expect(() => validateHexStringInput(input)).toThrow(output);
			});
		});
	});
	describe('validateBytesInput', () => {
		describe('invalid cases', () => {
			it.each(validateBytesInputInvalidData)('%s', (input, output) => {
				expect(() => validateBytesInput(input)).toThrow(output);
			});
		});
	});
	describe('validateNumbersInput', () => {
		describe('invalid cases', () => {
			it.each(validateNumbersInputInvalidData)('%s', (input, output) => {
				expect(() => validateNumbersInput(input[0], input[1])).toThrow(output);
			});
		});
	});
	describe('validateStringInput', () => {
		describe('invalid cases', () => {
			it.each(validateStringInputInvalidData)('%s', (input, output) => {
				expect(() => validateStringInput(input)).toThrow(output);
			});
		});
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
	describe('compareBlockNumbers', () => {
		it.each([...compareBlockNumbersValidData, ...compareBlockNumbersInvalidData])('%s', (input, output) => {
            if (output instanceof InvalidBlockError) {
                expect(() => compareBlockNumbers(input[0], input[1])).toThrow(output);
            } else {
                expect(compareBlockNumbers(input[0], input[1])).toEqual(output);
            }
        });
	});
	describe('isUserEthereumAddressInBloomValidData', () => {
		it.each([...isUserEthereumAddressInBloomValidData, ...isUserEthereumAddressInBloomInvalidData])('%s', (input, output) => {
            if (output instanceof InvalidBloomError || output instanceof InvalidAddressError) {
                expect(() => isUserEthereumAddressInBloom(input[0], input[1])).toThrow(output);
            } else {
                expect(isUserEthereumAddressInBloom(input[0], input[1])).toEqual(output);
            }
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
	describe('isContractAddressInBloom', () => {
		it.each(isInBloomValidData)('%s', (input, output) => {
            expect(isContractAddressInBloom(input[0], input[1])).toEqual(output);
        });
	});
	describe('isBigInt', () => {
		it.each(isBigIntValidData)('%s', (input, output) => {
            expect(isBigInt(input)).toEqual(output);
        });
	});
	describe('isBlockTag', () => {
		it.each([...isBlockTagValidData, ...isBlockTagInvalidData])('%s', (input, output) => {
            expect(isBlockTag(input)).toEqual(output);
        });
	});
});
