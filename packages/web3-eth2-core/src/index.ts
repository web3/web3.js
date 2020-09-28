import Axios, {AxiosInstance} from 'axios'

import { ETH2BaseOpts, ETH2Function } from '../types/index'
import { IBaseAPISchema } from './schema'

export class ETH2Core {
    private _httpClient: AxiosInstance

    [ key: string ]: ETH2Function | any;
    
    name: string
    provider: string
    protectProvider: boolean

    constructor(provider: string, opts: ETH2BaseOpts = {}, schema: IBaseAPISchema) {
        this.name = schema.packageName
        this.setProvider(`${provider}${schema.routePrefix}`)
        this.protectProvider = opts.protectProvider || false
        this.buildAPIWrappersFromSchema(schema)
    }

    setProvider(provider: string) {
        try {
            if (!provider || typeof provider !== 'string' || !/^http(s)?:\/\//i.test(provider)) {
                throw new Error(`Invalid HTTP(S) provider: ${provider}`)
            }

            const result = ETH2Core.createHttpClient(provider)
            this._httpClient = result

            this.provider = provider
        } catch (error) {
            throw new Error(`Failed to set provider: ${error.message}`)
        }
    }

    private buildAPIWrappersFromSchema(schema: IBaseAPISchema) {
        for (const method of schema.methods) {
            this[method.name] = async (params: any): Promise<any> => {
                try {
                    if (method.inputFormatter) params = method.inputFormatter(params)
                    let {data} = await this._httpClient[method.restMethod](method.route, { params })
                    if (method.outputFormatter) data = method.outputFormatter(data)
                    return data
                } catch (error) {
                    throw new Error(`${method.errorPrefix} ${error.message}`)
                }
            }
        }
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
}
