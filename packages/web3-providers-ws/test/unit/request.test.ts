import { RpcOptions } from 'web3-providers-base/lib/types';
import { EventEmitter } from 'events';

import Web3ProviderWS from '../../src/index';
import { WebSocketOptions } from '../../src/types';
import { doesNotMatch } from 'assert/strict';
import {
    RequestArguments,
    Web3ProviderEvents,
} from 'web3-core-types/lib/types';

describe('Web3ProvidersWS.request', () => {
    const request: RequestArguments = {
        rpcOptions: { id: 1, jsonrpc: '2.0' },
        method: 'eth_blockNumber',
        params: [],
    };
    jest.setTimeout(30000);
    it('should return RpcResponse', async (done) => {
        //jest.useFakeTimers();
        const web3ProvidersWS: Web3ProviderWS = new Web3ProviderWS(
            'ws://127.0.0.1:8546'
        );
        const callback = jest.fn();

        web3ProvidersWS.on(Web3ProviderEvents.Message, (data: any) => {
            console.log(JSON.stringify(data));
            callback();
        });

        await new Promise((r) => setTimeout(r, 5000));
        await web3ProvidersWS.request(request);

        //expect(callback).toBeCalledTimes(1);

        done();
    });
});
