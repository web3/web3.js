import { IBaseAPISchema } from '../../web3-eth2-core/src/schema'

export const DefaultSchema: IBaseAPISchema = {
    packageName: 'eth2-validator',
    routePrefix: '/eth/v1/validator/',
    methods: [
        {
            name: 'getAttesterDuties',
            route: 'duties/attester/${epoch}',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get attester duties:'
        },
        {
            name: 'getProposerDuties',
            route: 'duties/proposer/${epoch}',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get block proposer duties:'
        },
        {
            name: 'produceBlock',
            route: 'blocks/${slot}',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to produce new block without signature:'
        },
        {
            name: 'produceAttestationData',
            route: 'attestation_data',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to produce attestation data:'
        },
        {
            name: 'getAggregateAttestation',
            route: 'aggregate_attestation',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get aggregate attestation:'
        },
        {
            name: 'publishAggregateAndProofs',
            route: 'aggregate_and_proofs',
            restMethod: 'post',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to publish aggregate and proofs:'
        },
        {
            name: 'prepareNodeForCommitteeSubnet',
            route: 'beacon_committee_subscriptions',
            restMethod: 'post',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to prepare beacon node for committee subnet:'
        },
    ]
}
