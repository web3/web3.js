import Axios, {AxiosInstance} from 'axios'

Axios.defaults.adapter = require('axios/lib/adapters/http');

import {
    BaseOpts, BaseFunction, BaseAPISchema, RpcParams, RpcResponse
} from '../types'

export class Base {
    private _httpClient: AxiosInstance | undefined

    [ key: string ]: BaseFunction | any;
    
    name: string
    provider: string | undefined
    protectProvider: boolean // Protects from global overwrite when using .use functionality
    methodPrefix: string

    constructor(provider: string, schema: BaseAPISchema, opts: BaseOpts = {}) {
        this.name = schema.packageName
        this.setProvider(provider)
        this.protectProvider = opts.protectProvider || false
        this.methodPrefix = schema.methodPrefix
        // this.buildAPIWrappersFromSchema(schema)
    }

    static createHttpClient(baseUrl: string): AxiosInstance {
        try {
            return Axios.create({
                baseURL: baseUrl
            })
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

    // private buildAPIWrappersFromSchema(schema: BaseAPISchema) {
    //     for (const method of schema.methods) {
    //         this[method.name] = async (rpcParams: {[key: string]: string | number}): Promise<RpcResponse> => {
    //             try {
    //                 let rpcParams: RpcParams = []
    //                 if (method.inputFormatter) rpcParams = method.inputFormatter(rpcParams)

    //                 // @ts-ignore
    //                 let {data} = await this._httpClient[method.restMethod]('', {
    //                     jsonrpc: '2.0',
    //                     method: `${this.methodPrefix}${method.method}`,
    //                     id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER), // generate random integer
    //                     params: rpcParams
    //                 })
    //                 if (data.data) data = data.data

    //                 if (method.outputFormatter) data = method.outputFormatter(data)
    //                 return data
    //             } catch (error) {
    //                 throw Error(`${method.errorPrefix} ${error.message}`)
    //             }
    //         }
    //     }
    // }
}