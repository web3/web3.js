import { ProviderOptions } from 'web3-providers-base/types';

import Web3ProvidersHttp from '../../src/index';

describe('Web3ProvidersHttp.unsubscribe', () => {
    const providerOptions: ProviderOptions = {
        providerUrl: 'http://127.0.0.1:8545',
    };
    const subscribeOptions = {
        id: 42,
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        milisecondsBetweenRequests: 1000,
    };
    const expectedResult = {
        id: subscribeOptions.id,
        jsonrpc: subscribeOptions.jsonrpc,
        result: '0x1',
    };
    const expectedNumResponses = 1;

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

    it('should unsubscribe and receive unsubscribe event', (done) => {
        const { eventEmitter, subscriptionId } =
            web3ProvidersHttp.subscribe(subscribeOptions);
        // If event is not emitted, test will error because done is never called
        eventEmitter.on('unsubscribed', () => {
            done();
        });
        // Giving enough time for subscription to be initialized
        setTimeout(() => {
            web3ProvidersHttp.unsubscribe(eventEmitter, subscriptionId);
        }, 1000);
    });

    it('should error because subscriptionId does not exist', async () => {
        jest.useFakeTimers();
        const { eventEmitter, subscriptionId } =
            await web3ProvidersHttp.subscribe(subscribeOptions);
        expect(() => {
            web3ProvidersHttp.unsubscribe(eventEmitter, 420);
        }).toThrowError(
            'Error unsubscribing: Subscription with id: 420 does not exist'
        );
    });
});
