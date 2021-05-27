import { HttpRpcResponse } from 'web3-providers-http/types';
import Web3RequestManager from 'web3-core-requestmanager';

import Web3Eth from '../../src';
import { testConfig } from './testConfig';

let web3Eth: Web3Eth;
let web3RequestManagerSendSpy: jest.SpyInstance;

function checkForExpected(
    expectedResult: HttpRpcResponse,
    actualResult: HttpRpcResponse,
    expectedSendParameters: any
) {
    expect(actualResult).toMatchObject(expectedResult);
    expect(web3RequestManagerSendSpy).toHaveBeenCalledWith(
        expectedSendParameters
    );
}

for (const method of testConfig.methods) {
    describe(`Web3Eth.${method.name}`, () => {
        beforeAll(() => {
            Web3RequestManager.prototype.send = jest.fn();
            // @ts-ignore mockReturnValue added by jest
            Web3RequestManager.prototype.send.mockReturnValue(
                method.expectedResult
            );
            web3RequestManagerSendSpy = jest.spyOn(
                Web3RequestManager.prototype,
                'send'
            );

            web3Eth = new Web3Eth({ providerUrl: testConfig.providerUrl });
        });

        it('should construct a Web3Eth instance with method defined', () => {
            // @ts-ignore
            expect(web3Eth[method.name]).not.toBe(undefined);
        });

        it('should get expected result - default RPC parameters', async () => {
            // @ts-ignore tsc doesn't like that we're arbitrarily calling methods
            const result = await web3Eth[method.name](
                ...(method.parameters || [])
            );
            const expectedSendParameters = {
                method: method.rpcMethod,
                jsonrpc: '2.0',
                params: method.parameters || [],
            };
            Array.isArray(result)
                ? result.forEach((methodResult) => {
                      checkForExpected(
                          method.expectedResult,
                          methodResult,
                          expectedSendParameters
                      );
                  })
                : checkForExpected(
                      method.expectedResult,
                      result,
                      expectedSendParameters
                  );
        });

        it('should get expected result - id RPC parameter', async () => {
            // @ts-ignore tsc doesn't like that we're arbitrarily calling methods
            const result = await web3Eth[method.name](
                ...(method.parameters || []),
                testConfig.expectedRpcId
            );
            const expectedSendParameters = {
                method: method.rpcMethod,
                jsonrpc: '2.0',
                params: method.parameters || [],
            };
            Array.isArray(result)
                ? result.forEach((methodResult) => {
                      checkForExpected(
                          method.expectedResult,
                          methodResult,
                          expectedSendParameters
                      );
                  })
                : checkForExpected(
                      method.expectedResult,
                      result,
                      expectedSendParameters
                  );
        });
    });
}
