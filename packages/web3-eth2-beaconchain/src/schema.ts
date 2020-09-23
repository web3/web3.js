import { BaseAPISchema } from '../../web3-eth2-core/src/schema'
import {
    IBeaconChainAttestationsParams, IBeaconChainAttestationsResponse } from '../types/index'

export interface BeaconChainAPISchema extends BaseAPISchema {
    packageName: 'eth2-beaconchain',
    routePrefix: '/eth/v1alpha1/beacon/',
    methods: [
        {
            name: 'attestations',
            route: 'attestations',
            restMethod: 'get'
            paramsType: IBeaconChainAttestationsParams,
            returnType: IBeaconChainAttestationsResponse,
            inputFormatter: null,
            outputFormatter: null,
            errors: null
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