import { testConfig } from './testConfig';
import { toHex, formatOutput } from '../../src';

describe('Should convert each testConfig.testCases to a hex string', () => {
    for (const testCase of testConfig.testCases) {
        // Array of results is handled by formatOutputObject
        if (testCase.inputType === 'Object') continue;
        // null tests are for formatOutput and formatOutputObject tests
        if (testCase.input === null) continue;
        it(
            testCase.shouldError
                ? `Should error because ${testCase.input} is an unsupported type`
                : `${testCase.input} (input type: ${testCase.inputType}) should be converted to hex string`,
            () => {
                if (testCase.shouldError) {
                    expect(() => {
                        // @ts-ignore Already checking that testCase.input is not an array
                        toHex(testCase.input);
                    }).toThrowError(testCase.errorMessage);
                } else {
                    // @ts-ignore Already checking that testCase.input is not an array
                    const hexInput = toHex(testCase.input);
                    const convertedInput = formatOutput(
                        hexInput,
                        // @ts-ignore Already checking that testCase.input is not an array
                        testCase.inputType
                    );
                    expect(convertedInput).toBe(testCase.input);
                }
            }
        );
    }
});
