import { IBaseAPISchema } from '../../web3-eth2-base/src/schema'

export const DefaultSchema: IBaseAPISchema = {
    packageName: 'eth2-beacon',
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
            notImplemented: true,
            name: 'getHashRoot',
            route: 'states/${stateId}/root',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get state hash tree root:'
        },
        {
            notImplemented: true,
            name: 'getForkData',
            route: 'states/${stateId}/fork',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get fork object for state:'
        },
        {
            notImplemented: true,
            name: 'getFinalityCheckpoint',
            route: 'states/${stateId}/finality_checkpoints',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get state finality checkpoints:'
        },
        {
            notImplemented: true,
            name: 'getValidators',
            route: 'states/${stateId}/validators',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get state validators:'
        },
        {
            notImplemented: true,
            name: 'getValidatorById',
            route: 'states/${stateId}/validators/${validatorId}',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to validator from state by id:'
        },
        {
            notImplemented: true,
            name: 'getValidatorBalances',
            route: 'states/${stateId}/validator_balances',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to validator balances from state:'
        },
        {
            notImplemented: true,
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
            notImplemented: true,
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
            notImplemented: true,
            name: 'getBlockAttestations',
            route: 'blocks/${blockId}/attestations',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to block attestations:'
        },
        {
            notImplemented: true,
            name: 'getAttestationsFromPool',
            route: 'pool/attestations',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to attestations from operations pool:'
        },
        {
            notImplemented: true,
            name: 'submitAttestation',
            route: 'pool/attestations',
            restMethod: 'post',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to submit attestations to operations pool:'
        },
        {
            notImplemented: true,
            name: 'getAttesterSlashings',
            route: 'pool/attester_slashings',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get attester slashings from operations pool:'
        },
        {
            notImplemented: true,
            name: 'submitAttesterSlashings',
            route: 'pool/attester_slashings',
            restMethod: 'post',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to submit attester slashings to operations pool:'
        },
        {
            notImplemented: true,
            name: 'getProposerSlashings',
            route: 'pool/proposer_slashings',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get proposer slashings from operations pool:'
        },
        {
            notImplemented: true,
            name: 'submitProposerSlashings',
            route: 'pool/proposer_slashings',
            restMethod: 'post',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to submit proposer slashings to operations pool:'
        },
        {
            notImplemented: true,
            name: 'getSignedVoluntaryExits',
            route: 'pool/voluntary_exits',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get signed voluntary exits from operations pool'
        },
        {
            notImplemented: true,
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
