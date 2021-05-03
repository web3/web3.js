import {ProviderOptions} from 'web3-providers-base/types'

import Web3RequestManager from '../../src/index'

describe('constructs a Web3RequestManager instance with expected properties', () => {
    let providerOptions: ProviderOptions

    beforeEach(() => {
        providerOptions = {
            providerString: 'http://127.0.0.1:8545'
        }
    })

    it('should instanciate with expected values', () => {
        const web3RequestManager = new Web3RequestManager(providerOptions)
        expect(web3RequestManager.provider).toMatchObject(providerOptions)
    })

    it('should have set providerProtocol to HTTP', () => {
        const web3RequestManager = new Web3RequestManager(providerOptions)
        // providerProtocol is an enum declared in src/index.ts
        expect(web3RequestManager.providerProtocol).toBe(1) // 1 === HTTP
    })

    it('should have set providerProtocol to WS', () => {
        providerOptions.providerString = 'wss://127.0.0.1:8545'

        const web3RequestManager = new Web3RequestManager(providerOptions)
        // providerProtocol is an enum declared in src/index.ts
        expect(web3RequestManager.providerProtocol).toBe(2) // 2 === WS
    })

    it('should have set providerProtocol to UNKNOWN', () => {
        providerOptions.providerString = '127.0.0.1:8545'

        const web3RequestManager = new Web3RequestManager(providerOptions)
        // providerProtocol is an enum declared in src/index.ts
        expect(web3RequestManager.providerProtocol).toBe(0) // 0 === UNKNOWN
    })
})
