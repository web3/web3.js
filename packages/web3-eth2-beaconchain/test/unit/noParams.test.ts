import Web3ProvidersHttp from 'web3-providers-http';

import Web3Beacon from '../../src';
import { testsNoParams } from './testConfig';

for (const testNoParams of testsNoParams) {
    describe(testNoParams.name, () => {
        let web3ProvidersHttpRequestSpy: jest.SpyInstance;
        let web3Beacon: Web3Beacon;
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
            Web3ProvidersHttp.prototype.request.mockReturnValueOnce(
                chainIdResult
            );
            web3Beacon = new Web3Beacon({
                web3Client: 'http://127.0.0.1:8545',
            });
        });

        it('should make request with expected requestArguments', async () => {
            // @ts-ignore mockReturnValueOnce added by jest

            Web3ProvidersHttp.prototype.request.mockReturnValueOnce(
                testNoParams.expectedResult
            );

            // @ts-ignore
            const result = await web3Beacon[testNoParams.name]();
            expect(result).toStrictEqual(testNoParams.expectedResult);
            expect(web3ProvidersHttpRequestSpy).toHaveBeenCalledWith({
                endpoint: testNoParams.endpoint,
            });
        });
    });
}
