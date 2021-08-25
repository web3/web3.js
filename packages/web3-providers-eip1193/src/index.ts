import { EventEmitter } from 'events';
import {
    IWeb3Provider,
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

export default class Web3ProvidersEip1193
    extends EventEmitter
    implements IWeb3Provider
{
    web3Client: Eip1193Provider;

    constructor(web3Client: Eip1193Provider) {
        super();
        this.setWeb3Client(web3Client);
    }

    /**
     * Determines whether {web3Client} is a valid EIP-1193 provider
     *
     * @param web3Client To be validated
     * @returns true if valid
     */
    private static _validateClient(web3Client: Web3Client): boolean {
        try {
            return (
                typeof web3Client === 'object' &&
                web3Client.request !== undefined
            );
        } catch (error) {
            throw Error(`Failed to validate client: ${error.message}`);
        }
    }

    /**
     * Validates and initializes provider using {web3Client}
     *
     * @param web3Client New client to set for provider instance
     */
    setWeb3Client(web3Client: Web3Client) {
        try {
            if (!Web3ProvidersEip1193._validateClient(web3Client))
                throw Error('Invalid EIP-1193 client provided');
            this.web3Client = web3Client as Eip1193Provider;
            this._setEventListeners();
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
            return await this.web3Client.request({
                method: args.method,
                params: arrayParams,
            });
        } catch (error) {
            // TODO Fancy error detection that complies with EIP1193 defined errors
            // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#provider-errors
            throw Error(error.message);
        }
    }

    /**
     * Sets EIP-1193 related event listeners
     *
     * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#events
     */
    private _setEventListeners() {
        this.web3Client.on(
            Web3ProviderEvents.Connect,
            (connectInfo: ProviderConnectInfo) => {
                super.emit(Web3ProviderEvents.Connect, connectInfo);
            }
        );
        this.web3Client.on(
            Web3ProviderEvents.Disconnect,
            (error: ProviderRpcError) => {
                super.emit(Web3ProviderEvents.Disconnect, error);
            }
        );
        this.web3Client.on(
            Web3ProviderEvents.ChainChanged,
            (chainId: string) => {
                super.emit(Web3ProviderEvents.ChainChanged, chainId);
            }
        );
        this.web3Client.on(
            Web3ProviderEvents.AccountsChanged,
            (accounts: string[]) => {
                super.emit(Web3ProviderEvents.AccountsChanged, accounts);
            }
        );
        this.web3Client.on(
            Web3ProviderEvents.Message,
            (providerMessage: ProviderMessage) => {
                super.emit(Web3ProviderEvents.Message, providerMessage);
            }
        );
    }
}
