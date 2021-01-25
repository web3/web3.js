import { ETH2Core, BaseAPISchema, ETH2BaseOpts } from 'web3-eth2-core'
import { DefaultSchema } from './schema'

import { ETH2BeaconChain as IETH2BeaconChain } from '../types'

// @ts-ignore - ETH2BeaconChain incorrectly implements interface IETH2BeaconChain
// because methods are added during runtime
export class ETH2BeaconChain extends ETH2Core implements IETH2BeaconChain {
    constructor(
        provider: string,
        schema: BaseAPISchema = DefaultSchema,
        opts: ETH2BaseOpts = { protectProvider: true }) {
        super(provider, schema, opts)
    }
}
