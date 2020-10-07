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

(async () => {
    try {
        // const provider = 'http://54.157.182.30:3500'
        const provider = 'http://127.0.0.1:9596'
        const eth2BeaconChain = new ETH2BeaconChain(provider)

        console.log(await eth2BeaconChain.getBlockHeader({ blockId: 'head' }))

        // const attestationsParams = {
        //     // epoch: '9946',
        //     genesisEpoch: false,
        //     // pageSize: 3,
        //     // pageToken: 
        // }
        // const result = await eth2BeaconChain.attestations(attestationsParams)
        // console.log(result)

    } catch (error) {
        console.log(error)
    }
})()
