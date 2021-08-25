import Web3ProviderWS from '../../src/index';
import {
    Eth1RequestArguments,
    Web3ProviderEvents,
} from 'web3-core-types/lib/types';

describe('Web3ProvidersWS.request', () => {
    it('should return RpcResponse', async (done) => {
        const request: Eth1RequestArguments = {
            rpcOptions: { id: 131, jsonrpc: '2.0' },
            method: 'eth_blockNumber',
            params: [],
        };

        const web3ProvidersWS: Web3ProviderWS = new Web3ProviderWS(
            'ws://127.0.0.1:8545'
        );

        let parseResponseCallback = (response: any) => {
            expect(response).not.toBeNull();
            expect(response.id).toBe(request.rpcOptions?.id);

            web3ProvidersWS.disconnect();
            done();
        };

        web3ProvidersWS.on(Web3ProviderEvents.Message, (response: any) => {
            parseResponseCallback(response);
        });

        await web3ProvidersWS.request(request);
    });
});
