import { ETH2BeaconChain } from '../src/index'

// Jest doesn't have a native method to test if value is voolean
expect.extend({
    toBeBoolean(received) {
        return typeof received === 'boolean' ? {
            message: () => `expected ${received} to be boolean`,
            pass: true
        } : {
            message: () => `expected ${received} to be boolean`,
            pass: false
        }
    }
})

let eth2BeaconChain

beforeAll(() => {
    const provider = 'http://127.0.0.1:9596'
    eth2BeaconChain = new ETH2BeaconChain(provider)
})

it('getGenesis', async () => {
    const expectedResponse = {
        genesis_validators_root: expect.stringMatching(/0x[a-f|A-F|\d]{64}/),
        genesis_time: expect.stringMatching(/\d{10}/),
        genesis_fork_version: expect.stringMatching(/0x[a-f|A-F|\d]{8}/)
    }

    const response = await eth2BeaconChain.getGenesis()
    expect(response).toMatchObject(expectedResponse)
})

it('getHashRoot - NOT IMPLEMENTED IN LODESTAR', async () => {
    const routeParameters = { state_id: 'head' }

    const response = eth2BeaconChain.getHashRoot(routeParameters)
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getForkData - NOT IMPLEMENTED IN LODESTAR', async () => {
    const routeParameters = { state_id: 'head' }

    const response = eth2BeaconChain.getForkData(routeParameters)
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getFinalityCheckpoint - NOT IMPLEMENTED IN LODESTAR', async () => {
    const routeParameters = { state_id: 'head' }

    const response = eth2BeaconChain.getFinalityCheckpoint(routeParameters)
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getValidators - NOT IMPLEMENTED IN LODESTAR', async () => {
    const routeParameters = { state_id: 'head' }

    const response = eth2BeaconChain.getValidators(routeParameters)
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getValidatorById - NOT IMPLEMENTED IN LODESTAR', async () => {
    const routeParameters = {
        state_id: 'head',
        validatorId: '0x93247f2209abcacf57b75a51dafae777f9dd38bc7053d1af526f220a7489a6d3a2753e5f3e8b1cfe39b56f43611df74a'
    }

    const response = eth2BeaconChain.getValidatorById(routeParameters)
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getValidatorBalances - NOT IMPLEMENTED IN LODESTAR', async () => {
    const routeParameters = {
        state_id: 'head',
    }

    const response = eth2BeaconChain.getValidatorBalances(routeParameters)
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getEpochCommittees - NOT IMPLEMENTED IN LODESTAR', async () => {
    const routeParameters = {
        state_id: 'head',
        epoch: ''
    }

    const queryParameters = {
        index: "1",
        slot: "1"
    }

    const response = eth2BeaconChain.getEpochCommittees(routeParameters, queryParameters)
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getBlockHeaders', async () => {
    const expectedResponse = [
        {
            root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/),
            // @ts-ignore - method is added at top of file
            canonical: expect.toBeBoolean(),
            header: {
                message: {
                    slot: expect.stringMatching(/\d/),
                    proposer_index: expect.stringMatching(/\d/),
                    parent_root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/),
                    state_root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/),
                    body_root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/),
                },
                signature: expect.stringMatching(/0x[a-f|A-F|\d]{192}/),
            }
        }
    ]

    const response = await eth2BeaconChain.getBlockHeaders()
    expect(response).toMatchObject(expectedResponse)
})

it('getBlockHeaders', async () => {
    const expectedResponse = [
        {
            root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/),
            // @ts-ignore - method is added at top of file
            canonical: expect.toBeBoolean(),
            header: {
                message: {
                    slot: expect.stringMatching(/\d/),
                    proposer_index: expect.stringMatching(/\d/),
                    parent_root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/),
                    state_root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/),
                    body_root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/),
                },
                signature: expect.stringMatching(/0x[a-f|A-F|\d]{192}/),
            }
        }
    ]

    const response = await eth2BeaconChain.getBlockHeaders()
    expect(response).toMatchObject(expectedResponse)
})
