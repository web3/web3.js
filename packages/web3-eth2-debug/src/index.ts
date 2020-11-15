// @ts-ignore - types not full implemented yet
import { ETH2Core } from 'web3-eth2-core'
import { DefaultSchema } from './schema'

import { IETH2Debug } from '../types/index'
// @ts-ignore - types not full implemented yet
import { IBaseAPISchema } from 'web3-eth2-core'
// @ts-ignore - types not full implemented yet
import { ETH2BaseOpts } from 'web3-eth2-core'

// @ts-ignore - ETH2BeaconChain incorrectly implements interface IETH2BeaconChain
export class ETH2Debug extends ETH2Core implements IETH2Debug {
    constructor(
        provider: string,
        schema: IBaseAPISchema = DefaultSchema,
        opts: ETH2BaseOpts = { protectProvider: true }) {
        super(provider, schema, opts)
    }
}
