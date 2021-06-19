import { ValidTypesEnum } from 'web3-utils/types';
import { toHex, formatOutput } from 'web3-utils';
import Web3RequestManager from 'web3-core-requestmanager';

import Web3Eth from '../../src';
import { testConfig } from './testConfig';

let web3Eth: Web3Eth;
let web3RequestManagerSendSpy: jest.SpyInstance;

/**
 * This test suite is a bit convoluted, but it's testing to make sure
 * that the expected {method.formattableInputProperties} are being formatted
 * from any {ValidTypes} to {PrefixedHexString} before being passed to {Web3RequestManager.send}
 */

function checkForExpected(
    rpcMethod: string,
    originalParameters: any,
    desiredType: ValidTypesEnum,
    formattableProperties: string[] = [],
    formattablePropertyByteLengths: { [key: string]: number } = {}
) {
    for (const formattableProperty of formattableProperties) {
        const convertedParameter = originalParameters.filter
            ? formatOutput(
                  originalParameters.filter[formattableProperty],
                  desiredType
              )
            : formatOutput(
                  originalParameters[formattableProperty],
                  desiredType
              );
        const formattedParameter = toHex(
            convertedParameter,
            formattablePropertyByteLengths[formattableProperty]
        );

        if (originalParameters.filter) {
            originalParameters.filter[formattableProperty] = formattedParameter;
        } else {
            originalParameters[formattableProperty] = formattedParameter;
        }
        expect(web3RequestManagerSendSpy).toBeCalledWith(
            {
                method: rpcMethod,
                params: Object.values(originalParameters),
            },
            undefined
        );
    }
}

describe('Web3Eth Input Formatter Tests', () => {
    for (const method of testConfig.methods) {
        describe(method.name, () => {
            beforeAll(() => {
                Web3RequestManager.prototype.send = jest.fn();
                // @ts-ignore mockReturnValue added by jest
                Web3RequestManager.prototype.send.mockReturnValue(
                    method.defaultExpectedResult
                );
                web3RequestManagerSendSpy = jest.spyOn(
                    Web3RequestManager.prototype,
                    'send'
                );

                web3Eth = new Web3Eth({ providerUrl: testConfig.providerUrl });
            });

            if (method.testInputFormatter) {
                for (const validType in ValidTypesEnum) {
                    describe(`Return type: ${validType}`, () => {
                        it('should convert expected formattable parameters to PrefixedHexString', async () => {
                            const parameters = method.parameters
                                ? Object.values(method.parameters)
                                : [];
                            const callOptions = { returnType: validType };

                            // @ts-ignore tsc doesn't like that we're arbitrarily calling methods
                            await web3Eth[method.name](
                                ...parameters,
                                callOptions
                            );
                            checkForExpected(
                                method.rpcMethod,
                                method.parameters,
                                ValidTypesEnum[validType as ValidTypesEnum],
                                method.formattableInputProperties,
                                method.formattablePropertyByteLengths
                            );
                        });
                    });
                }
            }
        });
    }
});
