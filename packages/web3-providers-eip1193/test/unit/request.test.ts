import {
    ProviderEventListener,
    Eth1RequestArguments,
    Web3ProviderEvents,
} from 'web3-core-types/src/types';

import Web3ProvidersEip1193 from '../../src/index';

describe('Web3ProvidersEip1193.request', () => {
    let eip1193ProviderRequestSpy: jest.SpyInstance;
    let web3ProvidersEip1193: Web3ProvidersEip1193;

    beforeAll(() => {
        const eip1193Provider = {
            request: async (args: Eth1RequestArguments) => {
                return {
                    id: 1,
                    jsonrpc: '2.0',
                    result: [],
                };
            },
            on: (
                web3ProviderEvents: Web3ProviderEvents,
                listener: ProviderEventListener
            ) => eip1193Provider,
        };

        eip1193ProviderRequestSpy = jest.spyOn(eip1193Provider, 'request');

        web3ProvidersEip1193 = new Web3ProvidersEip1193(eip1193Provider);
    });

    it('should call eip1193Provider.request with expected params = undefined', () => {
        web3ProvidersEip1193.request({
            method: 'foo',
            params: undefined,
        });

        expect(eip1193ProviderRequestSpy).toHaveBeenCalledWith({
            method: 'foo',
            params: [],
        });
    });

    it('should call eip1193Provider.request with expected params = array', () => {
        web3ProvidersEip1193.request({
            method: 'foo',
            params: [1, BigInt(0), 'cheese'],
        });

        expect(eip1193ProviderRequestSpy).toHaveBeenCalledWith({
            method: 'foo',
            params: [1, BigInt(0), 'cheese'],
        });
    });

    it('should call eip1193Provider.request with expected params = object', () => {
        web3ProvidersEip1193.request({
            method: 'foo',
            params: {
                one: 'one',
                two: 2,
                three: BigInt(3),
            },
        });

        expect(eip1193ProviderRequestSpy).toHaveBeenCalledWith({
            method: 'foo',
            params: ['one', 2, BigInt(3)],
        });
    });

    it('should call eip1193Provider.request with expected params = number', () => {
        web3ProvidersEip1193.request({
            method: 'foo',
            // @ts-ignore Testing invalid argument
            params: 2,
        });

        expect(eip1193ProviderRequestSpy).toHaveBeenCalledWith({
            method: 'foo',
            params: [],
        });
    });
});
