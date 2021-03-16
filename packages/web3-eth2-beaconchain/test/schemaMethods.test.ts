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
    // const provider = 'http://127.0.0.1:9596' // default port for Lodestar
    const provider = 'http://127.0.0.1:5052' // default port for Lighthouse
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

it('getHashRoot', async () => {
    const routeParameters = { stateId: 'head' }
    const expectedResponse = {
        root: expect.stringMatching(/0x[a-f|A-F|\d]{64}/),
    }

    const response = await eth2BeaconChain.getHashRoot(routeParameters)
    expect(response).toMatchObject(expectedResponse)
})

it('getForkData', async () => {
    const routeParameters = { stateId: 'head' }
    const expectedResponse = {
        current_version: expect.stringMatching(/0x[a-f|A-F|\d]{8}/),
        epoch: expect.stringMatching(/\d/),
        previous_version: expect.stringMatching(/0x[a-f|A-F|\d]{8}/),
    }

    const response = await eth2BeaconChain.getForkData(routeParameters)
    expect(response).toMatchObject(expectedResponse)
})

it('getFinalityCheckpoint', async () => {
    const routeParameters = { stateId: 'head' }
    const expectedResponse = {
        current_justified: {
            epoch: expect.stringMatching(/\d+/),
            root: expect.stringMatching(/0x[a-f|A-F|\d]{64}/),
        },
        finalized: {
            epoch: expect.stringMatching(/\d+/),
            root: expect.stringMatching(/0x[a-f|A-F|\d]{64}/),
        },
        previous_justified: {
            epoch: expect.stringMatching(/\d+/),
            root: expect.stringMatching(/0x[a-f|A-F|\d]{64}/),
        },
    }

    const response = await eth2BeaconChain.getFinalityCheckpoint(routeParameters)
    expect(response).toMatchObject(expectedResponse)
})

it('getValidators', async () => {
    const routeParameters = { stateId: 'genesis' }
    const expectedResponse = {
        balance: expect.stringMatching(/\d+/),
        index: expect.stringMatching(/\d+/),
        status: expect.stringMatching(/pending_initialized|pending_queued|active_ongoing|active_exiting|active_slashed|exited_unslashed|exited_slashed|withdrawal_possible|withdrawal_done|active|pending|exited|withdrawal/),
        validator: {
            activation_eligibility_epoch: expect.stringMatching(/\d+/),
            activation_epoch: expect.stringMatching(/\d+/),
            effective_balance: expect.stringMatching(/\d+/),
            exit_epoch: expect.stringMatching(/\d+/),
            pubkey: expect.stringMatching(/0x[a-f|A-F|\d]{96}/),
            slashed: false,
            withdrawable_epoch: expect.stringMatching(/\d+/),
            withdrawal_credentials: expect.stringMatching(/0x[a-f|A-F|\d]{64}/),
        }
    }

    const response = await eth2BeaconChain.getValidators(routeParameters)
    expect(response[0]).toMatchObject(expectedResponse)
})

it('getValidatorById', async () => {
    const routeParameters = {
        stateId: 'head',
        validatorId: '0x96fb9db98b540d8500711c45fcb3608cc3fd75212457976f5b11f9f93c26701e68f846a9751e3dc2d92fa3d972a8c6b0'
    }
    const expectedResponse = {
        balance: expect.stringMatching(/\d+/),
        index: expect.stringMatching(/\d+/),
        status: expect.stringMatching(/pending_initialized|pending_queued|active_ongoing|active_exiting|active_slashed|exited_unslashed|exited_slashed|withdrawal_possible|withdrawal_done|active|pending|exited|withdrawal/),
        validator: {
            activation_eligibility_epoch: expect.stringMatching(/\d+/),
            activation_epoch: expect.stringMatching(/\d+/),
            effective_balance: expect.stringMatching(/\d+/),
            exit_epoch: expect.stringMatching(/\d+/),
            pubkey: expect.stringMatching(/0x[a-f|A-F|\d]{96}/),
            slashed: false,
            withdrawable_epoch: expect.stringMatching(/\d+/),
            withdrawal_credentials: expect.stringMatching(/0x[a-f|A-F|\d]{64}/),
        }
    }

    const response = await eth2BeaconChain.getValidatorById(routeParameters)
    expect(response).toMatchObject(expectedResponse)
})

it('getValidatorBalances', async () => {
    const routeParameters = {
        stateId: 'head',
    }
    const expectedResponse = {
        balance: expect.stringMatching(/\d+/),
        index: expect.stringMatching(/\d+/)
    }

    const response = await eth2BeaconChain.getValidatorBalances(routeParameters)
    expect(response[0]).toMatchObject(expectedResponse)
})

xit('getEpochCommittees', async () => {
    const routeParameters = {
        stateId: 'head',
        epoch: ''
    }
    const queryParameters = {
        index: '1',
        slot: '1'
    }
    const expectedResponse = {
        index: expect.stringMatching(/\d+/),
        slot: expect.stringMatching(/\d+/),
        validators: expect.anything() // Only tests if not null or undefined
    }

    const response = await eth2BeaconChain.getEpochCommittees(routeParameters, queryParameters)
    expect(response[0]).toMatchObject(expectedResponse)
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

/**
 * @TODO Doesn't actually test publishing signed block, but not sure how to go about
 * setting this up in a test environment to test actual publishing of blocks
 */
it('publishSignedBlock', async () => {
    const response = eth2BeaconChain.publishSignedBlock()
    await expect(response).rejects.toThrow('Failed to publish signed block: Request failed with status code 400')
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
        blockId: 'head',
    }
    const expectedResponse = {
        aggregation_bits: expect.stringMatching(/0x[a-f|A-F|\d]{2}/),
        signature: expect.stringMatching(/0x[a-f|A-F|\d]{192}/),
        data: {
            slot: expect.stringMatching(/\d/),
            index: expect.stringMatching(/\d/),
            beacon_block_root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/),
            source: {
                epoch: expect.stringMatching(/\d/),
                root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/)
            },
            target: {
                epoch: expect.stringMatching(/\d/),
                root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/)
            }
        }
    }

    const response = await eth2BeaconChain.getBlockAttestations(routeParameters)
    expect(response[0]).toMatchObject(expectedResponse)
})

/**
 * @TODO queryParameters don't seem to be taken into consideration
 */
it('getAttestationsFromPool', async () => {
    const queryParameters = {
        slot: 1,
        committee_index: 1
    }
    // const expectedResponse = {
    //     aggregation_bits: expect.stringMatching(/0x[a-f|A-F|\d]{2}/),
    //     signature: expect.stringMatching(/0x[a-f|A-F|\d]{192}/),
    //     data: {
    //         slot: expect.stringMatching(/\d/),
    //         index: expect.stringMatching(/\d/),
    //         beacon_block_root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/),
    //         source: {
    //             epoch: expect.stringMatching(/\d/),
    //             root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/)
    //         },
    //         target: {
    //             epoch: expect.stringMatching(/\d/),
    //             root: expect.stringMatching(/0x[a-f|A-F|\d]{62}/)
    //         }
    //     }
    // }
    const expectedResponse: any[] = []

    const response = await eth2BeaconChain.getAttestationsFromPool(null, queryParameters)
    expect(response).toMatchObject(expectedResponse)
})

/**
 * @TODO Doesn't actually test submitting attestation, but not sure how to go about
 * setting this up in a test environment to test actual submission
 */
it('submitAttestation', async () => {
    const response = eth2BeaconChain.submitAttestation()
    await expect(response).rejects.toThrow('Failed to submit attestations to operations pool: Request failed with status code 400')
})

it('getAttesterSlashings', async () => {
    const expectedResponse: any[] = []
    const response = await eth2BeaconChain.getAttesterSlashings()
    expect(response).toMatchObject(expectedResponse)
})

/**
 * @TODO Doesn't actually test submitting attester slashings, but not sure how to go about
 * setting this up in a test environment to test actual submission
 */
it('submitAttesterSlashings', async () => {
    const response = eth2BeaconChain.submitAttesterSlashings()
    await expect(response).rejects.toThrow('Failed to submit attester slashings to operations pool: Request failed with status code 400')
})

it('getProposerSlashings', async () => {
    const expectedResponse: any[] = []
    const response = await eth2BeaconChain.getProposerSlashings()
    expect(response).toMatchObject(expectedResponse)
})

/**
 * @TODO Doesn't actually test submitting proposer slashings, but not sure how to go about
 * setting this up in a test environment to test actual submission
 */
it('submitProposerSlashings', async () => {
    const response = eth2BeaconChain.submitProposerSlashings()
    await expect(response).rejects.toThrow('Failed to submit proposer slashings to operations pool: Request failed with status code 400')
})

it('getSignedVoluntaryExits', async () => {
    const expectedResponse: any[] = []
    const response = await eth2BeaconChain.getSignedVoluntaryExits()
    expect(response).toMatchObject(expectedResponse)
})

/**
 * @TODO Doesn't actually test submitting exit, but not sure how to go about
 * setting this up in a test environment to test actual submission
 */
it('submitVoluntaryExit', async () => {
    const response = eth2BeaconChain.submitVoluntaryExit()
    await expect(response).rejects.toThrow('Failed to submit voluntary exit to operations pool: Request failed with status code 400')
})
