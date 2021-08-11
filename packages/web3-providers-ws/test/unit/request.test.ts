import { ProviderOptions, RpcOptions } from 'web3-providers-base/lib/types';
import { EventEmitter } from 'events';

import Web3ProviderWS from '../../src/index';
import { JsonRpcResponse, WebSocketOptions, WSStatus } from '../../src/types';
import { doesNotMatch } from 'assert/strict';

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
    jest.setTimeout(30000);
    it('should return RpcResponse', async (done) => {
        //jest.useFakeTimers();
        const web3ProvidersWS = new Web3ProviderWS(providerOptions);

        const callback = jest.fn();

        web3ProvidersWS.on(WSStatus.DATA, (data: any) => {
            console.log(JSON.stringify(data));
            callback();
        });

        await web3ProvidersWS.connect();
        await new Promise((r) => setTimeout(r, 5000));
        await web3ProvidersWS.request(rpcOptions);

        //expect(callback).toBeCalledTimes(1);

        done();
    });
});
