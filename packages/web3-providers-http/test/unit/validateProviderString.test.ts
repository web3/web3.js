import {ProviderOptions} from 'web3-providers-base/types'

import Web3ProvidersHttp from '../../src/index'

describe('Web3ProvidersHttp.validateProviderString', () => {
    it('should return true', () => {
        const providerString = 'http://localhost:8545'
        expect(Web3ProvidersHttp.validateProviderString(providerString)).toBe(true)
    })

    it('should return true', () => {
        const providerString = 'http://localhost'
        expect(Web3ProvidersHttp.validateProviderString(providerString)).toBe(true)
    })
    
    it('should return true', () => {
        const providerString = 'http://localhost.com'
        expect(Web3ProvidersHttp.validateProviderString(providerString)).toBe(true)
    })

    it('should return true', () => {
        const providerString = 'https://localhost'
        expect(Web3ProvidersHttp.validateProviderString(providerString)).toBe(true)
    })

    it('should return false', () => {
        const providerString = 'localhost.com'
        expect(Web3ProvidersHttp.validateProviderString(providerString)).toBe(false)
    })

    it('should return false', () => {
        const providerString = 'email@foo.com'
        expect(Web3ProvidersHttp.validateProviderString(providerString)).toBe(false)
    })

    it('should return false', () => {
        const providerString = 'htp://localhost'
        expect(Web3ProvidersHttp.validateProviderString(providerString)).toBe(false)
    })
})
