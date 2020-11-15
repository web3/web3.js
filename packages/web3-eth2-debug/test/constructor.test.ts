import { ETH2Debug } from '../src/index'

const provider = 'http://127.0.0.1:9596'
const providerSuffix = '/eth/v1/debug/beacon/'

it('constructs a ETH2Config instance with expected properties', () => {
    const eth2Debug = new ETH2Debug(provider)

    // @ts-ignore - types not full implemented yet
    expect(eth2Debug.name).toBe('eth2-debug')
    // @ts-ignore - types not full implemented yet
    expect(eth2Debug.provider).toBe(`${provider}${providerSuffix}`)
    // @ts-ignore - types not full implemented yet
    expect(eth2Debug.protectProvider)
})
