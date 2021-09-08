import Web3ProvidersHttp from 'web3-providers-http';

import Web3Beacon from '../../src';
import { testsHasParams } from './testConfig';

for (const testHasParams of testsHasParams) {
    describe(testHasParams.name, () => {
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
                testHasParams.expectedResult
            );

            // @ts-ignore
            const result = await web3Beacon[testHasParams.name](
                ...testHasParams.params
            );
            // if(testHasParams.defaultParams){

            // }
            expect(result).toEqual(testHasParams.expectedResult);
            expect(web3ProvidersHttpRequestSpy).toHaveBeenCalledWith({
                endpoint: testHasParams.endpoint,
                params: testHasParams.expectedParams,
                providerOptions: testHasParams.providerOptions,
            });
        });
    });
}
