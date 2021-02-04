import { BaseAPISchema } from 'web3-eth2-core'

export const DefaultSchema: BaseAPISchema = {
    packageName: 'eth2-beaconchain',
    routePrefix: '/eth/v1/beacon/',
    methods: [
        {
            name: 'getGenesis',
            route: 'genesis',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get genesis block:'
        },
        {
            name: 'getHashRoot',
            route: 'states/${stateId}/root',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get state hash tree root:'
        },
        {
            name: 'getForkData',
            route: 'states/${stateId}/fork',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get fork object for state:'
        },
        {
            name: 'getFinalityCheckpoint',
            route: 'states/${stateId}/finality_checkpoints',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get state finality checkpoints:'
        },
        {
            name: 'getValidators',
            route: 'states/${stateId}/validators',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get state validators:'
        },
        {
            name: 'getValidatorById',
            route: 'states/${stateId}/validators/${validatorId}',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to validator from state by id:'
        },
        {
            name: 'getValidatorBalances',
            route: 'states/${stateId}/validator_balances',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to validator balances from state:'
        },
        {
            name: 'getEpochCommittees',
            route: 'states/${stateId}/committees/${epoch}',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to committees for epoch:'
        },
        {
            name: 'getBlockHeaders',
            route: 'headers',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to block headers:'
        },
        {
            name: 'getBlockHeader',
            route: 'headers/${blockId}',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get block header:'
        },
        {
            name: 'publishSignedBlock',
            route: 'blocks',
            restMethod: 'post',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to publish signed block:'
        },
        {
            name: 'getBlock',
            route: 'blocks/${blockId}',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get block:'
        },
        {
            name: 'getBlockRoot',
            route: 'blocks/${blockId}/root',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get block root:'
        },
        {
            name: 'getBlockAttestations',
            route: 'blocks/${blockId}/attestations',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to block attestations:'
        },
        {
            name: 'getAttestationsFromPool',
            route: 'pool/attestations',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to attestations from operations pool:'
        },
        {
            name: 'submitAttestation',
            route: 'pool/attestations',
            restMethod: 'post',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to submit attestations to operations pool:'
        },
        {
            name: 'getAttesterSlashings',
            route: 'pool/attester_slashings',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get attester slashings from operations pool:'
        },
        {
            name: 'submitAttesterSlashings',
            route: 'pool/attester_slashings',
            restMethod: 'post',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to submit attester slashings to operations pool:'
        },
        {
            name: 'getProposerSlashings',
            route: 'pool/proposer_slashings',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get proposer slashings from operations pool:'
        },
        {
            name: 'submitProposerSlashings',
            route: 'pool/proposer_slashings',
            restMethod: 'post',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to submit proposer slashings to operations pool:'
        },
        {
            name: 'getSignedVoluntaryExits',
            route: 'pool/voluntary_exits',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get signed voluntary exits from operations pool'
        },
        {
            name: 'submitVoluntaryExit',
            route: 'pool/voluntary_exits',
            restMethod: 'post',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to submit voluntary exit to operations pool:'
        },
    ]
}
