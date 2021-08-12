import {
    ProviderEventListener,
    RequestArguments,
    Web3ProviderEvents,
} from 'web3-core-types/src/types';

import Web3ProvidersEip1193 from '../../src/index';

describe('constructs a Web3ProvidersEip1193 instance with expected properties', () => {
    it('should instantiate with expected properties', () => {
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
        const web3ProvidersEip1193 = new Web3ProvidersEip1193(eip1193Provider);
        expect(web3ProvidersEip1193.web3Client).toBe(eip1193Provider);
    });

    it('should fail to instantiate with invalid client error', () => {
        expect(() => {
            // @ts-ignore - Ignore invalid type
            new Web3ProvidersEip1193({});
        }).toThrowError(
            'Failed to set web3 client: Invalid EIP-1193 client provided'
        );
    });
});
