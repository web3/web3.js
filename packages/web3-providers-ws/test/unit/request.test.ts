import Web3ProviderWS from '../../src/index';
import {
    Eth1RequestArguments,
    RpcResponse,
    Web3ProviderEvents,
} from 'web3-core-types/lib/types';

describe.skip('Web3ProvidersWS.request', () => {
    // TODO: add eth clients in CI in new PR of CI
    it('should return RpcResponse', async (done) => {
        const request: Eth1RequestArguments = {
            rpcOptions: { id: 131, jsonrpc: '2.0' },
            method: 'eth_blockNumber',
            params: [],
        };

        const web3ProvidersWS: Web3ProviderWS = new Web3ProviderWS(
            'ws://127.0.0.1:8546'
        );

        let parseResponseCallback = (response: RpcResponse) => {
            expect(response).not.toBeNull();
            expect(response.id).toBe(request.rpcOptions?.id);

            web3ProvidersWS.disconnect();
            done();
        };

        web3ProvidersWS.on(
            Web3ProviderEvents.Message,
            (response: RpcResponse) => {
                parseResponseCallback(response);
            }
        );

        await web3ProvidersWS.request(request);
    });
});
