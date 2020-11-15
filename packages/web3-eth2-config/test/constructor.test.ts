import { ETH2Config } from '../src/index'

const provider = 'http://127.0.0.1:9596'
const providerSuffix = '/eth/v1/config/'

it('constructs a ETH2Config instance with expected properties', () => {
    const eth2Config = new ETH2Config(provider)

    // @ts-ignore - types not full implemented yet
    expect(eth2Config.name).toBe('eth2-config')
    // @ts-ignore - types not full implemented yet
    expect(eth2Config.provider).toBe(`${provider}${providerSuffix}`)
    // @ts-ignore - types not full implemented yet
    expect(eth2Config.protectProvider)
})
