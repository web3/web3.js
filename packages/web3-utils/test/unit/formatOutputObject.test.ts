import { testConfig } from './testConfig';
import { formatOutputObject } from '../../src';
import { ValidTypesEnum } from '../../src/types';

describe('Should convert each testConfig.testCases that is an array of objects', () => {
    for (const testCase of testConfig.testCases) {
        for (const validType in ValidTypesEnum) {
            if (testCase.inputType !== 'Object') continue;
            describe(`Desired type: ${validType}`, () => {
                it(
                    testCase.shouldError
                        ? 'Should error because one of the {formattableProperties} is an unsupported type'
                        : `{formattableProperties} should be converted to ${validType}`,
                    () => {
                        if (testCase.shouldError) {
                            expect(() => {
                                formatOutputObject(
                                    testCase.input as { [key: string]: any },
                                    testCase.formattableProperties || [],
                                    ValidTypesEnum[validType as ValidTypesEnum]
                                );
                            }).toThrowError(testCase.errorMessage);
                        } else {
                            const convertedInput = formatOutputObject(
                                testCase.input as { [key: string]: any },
                                testCase.formattableProperties || [],
                                ValidTypesEnum[validType as ValidTypesEnum]
                            );
                            if (testCase.formattedInputs) {
                                expect(convertedInput).toMatchObject(
                                    // @ts-ignore Complain that test.formattedInputs can be
                                    // null instead of an array or object
                                    testCase.formattedInputs[
                                        ValidTypesEnum[
                                            validType as ValidTypesEnum
                                        ]
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
            });
        }
    }
});
