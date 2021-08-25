import { EventEmitter } from 'events';
import {
    RpcResponse,
    Eth1RequestArguments,
    Web3ProviderEvents,
    ProviderEventListener,
    Eip1193Provider,
    ProviderConnectInfo,
    Web3Client,
    ProviderRpcError,
    ProviderMessage,
} from 'web3-core-types/lib/types';
import Web3CoreLogger from 'web3-core-logger';

import {
    Web3ProvidersEip1193ErrorsConfig,
    Web3ProvidersEip1193ErrorNames,
} from './errors';

export default class Web3ProvidersEip1193
    extends EventEmitter
    implements Eip1193Provider
{
    private _logger: Web3CoreLogger;
    private _web3Client: Eip1193Provider;

    constructor(web3Client: Eip1193Provider) {
        super();
        this._logger = new Web3CoreLogger(Web3ProvidersEip1193ErrorsConfig);
        this.setWeb3Client(web3Client);
    }

    /**
     * Determines whether {web3Client} is a valid EIP-1193 provider
     *
     * @param web3Client To be validated
     * @returns true if valid
     */
    private _validateClient(web3Client: Web3Client) {
        try {
            if (
                typeof web3Client === 'object' &&
                web3Client.request !== undefined
            )
                return;

            throw this._logger.makeError(
                Web3ProvidersEip1193ErrorNames.invalidClient,
                {
                    params: { web3Client },
                }
            );
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
            this._validateClient(web3Client);
            this._web3Client = web3Client as Eip1193Provider;
            this._setEventListeners();
        } catch (error) {
            throw error;
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
        web3ProviderEvents: Web3ProviderEvents,
        listener: ProviderEventListener
    ): this {
        return super.on(web3ProviderEvents, listener);
    }

    /**
     * Wraps {web3Client}'s request method
     *
     * @param args Request params
     * @returns RpcResponse
     */
    async request(args: Eth1RequestArguments): Promise<RpcResponse> {
        try {
            const arrayParams =
                args.params === undefined || Array.isArray(args.params)
                    ? args.params || []
                    : Object.values(args.params);
            return await this._web3Client.request({
                method: args.method,
                params: arrayParams,
            });
        } catch (error) {
            throw Error(error.message);
        }
    }

    /**
     * Sets EIP-1193 related event listeners
     *
     * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#events
     */
    private _setEventListeners() {
        this._web3Client.on(
            Web3ProviderEvents.Connect,
            (connectInfo: ProviderConnectInfo) => {
                super.emit(Web3ProviderEvents.Connect, connectInfo);
            }
        );
        this._web3Client.on(
            Web3ProviderEvents.Disconnect,
            (error: ProviderRpcError) => {
                super.emit(Web3ProviderEvents.Disconnect, error);
            }
        );
        this._web3Client.on(
            Web3ProviderEvents.ChainChanged,
            (chainId: string) => {
                super.emit(Web3ProviderEvents.ChainChanged, chainId);
            }
        );
        this._web3Client.on(
            Web3ProviderEvents.AccountsChanged,
            (accounts: string[]) => {
                super.emit(Web3ProviderEvents.AccountsChanged, accounts);
            }
        );
        this._web3Client.on(
            Web3ProviderEvents.Message,
            (providerMessage: ProviderMessage) => {
                super.emit(Web3ProviderEvents.Message, providerMessage);
            }
        );
    }
}
