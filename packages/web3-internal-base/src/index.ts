import Axios, {AxiosInstance} from 'axios'
Axios.defaults.adapter = require('axios/lib/adapters/http');

import {
    BaseOpts, BaseFunction, RpcParams, RpcResponse
} from '../types'

export class Base {
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
            throw new Error(`Failed to create HTTP client: ${error.message}`)
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
            throw new Error(`Failed to set provider: ${error.message}`)
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
}