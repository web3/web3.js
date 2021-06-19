import { ProviderOptions, RpcOptions } from 'web3-providers-base/types';
import { EventEmitter } from 'events';

import Web3ProvidersHttp from '../../src/index';

describe('Web3ProvidersHttp.subscribe', () => {
    const providerOptions: ProviderOptions = {
        providerUrl: 'http://127.0.0.1:8545',
    };
    const rpcOptions: RpcOptions = {
        id: 42,
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
    };
    const expectedResult = {
        id: rpcOptions.id,
        jsonrpc: rpcOptions.jsonrpc,
        result: '0x1',
    };

    let web3ProvidersHttpSendSpy: jest.SpyInstance;
    let web3ProvidersHttp: Web3ProvidersHttp;

    beforeAll(() => {
        Web3ProvidersHttp.prototype.send = jest.fn();
        // @ts-ignore mockReturnValue added by jest
        Web3ProvidersHttp.prototype.send.mockReturnValue(expectedResult);
        web3ProvidersHttpSendSpy = jest.spyOn(
            Web3ProvidersHttp.prototype,
            'send'
        );

        web3ProvidersHttp = new Web3ProvidersHttp(providerOptions);
    });

    it('should return eventEmitter and subscriptionId', (done) => {
        const { eventEmitter, subscriptionId } =
            web3ProvidersHttp.subscribe(rpcOptions);
        expect(typeof subscriptionId).toBe('number');
        expect(eventEmitter instanceof EventEmitter).toBeTruthy();
        // Giving enough time for subscription to be initialized
        setTimeout(() => {
            web3ProvidersHttp.unsubscribe(eventEmitter, subscriptionId);
            done();
        }, 1000);
    });
});
