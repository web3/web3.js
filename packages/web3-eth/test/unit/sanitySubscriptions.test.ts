import Web3RequestManager from 'web3-core-requestmanager';
import {
    CallOptions,
    PartialRpcOptions,
    RpcParams,
} from 'web3-providers-base/types';

import Web3Eth from '../../src';
import { testConfig } from './testConfig';

let web3RequestManagerSubscribeSpy: jest.SpyInstance;
let web3Eth: Web3Eth;

/**
 * This test suite verifes that {Web3RequestManager.subscribe} is called
 * with the expected parameters when {callOptions.subscribe} = true
 */

function checkForExpected(rpcOptions: PartialRpcOptions) {
    expect(web3RequestManagerSubscribeSpy).toHaveBeenCalledWith(
        rpcOptions,
        undefined
    );
}

for (const method of testConfig.methods) {
    describe(`Web3Eth.${method.name} - Subscription`, () => {
        beforeAll(() => {
            Web3RequestManager.prototype.subscribe = jest.fn();
            web3RequestManagerSubscribeSpy = jest.spyOn(
                Web3RequestManager.prototype,
                'subscribe'
            );

            web3Eth = new Web3Eth({ providerUrl: testConfig.providerUrl });
        });

        it('should call Web3RequestManager.subscribe with expected parameters', async () => {
            const parameters = method.parameters
                ? Object.values(method.parameters)
                : [];
            const callOptions: CallOptions = {
                subscribe: true,
            };

            method.parameters
                ? // @ts-ignore tsc doesn't like that we're arbitrarily calling methods
                  await web3Eth[method.name](...parameters, callOptions)
                : // @ts-ignore tsc doesn't like that we're arbitrarily calling methods
                  await web3Eth[method.name](callOptions);
            const rpcOptions = {
                method: method.rpcMethod,
                params: parameters as RpcParams,
            };
            checkForExpected(rpcOptions);
        });
    });
}
