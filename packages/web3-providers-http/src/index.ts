import Axios, { AxiosInstance } from 'axios'

import { HttpRpcOptions, HttpRpcResponse, IWeb3Provider, ProviderOptions } from '../types'

class Web3ProviderBase {
  providerString = ''
  protectProvider = false
  connected = false
  supportsSubscriptions = false

  constructor(options: ProviderOptions) {
    this.providerString = options.providerString
    this.protectProvider = options.protectProvider
    this.supportsSubscriptions = options.supportsSubscriptions
  }

  setProvider(providerString: string) {
    try {
      if (this.protectProvider) throw Error('Provider is protected')
      this.providerString = providerString
    } catch (error) {
      throw Error(`Error setting provider: ${error.message}`)
    }
  }
}

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
