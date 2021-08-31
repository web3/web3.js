import {
    ProviderEventListener,
    Eth1RequestArguments,
    Web3ProviderEvents,
} from 'web3-core-types/src/types';
import Web3LoggerVersion from 'web3-core-logger/src/_version';

import Web3ProvidersEip1193 from '../../src/index';
import Version from '../../src/_version';

describe('constructs a Web3ProvidersEip1193 instance with expected properties', () => {
    it('should instantiate successfully', () => {
        const eip1193Provider = {
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
            ) => eip1193Provider,
        };
        new Web3ProvidersEip1193(eip1193Provider);
    });

    it('should fail to instantiate with invalid client error', () => {
        expect(() => {
            // @ts-ignore - Ignore invalid type
            new Web3ProvidersEip1193({});
        }).toThrowError(
            `{"loggerVersion":"${Web3LoggerVersion}","packageName":"web3-providers-eip1193","packageVersion":"${Version}","name":"invalidClient","msg":"Provided web3Client is an invalid EIP-1193 client","params":{"web3Client":{}}}`
        );
    });
});
