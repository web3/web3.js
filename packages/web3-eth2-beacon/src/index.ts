// @ts-ignore - types not full implemented yet
import { ETH2Base } from 'web3-eth2-base'
import { DefaultSchema } from './schema'

import { IETH2Beacon } from '../types/index'
// @ts-ignore - types not full implemented yet
import { IBaseAPISchema } from 'web3-eth2-core'
// @ts-ignore - types not full implemented yet
import { ETH2BaseOpts } from 'web3-eth2-core'

// @ts-ignore - ETH2Beacon incorrectly implements interface IETH2Beacon
export class ETH2Beacon extends ETH2Base implements IETH2Beacon {
    constructor(
        provider: string,
        schema: IBaseAPISchema = DefaultSchema,
        opts: ETH2BaseOpts = { protectProvider: true }) {
        super(provider, schema, opts)
    }
}
