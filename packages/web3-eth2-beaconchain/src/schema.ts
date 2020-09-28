// import { Genesis } from '@chainsafe/lodestar-types'

import { IBaseAPISchema } from '../../web3-eth2-core/src/schema'

export const DefaultSchema: IBaseAPISchema = {
    packageName: 'eth2-beaconchain',
    routePrefix: '/eth/v1alpha1/beacon/',
    methods: [
        {
            name: 'attestations',
            route: 'attestations',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get attestations:'
        },
        {
            name: 'chainHead',
            route: 'chainhead',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get chain head:'
        }
    ]
}
