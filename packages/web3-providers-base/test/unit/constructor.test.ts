import Web3ProviderBase from '../../src/index'
import {ProviderOptions} from '../../types'

describe('constructs a Web3Eth instance with expected properties', () => {
    let providerOptions: ProviderOptions

    beforeEach(() => {
        providerOptions = {
            providerString: 'http://127.0.0.1:8545',
            protectProvider: false,
            supportsSubscriptions: false
        }
    })

    it('providerOptions - falsey', () => {
        const web3ProviderBase = new Web3ProviderBase(providerOptions)
        expect(web3ProviderBase).toMatchObject({
            _providerString: providerOptions.providerString,
            _protectProvider: providerOptions.protectProvider,
            _supportsSubscriptions: providerOptions.supportsSubscriptions
        })
    })

    it('providerOptions - truthy', () => {
        providerOptions.protectProvider = true
        providerOptions.supportsSubscriptions = true

        const web3ProviderBase = new Web3ProviderBase(providerOptions)
        expect(web3ProviderBase).toMatchObject({
            _providerString: providerOptions.providerString,
            _protectProvider: providerOptions.protectProvider,
            _supportsSubscriptions: providerOptions.supportsSubscriptions
        })
    })
})
