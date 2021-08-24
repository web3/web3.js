import Web3ProvidersHttp from 'web3-providers-http';
import { ValidTypesEnum } from 'web3-core-types/src/types';

import Web3Eth from '../../src';
import { testsNoParams } from './testConfig';

for (const testNoParams of testsNoParams) {
    describe(testNoParams.name, () => {
        let web3ProvidersHttpRequestSpy: jest.SpyInstance;
        let web3Eth: Web3Eth;

        beforeAll(() => {
            Web3ProvidersHttp.prototype.request = jest.fn();
            web3ProvidersHttpRequestSpy = jest.spyOn(
                Web3ProvidersHttp.prototype,
                'request'
            );
            web3Eth = new Web3Eth({ web3Client: 'http://127.0.0.1:8545' });
        });

        it('should make request with expected requestArguments', async () => {
            // @ts-ignore mockReturnValueOnce added by jest
            Web3ProvidersHttp.prototype.request.mockReturnValueOnce(
                testNoParams.expectedResult
            );

            // @ts-ignore
            const result = await web3Eth[testNoParams.name]();
            expect(result).toStrictEqual(testNoParams.expectedResult);
            expect(web3ProvidersHttpRequestSpy).toHaveBeenCalledWith({
                method: testNoParams.method,
                params: [],
            });
        });

        if (testNoParams.formatOutput) {
            describe('Output formatting', () => {
                for (const validType in ValidTypesEnum) {
                    it(`should convert RPC result to ${validType}`, async () => {
                        // @ts-ignore mockReturnValueOnce added by jest
                        Web3ProvidersHttp.prototype.request.mockReturnValueOnce(
                            // @ts-ignore
                            testNoParams[`expectedResult${validType}`]
                        );

                        // @ts-ignore
                        const result = await web3Eth[testNoParams.name]({
                            returnType: validType,
                        });
                        expect(result).toStrictEqual(
                            // @ts-ignore
                            testNoParams[`expectedResult${validType}`]
                        );
                        expect(
                            web3ProvidersHttpRequestSpy
                        ).toHaveBeenCalledWith({
                            method: testNoParams.method,
                            params: [],
                        });
                    });
                }
            });
        }
    });
}
