import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { EventEmitter } from 'events';
import {
    IWeb3Provider,
    RpcResponse,
    Eth2RpcResponse,
    Eth1RequestArguments,
    Eth2RequestArguments,
    Web3Client,
} from 'web3-core-types/lib/types';
import Web3CoreLogger from 'web3-core-logger';

import {
    Web3ProvidersHttpErrorsConfig,
    Web3ProvidersHttpErrorNames,
} from './errors';

export default class Web3ProvidersHttp
    extends EventEmitter
    implements IWeb3Provider
{
    private _httpClient: AxiosInstance;
    private _logger: Web3CoreLogger;
    private _web3Client: string;

    constructor(web3Client: string) {
        super();
        this._logger = new Web3CoreLogger(Web3ProvidersHttpErrorsConfig);
        this._httpClient = this._createHttpClient(web3Client);
        this._web3Client = web3Client;
    }

    /**
     * Determines whether {web3Client} is a valid HTTP client URL
     *
     * @param web3Client To be validated
     * @returns true if valid
     */
    private _validateClientUrl(web3Client: Web3Client) {
        try {
            if (
                typeof web3Client === 'string' &&
                /^http(s)?:\/\//i.test(web3Client)
            )
                return;

            throw this._logger.makeError(
                Web3ProvidersHttpErrorNames.invalidClientUrl,
                {
                    params: { web3Client },
                }
            );
        } catch (error) {
            throw error;
        }
    }

    /**
     * Creates axios instance from {web3Client} URL
     *
     * @param web3Client Client URL to send requests to
     * @returns AxiosInstance
     */
    private _createHttpClient(web3Client: Web3Client): AxiosInstance {
        try {
            this._validateClientUrl(web3Client);
            return axios.create({ baseURL: web3Client as string });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Validates and initializes provider using {web3Client}
     *
     * @param web3Client New client to set for provider instance
     */
    setWeb3Client(web3Client: Web3Client) {
        try {
            this._httpClient = this._createHttpClient(web3Client);
            this._web3Client = web3Client as string;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Shows that this package does not support subscriptions
     *
     * @returns false
     */
    supportsSubscriptions() {
        return false;
    }

    /**
     * Makes an Axios GET or POST request using provided {args} for the eth2 API
     *
     * @param args RPC options, request params, AxiosConfig
     * @returns
     */
    private async _eth2Request(
        args: Eth2RequestArguments
    ): Promise<AxiosResponse> {
        try {
            const response = await this._httpClient[
                (args.providerOptions?.httpMethod as 'get' | 'post') || 'get'
            ](
                args.endpoint, // URL path
                args.params || {},
                args.providerOptions?.axiosConfig || {}
            );

            return response.data.data ? response.data.data : response.data;
        } catch (error) {
            // Check if Axios error
            if (error.code === 'ECONNREFUSED')
                throw this._logger.makeError(
                    Web3ProvidersHttpErrorNames.connectionRefused,
                    {
                        params: { clientUrl: this._web3Client },
                    }
                );

            throw error;
        }
    }

    /**
     * Makes an Axios POST request using provided {args} for JSON RPC requests
     *
     * @param args RPC options, request params, AxiosConfig
     * @returns
     */
    private async _eth1Request(
        args: Eth1RequestArguments
    ): Promise<AxiosResponse> {
        try {
            if (this._httpClient === undefined)
                throw this._logger.makeError(
                    Web3ProvidersHttpErrorNames.noHttpClient
                );
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
            // Check if Axios error
            if (error.code === 'ECONNREFUSED')
                throw this._logger.makeError(
                    Web3ProvidersHttpErrorNames.connectionRefused,
                    {
                        params: { clientUrl: this._web3Client },
                    }
                );

            throw error;
        }
    }

    /**
     * Makes an Axios POST request using provided {args}
     *
     * @param args RPC options, request params, AxiosConfig
     * @returns
     */
    async request(
        args: Eth1RequestArguments | Eth2RequestArguments
    ): Promise<RpcResponse | Eth2RpcResponse> {
        try {
            if (this._httpClient === undefined)
                throw Error('No HTTP client initiliazed');

            const eth1 = args as Eth1RequestArguments;
            const eth2 = args as Eth2RequestArguments;
            const response = eth2.endpoint
                ? await this._eth2Request(eth2)
                : await this._eth1Request(eth1);

            return response;
        } catch (error) {
            throw error;
        }
    }
}
