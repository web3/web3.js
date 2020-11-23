// @ts-ignore - types not full implemented yet
import { ETH2Core } from 'web3-eth2-core'
import { DefaultSchema } from './schema'

import { IETH2Validator } from '../types/index'
// @ts-ignore - types not full implemented yet
import { IBaseAPISchema } from 'web3-eth2-core'
// @ts-ignore - types not full implemented yet
import { ETH2BaseOpts } from 'web3-eth2-core'

// @ts-ignore - ETH2BeaconChain incorrectly implements interface IETH2Validator
export class ETH2Validator extends ETH2Core implements IETH2Validator {
    constructor(
        provider: string,
        schema: IBaseAPISchema = DefaultSchema,
        opts: ETH2BaseOpts = { protectProvider: true }) {
        super(provider, schema, opts)
    }
}
