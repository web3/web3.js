import { IBaseAPISchema } from '../../web3-eth2-core/src/schema'

export const DefaultSchema: IBaseAPISchema = {
    packageName: 'eth2-node',
    routePrefix: '/eth/v1/node/',
    methods: [
        {
            name: 'getNetworkIdentity',
            route: 'identity',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get network identity:',
            notImplemented: true
        },
        {
            name: 'getPeers',
            route: 'peers',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get peers:'
        },
        {
            name: 'getPeer',
            route: 'peers/${peerId}',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get peer:'
        },
        {
            name: 'getPeerCount',
            route: 'peer_count',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get peer count:',
            notImplemented: true
        },
        {
            name: 'getVersion',
            route: 'version',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get version:'
        },
        {
            name: 'getSyncingStatus',
            route: 'syncing',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get syncing status:'
        },
        {
            name: 'getNodeHealth',
            route: 'health',
            restMethod: 'get',
            inputFormatter: null,
            outputFormatter: null,
            errors: null,
            errorPrefix: 'Failed to get node health:'
        },
    ]
}
