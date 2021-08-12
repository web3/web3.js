import {
    IWeb3Provider,
    RequestArguments,
    Web3ProviderEvents,
    ProviderEventListener,
} from 'web3-core-types/src/types';
import Web3ProvidersHttp from 'web3-providers-http';

import initWeb3Provider from '../../src/index';

describe('Instantiates correct provider for varying provided clients', () => {
    it('should instantiate Eip1193 provider', () => {
        const Eip1193Provider = {
            request: async (args: RequestArguments) => {
                return {
                    id: 1,
                    jsonrpc: '2.0',
                    result: [],
                };
            },
            on: (
                web3ProviderEvents: Web3ProviderEvents,
                listener: ProviderEventListener
            ) => Eip1193Provider,
        };
        const web3ProvidersEip1193: IWeb3Provider =
            initWeb3Provider(Eip1193Provider);
        expect(typeof web3ProvidersEip1193.web3Client).toBe('object');
        expect(web3ProvidersEip1193.setWeb3Client).not.toBe(undefined);
        expect(web3ProvidersEip1193.on).not.toBe(undefined);
        expect(web3ProvidersEip1193.request).not.toBe(undefined);
    });

    it('should instantiate HTTP provider', () => {
        Web3ProvidersHttp.prototype.request = jest.fn();
        // Web3ProviderHttp makes a request to get chainId of
        // connected client upon instantiation, so we mock the reponse
        // @ts-ignore mockReturnValue added by jest
        Web3ProvidersHttp.prototype.request.mockReturnValue('0x1');

        const httpClient = 'http://127.0.0.1:8545';
        const web3ProvidersHttp: IWeb3Provider = initWeb3Provider(httpClient);
        expect(web3ProvidersHttp.web3Client).toBe(httpClient);
        expect(web3ProvidersHttp.setWeb3Client).not.toBe(undefined);
        expect(web3ProvidersHttp.on).not.toBe(undefined);
        expect(web3ProvidersHttp.request).not.toBe(undefined);
        expect(web3ProvidersHttp.supportsSubscriptions).not.toBe(undefined);
    });

    it('should throw not implemented error for WebSocket client', () => {
        expect(() => initWeb3Provider('ws://127.0.0.1:8545')).toThrowError(
            'Provider protocol not implemented'
        );
    });

    it('should throw not implemented error for IPC client', () => {
        expect(() => initWeb3Provider('ipc://geth.ipc')).toThrowError(
            'Provider protocol not implemented'
        );
    });

    it('should throw protocol not support error', () => {
        expect(() => initWeb3Provider('foobar')).toThrowError(
            'Provider protocol not supported'
        );
    });
});
