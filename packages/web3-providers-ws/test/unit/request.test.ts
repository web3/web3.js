import { ProviderOptions, RpcOptions } from 'web3-providers-base/lib/types';
import { EventEmitter } from 'events';


import Web3ProviderWS from '../../src/index';
import { JsonRpcResponse, WebSocketOptions, WSStatus } from '../../src/types';


describe('Web3ProvidersWS.request', () => {
    const providerOptions: WebSocketOptions = {
        providerUrl: 'ws://127.0.0.1:8546',
    };

    const rpcOptions: RpcOptions = {
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
    };

    it('should return RpcResponse', async () => {
        const web3ProvidersWS = new Web3ProviderWS(providerOptions);
        const eventEmitterWS: EventEmitter = web3ProvidersWS.getEventEmitter();

        eventEmitterWS.on(WSStatus.DATA, (data: any) => {
            console.log(JSON.stringify(data));
        });
        
        web3ProvidersWS.connect();

        web3ProvidersWS.request(rpcOptions, (error: Error | null, data: JsonRpcResponse | void) => {
            if(error)
                console.log(JSON.stringify(error));

            if(data)
                console.log(JSON.stringify(data));
        });

    });
});
