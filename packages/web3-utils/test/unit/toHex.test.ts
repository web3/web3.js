import { testConfig } from './testConfig';
import { toHex, formatOutput } from '../../src';

describe('Should convert each testConfig.testCases to a hex string', () => {
    for (const testCase of testConfig.testCases) {
        it(
            testCase.shouldError
                ? `Should error because ${testCase.input} is an unsupported type`
                : `${testCase.input} should be converted to hex string`,
            () => {
                if (testCase.shouldError) {
                    expect(() => {
                        toHex(testCase.input);
                    }).toThrowError(testCase.errorMessage || 'cheese');
                } else {
                    const hexInput = toHex(testCase.input);
                    const convertedInput = formatOutput(
                        hexInput,
                        testCase.inputType
                    );
                    expect(convertedInput).toBe(
                        testCase.expectedFormattedInput || testCase.input
                    );
                }
            }
        );
    }
});
