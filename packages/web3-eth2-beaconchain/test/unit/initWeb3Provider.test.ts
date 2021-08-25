import Web3ProvidersHttp from '../../../web3-providers-http/src/index';

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

    it('should instantiate with expected properties', () => {
        const expectedClient = 'http://127.0.0.1:8545';
        new Web3ProvidersHttp(expectedClient);
    });
});
