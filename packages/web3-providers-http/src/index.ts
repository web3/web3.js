import axios, { AxiosInstance } from 'axios';
import Web3ProviderBase from 'web3-providers-base';
import {
    ProviderOptions,
    IWeb3Provider,
    RpcResponse,
    RequestArguments,
    PollingInfo,
} from 'web3-providers-base/lib/types';
import { EventEmitter } from 'events';

export default class Web3ProvidersHttp
    extends Web3ProviderBase
    implements IWeb3Provider
{
    private _httpClient: AxiosInstance;
    private _polls: {
        [pollingId: number]: ReturnType<typeof setTimeout>;
    } = {};

    constructor(options: ProviderOptions) {
        super(options);
        this._httpClient = Web3ProvidersHttp._createHttpClient(
            options.providerUrl
        );
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

    setProvider(providerUrl: string) {
        try {
            this._httpClient = Web3ProvidersHttp._createHttpClient(providerUrl);
            super.providerUrl = providerUrl;
        } catch (error) {
            throw Error(`Failed to set provider: ${error.message}`);
        }
    }

    supportsSubscriptions() {
        return false;
    }

    async request(args: RequestArguments): Promise<RpcResponse | PollingInfo> {
        return args.providerOptions?.poll
            ? this._poll(args)
            : await this._request(args);
    }

    cancelPoll(pollingInfo: PollingInfo) {
        try {
            if (!this._polls[pollingInfo.pollingId])
                throw Error(
                    `Poll with id: ${pollingInfo.pollingId} does not exist`
                );
            clearTimeout(this._polls[pollingInfo.pollingId]);
            pollingInfo.eventEmitter.emit('cancelled');
            delete this._polls[pollingInfo.pollingId];
        } catch (error) {
            throw Error(`Error cancelling poll: ${error.message}`);
        }
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

    private _poll(args: RequestArguments): PollingInfo {
        try {
            if (this._httpClient === undefined)
                throw Error('No HTTP client initiliazed'); // Is checked in _request, but short circuiting here
            const pollingInfo = {
                eventEmitter: new EventEmitter(),
                pollingId: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER), // generate random integer
            };
            this._pollInterval(args, pollingInfo);
            return pollingInfo;
        } catch (error) {
            throw Error(error.message);
        }
    }

    private async _pollInterval(
        args: RequestArguments,
        pollingInfo: PollingInfo
    ) {
        try {
            const response = await this._request(args);
            pollingInfo.eventEmitter.emit('response', response);
            this._polls[pollingInfo.pollingId] = setTimeout(
                () => this._pollInterval(args, pollingInfo),
                args.providerOptions?.pollingInterval || 1000
            );
        } catch (error) {
            throw Error(error.message);
        }
    }
}
