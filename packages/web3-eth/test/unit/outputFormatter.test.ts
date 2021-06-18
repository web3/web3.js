import { RpcResponse } from 'web3-providers-base/types';
import { ValidTypesEnum } from 'web3-utils/types';
import { formatOutput, formatOutputObject } from 'web3-utils';
import Web3RequestManager from 'web3-core-requestmanager';

import Web3Eth from '../../src';
import { testConfig } from './testConfig';

let web3Eth: Web3Eth;
let web3RequestManagerSendSpy: jest.SpyInstance;

/**
 * This test suite verifies that each method in {Web3Eth} returns
 * {formattableProperties} as the specified {callOptions.returnType} for
 * each possible {ValidTypesEnum}
 */

function checkForExpected(
    expectedResult: RpcResponse,
    actualResult: RpcResponse,
    expectedReturnType: ValidTypesEnum,
    formattableProperties?: string[]
) {
    let formattedResult = formattableProperties
        ? formatOutputObject(
              expectedResult.result,
              formattableProperties,
              expectedReturnType
          )
        : formatOutput(expectedResult.result, expectedReturnType);
    expect(actualResult).toMatchObject({
        ...expectedResult,
        result: formattedResult,
    });
}

describe('Web3Eth Output Formatter Tests', () => {
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

            if (method.testOutputFormatter) {
                for (const validType in ValidTypesEnum) {
                    describe(`Return type: ${validType}`, () => {
                        it('should call method with desired return type', async () => {
                            const parameters = method.parameters
                                ? Object.values(method.parameters)
                                : [];
                            const callOptions = { returnType: validType };

                            // @ts-ignore tsc doesn't like that we're arbitrarily calling methods
                            const result = await web3Eth[method.name](
                                ...parameters,
                                callOptions
                            );
                            Array.isArray(result)
                                ? result.forEach((methodResult) => {
                                      checkForExpected(
                                          method.defaultExpectedResult,
                                          methodResult,
                                          ValidTypesEnum[
                                              validType as ValidTypesEnum
                                          ],
                                          method.formattableOutputProperties
                                      );
                                  })
                                : checkForExpected(
                                      method.defaultExpectedResult,
                                      result,
                                      ValidTypesEnum[
                                          validType as ValidTypesEnum
                                      ],
                                      method.formattableOutputProperties
                                  );
                        });
                    });
                }
            }
        });
    }
});
