import Web3ProviderWS from '../../src/index';
import { WebSocketOptions } from '../../src/types';

describe('Web3ProviderWS Tests', () => {
    it('should error because invalid WS address', () => {
        expect(() => {
            new Web3ProviderWS('http://127.0.0.1:8545');
        }).toThrowError('Invalid WebSocket URL provided');
    });
});
