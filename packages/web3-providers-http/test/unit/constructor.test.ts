import Web3LoggerVersion from 'web3-core-logger/src/_version';

import Web3ProvidersHttp from '../../src/index';
import Version from '../../src/_version';

describe('constructs a Web3ProvidersHttp instance with expected properties', () => {
    let web3ProvidersHttpRequestSpy: jest.SpyInstance;

    beforeAll(() => {
        const chainIdResult = {
            id: 42,
            jsonrpc: '2.0',
            result: '0x1',
        };

        Web3ProvidersHttp.prototype.request = jest.fn();
        web3ProvidersHttpRequestSpy = jest.spyOn(
            Web3ProvidersHttp.prototype,
            'request'
        );
        // Web3ProviderHttp makes a request to get chainId of
        // connected client upon instantiation, so we mock the reponse
        // @ts-ignore mockReturnValueOnce added by jest
        Web3ProvidersHttp.prototype.request.mockReturnValue(chainIdResult);
    });

    it('should instantiate successfully', () => {
        const expectedClient = 'http://127.0.0.1:8545';
        new Web3ProvidersHttp(expectedClient);
    });

    it('should fail to instantiate with invalid client error', () => {
        expect(() => {
            // @ts-ignore - Ignore invalid type
            new Web3ProvidersHttp({});
        }).toThrowError(
            [
                `loggerVersion: ${Web3LoggerVersion}`,
                'packageName: web3-providers-http',
                `packageVersion: ${Version}`,
                'code: 1',
                'name: invalidClientUrl',
                'msg: Provided web3Client is an invalid HTTP(S) URL',
                'params: {"web3Client":{}}',
            ].join('\n')
        );
    });

    it('should return false when calling supportsSubscriptions', () => {
        const expectedClient = 'http://127.0.0.1:8545';
        const web3ProvidersHttp = new Web3ProvidersHttp(expectedClient);
        expect(web3ProvidersHttp.supportsSubscriptions()).toBeFalsy();
    });
});
