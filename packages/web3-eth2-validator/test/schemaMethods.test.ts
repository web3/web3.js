import { ETH2Validator } from '../src/index'

let eth2Validator: any // should be ETH2Config but types aren't implemented yet

beforeAll(() => {
    const provider = 'http://127.0.0.1:9596' // default port for Lodestar
    eth2Validator = new ETH2Validator(provider)
})

it('getAttesterDuties', async () => {
    const epoch = 1
    const expectedResponse = [
        {}
    ]

    const response = await eth2Validator.getAttesterDuties({ epoch })
    expect(response).toEqual(expect.arrayContaining(expectedResponse))
})

it('getProposerDuties', async () => {
    const epoch = 1
    const expectedResponse = [
        {}
    ]

    const response = await eth2Validator.getAttesterDuties({ epoch })
    expect(response).toEqual(expect.arrayContaining(expectedResponse))
})

// it('getPeerCount', async () => {
//     const response = eth2Validator.getPeerCount()
//     await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
// })
