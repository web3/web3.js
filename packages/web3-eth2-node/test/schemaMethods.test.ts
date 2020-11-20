import { ETH2Node } from '../src/index'

let eth2Node: any // should be ETH2Config but types aren't implemented yet

beforeAll(() => {
    const provider = 'http://127.0.0.1:9596' // default port for Lodestar
    eth2Node = new ETH2Node(provider)
})

it('getNetworkIdentity', async () => {
    const routeParameters = { stateId: 'head' }

    const response = eth2Node.getNetworkIdentity(routeParameters)
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getPeers', async () => {
    const expectedResponse = [
        {
            // Matches pattern: /ip4/139.59.95.219/tcp/9001/p2p/16Uiu2HAmJPrwqsN7dDPhwXxgZs3QoTtWro8aYDNAt3eWTdtEYAcQ
            address: expect.stringMatching(/\/ip4\/(?:\d{1,3}\.?){4}\/tcp\/\d{1,5}\/p2p\/\S{53}/),
            direction: 'outbound',
            enr: '',
            peer_id: expect.stringMatching(/\S{53}/),
            state: 'connected'
        }
    ]

    const response = await eth2Node.getPeers()
    expect(response).toEqual(expect.arrayContaining(expectedResponse))
})

it('getPeer', async () => {
    const peerId = '16Uiu2HAmUDdSyKZYKzY6dcrF2AnAoM1WyVvJZ8xzcdeqghouybpi'
    const expectedResponse = {
        // Matches pattern: /ip4/139.59.95.219/tcp/9001/p2p/16Uiu2HAmJPrwqsN7dDPhwXxgZs3QoTtWro8aYDNAt3eWTdtEYAcQ
        address: expect.stringMatching(/\/ip4\/(?:\d{1,3}\.?){4}\/tcp\/\d{1,5}\/p2p\/\S{53}/),
        direction: 'outbound',
        enr: '',
        peer_id: expect.stringMatching(/\S{53}/),
        state: 'connected'
    }

    const response = await eth2Node.getPeer({ peerId })
    expect(response).toEqual(expectedResponse)
})

it('getPeerCount', async () => {
    const response = eth2Node.getPeerCount()
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getVersion', async () => {
    const expectedResponse = {
        version: expect.stringMatching(/\w+\/.+/)
    }

    const response = await eth2Node.getVersion()
    expect(response).toEqual(expectedResponse)
})

it('getSyncingStatus', async () => {
    const expectedResponse = {
        head_slot: expect.stringMatching(/\d+/),
        sync_distance: expect.stringMatching(/\d+/)
    }

    const response = await eth2Node.getSyncingStatus()
    expect(response).toEqual(expectedResponse)
})

it('getNodeHealth', async () => {
    const response = await eth2Node.getNodeHealth()
    expect(response).toEqual('')
})
