import { EventEmitter } from 'events';

export interface ProviderOptions {
    providerUrl: string;
}

export interface BaseRpcOptions {
    id?: number;
    jsonrpc: string;
    method: string;
    params: (string | number)[];
}

export interface BaseRpcResponse {
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
    send: (options: BaseRpcOptions) => Promise<BaseRpcResponse>;
    subscribe: (options: BaseRpcOptions) => {
        eventEmitter: EventEmitter;
        subscriptionId: number;
    };
    unsubscribe?: (eventEmitter: EventEmitter, subscriptionId: number) => void;
    disconnect?: () => void;
}
