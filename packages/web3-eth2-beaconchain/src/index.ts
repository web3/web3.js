import { ETH2Core } from '../../web3-eth2-core/src/index'
import {
    IBeaconChainAttestationsParams, IBeaconChainAttestationsResponse,
    IBeaconChainAttestationsStreamResponse,
    IBeaconChainAttestationsIndexedResponse,
    IBeaconChainAttestationsIndexedStreamResponse,
    IBeaconChainAttestationsPoolParams,
    IBeaconChainBlocksParams,

    IBeaconChainChainHeadResponse,
    IBeaconChainConfigResponse } from '../types/index'

export class ETH2BeaconChain extends ETH2Core {
    constructor(provider: string) {
        super('eth2-beaconchain', provider, { protectProvider: true })
    }

    async attestations(params: IBeaconChainAttestationsParams): Promise<IBeaconChainAttestationsResponse> {
        try {
            const response = await this._httpClient.get('beacon/attestations', { params })
            return response.data
        } catch (error) {
            throw new Error(`Failed to get attestations: ${error.message}`)
        }
    }

    async attestationsStream(): Promise<IBeaconChainAttestationsStreamResponse> {
        try {
            const response = await this._httpClient.get('beacon/attestations/stream')
            return response.data
        } catch (error) {
            throw new Error(`Failed to get indexed attestations stream: ${error.message}`)
        }
    }

    async attestationsIndexed(params: IBeaconChainAttestationsParams): Promise<IBeaconChainAttestationsIndexedResponse> {
        try {
            const response = await this._httpClient.get('beacon/attestations/indexed', { params })
            return response.data
        } catch (error) {
            throw new Error(`Failed to get indexed attestations: ${error.message}`)
        }
    }

    async attestationsIndexedStream(): Promise<IBeaconChainAttestationsIndexedStreamResponse> {
        try {
            const response = await this._httpClient.get('beacon/attestations/indexed/stream')
            return response.data
        } catch (error) {
            throw new Error(`Failed to get indexed attestations stream: ${error.message}`)
        }
    }

    async attestationsPool(params: IBeaconChainAttestationsPoolParams): Promise<IBeaconChainAttestationsResponse> {
        try {
            const response = await this._httpClient.get('beacon/attestations/pool', { params })
            return response.data
        } catch (error) {
            throw new Error(`Failed to get indexed attestations: ${error.message}`)
        }
    }

    async blocks(params: IBeaconChainBlocksParams): Promise<IBeaconChainAttestationsResponse> {
        try {
            const response = await this._httpClient.get('beacon/attestations/pool', { params })
            return response.data
        } catch (error) {
            throw new Error(`Failed to get indexed attestations: ${error.message}`)
        }
    }

    async chainHead(): Promise<IBeaconChainChainHeadResponse> {
        try {
            const response = await this._httpClient.get('beacon/chainhead')
            return response.data
        } catch (error) {
            throw new Error(`Failed to get chain head: ${error.message}`)
        }
    }

    async config(): Promise<IBeaconChainConfigResponse> {
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
        // const provider = 'http://beacon.prylabs.network:30002/eth/v1alpha1/'
        const eth2BeaconChain = new ETH2BeaconChain(provider)

        // console.log(await eth2BeaconChain.chainHead())
        // console.log(await eth2BeaconChain.config())

        const attestationsParams = {
            // epoch: '9946',
            genesisEpoch: false,
            // pageSize: 1,
            // pageToken: 
        }
        const result = await eth2BeaconChain.attestationsIndexed(attestationsParams)
        console.log(result)

    } catch (error) {
        console.log(error)
    }
})()
