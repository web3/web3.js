import Axios, {AxiosInstance} from 'axios'

import { ETH2CoreOpts } from '../types/index'

export class ETH2Core {
    protected _httpClient: AxiosInstance
    
    name: string
    provider: string
    protectProvider: boolean

    constructor(packageName:string, provider: string, opts: ETH2CoreOpts = {}) {
        this.name = packageName
        this.setProvider(provider)
        this.protectProvider = opts.protectProvider || false
    }

    setProvider(provider: string) {
        try {
            if (!provider || typeof provider !== 'string' || !/^http(s)?:\/\//i.test(provider)) {
                throw new Error(`Invalid HTTP(S) provider: ${provider}`)
            }

            this._httpClient = ETH2Core.createHttpClient(provider)
            this.provider = provider
        } catch (error) {
            throw new Error(`Failed to set provider: ${error}`)
        }
    }

    static createHttpClient(baseUrl: string) {
        try {
            return Axios.create({
                baseURL: baseUrl
            })
        } catch (error) {
            throw new Error(`Failed to create HTTP client: ${error}`)
        }
    }
}
