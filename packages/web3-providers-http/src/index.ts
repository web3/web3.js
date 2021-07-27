import axios, { AxiosInstance } from 'axios';
import Web3ProviderBase from 'web3-providers-base';
import {
    ProviderOptions,
    IWeb3Provider,
    RpcResponse,
    RpcOptions,
    SubscriptionResponse,
    HttpOptions,
    CallOptions,
} from 'web3-providers-base/lib/types';
import { EventEmitter } from 'events';

export default class Web3ProvidersHttp
    extends Web3ProviderBase
    implements IWeb3Provider
{
    private _httpClient: AxiosInstance;
    private _subscriptions: {
        [subscriptionId: number]: ReturnType<typeof setTimeout>;
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
        return true;
    }

    // async send(
    //     rpcOptions?: RpcOptions,
    //     httpOptions?: HttpOptions
    // ): Promise<RpcResponse> {
    async send(callOptions: CallOptions): Promise<RpcResponse> {
        try {
            if (this._httpClient === undefined)
                throw Error('No HTTP client initiliazed');
            // @ts-ignore tsc doesn't understand httpOptions.method || 'post'
            const response = await this._httpClient[
                callOptions.providerCallOptions?.method || 'post'
            ]('', callOptions.rpcOptions || {}, {
                ...callOptions.providerCallOptions?.axiosConfig,
                url: callOptions.providerCallOptions?.url,
                params: callOptions.providerCallOptions?.params || undefined,
                data: callOptions.providerCallOptions?.data || undefined,
            });
            return response.data.data ? response.data.data : response.data;
        } catch (error) {
            throw Error(`Error sending: ${error.message}`);
        }
    }

    subscribe(callOptions: CallOptions): SubscriptionResponse {
        try {
            if (this._httpClient === undefined)
                throw Error('No HTTP client initiliazed');
            const eventEmitter = new EventEmitter();
            const subscriptionId = Math.floor(
                Math.random() * Number.MAX_SAFE_INTEGER
            ); // generate random integer
            this._subscribe(callOptions, eventEmitter, subscriptionId);
            // this._subscribe(
            //     rpcOptions || {},
            //     eventEmitter,
            //     subscriptionId,
            //     httpOptions
            // );
            return { eventEmitter, subscriptionId };
        } catch (error) {
            throw Error(`Error subscribing: ${error.message}`);
        }
    }

    private async _subscribe(
        callOptions: CallOptions,
        eventEmitter: EventEmitter,
        subscriptionId: number
    ) {
        try {
            const response = await this.send(callOptions);
            eventEmitter.emit('response', response);
            this._subscriptions[subscriptionId] = setTimeout(
                () =>
                    this._subscribe(callOptions, eventEmitter, subscriptionId),
                callOptions.providerCallOptions?.subscriptionConfig
                    ?.milisecondsBetweenRequests || 1000
            );
        } catch (error) {
            throw Error(`Error subscribing: ${error.message}`);
        }
    }

    unsubscribe(eventEmitter: EventEmitter, subscriptionId: number) {
        try {
            if (!this._subscriptions[subscriptionId])
                throw Error(
                    `Subscription with id: ${subscriptionId} does not exist`
                );
            clearTimeout(this._subscriptions[subscriptionId]);
            eventEmitter.emit('unsubscribed');
            delete this._subscriptions[subscriptionId];
        } catch (error) {
            throw Error(`Error unsubscribing: ${error.message}`);
        }
    }
}
