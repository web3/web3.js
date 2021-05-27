import axios, { AxiosInstance } from 'axios';
import Web3ProviderBase from 'web3-providers-base';
import { ProviderOptions, IWeb3Provider } from 'web3-providers-base/types';

import { HttpRpcOptions, HttpRpcResponse } from '../types';

export default class Web3ProvidersHttp extends Web3ProviderBase implements IWeb3Provider {
  private _httpClient: AxiosInstance

  constructor(options: ProviderOptions) {
    super(options);
    this._httpClient = Web3ProvidersHttp.createHttpClient(options.providerUrl);
  }

  static validateProviderUrl(providerUrl: string): boolean {
    try {
      return (typeof providerUrl !== 'string'
          || /^http(s)?:\/\//i.test(providerUrl));
    } catch (error) {
      throw Error(`Failed to validate provider string: ${error.message}`);
    }
  }

  static createHttpClient(baseUrl: string): AxiosInstance {
    try {
      if (!Web3ProvidersHttp.validateProviderUrl(baseUrl)) throw Error('Invalid HTTP(S) URL provided');
      return axios.create({ baseURL: baseUrl });
    } catch (error) {
      throw Error(`Failed to create HTTP client: ${error.message}`);
    }
  }

  setProvider(providerUrl: string) {
    try {
      this._httpClient = Web3ProvidersHttp.createHttpClient(providerUrl);
      super.providerUrl = providerUrl;
    } catch (error) {
      throw Error(`Failed to set provider: ${error.message}`);
    }
  }

  async send(options: HttpRpcOptions): Promise<HttpRpcResponse> {
    try {
      if (this._httpClient === undefined) throw Error('No HTTP client initiliazed');
      const response = await this._httpClient.post('', {
        id: options.id
          || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER), // generate random integer
        jsonrpc: options.jsonrpc || '2.0',
        method: options.method,
        params: options.params,
      });

      return response.data.data ? response.data.data : response.data;
    } catch (error) {
      throw Error(`Error sending: ${error.message}`);
    }
  }
}
