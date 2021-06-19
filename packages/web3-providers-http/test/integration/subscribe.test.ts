import { ProviderOptions } from 'web3-providers-base/types';

import Web3ProvidersHttp from '../../src/index';

describe('Web3ProvidersHttp.subscribe', () => {
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
    const expectedNumResponses = 2;

    let web3ProvidersHttp: Web3ProvidersHttp;

    beforeAll(() => {
        web3ProvidersHttp = new Web3ProvidersHttp(providerOptions);
    });

    it('should receive expectedNumResponses', async (done) => {
        const responses: any[] = [];
        const { eventEmitter, subscriptionId } =
            await web3ProvidersHttp.subscribe(subscribeOptions);
        eventEmitter.on('response', (response) => {
            expect(response).toMatchObject(expectedResult);
            responses.push(response);
        });
        setTimeout(() => {
            web3ProvidersHttp.unsubscribe(eventEmitter, subscriptionId);
            expect(responses.length).toBe(expectedNumResponses);
            done();
        }, expectedNumResponses * subscribeOptions.milisecondsBetweenRequests);
    });
});
