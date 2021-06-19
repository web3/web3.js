import Web3ProviderHttp from 'web3-providers-http';
import {
    ProviderOptions,
    ProviderCallOptions,
    RpcOptions,
    RpcResponse,
    PartialRpcOptions,
    SubscriptionResponse,
} from 'web3-providers-base/types';

import { ProviderProtocol } from '../types';

export default class Web3RequestManager {
    provider: Web3ProviderHttp | undefined;

    providerProtocol: ProviderProtocol = ProviderProtocol.UNKNOWN;

    private static _DEFAULT_JSON_RPC_VERSION = '2.0';

    constructor(providerOptions: ProviderOptions) {
        switch (
            Web3RequestManager.detectProviderProtocol(
                providerOptions.providerUrl
            )
        ) {
            case ProviderProtocol.HTTP:
                this.provider = new Web3ProviderHttp(providerOptions);
                this.providerProtocol = ProviderProtocol.HTTP;
                break;
            case ProviderProtocol.WS:
                this.providerProtocol = ProviderProtocol.WS;
                // TODO
                throw Error('Provider protocol not implemented');
            case ProviderProtocol.IPC:
                this.providerProtocol = ProviderProtocol.IPC;
                // TODO
                throw Error('Provider protocol not implemented');
            default:
                // TODO figure out if possible to support generic provider
                throw Error('Provider protocol not supported');
        }
    }

    static detectProviderProtocol(providerUrl: string): ProviderProtocol {
        try {
            if (/^http(s)?:\/\//i.test(providerUrl)) {
                return ProviderProtocol.HTTP;
            } else if (/^ws(s)?:\/\//i.test(providerUrl)) {
                return ProviderProtocol.WS;
            } else if (/^ipc:\/\//i.test(providerUrl)) {
                return ProviderProtocol.WS;
            }
            return ProviderProtocol.UNKNOWN;
        } catch (error) {
            throw Error(`Error detecting provider protocol: ${error.message}`);
        }
    }

    private static _defaultRpcOptions(
        rpcOptions: PartialRpcOptions
    ): RpcOptions {
        return {
            id:
                rpcOptions.id ||
                Math.floor(Math.random() * Number.MAX_SAFE_INTEGER), // generate random integer
            jsonrpc: rpcOptions.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
            method: rpcOptions.method,
            params: rpcOptions.params,
        };
    }

    async send(
        rpcOptions: PartialRpcOptions,
        providerCallOptions?: ProviderCallOptions
    ): Promise<RpcResponse> {
        try {
            if (this.provider === undefined)
                throw Error('No provider initialized');
            return this.provider.send(
                Web3RequestManager._defaultRpcOptions(rpcOptions),
                providerCallOptions
            );
        } catch (error) {
            throw Error(`Error sending: ${error.message}`);
        }
    }

    async subscribe(
        rpcOptions: PartialRpcOptions,
        providerCallOptions?: ProviderCallOptions
    ): Promise<SubscriptionResponse> {
        try {
            if (this.provider === undefined)
                throw Error('No provider initialized');
            return this.provider.subscribe(
                Web3RequestManager._defaultRpcOptions(rpcOptions),
                providerCallOptions
            );
        } catch (error) {
            throw Error(`Error subscribing: ${error.message}`);
        }
    }
}
