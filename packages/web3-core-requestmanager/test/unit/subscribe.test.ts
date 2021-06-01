import { RpcOptions } from 'web3-providers-base/types';
import Web3ProviderHttp from 'web3-providers-http';

import Web3RequestManager from '../../src/index';

describe('Web3RequestManager.subscribe', () => {
    it('should call Web3ProviderHttp.subscribe', async () => {
        // Replace method so network call isn't made
        Web3ProviderHttp.prototype.subscribe = jest.fn();
        const web3ProviderHttpSubscribeSpy = jest.spyOn(
            Web3ProviderHttp.prototype,
            'subscribe'
        );
        const providerOptions = {
            providerUrl: 'http://127.0.0.1:8545',
        };
        const rpcOptions: RpcOptions = {
            id: 42,
            jsonrpc: '2.0',
            method: 'testing',
            params: ['bar'],
        };
        const web3RequestManager = new Web3RequestManager(providerOptions);
        await web3RequestManager.subscribe(rpcOptions);
        expect(web3ProviderHttpSubscribeSpy).toHaveBeenCalledTimes(1);
        expect(web3ProviderHttpSubscribeSpy).toHaveBeenCalledWith(
            rpcOptions,
            undefined
        );
    });
});
