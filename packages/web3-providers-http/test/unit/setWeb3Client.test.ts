import Web3LoggerVersion from 'web3-core-logger/src/_version';
import { Web3ProviderEvents } from 'web3-core-types/src/types';

import Web3ProvidersHttp from '../../src/index';
import Version from '../../src/_version';

describe('Web3ProvidersHttp.setWeb3Client', () => {
    const expectedChainId = '0x1';
    const oldClient = 'http://127.0.0.1:8545';

    let web3ProvidersHttpRequestSpy: jest.SpyInstance;

    beforeAll(() => {
        const chainIdResult = {
            id: 42,
            jsonrpc: '2.0',
            result: expectedChainId,
        };

        Web3ProvidersHttp.prototype.request = jest.fn();
        web3ProvidersHttpRequestSpy = jest.spyOn(
            Web3ProvidersHttp.prototype,
            'request'
        );
        // Web3ProviderHttp makes a request to get expectedChainId of
        // connected client upon instantiation, so we mock the reponse
        // @ts-ignore mockReturnValueOnce added by jest
        Web3ProvidersHttp.prototype.request.mockReturnValue(chainIdResult);
    });

    it('should set new web3Client', () => {
        const updatedClient = 'http://mycoolclient.ninja';
        const web3ProvidersHttp = new Web3ProvidersHttp(oldClient);
        web3ProvidersHttp.setWeb3Client(updatedClient);
    });

    it('should fail to set new client with invalid client error', () => {
        expect(() => {
            const web3ProvidersHttp = new Web3ProvidersHttp(oldClient);
            // @ts-ignore - Ignore invalid type
            web3ProvidersHttp.setWeb3Client({});
        }).toThrowError(
            `{"loggerVersion":"${Web3LoggerVersion}","packageName":"web3-providers-http","packageVersion":"${Version}","name":"invalidClientUrl","msg":"Provided web3Client is an invalid HTTP(S) URL","params":{"web3Client":{}}}`
        );
    });

    it('should fire Connect event when setting new web3Client', () => {
        const updatedClient = 'http://mycoolclient.ninja';
        const web3ProvidersHttp = new Web3ProvidersHttp(oldClient);

        web3ProvidersHttp.on(Web3ProviderEvents.Connect, (chainId: string) => {
            expect(chainId).toStrictEqual({ chainId: expectedChainId });
        });

        web3ProvidersHttp.setWeb3Client(updatedClient);
    });

    it('should fire ChainChanged event when setting new web3Client with different chainId', () => {
        const updatedClient = 'http://mycoolclient.ninja';
        const web3ProvidersHttp = new Web3ProvidersHttp(oldClient);
        const updatedChainId = '0x2';

        web3ProvidersHttp.on(
            Web3ProviderEvents.ChainChanged,
            (chainId: string) => {
                expect(chainId).toStrictEqual(updatedChainId);
            }
        );

        const chainIdResult = {
            id: 42,
            jsonrpc: '2.0',
            result: updatedChainId,
        };

        Web3ProvidersHttp.prototype.request = jest.fn();
        web3ProvidersHttpRequestSpy = jest.spyOn(
            Web3ProvidersHttp.prototype,
            'request'
        );
        // Web3ProviderHttp makes a request to get expectedChainId of
        // connected client upon instantiation, so we mock the reponse
        // @ts-ignore mockReturnValueOnce added by jest
        Web3ProvidersHttp.prototype.request.mockReturnValue(chainIdResult);

        web3ProvidersHttp.setWeb3Client(updatedClient);
    });
});
