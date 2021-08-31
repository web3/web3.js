import { ValidTypes, ValidTypesEnum } from 'web3-core-types/src/types';
import Web3LoggerVersion from 'web3-core-logger/src/_version';

import Version from '../../src/_version';

interface TestCase {
    input: ValidTypes | null | { [key: string]: any };
    inputType: ValidTypesEnum | 'Object';
    shouldError?: true;
    errorMessage?: string;
    formattedInputs?: {
        [key: string]: ValidTypes | any[] | null | { [key: string]: any };
    };
    formattableProperties?: (string | { [key: string]: any })[];
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
                PrefixedHexString: '0x1',
                NumberString: '1',
                BigInt: BigInt(1),
            },
        },
        {
            input: -1,
            shouldError: true,
            errorMessage: `{"loggerVersion":"${Web3LoggerVersion}","packageName":"web3-utils","packageVersion":"${Version}","name":"invalidInput","msg":"Cannot convert provided input to prefiex hex string","params":{"input":-1},"reason":"Cannot convert number less than 0"}`,
            inputType: ValidTypesEnum.Number,
        },
        {
            input: 4.2,
            shouldError: true,
            errorMessage: `{"loggerVersion":"${Web3LoggerVersion}","packageName":"web3-utils","packageVersion":"${Version}","name":"invalidInput","msg":"Cannot convert provided input to prefiex hex string","params":{"input":4.2},"reason":"Cannot convert decimals"}`,
            inputType: ValidTypesEnum.Number,
        },
        {
            input: '0x1',
            inputType: ValidTypesEnum.PrefixedHexString,
            formattedInputs: {
                Number: 1,
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
                PrefixedHexString: '0xabc',
                NumberString: '2748',
                BigInt: BigInt(2748),
            },
        },
        {
            input: '0xxyz',
            shouldError: true,
            errorMessage: `{"loggerVersion":"${Web3LoggerVersion}","packageName":"web3-utils","packageVersion":"${Version}","name":"invalidInput","msg":"Cannot convert provided input to prefiex hex string","params":{"input":"0xxyz"},"reason":"Cannot convert arbitrary string"}`,
            inputType: ValidTypesEnum.PrefixedHexString,
        },
        {
            input: '42',
            inputType: ValidTypesEnum.NumberString,
            formattedInputs: {
                Number: 42,
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
                PrefixedHexString: '0x1',
                NumberString: '1',
                BigInt: BigInt(1),
            },
        },
        {
            input: '-1',
            shouldError: true,
            errorMessage: `{"loggerVersion":"${Web3LoggerVersion}","packageName":"web3-utils","packageVersion":"${Version}","name":"invalidInput","msg":"Cannot convert provided input to prefiex hex string","params":{"input":"-1"},"reason":"Cannot convert number less than 0"}`,
            inputType: ValidTypesEnum.NumberString,
        },
        {
            input: '4.2',
            shouldError: true,
            errorMessage: `{"loggerVersion":"${Web3LoggerVersion}","packageName":"web3-utils","packageVersion":"${Version}","name":"invalidInput","msg":"Cannot convert provided input to prefiex hex string","params":{"input":"4.2"},"reason":"Cannot convert decimals"}`,
            inputType: ValidTypesEnum.NumberString,
        },
        {
            input: BigInt(42),
            inputType: ValidTypesEnum.BigInt,
            formattedInputs: {
                Number: 42,
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
                PrefixedHexString: '0x1',
                NumberString: '1',
                BigInt: BigInt(1),
            },
        },
        {
            input: BigInt(-1),
            shouldError: true,
            errorMessage: `{"loggerVersion":"${Web3LoggerVersion}","packageName":"web3-utils","packageVersion":"${Version}","name":"invalidInput","msg":"Cannot convert provided input to prefiex hex string","params":{"input":"-1n"},"reason":"Cannot convert number less than 0"}`,
            inputType: ValidTypesEnum.BigInt,
        },
        {
            input: null,
            inputType: ValidTypesEnum.BigInt,
            formattedInputs: {
                Number: null,
                PrefixedHexString: null,
                NumberString: null,
                BigInt: null,
            },
        },
        {
            input: {
                propertyOne: 42,
                propertyTwo: '13',
                propertyThree: {
                    propertyFour: '0xabc',
                    propertyFive: '0xaaa',
                },
            },
            inputType: 'Object',
            formattableProperties: [
                'propertyOne',
                'propertyTwo',
                { propertyThree: ['propertyFour', 'propertyFive'] },
            ],
            formattedInputs: {
                Number: {
                    propertyOne: 42,
                    propertyTwo: 13,
                    propertyThree: {
                        propertyFour: 2748,
                        propertyFive: 2730,
                    },
                },
                PrefixedHexString: {
                    propertyOne: '0x2a',
                    propertyTwo: '0xd',
                    propertyThree: {
                        propertyFour: '0xabc',
                        propertyFive: '0xaaa',
                    },
                },
                NumberString: {
                    propertyOne: '42',
                    propertyTwo: '13',
                    propertyThree: {
                        propertyFour: '2748',
                        propertyFive: '2730',
                    },
                },
                BigInt: {
                    propertyOne: BigInt(42),
                    propertyTwo: BigInt('13'),
                    propertyThree: {
                        propertyFour: BigInt('0xabc'),
                        propertyFive: BigInt('0xaaa'),
                    },
                },
            },
        },
        {
            input: {
                propertyOne: 42,
                propertyTwo: '13',
                propertyThree: '0xabc',
            },
            inputType: 'Object',
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
        {
            input: {
                propertyOne: 42,
                propertyTwo: null,
                propertyThree: '0xabc',
            },
            inputType: 'Object',
            formattableProperties: [
                'propertyOne',
                'propertyTwo',
                'propertyThree',
            ],
            formattedInputs: {
                Number: {
                    propertyOne: 42,
                    propertyTwo: null,
                    propertyThree: 2748,
                },
                PrefixedHexString: {
                    propertyOne: '0x2a',
                    propertyTwo: null,
                    propertyThree: '0xabc',
                },
                NumberString: {
                    propertyOne: '42',
                    propertyTwo: null,
                    propertyThree: '2748',
                },
                BigInt: {
                    propertyOne: BigInt(42),
                    propertyTwo: null,
                    propertyThree: BigInt('0xabc'),
                },
            },
        },
    ],
};
