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

    private static _validateClientUrl(web3Client: Web3Client): boolean {
        try {
            return typeof web3Client === 'string'
                ? /^http(s)?:\/\//i.test(web3Client)
                : false;
        } catch (error) {
            throw Error(`Failed to validate client url: ${error.message}`);
        }
    }

    private static _createHttpClient(web3Client: Web3Client): AxiosInstance {
        try {
            if (!Web3ProvidersHttp._validateClientUrl(web3Client))
                throw Error('Invalid HTTP(S) URL provided');
            return axios.create({ baseURL: web3Client as string });
        } catch (error) {
            throw Error(`Failed to create HTTP client: ${error.message}`);
        }
    }

    setWeb3Client(web3Client: Web3Client) {
        try {
            this._httpClient = Web3ProvidersHttp._createHttpClient(web3Client);
            this.web3Client = web3Client as string;
            this._connectToClient();
        } catch (error) {
            throw Error(`Failed to set web3 client: ${error.message}`);
        }
    }

    on(
        web3ProviderEvents: Web3ProviderEvents,
        listener: ProviderEventListener
    ): this {
        return super.on(web3ProviderEvents, listener);
    }

    supportsSubscriptions() {
        return false;
    }

    private async _eth1Request(args: RequestArguments): Promise<RpcResponse> {
        try {
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
            throw Error(error.message);
        }
    }

    private async _eth2Request(args: RequestArguments): Promise<RpcResponse> {
        try {
            // @ts-ignore tsc doesn't understand httpOptions.method || 'post'
            const response = await this._httpClient[
                args.providerOptions.AxiosRequestConfig.method || 'post'
            ]('', args?.rpcOptions || {}, {
                ...args?.providerOptions?.axiosConfig,
            });
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
            throw Error(error.message);
        }
    }

    async request(args: RequestArguments): Promise<RpcResponse> {
        try {
            if (this._httpClient === undefined)
                throw Error('No HTTP client initiliazed');

            return args.providerOptions.ethVersion === 1
                ? await this._eth1Request(args)
                : await this._eth2Request(args);
            // const arrayParams =
            //     args.params === undefined || Array.isArray(args.params)
            //         ? args.params || []
            //         : Object.values(args.params);
            // const response = await this._httpClient.post(
            //     '', // URL path
            //     {
            //         ...args.rpcOptions,
            //         method: args.method,
            //         params: arrayParams,
            //     },
            //     args.providerOptions?.axiosConfig || {}
            // );

            // If the above call was successful, then we're connected
            // to the client, and should emit accordingly (EIP-1193)
            // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#connect-1
            if (this._connected === false) this._connectToClient();

            return response.data.data ? response.data.data : response.data;
        } catch (error) {
            // TODO Fancy error detection that complies with EIP1193 defined errors
            // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#provider-errors
            throw Error(error.message);
        }
    }

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
            throw Error(`Error connecting to client: ${error.message}`);
        }
    }

    private async _getChainId(): Promise<string> {
        const result = await this.request({
            method: 'eth_chainId',
            params: [],
        });
        return result.result;
    }
}
