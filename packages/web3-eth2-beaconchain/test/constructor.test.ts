import { ETH2BeaconChain } from '../src/index'

const provider = 'http://127.0.0.1:9596'
const providerSuffix = '/eth/v1/beacon/'

it('constructs a ETH2BeaconChain instance with expected properties', () => {
    const eth2BeaconChain = new ETH2BeaconChain(provider)

    // @ts-ignore - types not full implemented yet
    expect(eth2BeaconChain.name).toBe('eth2-beaconchain')
    // @ts-ignore - types not full implemented yet
    expect(eth2BeaconChain.provider).toBe(`${provider}${providerSuffix}`)
    // @ts-ignore - types not full implemented yet
    expect(eth2BeaconChain.protectProvider)
})
