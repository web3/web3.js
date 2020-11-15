import { IBaseAPISchema } from '../../web3-eth2-core/src/schema'

export const DefaultSchema: IBaseAPISchema = {
    packageName: 'eth2-debug',
    routePrefix: '/eth/v1/debug/beacon/',
    methods: [
        {
            name: 'getBeaconState',
            route: 'states/${stateId}',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get beacon state:',
            notImplemented: true
        },
        {
            name: 'getBeaconHeads',
            route: 'heads',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get beacon heads:',
            notImplemented: true
        },
    ]
}
