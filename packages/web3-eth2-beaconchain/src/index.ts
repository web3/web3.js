import { ETH2Core } from '../../web3-eth2-core/src/index'
import { IETH2BeaconChain } from '../types/index'
import { DefaultSchema } from './schema'
import { IBaseAPISchema } from '../../web3-eth2-core/src/schema'

// @ts-ignore
export class ETH2BeaconChain extends ETH2Core implements IETH2BeaconChain {
    constructor(provider: string, schema: IBaseAPISchema = DefaultSchema) {
        super(provider, { protectProvider: true }, schema)
    }
}
