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

    // TODO Could make use of jest.useFakeTimers, but
    // implemting that functionality does not emit the responses
    // as expected, therefore the tests fail
    it('should receive response expectedNumResponses', (done) => {
        const responses: any[] = [];
        const { eventEmitter, subscriptionId } =
            web3ProvidersHttp.subscribe(subscribeOptions);
        expect(typeof subscriptionId).toBe('number');
        eventEmitter.on('response', (response) => {
            expect(response).toMatchObject(expectedResult);
            responses.push(response);
        });
        // Unsubscribe after giving enough time to receive expectedNumResponses
        setTimeout(() => {
            web3ProvidersHttp.unsubscribe(subscriptionId);
        }, expectedNumResponses * subscribeOptions.milisecondsBetweenRequests);
        // Wait time it would take to receive expectedNumResponses + 1
        // to verify unsubscribing worked
        setTimeout(() => {
            expect(responses.length).toBe(expectedNumResponses);
            expect(web3ProvidersHttpSendSpy).toHaveBeenCalledTimes(
                expectedNumResponses
            );
            done();
        }, (expectedNumResponses + 1) * subscribeOptions.milisecondsBetweenRequests);
    });
});
