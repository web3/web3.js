import axios, { AxiosInstance } from 'axios';
import Web3ProviderBase from 'web3-providers-base';
import {
    ProviderOptions,
    IWeb3Provider,
    BaseRpcOptions,
    RpcResponse,
    CallOptions,
    RpcOptions,
} from 'web3-providers-base/types';
import { EventEmitter } from 'events';
import { HttpOptions, SubscriptionOptions } from '../types';

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
        this._httpClient = Web3ProvidersHttp.createHttpClient(
            options.providerUrl
        );
    }

    static validateProviderUrl(providerUrl: string): boolean {
        try {
            return (
                typeof providerUrl !== 'string' ||
                /^http(s)?:\/\//i.test(providerUrl)
            );
        } catch (error) {
            throw Error(`Failed to validate provider string: ${error.message}`);
        }
    }

    static createHttpClient(baseUrl: string): AxiosInstance {
        try {
            if (!Web3ProvidersHttp.validateProviderUrl(baseUrl))
                throw Error('Invalid HTTP(S) URL provided');
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

    supportsSubscriptions() {
        return true;
    }

    // async send(options: BaseRpcOptions): Promise<RpcResponse> {
    //     try {
    //         if (this._httpClient === undefined)
    //             throw Error('No HTTP client initiliazed');
    //         const response = await this._httpClient.post('', {
    //             id:
    //                 options.id ||
    //                 Math.floor(Math.random() * Number.MAX_SAFE_INTEGER), // generate random integer
    //             jsonrpc: options.jsonrpc || '2.0',
    //             method: options.method,
    //             params: options.params,
    //         });

    //         return response.data.data ? response.data.data : response.data;
    //     } catch (error) {
    //         throw Error(`Error sending: ${error.message}`);
    //     }
    // }

    async send(
        rpcOptions: RpcOptions,
        httpOptions: HttpOptions
    ): Promise<RpcResponse> {
        try {
            if (this._httpClient === undefined)
                throw Error('No HTTP client initiliazed');
            const response = await this._httpClient.post(
                '',
                rpcOptions,
                httpOptions
            );
            return response.data.data ? response.data.data : response.data;
        } catch (error) {
            throw Error(`Error sending: ${error.message}`);
        }
    }

    subscribe(options: SubscriptionOptions): {
        eventEmitter: EventEmitter;
        subscriptionId: number;
    } {
        try {
            if (this._httpClient === undefined)
                throw Error('No HTTP client initiliazed');
            const eventEmitter = new EventEmitter();
            const subscriptionId = Math.floor(
                Math.random() * Number.MAX_SAFE_INTEGER
            ); // generate random integer
            this._subscribe(options, eventEmitter, subscriptionId);
            return { eventEmitter, subscriptionId };
        } catch (error) {
            throw Error(`Error subscribing: ${error.message}`);
        }
    }

    private async _subscribe(
        options: SubscriptionOptions,
        eventEmitter: EventEmitter,
        subscriptionId: number
    ) {
        try {
            const response = await this.send(options);
            eventEmitter.emit('response', response);
            this._subscriptions[subscriptionId] = setTimeout(
                () => this._subscribe(options, eventEmitter, subscriptionId),
                options.milisecondsBetweenRequests || 1000
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
