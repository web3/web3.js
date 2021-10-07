import fetchMock from 'jest-fetch-mock';
jest.setMock("cross-fetch", fetchMock);

import { JsonRpcPayload } from 'web3-common';

import { HttpProvider } from '../../src/index';
import { httpProviderOptions } from '../fixtures/http_provider_options';

describe('HttpProvider.send', () => {
    let httpProvider: HttpProvider;

    beforeAll(() => {
        httpProvider = new HttpProvider('http://localhost:8545');
    });

    it('should call HttpProvider.request with correct parameters', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ foo: 'bar' }));

        const requestSpy = jest.spyOn(httpProvider, 'request');

        const jsonRpcPayload = ({
            jsonrpc: '2.0',
            id: 42,
            method: 'eth_getBalance',
            params: [
                '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
                'latest'
            ]
        } as JsonRpcPayload);
        // const callback = jest.fn();

        // httpProvider.send(
        //     jsonRpcPayload,
        //     callback,
        //     httpProviderOptions
        // );

        const foo = await httpProvider.request(jsonRpcPayload, httpProviderOptions);
        console.log(foo);

        expect(requestSpy).toHaveBeenCalledWith(jsonRpcPayload, httpProviderOptions);
    });
});
