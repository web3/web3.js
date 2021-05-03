import {ProviderOptions} from 'web3-providers-base/types'

import Web3RequestManager from '../../src/index'

describe('constructs a Web3RequestManager instance with expected properties', () => {
    let providerOptions: ProviderOptions

    beforeEach(() => {
        providerOptions = {
            providerString: 'http://127.0.0.1:8545',
            protectProvider: false,
            supportsSubscriptions: false
        }
    })

    it('providerOptions - falsey', () => {
        const web3RequestManager = new Web3RequestManager(providerOptions)
        expect(web3RequestManager.provider).toMatchObject(providerOptions)
    })

    it('providerOptions - truthy', () => {
        providerOptions.protectProvider = true
        providerOptions.supportsSubscriptions = true

        const web3RequestManager = new Web3RequestManager(providerOptions)
        expect(web3RequestManager.provider).toMatchObject(providerOptions)
    })

    it('should have set providerProtocol to HTTP', () => {
        const web3RequestManager = new Web3RequestManager(providerOptions)
        // providerProtocol is an enum declared in src/index.ts
        expect(web3RequestManager.providerProtocol).toBe(1) // 1 === HTTP
    })
})
