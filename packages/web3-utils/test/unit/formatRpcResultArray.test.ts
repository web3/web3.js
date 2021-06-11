import { testConfig } from './testConfig';
import { formatRpcResultArray } from '../../src';
import { ValidTypesEnum } from '../../types';

describe('Should convert each testConfig.testCases that is an array of objects', () => {
    for (const testCase of testConfig.testCases) {
        for (const validType in ValidTypesEnum) {
            if (testCase.inputType !== 'Array') continue;
            // if (validType !== ValidTypesEnum.BigInt) continue;
            it(
                testCase.shouldError
                    ? 'Should error because one of the {formattableProperties} is an unsupported type'
                    : `{formattableProperties} should be converted to ${validType}`,
                () => {
                    if (testCase.shouldError) {
                        expect(() => {
                            formatRpcResultArray(
                                testCase.input,
                                testCase.formattableProperties || [],
                                ValidTypesEnum[validType as ValidTypesEnum]
                            );
                        }).toThrowError(testCase.errorMessage);
                    } else {
                        const convertedInput = formatRpcResultArray(
                            testCase.input,
                            testCase.formattableProperties || [],
                            ValidTypesEnum[validType as ValidTypesEnum]
                        );
                        console.log(convertedInput);
                        if (testCase.formattedInputs) {
                            expect(convertedInput).toMatchObject(
                                testCase.formattedInputs[
                                    ValidTypesEnum[validType as ValidTypesEnum]
                                ]
                            );
                        } else {
                            throw Error(
                                'Need to specifiy testCase.formattedInput in testConfig.ts'
                            );
                        }
                    }
                }
            );
        }
    }
});
