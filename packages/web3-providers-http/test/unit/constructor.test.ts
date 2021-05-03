import {ProviderOptions} from 'web3-providers-base/types'

import Web3ProvidersHttp from '../../src/index'

describe('constructs a Web3ProvidersHttp instance with expected properties', () => {
    let providerOptions: ProviderOptions

    beforeEach(() => {
        providerOptions = {
            providerString: 'http://127.0.0.1:8545',
            protectProvider: false,
            supportsSubscriptions: false
        }
    })

    it('providerOptions - falsey', () => {
        const web3ProvidersHttp = new Web3ProvidersHttp(providerOptions)
        expect(web3ProvidersHttp).toMatchObject(providerOptions)
    })

    it('providerOptions - truthy', () => {
        providerOptions.protectProvider = true
        providerOptions.supportsSubscriptions = true

        const web3ProvidersHttp = new Web3ProvidersHttp(providerOptions)
        expect(web3ProvidersHttp).toMatchObject(providerOptions)
    })
})
