import { PartialRpcOptions, RpcOptions } from 'web3-providers-base/types';
import Web3ProviderHttp from 'web3-providers-http';

import Web3RequestManager from '../../src/index';

const providerOptions = {
    providerUrl: 'http://127.0.0.1:8545',
};
const DEFAULT_JSON_RPC_VERSION = '2.0';
const rpcOptions: RpcOptions = {
    id: 42,
    jsonrpc: DEFAULT_JSON_RPC_VERSION,
    method: 'testing',
    params: ['bar'],
};

let web3ProviderHttpSubscribeSpy: jest.SpyInstance;
let web3RequestManager: Web3RequestManager;

describe('Web3RequestManager.subscribe', () => {
    beforeAll(() => {
        // Replace method so network call isn't made
        Web3ProviderHttp.prototype.subscribe = jest.fn();
        web3ProviderHttpSubscribeSpy = jest.spyOn(
            Web3ProviderHttp.prototype,
            'subscribe'
        );
        web3RequestManager = new Web3RequestManager(providerOptions);
    });

    it('should call Web3ProviderHttp.subscribe', async () => {
        await web3RequestManager.subscribe(rpcOptions);
        expect(web3ProviderHttpSubscribeSpy).toHaveBeenCalledTimes(1);
        expect(web3ProviderHttpSubscribeSpy).toHaveBeenCalledWith(
            rpcOptions,
            undefined
        );
    });

    it('should default rpcOptions.id and rpcOptions.jsonrpc', async () => {
        const partialRpcOptions: PartialRpcOptions = { ...rpcOptions };
        delete partialRpcOptions.id;
        delete partialRpcOptions.jsonrpc;
        await web3RequestManager.subscribe(partialRpcOptions);
        expect(web3ProviderHttpSubscribeSpy).toHaveBeenCalledWith(
            rpcOptions,
            undefined
        );
    });
});
