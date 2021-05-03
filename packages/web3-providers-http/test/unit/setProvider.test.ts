import {ProviderOptions} from 'web3-providers-base/types'

import Web3ProvidersHttp from '../../src/index'

describe('Web3ProvidersHttp.setProvider', () => {
    const updatedProviderUrl = 'http://foo.bar'

    let providerOptions: ProviderOptions

    beforeEach(() => {
        providerOptions = {
            providerUrl: 'http://127.0.0.1:8545'
        }
    })

    it('should update the provider with updatedProviderUrl', () => {
        const web3ProvidersHttp = new Web3ProvidersHttp(providerOptions)
        expect(web3ProvidersHttp).toMatchObject(providerOptions) // Sanity
        web3ProvidersHttp.setProvider(updatedProviderUrl)
    })

    it('should error because provider string is invalid', () => {
        const web3ProvidersHttp = new Web3ProvidersHttp(providerOptions)
        expect(web3ProvidersHttp).toMatchObject(providerOptions) // Sanity
        expect(() => {
            web3ProvidersHttp.setProvider('foobar')
        }).toThrowError('Failed to set provider: Failed to create HTTP client: Invalid HTTP(S) URL provided')
    })
})
