import Web3ProvidersHttp from 'web3-providers-http';
import { ValidTypesEnum, BlockTags } from 'web3-core-types/src/types';

import Web3Eth from '../../src';
import { testsHasParams } from './testConfig';

for (const testHasParams of testsHasParams) {
    describe(testHasParams.name, () => {
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
                testHasParams.expectedResult
            );

            // @ts-ignore
            const result = await web3Eth[testHasParams.name](
                ...testHasParams.params
            );
            expect(result).toStrictEqual(testHasParams.expectedResult);
            expect(web3ProvidersHttpRequestSpy).toHaveBeenCalledWith({
                method: testHasParams.method,
                params: testHasParams.params,
            });
        });

        if (testHasParams.formatInput) {
            describe('Input formatting', () => {
                for (const validType in ValidTypesEnum) {
                    it(`should convert params from ${validType} to prefixed hex strings`, async () => {
                        // @ts-ignore mockReturnValueOnce added by jest
                        Web3ProvidersHttp.prototype.request.mockReturnValueOnce(
                            testHasParams.expectedResult
                        );

                        // @ts-ignore
                        const result = await web3Eth[testHasParams.name](
                            // @ts-ignore
                            ...testHasParams[`params${validType}`]
                        );
                        expect(result).toStrictEqual(
                            testHasParams.expectedResult
                        );
                        expect(
                            web3ProvidersHttpRequestSpy
                        ).toHaveBeenCalledWith({
                            method: testHasParams.method,
                            params: testHasParams.params,
                        });
                    });
                }
            });
        }

        if (testHasParams.supportsBlockTags) {
            describe('Input formatting - Block Tags', () => {
                for (const blockTag in BlockTags) {
                    it(`should not convert provided Block Tag: ${blockTag}`, async () => {
                        // @ts-ignore mockReturnValueOnce added by jest
                        Web3ProvidersHttp.prototype.request.mockReturnValueOnce(
                            testHasParams.expectedResult
                        );

                        // @ts-ignore
                        const result = await web3Eth[testHasParams.name](
                            // @ts-ignore
                            ...testHasParams[`params${blockTag}`]
                        );
                        expect(result).toStrictEqual(
                            testHasParams.expectedResult
                        );
                        expect(
                            web3ProvidersHttpRequestSpy
                        ).toHaveBeenCalledWith({
                            method: testHasParams.method,
                            // @ts-ignore
                            params: testHasParams[`params${blockTag}`],
                        });
                    });
                }
            });
        }

        if (testHasParams.formatOutput) {
            describe('Output formatting', () => {
                for (const validType in ValidTypesEnum) {
                    it(`should convert RPC result to ${validType}`, async () => {
                        // @ts-ignore mockReturnValueOnce added by jest
                        Web3ProvidersHttp.prototype.request.mockReturnValueOnce(
                            // @ts-ignore
                            testHasParams[`expectedResult${validType}`]
                        );

                        // @ts-ignore
                        const result = await web3Eth[testHasParams.name](
                            ...testHasParams.params,
                            { returnType: validType }
                        );
                        expect(result).toStrictEqual(
                            // @ts-ignore
                            testHasParams[`expectedResult${validType}`]
                        );
                        expect(
                            web3ProvidersHttpRequestSpy
                        ).toHaveBeenCalledWith({
                            method: testHasParams.method,
                            params: testHasParams.params,
                        });
                    });
                }
            });
        }
    });
}
