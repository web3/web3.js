import Web3RequestManager from '../../src/index'

describe('Web3RequestManager.detectProviderProtocol', () => {
    it('should return HTTP', () => {
        // providerProtocol is an enum declared in src/index.ts
        expect(Web3RequestManager.detectProviderProtocol(
            'http://127.0.0.1:8545'
        )).toBe(1) // 1 === HTTP
    })

    it('should return WS', () => {
        // providerProtocol is an enum declared in src/index.ts
        expect(Web3RequestManager.detectProviderProtocol(
            'wss://127.0.0.1:8545'
        )).toBe(2) // 2 === WS
    })

    it('should return UNKNOWN', () => {
        // providerProtocol is an enum declared in src/index.ts
        expect(Web3RequestManager.detectProviderProtocol(
            '127.0.0.1:8545'
        )).toBe(0) // 0 === UNKNOWN
    })
})
