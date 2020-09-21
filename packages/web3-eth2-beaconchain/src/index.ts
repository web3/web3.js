import { ETH2Core } from '../../web3-eth2-core/src/index'
import { IBeaconChainAttestationsParams, IBeaconChainAttestationsResponse } from '../types/index'

export class ETH2BeaconChain extends ETH2Core {
    constructor(provider: string) {
        super('eth2-beaconchain', provider)
    }

    async attestations(params: IBeaconChainAttestationsParams): Promise<IBeaconChainAttestationsResponse> {
        try {
            const response = await this._httpClient.get('beacon/attestations', { params })
            return response.data
        } catch (error) {
            throw new Error(`Failed to get attestations: ${error}`)
        }
    }

    async chainHead() {
        try {
            const response = await this._httpClient.get('beacon/chainhead')
            return response.data
        } catch (error) {
            throw new Error(`Failed to get chain head: ${error}`)
        }
    }

    async config() {
        try {
            const response = await this._httpClient.get('beacon/config')
            return response.data
        } catch (error) {
            throw new Error(`Failed to get config: ${error}`)
        }
    }
}

(async () => {
    try {
        console.log(`SANITY ${Date.now()}`)
    
        const provider = 'http://54.157.182.30:3500/eth/v1alpha1/'
        const eth2BeaconChain = new ETH2BeaconChain(provider)

        // console.log(await eth2BeaconChain.chainHead())
        // console.log(await eth2BeaconChain.config())

        const attestationsParams = {
            // epoch: '9946',
            genesisEpoch: false,
            // pageSize: 1,
            // pageToken: 
        }
        console.log(await eth2BeaconChain.attestations(attestationsParams))
    } catch (error) {
        console.log(`ERROR: ${error}`)
    }
})()
