import { IBaseAPISchema } from '../../web3-eth2-core/src/schema'

export const DefaultSchema: IBaseAPISchema = {
    packageName: 'eth2-config',
    routePrefix: '/eth/v1/config/',
    methods: [
        {
            name: 'getForkSchedule',
            route: 'fork_schedule',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get fork schedule:',
            notImplemented: true
        },
        {
            name: 'getSpec',
            route: 'spec',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get spec:',
            notImplemented: true
        },
        {
            name: 'getDepositContract',
            route: 'deposit_contract',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get deposit contract:',
            notImplemented: true
        },
    ]
}
