import { ETH2Core } from '../../web3-eth2-core/src/index'
import { IBeaconChainAttestationsParams, IBeaconChainAttestationsResponse } from '../types/index'

export class ETH2BeaconChain extends ETH2Core {
    constructor(provider: string) {
        super('eth2-beaconchain', provider)
    }

    async attestations(params: IBeaconChainAttestationsParams): Promise<IBeaconChainAttestationsResponse | Error> {
        try {
            const response = await this._httpClient.get('beacon/attestations', { params })
            return response.data
        } catch (error) {
            return new Error(`Failed to get attestations: ${error.message}`)
        }
    }

    async chainHead() {
        try {
            const response = await this._httpClient.get('beacon/chainhead')
            return response.data
        } catch (error) {
            throw new Error(`Failed to get chain head: ${error.message}`)
        }
    }

    async config() {
        try {
            const response = await this._httpClient.get('beacon/config')
            return response.data
        } catch (error) {
            throw new Error(`Failed to get config: ${error.message}`)
        }
    }
}

(async () => {
    try {
        const provider = 'http://54.157.182.30:3500/eth/v1alpha1/'
        const eth2BeaconChain = new ETH2BeaconChain(provider)

        // console.log(await eth2BeaconChain.chainHead())
        // console.log(await eth2BeaconChain.config())

        const attestationsParams = {
            // epoch: '9946',
            // genesisEpoch: false,
            // pageSize: 1,
            // pageToken: 
        }
        const result = await eth2BeaconChain.attestations(attestationsParams)
        if (result instanceof Error) {
            console.log(`I received an error: ${result.message}`)
            return
        }
        console.log(`RESULT: ${JSON.stringify(result)}`)

    } catch (error) {
        console.log(error)
    }
})()
