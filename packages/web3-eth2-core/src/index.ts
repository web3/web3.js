import Axios, {AxiosInstance} from 'axios'

Axios.defaults.adapter = require('axios/lib/adapters/http');

import { ETH2BaseOpts, ETH2Function, BaseAPISchema } from '../types'

export class ETH2Core {
    private _httpClient: AxiosInstance | undefined

    [ key: string ]: ETH2Function | any;
    
    name: string
    provider: string | undefined
    protectProvider: boolean // Protects from global overwrite when using .use functionality

    constructor(provider: string, schema: BaseAPISchema, opts: ETH2BaseOpts = {}) {
        this.name = schema.packageName
        this.setProvider(`${provider}${schema.routePrefix}`)
        this.protectProvider = opts.protectProvider || false
        this.buildAPIWrappersFromSchema(schema)
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

            this._httpClient = ETH2Core.createHttpClient(provider)
            this.provider = provider
        } catch (error) {
            throw new Error(`Failed to set provider: ${error.message}`)
        }
    }

    private routeBuilder(rawUrl: string, parameters: { [ key: string]: string }): string {
        try {
            let computedRoute = rawUrl

            // Find all: ${valuesWeWant} in rawUrl, returns array with only valuesWeWant
            const foundIdentifiers = rawUrl.match(/(?<=\$\{).*?(?=\})/gm) // Matches ${valueWeWant}, but doesn't include ${}
            if (foundIdentifiers !== null) {
                for (const foundIdentifier of foundIdentifiers) {
                    if (parameters[foundIdentifier] === undefined) throw new Error(`The parameter ${foundIdentifier} was not provided`)
                    computedRoute = computedRoute.replace(`\${${foundIdentifier}}`, parameters[foundIdentifier])
                }
            }
            
            return computedRoute
        } catch (error) {
            throw new Error(`Failed to build route: ${error.message}`)
        }
    }

    private buildAPIWrappersFromSchema(schema: BaseAPISchema) {
        for (const method of schema.methods) {
            this[method.name] = async (routeParameters: any, queryParameters: any = {}): Promise<any> => {
                try {
                    if (method.inputFormatter) queryParameters = method.inputFormatter(queryParameters)

                    const computedRoute = this.routeBuilder(method.route, routeParameters)
                    // @ts-ignore
                    let {data} = await this._httpClient[method.restMethod](computedRoute, { params: queryParameters })
                    if (data.data) data = data.data

                    if (method.outputFormatter) data = method.outputFormatter(data)
                    return data
                } catch (error) {
                    throw new Error(`${method.errorPrefix} ${error.message}`)
                }
            }
        }
    }
}
