import { ETH2Core } from '../../web3-eth2-core/src/index'
import { DefaultSchema } from './schema'
import { IBaseAPISchema } from '../../web3-eth2-core/src/schema'

export class ETH2BeaconChain extends ETH2Core {
    constructor(provider: string, schema: IBaseAPISchema = DefaultSchema) {
        super(provider, { protectProvider: true }, schema)
    }
}

(async () => {
    try {
        const provider = 'http://54.157.182.30:3500'
        // // const provider = 'http://beacon.prylabs.network:30002'
        const eth2BeaconChain = new ETH2BeaconChain(provider)

        // // console.log(await eth2BeaconChain.chainHead())
        // // console.log(await eth2BeaconChain.config())

        // const attestationsParams = {
        //     // epoch: '9946',
        //     genesisEpoch: false,
        //     // pageSize: 1,
        //     // pageToken: 
        // }
        // const result = await eth2BeaconChain.attestations(attestationsParams)
        // console.log(result)

    } catch (error) {
        console.log(error)
    }
})()
