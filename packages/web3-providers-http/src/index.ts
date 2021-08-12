import axios, { AxiosInstance } from 'axios';
import { EventEmitter } from 'events';
import {
    IWeb3Provider,
    RpcResponse,
    RequestArguments,
    Web3ProviderEvents,
    ProviderEventListener,
    Web3Client,
} from 'web3-core-types/lib/types';

export default class Web3ProvidersHttp
    extends EventEmitter
    implements IWeb3Provider
{
    private _httpClient: AxiosInstance;
    private _clientChainId: string | undefined;
    private _connected = false;

    web3Client: string;

    constructor(web3Client: string) {
        super();
        this._httpClient = Web3ProvidersHttp._createHttpClient(web3Client);
        this.web3Client = web3Client;
        this._connectToClient();
    }

    /**
     * Determines whether {web3Client} is a valid HTTP client URL
     *
     * @param web3Client To be validated
     * @returns true if valid
     */
    private static _validateClientUrl(web3Client: Web3Client): boolean {
        try {
            return typeof web3Client === 'string'
                ? /^http(s)?:\/\//i.test(web3Client)
                : false;
        } catch (error) {
            throw Error(`Failed to validate client url: ${error.message}`);
        }
    }

    /**
     * Creates axios instance from {web3Client} URL
     *
     * @param web3Client Client URL to send requests to
     * @returns AxiosInstance
     */
    private static _createHttpClient(web3Client: Web3Client): AxiosInstance {
        try {
            if (!Web3ProvidersHttp._validateClientUrl(web3Client))
                throw Error('Invalid HTTP(S) URL provided');
            return axios.create({ baseURL: web3Client as string });
        } catch (error) {
            throw Error(`Failed to create HTTP client: ${error.message}`);
        }
    }

    /**
     * Checks if connection to client is possible by requesting
     * client's chainId
     */
    private async _connectToClient() {
        try {
            const chainId = await this._getChainId();
            this.emit(Web3ProviderEvents.Connect, { chainId });
            this._connected = true;

            // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#chainchanged-1
            if (
                this._clientChainId !== undefined &&
                chainId !== this._clientChainId
            ) {
                this.emit(Web3ProviderEvents.ChainChanged, chainId);
            }
            this._clientChainId = chainId;
        } catch (error) {
            throw Error(
                `Error connecting to client: ${error.message}\n${error.stack}`
            );
        }
    }

    /**
     * Makes chainId RPC request
     *
     * @returns ChainId string
     */
    private async _getChainId(): Promise<string> {
        try {
            const result = await this.request({
                method: 'eth_chainId',
                params: [],
            });
            return result.result;
        } catch (error) {
            throw Error(`Error getting chain id: ${error.message}`);
        }
    }

    /**
     * Validates and initializes provider using {web3Client}
     *
     * @param web3Client New client to set for provider instance
     */
    setWeb3Client(web3Client: Web3Client) {
        try {
            this._httpClient = Web3ProvidersHttp._createHttpClient(web3Client);
            this.web3Client = web3Client as string;
            this._connectToClient();
        } catch (error) {
            throw Error(`Failed to set web3 client: ${error.message}`);
        }
    }

    /**
     * Wrapper for EventEmitter's .on
     *
     * @param web3ProviderEvents Any valid EIP-1193 provider event
     * @param listener Function to be called when event is emitted
     * @returns
     */
    on(
        web3ProviderEvent: Web3ProviderEvents,
        listener: ProviderEventListener
    ): this {
        return super.on(web3ProviderEvent, listener);
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
     * Makes an Axios POST request using provided {args}
     *
     * @param args RPC options, request params, AxiosConfig
     * @returns
     */
    async request(args: RequestArguments): Promise<RpcResponse> {
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

            // If the above call was successful, then we're connected
            // to the client, and should emit accordingly (EIP-1193)
            // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#connect-1
            if (this._connected === false) this._connectToClient();

            return response.data.data ? response.data.data : response.data;
        } catch (error) {
            if (error.code === 'ECONNREFUSED' && this._connected) {
                this._connected = false;
                // TODO replace with ProviderRpcError
                this.emit(Web3ProviderEvents.Disconnect, { code: 4900 });
            }
            // TODO Fancy error detection that complies with EIP1193 defined errors
            // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#provider-errors
            throw Error(error.message);
        }
    }
}
