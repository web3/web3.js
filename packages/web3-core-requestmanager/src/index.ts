import Web3ProviderHttp from 'web3-providers-http';
import {
    ProviderOptions,
    ProviderCallOptions,
    RpcOptions,
    RpcResponse,
    PartialRpcOptions,
    SubscriptionResponse,
    CallOptions,
} from 'web3-providers-base/src/types';

import { ProviderProtocol } from './types';

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

    async send(callOptions: CallOptions): Promise<RpcResponse> {
        try {
            if (this.provider === undefined)
                throw Error('No provider initialized');
            switch (this.providerProtocol) {
                case ProviderProtocol.WS:
                    // TODO
                    throw Error('Provider protocol not implemented');
                case ProviderProtocol.IPC:
                    // TODO
                    throw Error('Provider protocol not implemented');
                default:
                    // this.providerProtocol is assumed to be ProviderProtocol.HTTP
                    // return callOptions.rpcOptions
                    //     ? this.provider.send(
                    //           //Checks if RPC options exist
                    //           callOptions.providerCallOptions,
                    //           Web3RequestManager._defaultRpcOptions(callOptions.rpcOptions)
                    //       )
                    //     : this.provider.send(callOptions.providerCallOptions);

                    const defaultedCallOptions: CallOptions = {
                        ...callOptions,
                        rpcOptions: callOptions.rpcOptions
                            ? Web3RequestManager._defaultRpcOptions(
                                  callOptions.rpcOptions
                              )
                            : undefined,
                    };

                    return this.provider.send(defaultedCallOptions);
            }
        } catch (error) {
            throw Error(`Error sending: ${error.message}`);
        }
    }

    async subscribe(
        providerCallOptions: ProviderCallOptions,
        rpcOptions?: PartialRpcOptions
    ): Promise<SubscriptionResponse> {
        try {
            if (this.provider === undefined)
                throw Error('No provider initialized');
            return rpcOptions
                ? this.provider.subscribe(
                      providerCallOptions,
                      Web3RequestManager._defaultRpcOptions(rpcOptions)
                  )
                : this.provider.subscribe(providerCallOptions);
        } catch (error) {
            throw Error(`Error subscribing: ${error.message}`);
        }
    }
}
