import {
    ProviderEventListener,
    RequestArguments,
    Web3ProviderEvents,
} from 'web3-core-types/src/types';

import Web3ProvidersEip1193 from '../../src/index';

describe('constructs a Web3ProvidersEip1193 instance with expected properties', () => {
    it('should instantiate successfully', () => {
        const eip1193Provider = {
            request: async (args: RequestArguments) => {
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
            [
                'loggerVersion: 1.0.0-alpha.0',
                'packageName: web3-providers-eip1193',
                'packageVersion: 1.0.0-alpha.0',
                'code: 1',
                'name: invalidClient',
                'msg: Provided web3Client is an invalid EIP-1193 client',
                'params: {"web3Client":{}}',
            ].join('\n')
        );
    });
});
