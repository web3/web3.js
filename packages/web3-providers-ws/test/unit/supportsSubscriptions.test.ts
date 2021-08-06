
import Web3ProviderWS from '../../src/index';
import { WebSocketOptions } from '../../src/types';

describe('web3ProvidersWS.supportsSubscriptions', () => {
    const providerOptions: WebSocketOptions = {
        providerUrl: 'ws://127.0.0.1:8545',
    };

    it('should return true', () => {
        const web3ProvidersWS = new Web3ProviderWS(providerOptions);
        expect(web3ProvidersWS.supportsSubscriptions()).toBeTruthy();
    });
});
