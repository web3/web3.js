import { testConfig } from './testConfig';
import { formatOutput } from '../../src';
import { ValidTypesEnum } from '../../types';

describe('Should convert each testConfig.testCases to each {ValidTypesEnum}', () => {
    for (const testCase of testConfig.testCases) {
        for (const validType in ValidTypesEnum) {
            if (testCase.inputType === 'Array') continue;
            it(
                testCase.shouldError
                    ? `Should error because ${testCase.input} is an unsupported type`
                    : `${testCase.input} should be converted to ${validType}`,
                () => {
                    if (testCase.shouldError) {
                        expect(() => {
                            formatOutput(
                                // @ts-ignore Already checking that testCase.input is not an array
                                testCase.input,
                                ValidTypesEnum[validType as ValidTypesEnum]
                            );
                        }).toThrowError(testCase.errorMessage);
                    } else {
                        const convertedInput = formatOutput(
                            // @ts-ignore Already checking that testCase.input is not an array
                            testCase.input,
                            ValidTypesEnum[validType as ValidTypesEnum]
                        );
                        if (testCase.formattedInputs) {
                            expect(convertedInput).toBe(
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
