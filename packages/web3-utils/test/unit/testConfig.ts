import { ValidTypes, ValidTypesEnum } from '../../types';

interface TestCase {
    input: ValidTypes | { [key: string]: any };
    inputType: ValidTypesEnum | 'Array';
    shouldError?: true;
    errorMessage?: string;
    formattedInputs?: {
        [key: string]: ValidTypes | any[] | { [key: string]: any };
    };
    formattableProperties?: string[];
}

interface TestConfig {
    testCases: TestCase[];
}

export const testConfig: TestConfig = {
    testCases: [
        {
            input: 42,
            inputType: ValidTypesEnum.Number,
            formattedInputs: {
                Number: 42,
                HexString: '2a',
                PrefixedHexString: '0x2a',
                NumberString: '42',
                BigInt: BigInt(42),
            },
        },
        {
            input: 0,
            inputType: ValidTypesEnum.Number,
            formattedInputs: {
                Number: 0,
                HexString: '0',
                PrefixedHexString: '0x0',
                NumberString: '0',
                BigInt: BigInt(0),
            },
        },
        {
            input: 1,
            inputType: ValidTypesEnum.Number,
            formattedInputs: {
                Number: 1,
                HexString: '1',
                PrefixedHexString: '0x1',
                NumberString: '1',
                BigInt: BigInt(1),
            },
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
            inputType: ValidTypesEnum.PrefixedHexString,
            formattedInputs: {
                Number: 1,
                HexString: '1',
                PrefixedHexString: '0x1',
                NumberString: '1',
                BigInt: BigInt(1),
            },
        },
        {
            input: '0x01',
            inputType: ValidTypesEnum.PrefixedHexString,
            formattedInputs: {
                Number: 1,
                HexString: '01',
                PrefixedHexString: '0x01',
                NumberString: '1',
                BigInt: BigInt(1),
            },
        },
        {
            input: '0x0',
            inputType: ValidTypesEnum.PrefixedHexString,
            formattedInputs: {
                Number: 0,
                HexString: '0',
                PrefixedHexString: '0x0',
                NumberString: '0',
                BigInt: BigInt(0),
            },
        },
        {
            input: '0xabc',
            inputType: ValidTypesEnum.PrefixedHexString,
            formattedInputs: {
                Number: 2748,
                HexString: 'abc',
                PrefixedHexString: '0xabc',
                NumberString: '2748',
                BigInt: BigInt(2748),
            },
        },
        {
            input: '01',
            inputType: ValidTypesEnum.HexString,
            formattedInputs: {
                Number: 1,
                HexString: '01',
                PrefixedHexString: '0x01',
                NumberString: '1',
                BigInt: BigInt(1),
            },
        },
        {
            input: 'abc',
            inputType: ValidTypesEnum.HexString,
            formattedInputs: {
                Number: 2748,
                HexString: 'abc',
                PrefixedHexString: '0xabc',
                NumberString: '2748',
                BigInt: BigInt(2748),
            },
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
            inputType: ValidTypesEnum.PrefixedHexString,
        },
        {
            input: '42',
            inputType: ValidTypesEnum.NumberString,
            formattedInputs: {
                Number: 42,
                HexString: '2a',
                PrefixedHexString: '0x2a',
                NumberString: '42',
                BigInt: BigInt(42),
            },
        },
        {
            input: '0',
            inputType: ValidTypesEnum.NumberString,
            formattedInputs: {
                Number: 0,
                HexString: '0',
                PrefixedHexString: '0x0',
                NumberString: '0',
                BigInt: BigInt(0),
            },
        },
        {
            input: '1',
            inputType: ValidTypesEnum.NumberString,
            formattedInputs: {
                Number: 1,
                HexString: '1',
                PrefixedHexString: '0x1',
                NumberString: '1',
                BigInt: BigInt(1),
            },
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
            formattedInputs: {
                Number: 42,
                HexString: '2a',
                PrefixedHexString: '0x2a',
                NumberString: '42',
                BigInt: BigInt(42),
            },
        },
        {
            input: BigInt(0),
            inputType: ValidTypesEnum.BigInt,
            formattedInputs: {
                Number: 0,
                HexString: '0',
                PrefixedHexString: '0x0',
                NumberString: '0',
                BigInt: BigInt(0),
            },
        },
        {
            input: BigInt(1),
            inputType: ValidTypesEnum.BigInt,
            formattedInputs: {
                Number: 1,
                HexString: '1',
                PrefixedHexString: '0x1',
                NumberString: '1',
                BigInt: BigInt(1),
            },
        },
        {
            input: BigInt(-1),
            shouldError: true,
            errorMessage: 'Cannot convert number less than 0: -1',
            inputType: ValidTypesEnum.BigInt,
        },
        {
            input: [
                {
                    propertyOne: 42,
                    propertyTwo: '13',
                    propertyThree: '0xabc',
                },
                {
                    propertyOne: 42,
                    propertyTwo: '13',
                    propertyThree: '0xabc',
                },
                {
                    propertyOne: 42,
                    propertyTwo: '13',
                    propertyThree: '0xabc',
                },
            ],
            inputType: 'Array',
            formattableProperties: [
                'propertyOne',
                'propertyTwo',
                'propertyThree',
            ],
            formattedInputs: {
                Number: [
                    {
                        propertyOne: 42,
                        propertyTwo: 13,
                        propertyThree: 2748,
                    },
                    {
                        propertyOne: 42,
                        propertyTwo: 13,
                        propertyThree: 2748,
                    },
                    {
                        propertyOne: 42,
                        propertyTwo: 13,
                        propertyThree: 2748,
                    },
                ],
                HexString: [
                    {
                        propertyOne: '2a',
                        propertyTwo: 'd',
                        propertyThree: 'abc',
                    },
                    {
                        propertyOne: '2a',
                        propertyTwo: 'd',
                        propertyThree: 'abc',
                    },
                    {
                        propertyOne: '2a',
                        propertyTwo: 'd',
                        propertyThree: 'abc',
                    },
                ],
                PrefixedHexString: [
                    {
                        propertyOne: '0x2a',
                        propertyTwo: '0xd',
                        propertyThree: '0xabc',
                    },
                    {
                        propertyOne: '0x2a',
                        propertyTwo: '0xd',
                        propertyThree: '0xabc',
                    },
                    {
                        propertyOne: '0x2a',
                        propertyTwo: '0xd',
                        propertyThree: '0xabc',
                    },
                ],
                NumberString: [
                    {
                        propertyOne: '42',
                        propertyTwo: '13',
                        propertyThree: '2748',
                    },
                    {
                        propertyOne: '42',
                        propertyTwo: '13',
                        propertyThree: '2748',
                    },
                    {
                        propertyOne: '42',
                        propertyTwo: '13',
                        propertyThree: '2748',
                    },
                ],
                BigInt: [
                    {
                        propertyOne: BigInt(42),
                        propertyTwo: BigInt('13'),
                        propertyThree: BigInt('0xabc'),
                    },
                    {
                        propertyOne: BigInt(42),
                        propertyTwo: BigInt('13'),
                        propertyThree: BigInt('0xabc'),
                    },
                    {
                        propertyOne: BigInt(42),
                        propertyTwo: BigInt('13'),
                        propertyThree: BigInt('0xabc'),
                    },
                ],
            },
        },
        {
            input: {
                propertyOne: 42,
                propertyTwo: '13',
                propertyThree: '0xabc',
            },
            inputType: 'Array',
            formattableProperties: [
                'propertyOne',
                'propertyTwo',
                'propertyThree',
            ],
            formattedInputs: {
                Number: {
                    propertyOne: 42,
                    propertyTwo: 13,
                    propertyThree: 2748,
                },
                HexString: {
                    propertyOne: '2a',
                    propertyTwo: 'd',
                    propertyThree: 'abc',
                },
                PrefixedHexString: {
                    propertyOne: '0x2a',
                    propertyTwo: '0xd',
                    propertyThree: '0xabc',
                },
                NumberString: {
                    propertyOne: '42',
                    propertyTwo: '13',
                    propertyThree: '2748',
                },
                BigInt: {
                    propertyOne: BigInt(42),
                    propertyTwo: BigInt('13'),
                    propertyThree: BigInt('0xabc'),
                },
            },
        },
    ],
};
