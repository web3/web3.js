import Web3ProviderHttp from 'web3-providers-http'

import Web3RequestManager from '../../src/index'

describe('Web3RequestManager.send', () => {
    it('should call Web3ProviderHttp.send', async () => {
        // Replace method so network call isn't made
        Web3ProviderHttp.prototype.send = jest.fn()
        const web3ProviderHttpSendSpy = jest.spyOn(Web3ProviderHttp.prototype, 'send')
        const providerOptions = {
            providerUrl: 'http://127.0.0.1:8545'
        }
        const httpRpcOptions = {
            id: 42,
            jsonrpc: '2.0',
            method: 'testing',
            params: {foo: 'bar'}
        }
        const web3RequestManager = new Web3RequestManager(providerOptions)
        await web3RequestManager.send(httpRpcOptions)
        expect(web3ProviderHttpSendSpy).toHaveBeenCalledTimes(1)
        expect(web3ProviderHttpSendSpy).toHaveBeenCalledWith(httpRpcOptions)
    })
})
