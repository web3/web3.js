import Web3ProviderWS from '../../src/index';
import { WebSocketOptions } from '../../src/types';

describe('Web3ProviderWS Tests', () => {
    let providerOptions: WebSocketOptions;

    beforeEach(() => {
        providerOptions = {
            providerUrl: 'wss://127.0.0.1:8545',
        };
    });

    it('should error because invalid WS address', () => {
        providerOptions.providerUrl = 'http://127.0.0.1:8545';
        expect(() => {
            new Web3ProviderWS(providerOptions);
        }).toThrowError('Invalid WebSocket URL provided');
    });
});
