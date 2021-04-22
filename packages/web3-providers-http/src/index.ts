import Axios, { AxiosInstance } from 'axios'
import Web3ProviderBase from 'web3-providers-base'
import { ProviderOptions } from 'web3-providers-base/types'

import { HttpRpcOptions, HttpRpcResponse, IWeb3Provider } from '../types'

export default class Web3ProvidersHttp extends Web3ProviderBase implements IWeb3Provider {
  private _httpClient: AxiosInstance | undefined

  constructor(options: ProviderOptions) {
    super(options)
    this._httpClient = Web3ProvidersHttp.createHttpClient(options.providerString)
  }

  static createHttpClient(baseUrl: string): AxiosInstance {
    try {
        return Axios.create({baseURL: baseUrl})
    } catch (error) {
        throw Error(`Failed to create HTTP client: ${error.message}`)
    }
  }

  setProvider(providerString: string) {
    try {
        if (typeof providerString !== 'string' ||
            !/^http(s)?:\/\//i.test(providerString)) {
            throw Error('Invalid HTTP(S) provider')
        }

        super.setProvider(providerString)
        this._httpClient = Web3ProvidersHttp.createHttpClient(providerString)
    } catch (error) {
        throw Error(`Failed to set provider: ${error.message}`)
    }
  }

  async send(options: HttpRpcOptions): Promise<HttpRpcResponse> {
    try {
      if (!this._httpClient) throw Error('No HTTP client initiliazed')
      const response = await this._httpClient.post('', {
          id: options.id || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER), // generate random integer
          jsonrpc: options.jsonrpc || '2.0',
          method: options.method,
          params: options.params
      })
      
      return response.data.data ? response.data.data : response.data
    } catch (error) {
        throw Error(`Error sending: ${error.message}`)
    }
  }
}
