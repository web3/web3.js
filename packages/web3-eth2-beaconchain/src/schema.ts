// import { Genesis } from '@chainsafe/lodestar-types'

import { IBaseAPISchema } from '../../web3-eth2-core/src/schema'

export const DefaultSchema: IBaseAPISchema = {
    packageName: 'eth2-beaconchain',
    routePrefix: '/eth/v1alpha1/beacon/',
    methods: [
        // {
        //     name: 'genesis',
        //     route: 'genesis',
        //     restMethod: 'get',
        //     paramsType: null,
        //     returnType: null,
        //     inputFormatter: null,
        //     outputFormatter: null,
        //     errors: null,
        //     errorPrefix: 'Failed to get genesis:'
        // }
        {
            name: 'attestations',
            route: 'attestations',
            restMethod: 'get',
            // paramsType: IBeaconChainAttestationsParams,
            paramsType: null,
            // returnType: IBeaconChainAttestationsResponse,
            returnType: null,
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get attestations:'
        },
        // {
        //     name: '',
        //     route: '',
        //     params: [],
        //     returnType: '',
        //     inputFormatter: '',
        //     outputFormatter: '',
        //     errors: ''
        // }
    ]
}
