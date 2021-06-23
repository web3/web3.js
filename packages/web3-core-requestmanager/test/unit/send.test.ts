import { PartialRpcOptions, RpcOptions } from 'web3-providers-base/lib/types';
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

let web3ProviderHttpSendSpy: jest.SpyInstance;
let web3RequestManager: Web3RequestManager;

describe('Web3RequestManager.send', () => {
    beforeAll(() => {
        // Replace method so network call isn't made
        Web3ProviderHttp.prototype.send = jest.fn();
        web3ProviderHttpSendSpy = jest.spyOn(
            Web3ProviderHttp.prototype,
            'send'
        );
        web3RequestManager = new Web3RequestManager(providerOptions);
    });

    it('should call Web3ProviderHttp.send', async () => {
        await web3RequestManager.send(rpcOptions);
        expect(web3ProviderHttpSendSpy).toHaveBeenCalledTimes(1);
        expect(web3ProviderHttpSendSpy).toHaveBeenCalledWith(
            rpcOptions,
            undefined
        );
    });

    it('should default rpcOptions.id and rpcOptions.jsonrpc', async () => {
        const partialRpcOptions: PartialRpcOptions = { ...rpcOptions };
        delete partialRpcOptions.id;
        delete partialRpcOptions.jsonrpc;
        await web3RequestManager.send(partialRpcOptions);
        expect(web3ProviderHttpSendSpy).toHaveBeenCalledWith(
            rpcOptions,
            undefined
        );
    });
});
