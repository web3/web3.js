import {
    IWeb3Provider,
    Eth1RequestArguments,
    Web3ProviderEvents,
    ProviderEventListener,
    Eip1193Provider,
} from 'web3-core-types/src/types';
import Web3ProvidersHttp from 'web3-providers-http';
import Web3LoggerVersion from 'web3-core-logger/src/_version';
import Web3ProvidersWS from 'web3-providers-ws';

import initWeb3Provider from '../../src/index';
import Version from '../../src/_version';

describe('Instantiates correct provider for varying provided clients', () => {
    it('should instantiate Eip1193 provider', () => {
        const Eip1193Provider: Eip1193Provider = {
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
            ) => Eip1193Provider,
        };
        const web3ProvidersEip1193 = initWeb3Provider(Eip1193Provider);
        // TODO
        // @ts-ignore tsc sees web3ProvidersEip1193 only as IWeb3Provider
        // and not Eip1193Provider
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
        const web3ProvidersHttp: IWeb3Provider = initWeb3Provider(
            httpClient
        ) as IWeb3Provider;
        expect(web3ProvidersHttp.setWeb3Client).not.toBe(undefined);
        expect(web3ProvidersHttp.request).not.toBe(undefined);
        expect(web3ProvidersHttp.supportsSubscriptions).not.toBe(undefined);
    });

    it('should instantiate WebSocket provider', () => {
        const wsClient = 'ws://127.0.0.1:8545';
        const Web3ProviderWS: IWeb3Provider = initWeb3Provider(
            wsClient
        ) as IWeb3Provider;

        expect(Web3ProviderWS.setWeb3Client).not.toBe(undefined);
        // @ts-ignore EIP1193 support needs to be removed
        expect(Web3ProviderWS.on).not.toBe(undefined);
        expect(Web3ProviderWS.request).not.toBe(undefined);
        expect(Web3ProviderWS.supportsSubscriptions).not.toBe(undefined);
    });

    it('should throw not implemented error for IPC client', () => {
        expect(() => initWeb3Provider('ipc://geth.ipc')).toThrowError(
            [
                `loggerVersion: ${Web3LoggerVersion}`,
                'packageName: web3-core-provider',
                `packageVersion: ${Version}`,
                'code: 1',
                'name: protocolNotImplemented',
                'msg: Detected protocol of provided web3Client is not implemented',
                'params: {"web3Client":"ipc://geth.ipc"}',
            ].join('\n')
        );
    });

    it('should throw protocol not support error', () => {
        expect(() => initWeb3Provider('foobar')).toThrowError(
            [
                `loggerVersion: ${Web3LoggerVersion}`,
                'packageName: web3-core-provider',
                `packageVersion: ${Version}`,
                'code: 2',
                'name: protocolNotSupported',
                'msg: Detected protocol of provided web3Client is not supported',
                'params: {"web3Client":"foobar"}',
            ].join('\n')
        );
    });
});
