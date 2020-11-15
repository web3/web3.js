import { ETH2Debug } from '../src/index'

let eth2Debug: any // should be ETH2Config but types aren't implemented yet

beforeAll(() => {
    const provider = 'http://127.0.0.1:9596' // default port for Lodestar
    eth2Debug = new ETH2Debug(provider)
})

it('getBeaconState', async () => {
    const response = eth2Debug.getBeaconState({ stateId: 'latest' })
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getBeaconHeads', async () => {
    const response = eth2Debug.getBeaconHeads()
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})
