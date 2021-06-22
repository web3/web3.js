import axios, { AxiosInstance } from 'axios';
import Web3ProviderBase from 'web3-providers-base';
import {
    ProviderOptions,
    IWeb3Provider,
    RpcResponse,
    RpcOptions,
    SubscriptionResponse,
    HttpOptions,
} from 'web3-providers-base/types';
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

    async send(
        rpcOptions: RpcOptions,
        httpOptions?: HttpOptions
    ): Promise<RpcResponse> {
        try {
            if (this._httpClient === undefined)
                throw Error('No HTTP client initiliazed');
            const response = await this._httpClient.post(
                '',
                rpcOptions,
                httpOptions?.axiosConfig || {}
            );
            return response.data.data ? response.data.data : response.data;
        } catch (error) {
            throw Error(`Error sending: ${error.message}`);
        }
    }

    subscribe(
        rpcOptions: RpcOptions,
        httpOptions?: HttpOptions
    ): SubscriptionResponse {
        try {
            if (this._httpClient === undefined)
                throw Error('No HTTP client initiliazed');
            const eventEmitter = new EventEmitter();
            const subscriptionId = Math.floor(
                Math.random() * Number.MAX_SAFE_INTEGER
            ); // generate random integer
            this._subscribe(
                rpcOptions,
                eventEmitter,
                subscriptionId,
                httpOptions
            );
            return { eventEmitter, subscriptionId };
        } catch (error) {
            throw Error(`Error subscribing: ${error.message}`);
        }
    }

    private async _subscribe(
        rpcOptions: RpcOptions,
        eventEmitter: EventEmitter,
        subscriptionId: number,
        httpOptions?: HttpOptions
    ) {
        try {
            const response = await this.send(rpcOptions, httpOptions);
            eventEmitter.emit('response', response);
            this._subscriptions[subscriptionId] = setTimeout(
                () =>
                    this._subscribe(
                        rpcOptions,
                        eventEmitter,
                        subscriptionId,
                        httpOptions
                    ),
                httpOptions?.subscriptionOptions?.milisecondsBetweenRequests ||
                    1000
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
