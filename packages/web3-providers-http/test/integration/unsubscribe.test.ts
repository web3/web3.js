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
        result: '0x0',
    };
    const expectedNumResponses = 1;

    let web3ProvidersHttp: Web3ProvidersHttp;

    beforeAll(() => {
        web3ProvidersHttp = new Web3ProvidersHttp(providerOptions);
    });

    it('should receive response once, then unsubscribe without receiving further responses', (done) => {
        const responses: any[] = [];
        const { eventEmitter, subscriptionId } =
            web3ProvidersHttp.subscribe(subscribeOptions);
        eventEmitter.on('response', (response) => {
            expect(response).toMatchObject(expectedResult);
            responses.push(response);
        });
        // Unsubscribe after giving enough time to receive expectedNumResponses
        setTimeout(() => {
            web3ProvidersHttp.unsubscribe(eventEmitter, subscriptionId);
        }, expectedNumResponses * subscribeOptions.milisecondsBetweenRequests);
        // Wait time it would take to receive expectedNumResponses + 1
        // to verify unsubscribing worked
        setTimeout(() => {
            expect(responses.length).toBe(expectedNumResponses);
            done();
        }, (expectedNumResponses + 1) * subscribeOptions.milisecondsBetweenRequests);
    });
});
