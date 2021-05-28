import { EventEmitter } from 'events';
import { HttpOptions } from 'web3-providers-http/types';

export type HexString = string;
export type NumberString = string;
export type ProviderCallOptions = HttpOptions; // HttpOptions | WsOptions | IpcOptions

export enum ReturnTypes {
    HexString,
    Number,
    NumberString,
    BigInt,
}

export interface ProviderOptions {
    providerUrl: string;
}

export interface RpcOptions {
    id: number;
    jsonrpc: string;
    method: string;
    params: (HexString | number)[];
}

export interface CallOptions {
    providerCallOptions?: ProviderCallOptions;
    rpcOptions?: Partial<RpcOptions>;
    returnType?: ReturnTypes;
    subscribe?: boolean;
}

export interface PartialRpcOptions {
    id?: number;
    jsonrpc?: string;
    method: string;
    params?: (HexString | number)[];
}

export interface SendOptions extends CallOptions {
    rpcOptions: PartialRpcOptions;
}

export interface RpcResponse {
    id: number;
    jsonrpc: string;
    result:
        | string
        | number
        | boolean
        | (string | number)[]
        | { [key: string]: string | number }
        | BigInt
        | null
        | any;
}

export interface IWeb3Provider {
    providerUrl: string;
    setProvider: (providerUrl: string) => void;
    send: (
        rpcOptions: RpcOptions,
        providerCallOptions: ProviderCallOptions
    ) => Promise<RpcResponse>;
    subscribe: (options: BaseRpcOptions) => {
        eventEmitter: EventEmitter;
        subscriptionId: number;
    };
    unsubscribe?: (eventEmitter: EventEmitter, subscriptionId: number) => void;
    disconnect?: () => void;
}
