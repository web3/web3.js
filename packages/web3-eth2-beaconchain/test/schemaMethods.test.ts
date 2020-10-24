import { ETH2BeaconChain } from '../src/index'

// Jest doesn't have a native method to test if value is boolean
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

let eth2BeaconChain: any // should be ETH2BeaconChain but types aren't implemented yet

beforeAll(() => {
    const provider = 'http://127.0.0.1:9596' // default port for Lodestar
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

it('getHashRoot - NOT IMPLEMENTED', async () => {
    const routeParameters = { stateId: 'head' }

    const response = eth2BeaconChain.getHashRoot(routeParameters)
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getForkData - NOT IMPLEMENTED', async () => {
    const routeParameters = { stateId: 'head' }

    const response = eth2BeaconChain.getForkData(routeParameters)
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getFinalityCheckpoint - NOT IMPLEMENTED', async () => {
    const routeParameters = { stateId: 'head' }

    const response = eth2BeaconChain.getFinalityCheckpoint(routeParameters)
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getValidators - NOT IMPLEMENTED', async () => {
    const routeParameters = { stateId: 'head' }

    const response = eth2BeaconChain.getValidators(routeParameters)
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getValidatorById - NOT IMPLEMENTED', async () => {
    const routeParameters = {
        stateId: 'head',
        validatorId: '0x93247f2209abcacf57b75a51dafae777f9dd38bc7053d1af526f220a7489a6d3a2753e5f3e8b1cfe39b56f43611df74a'
    }

    const response = eth2BeaconChain.getValidatorById(routeParameters)
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getValidatorBalances - NOT IMPLEMENTED', async () => {
    const routeParameters = {
        stateId: 'head',
    }

    const response = eth2BeaconChain.getValidatorBalances(routeParameters)
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getEpochCommittees - NOT IMPLEMENTED', async () => {
    const routeParameters = {
        stateId: 'head',
        epoch: ''
    }

    const queryParameters = {
        index: '1',
        slot: '1'
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

it('getBlockHeader', async () => {
    const routeParameters = {
        blockId: 'head',
    }
    const expectedResponse = {
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

    const response = await eth2BeaconChain.getBlockHeader(routeParameters)
    expect(response).toMatchObject(expectedResponse)
})

it('publishSignedBlock', async () => {
    const response = eth2BeaconChain.publishSignedBlock()
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getBlock', async () => {
    const routeParameters = {
        blockId: 'head',
    }
    const expectedResponse = {
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

    const response = await eth2BeaconChain.getBlockHeader(routeParameters)
    expect(response).toMatchObject(expectedResponse)
})

it('getBlockRoot', async () => {
    const routeParameters = {
        blockId: 'head',
    }
    const expectedResponse = {
        root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/)
    }

    const response = await eth2BeaconChain.getBlockRoot(routeParameters)
    expect(response).toMatchObject(expectedResponse)
})

it('getBlockAttestations', async () => {
    const routeParameters = {
        blockId: 'genesis',
    }
    // const expectedResponse = [
    //     {
    //         aggregation_bits: expect.stringMatching(/0x[a-f|A-F|\d]{2}/),
    //         signature: expect.stringMatching(/0x[a-f|A-F|\d]{192}/),
    //         data: {
    //             slot: expect.stringMatching(/\d/),
    //             index: expect.stringMatching(/\d/),
    //             beacon_block_root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/),
    //             source: {
    //                 epoch: expect.stringMatching(/\d/),
    //                 root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/)
    //             },
    //             target: {
    //                 epoch: expect.stringMatching(/\d/),
    //                 root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/)
    //             }
    //         }
    //     }
    // ]

    const response = eth2BeaconChain.getBlockAttestations(routeParameters)
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getAttestationsFromPool', async () => {
    // const expectedResponse = [
    //     {
    //         aggregation_bits: expect.stringMatching(/0x[a-f|A-F|\d]{2}/),
    //         signature: expect.stringMatching(/0x[a-f|A-F|\d]{192}/),
    //         data: {
    //             slot: expect.stringMatching(/\d/),
    //             index: expect.stringMatching(/\d/),
    //             beacon_block_root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/),
    //             source: {
    //                 epoch: expect.stringMatching(/\d/),
    //                 root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/)
    //             },
    //             target: {
    //                 epoch: expect.stringMatching(/\d/),
    //                 root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/)
    //             }
    //         }
    //     }
    // ]

    const response = eth2BeaconChain.getAttestationsFromPool()
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('submitAttestation', async () => {
    const response = eth2BeaconChain.submitAttestation()
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getAttesterSlashings', async () => {
    const response = eth2BeaconChain.getAttesterSlashings()
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('submitAttesterSlashings', async () => {
    const response = eth2BeaconChain.submitAttesterSlashings()
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getProposerSlashings', async () => {
    const response = eth2BeaconChain.getProposerSlashings()
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('submitProposerSlashings', async () => {
    const response = eth2BeaconChain.submitProposerSlashings()
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('getSignedVoluntaryExits', async () => {
    const response = eth2BeaconChain.getSignedVoluntaryExits()
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})

it('submitVoluntaryExit', async () => {
    const response = eth2BeaconChain.submitVoluntaryExit()
    await expect(response).rejects.toThrow('Method not implemented by beacon chain client')
})
