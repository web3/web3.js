import { ETH2Node } from '../src/index'

const provider = 'http://127.0.0.1:9596'
const providerSuffix = '/eth/v1/node/'

it('constructs a ETH2Node instance with expected properties', () => {
    const eth2Node = new ETH2Node(provider)

    // @ts-ignore - types not full implemented yet
    expect(eth2Node.name).toBe('eth2-node')
    // @ts-ignore - types not full implemented yet
    expect(eth2Node.provider).toBe(`${provider}${providerSuffix}`)
    // @ts-ignore - types not full implemented yet
    expect(eth2Node.protectProvider)
})
