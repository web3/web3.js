import { HttpRpcResponse } from "web3-providers-http/types";
import Web3RequestManager from "web3-core-requestmanager";

import Web3Eth from "../../src";
import { blockIdentifier, EthTransaction } from "../../types";
import { testConfig } from "./testConfig";

// @ts-ignore undefined was added to test default blockIdentifier set by Web3Eth method
const blockIdentifiers: blockIdentifier[] = [
    undefined,
    "latest",
    "earliest",
    "pending",
    42,
];

let web3Eth: Web3Eth;
let web3RequestManagerSendSpy: jest.SpyInstance;

async function configureWeb3EthCall(
    methodName: string,
    parameters: { [key: string]: string | number | BigInt },
    enumerateBlockIdentifiers: boolean
): Promise<HttpRpcResponse[]> {
    if (enumerateBlockIdentifiers) {
        const methodPromises = [];
        for (const blockIdentifier of blockIdentifiers) {
            if (blockIdentifier !== undefined)
                parameters.block = blockIdentifier;
            // @ts-ignore tsc doesn't like that we're arbitrarily calling methods
            methodPromises.push(web3Eth[methodName](parameters));
        }
        return await Promise.all(methodPromises);
    }
    // @ts-ignore tsc doesn't like that we're arbitrarily calling methods
    return await web3Eth[methodName](parameters);
}

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

function formatTransactionObject(
    transactionObject: EthTransaction
): [EthTransaction] {
    for (const property in transactionObject) {
        // @ts-ignore
        if (typeof transactionObject[property] === "bigint")
            transactionObject[property] = `0x${transactionObject[
                property
            ].toString(16)}`;
    }
    return [transactionObject];
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
                "send"
            );

            web3Eth = new Web3Eth({ providerUrl: testConfig.providerUrl });
        });

        it("should construct a Web3Eth instance with method defined", () => {
            // @ts-ignore
            expect(web3Eth[method.name]).not.toBe(undefined);
        });

        it("should get expected result - default RPC parameters", async () => {
            const result = await configureWeb3EthCall(
                method.name,
                method.parameters || {},
                method.enumerateBlockIdentifiers || false
            );
            const expectedSendParameters = {
                method: method.rpcMethod,
                jsonrpc: "2.0",
                params: method.parameterIsTransactionObject
                    ? // @ts-ignore we know this is a EthTransaction because of the flag
                      formatTransactionObject(method.parameters)
                    : method.parameters
                    ? Object.values(method.parameters)
                    : [],
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

        it("should get expected result - id RPC parameter", async () => {
            const result = await configureWeb3EthCall(
                method.name,
                { ...method.parameters, id: testConfig.expectedRpcId },
                method.enumerateBlockIdentifiers || false
            );
            const expectedSendParameters = {
                method: method.rpcMethod,
                jsonrpc: "2.0",
                params: method.parameterIsTransactionObject
                    ? // @ts-ignore we know this is a EthTransaction because of the flag
                      formatTransactionObject(method.parameters)
                    : method.parameters
                    ? Object.values(method.parameters)
                    : [],
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
