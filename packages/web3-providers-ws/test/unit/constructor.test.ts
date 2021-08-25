import { doesNotMatch } from 'assert';
import { Web3ProviderEvents } from 'web3-core-types/lib/types';
import Web3ProviderWS from '../../src/index';

describe('Web3ProviderWS Tests', () => {
    let provider: Web3ProviderWS;
    it('should error because invalid WS address', () => {
        expect(() => {
            new Web3ProviderWS('http://127.0.0.1:8545');
        }).toThrowError('Invalid WebSocket URL provided');
    });

    it('should create instance of Web3ProviderWS', async (done) => {
        let isConnected = (status: boolean) => {
            expect(status).toBeTruthy();
            provider.disconnect(0);
            done();
        };

        provider = new Web3ProviderWS('ws://127.0.0.1:8545');

        provider.on(Web3ProviderEvents.Connect, () => {
            isConnected(true);
        });
    });
});
