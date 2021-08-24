import Web3ProviderWS from '../../src/index';
import { WebSocketOptions } from '../../src/types';

describe('web3ProvidersWS.supportsSubscriptions', () => {
    it('should return true', () => {
        const web3ProvidersWS = new Web3ProviderWS('ws://127.0.0.1:8546');
        expect(web3ProvidersWS.supportsSubscriptions()).toBeTruthy();
    });
});
