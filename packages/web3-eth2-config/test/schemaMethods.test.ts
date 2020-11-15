import { ETH2Config } from '../src/index'

let eth2Config: any // should be ETH2Config but types aren't implemented yet

beforeAll(() => {
    const provider = 'http://127.0.0.1:9596' // default port for Lodestar
    eth2Config = new ETH2Config(provider)
})

it('getForkSchedule', async () => {
    const response = eth2Config.getForkSchedule()
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getSpec', async () => {
    const response = eth2Config.getSpec()
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getDepositContract', async () => {
    const response = eth2Config.getDepositContract()
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})
