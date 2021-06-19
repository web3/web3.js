import { ProviderOptions } from 'web3-providers-base/types';

import Web3RequestManager from '../../src/index';

describe('constructs a Web3RequestManager instance with expected properties', () => {
    let providerOptions: ProviderOptions;

    beforeEach(() => {
        providerOptions = {
            providerUrl: 'http://127.0.0.1:8545',
        };
    });

    it('should instanciate with expected values', () => {
        const web3RequestManager = new Web3RequestManager(providerOptions);
        expect(web3RequestManager.provider).toMatchObject(providerOptions);
    });

    it('should have set providerProtocol to HTTP', () => {
        const web3RequestManager = new Web3RequestManager(providerOptions);
        // providerProtocol is an enum declared in src/index.ts
        expect(web3RequestManager.providerProtocol).toBe(1); // 1 === HTTP
    });

    it('should error because WS is not implemented', () => {
        providerOptions.providerUrl = 'wss://127.0.0.1:8545';
        expect(() => {
            new Web3RequestManager(providerOptions);
        }).toThrowError('Provider protocol not implemented');
    });

    it('should error because IPC is not implemented', () => {
        providerOptions.providerUrl = 'ipc://geth.ipc';
        expect(() => {
            new Web3RequestManager(providerOptions);
        }).toThrowError('Provider protocol not implemented');
    });

    it('should have set providerProtocol to UNKNOWN', () => {
        providerOptions.providerUrl = '127.0.0.1:8545';
        expect(() => {
            new Web3RequestManager(providerOptions);
        }).toThrowError('Provider protocol not supported');
    });
});
