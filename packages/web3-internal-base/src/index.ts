import Axios, {AxiosInstance} from 'axios'
Axios.defaults.adapter = require('axios/lib/adapters/http');

import {
    BaseOpts, BaseFunction, RpcParams, RpcResponse, RpcResponseBigInt
} from '../types'

export default class Base {
    private _httpClient: AxiosInstance | undefined

    [ key: string ]: BaseFunction | any;
    
    name: string
    provider: string | undefined
    protectProvider: boolean // Protects from global overwrite when using .use functionality

    constructor(packageName: string, provider: string, opts: BaseOpts = {}) {
        this.name = packageName
        this.setProvider(provider)
        this.protectProvider = opts.protectProvider || false
    }

    static createHttpClient(baseUrl: string): AxiosInstance {
        try {
            return Axios.create({baseURL: baseUrl})
        } catch (error) {
            throw Error(`Failed to create HTTP client: ${error.message}`)
        }
    }
    
    toBigInt(toConvert: string | number): BigInt {
        try {
            const bigIntBlockNumber = BigInt(toConvert)
            if (bigIntBlockNumber === undefined) throw Error(`Unable to convert values: ${toConvert} into a BigInt`)
            return bigIntBlockNumber
        } catch (error) {
            throw Error(error.message)
        }
    }

    setProvider(provider: string) {
        try {
            if (!provider || typeof provider !== 'string' || !/^http(s)?:\/\//i.test(provider)) {
                throw new Error(`Invalid HTTP(S) provider: ${provider}`)
            }

            this._httpClient = Base.createHttpClient(provider)
            this.provider = provider
        } catch (error) {
            throw Error(`Failed to set provider: ${error.message}`)
        }
    }

    async sendRpc(rpcParams: RpcParams): Promise<RpcResponse> {
        try {
            if (!this._httpClient) throw Error('No HTTP client initiliazed')
            const response = await this._httpClient.post('', {
                id: rpcParams.id || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER), // generate random integer
                jsonrpc: rpcParams.jsonrpc || '2.0',
                method: rpcParams.method,
                params: rpcParams.params
            })
            return response.data.data ? response.data.data : response.data
        } catch (error) {
            throw Error(`Error sending RPC: ${error.message}`)
        }
    }

    async sendRpcFormatBigInt(rpcParams: RpcParams): Promise<RpcResponseBigInt> {
        try {
            const response = await this.sendRpc(rpcParams)
            if (typeof response.result !== 'string'
                && typeof response.result !== 'number') throw Error(`Unable to convert ${response.result} into a BigInt`)
            return {...response, result: this.toBigInt(response.result)}
        } catch (error) {
            throw Error(error.message)
        }
    }
}