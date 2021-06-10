import { ValidTypes, ValidTypesEnum } from '../../types';

interface TestCase {
    input: ValidTypes;
    inputType: ValidTypesEnum;
    shouldError?: true;
    errorMessage?: string;
    expectedFormattedInput?: ValidTypes;
}

interface TestConfig {
    testCases: TestCase[];
}

export const testConfig: TestConfig = {
    testCases: [
        {
            input: 42,
            inputType: ValidTypesEnum.Number,
        },
        {
            input: 0,
            inputType: ValidTypesEnum.Number,
        },
        {
            input: 1,
            inputType: ValidTypesEnum.Number,
        },
        {
            input: -1,
            shouldError: true,
            errorMessage: 'Cannot convert number less than 0: -1',
            inputType: ValidTypesEnum.Number,
        },
        {
            input: 4.2,
            shouldError: true,
            errorMessage: 'Cannot convert float: 4.2',
            inputType: ValidTypesEnum.Number,
        },
        {
            input: '0x1',
            inputType: ValidTypesEnum.HexString,
        },
        {
            input: '0x01',
            inputType: ValidTypesEnum.HexString,
            expectedFormattedInput: '0x01',
        },
        {
            input: '0x0',
            inputType: ValidTypesEnum.HexString,
        },
        {
            input: '0xabc',
            inputType: ValidTypesEnum.HexString,
        },
        {
            input: '01',
            inputType: ValidTypesEnum.HexString,
            expectedFormattedInput: '0x01',
        },
        {
            input: 'abc',
            inputType: ValidTypesEnum.HexString,
            expectedFormattedInput: '0xabc',
        },
        {
            input: 'xyz',
            shouldError: true,
            errorMessage: 'Cannot convert arbitrary string: xyz',
            inputType: ValidTypesEnum.HexString,
        },
        {
            input: '0xxyz',
            shouldError: true,
            errorMessage: 'Cannot convert arbitrary string: 0xxyz',
            inputType: ValidTypesEnum.HexString,
        },
        {
            input: '42',
            inputType: ValidTypesEnum.NumberString,
        },
        {
            input: '0',
            inputType: ValidTypesEnum.NumberString,
        },
        {
            input: '1',
            inputType: ValidTypesEnum.NumberString,
        },
        {
            input: '-1',
            shouldError: true,
            errorMessage: 'Cannot convert number less than 0: -1',
            inputType: ValidTypesEnum.NumberString,
        },
        {
            input: '4.2',
            shouldError: true,
            errorMessage: 'Cannot convert float: 4.2',
            inputType: ValidTypesEnum.NumberString,
        },
        {
            input: BigInt(42),
            inputType: ValidTypesEnum.BigInt,
        },
        {
            input: BigInt(0),
            inputType: ValidTypesEnum.BigInt,
        },
        {
            input: BigInt(1),
            inputType: ValidTypesEnum.BigInt,
        },
        {
            input: BigInt(-1),
            shouldError: true,
            errorMessage: 'Cannot convert number less than 0: -1',
            inputType: ValidTypesEnum.BigInt,
        },
    ],
};
