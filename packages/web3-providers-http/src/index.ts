import axios, { AxiosInstance } from 'axios';
import {
    IWeb3Provider,
    RpcResponse,
    RequestArguments,
} from 'web3-core-types/lib/types';
import { EventEmitter } from 'events';

export default class Web3ProvidersHttp implements IWeb3Provider
{
    private _httpClient: AxiosInstance;

    web3Client: string;

    constructor(web3Client: string) {
        this._httpClient = Web3ProvidersHttp._createHttpClient(web3Client);
        this.web3Client = web3Client;
    }

    private static _validateProviderUrl(providerUrl: string): boolean {
        try {
            return (
                typeof providerUrl !== 'string' ||
                /^http(s)?:\/\//i.test(providerUrl)
            );
        } catch (error) {
            throw Error(`Failed to validate provider string: ${error.message}`);
        }
    }

    private static _createHttpClient(baseUrl: string): AxiosInstance {
        try {
            if (!Web3ProvidersHttp._validateProviderUrl(baseUrl))
                throw Error('Invalid HTTP(S) URL provided');
            return axios.create({ baseURL: baseUrl });
        } catch (error) {
            throw Error(`Failed to create HTTP client: ${error.message}`);
        }
    }

    setWeb3Client(web3Client: string) {
        try {
            this._httpClient = Web3ProvidersHttp._createHttpClient(web3Client);
            this.web3Client = web3Client;
        } catch (error) {
            throw Error(`Failed to set web3 client: ${error.message}`);
        }
    }

    supportsSubscriptions() {
        return false;
    }

    async request(args: RequestArguments): Promise<RpcResponse> {
        return await this._request(args);
    }

    private async _request(args: RequestArguments): Promise<RpcResponse> {
        try {
            if (this._httpClient === undefined)
                throw Error('No HTTP client initiliazed');
            const arrayParams =
                args.params === undefined || Array.isArray(args.params)
                    ? args.params || []
                    : Object.values(args.params);
            const response = await this._httpClient.post(
                '', // URL path
                {
                    ...args.rpcOptions,
                    method: args.method,
                    params: arrayParams,
                },
                args.providerOptions?.axiosConfig || {}
            );
            return response.data.data ? response.data.data : response.data;
        } catch (error) {
            // TODO Fancy error detection that complies with EIP1193 defined errors
            // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#provider-errors
            throw Error(error.message);
        }
    }
}
