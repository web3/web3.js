import { ETH2Validator } from '../src/index'

const provider = 'http://127.0.0.1:9596'
const providerSuffix = '/eth/v1/validator/'

it('constructs a ETH2Validator instance with expected properties', () => {
    const eth2Validator = new ETH2Validator(provider)

    // @ts-ignore - types not full implemented yet
    expect(eth2Validator.name).toBe('eth2-validator')
    // @ts-ignore - types not full implemented yet
    expect(eth2Validator.provider).toBe(`${provider}${providerSuffix}`)
    // @ts-ignore - types not full implemented yet
    expect(eth2Validator.protectProvider)
})
