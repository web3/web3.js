import Web3ProvidersHttp from 'web3-providers-http';
import { ValidTypesEnum } from 'web3-core-types/lib/types';

import Web3Eth from '../../src';

describe('getSyncing', () => {
    let web3ProvidersHttpRequestSpy: jest.SpyInstance;
    let web3Eth: Web3Eth;

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
        Web3ProvidersHttp.prototype.request.mockReturnValueOnce(chainIdResult);
        web3Eth = new Web3Eth({ web3Client: 'http://127.0.0.1:8545' });
    });

    it('should make request with expected requestArguments', async () => {
        const expectedResult = {
            id: 42,
            jsonrpc: '2.0',
            result: {
                startingBlock: '0x384',
                currentBlock: '0x386',
                highestBlock: '0x454',
            },
        };
        // @ts-ignore mockReturnValueOnce added by jest
        Web3ProvidersHttp.prototype.request.mockReturnValueOnce(expectedResult);

        const result = await web3Eth.getSyncing();
        expect(result).toStrictEqual(expectedResult);
        expect(web3ProvidersHttpRequestSpy).toHaveBeenCalledWith({
            method: 'eth_syncing',
            params: [],
        });
    });

    describe('Output formatting', () => {
        it('should convert RPC result to number', async () => {
            const expectedResult = {
                id: 42,
                jsonrpc: '2.0',
                result: {
                    startingBlock: 900,
                    currentBlock: 902,
                    highestBlock: 1108,
                },
            };
            // @ts-ignore mockReturnValueOnce added by jest
            Web3ProvidersHttp.prototype.request.mockReturnValueOnce(
                expectedResult
            );

            const result = await web3Eth.getSyncing({
                returnType: ValidTypesEnum.Number,
            });
            expect(result).toStrictEqual(expectedResult);
            expect(web3ProvidersHttpRequestSpy).toHaveBeenCalledWith({
                method: 'eth_syncing',
                params: [],
            });
        });

        it('should convert RPC result to number string', async () => {
            const expectedResult = {
                id: 42,
                jsonrpc: '2.0',
                result: {
                    startingBlock: '900',
                    currentBlock: '902',
                    highestBlock: '1108',
                },
            };
            // @ts-ignore mockReturnValueOnce added by jest
            Web3ProvidersHttp.prototype.request.mockReturnValueOnce(
                expectedResult
            );

            const result = await web3Eth.getSyncing({
                returnType: ValidTypesEnum.NumberString,
            });
            expect(result).toStrictEqual(expectedResult);
            expect(web3ProvidersHttpRequestSpy).toHaveBeenCalledWith({
                method: 'eth_syncing',
                params: [],
            });
        });

        it('should convert RPC result to BigInt', async () => {
            const expectedResult = {
                id: 42,
                jsonrpc: '2.0',
                result: {
                    startingBlock: BigInt(0x384),
                    currentBlock: BigInt(0x386),
                    highestBlock: BigInt(0x454),
                },
            };
            // @ts-ignore mockReturnValueOnce added by jest
            Web3ProvidersHttp.prototype.request.mockReturnValueOnce(
                expectedResult
            );

            const result = await web3Eth.getSyncing({
                returnType: ValidTypesEnum.BigInt,
            });
            expect(result).toStrictEqual(expectedResult);
            expect(web3ProvidersHttpRequestSpy).toHaveBeenCalledWith({
                method: 'eth_syncing',
                params: [],
            });
        });
    });
});
