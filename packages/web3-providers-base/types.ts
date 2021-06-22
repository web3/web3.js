import { EventEmitter } from 'events';
import {
    PrefixedHexString,
    ValidTypes,
    ValidTypesEnum,
    EthFilter,
    EthTransaction,
    EthMinedTransaction,
    EthLog,
    CompiledSolidity,
} from 'web3-utils/types';
import { AxiosRequestConfig } from 'axios';

export type ProviderCallOptions = HttpOptions | undefined; // HttpOptions | WsOptions | IpcOptions
export type RpcParams = (
    | PrefixedHexString
    | number
    | EthTransaction
    | boolean
    | EthFilter
)[];

export interface ProviderOptions {
    providerUrl: string;
}

export interface HttpOptions {
    axiosConfig?: AxiosRequestConfig;
    subscriptionOptions?: SubscriptionOptions;
}

export interface SubscriptionOptions {
    milisecondsBetweenRequests?: number;
}

export interface RpcOptions {
    id: number;
    jsonrpc: string;
    method: string;
    params: RpcParams;
}

export interface PartialRpcOptions extends Partial<RpcOptions> {
    method: string;
    params: RpcParams;
}

export interface CallOptions {
    providerCallOptions?: ProviderCallOptions;
    rpcOptions?: Partial<RpcOptions>;
    returnType?: ValidTypesEnum;
    subscribe?: boolean;
}

export interface SendOptions extends CallOptions {
    rpcOptions: PartialRpcOptions;
}

export interface RpcResponse {
    id: number;
    jsonrpc: string;
    result: any;
}

export interface RpcStringResult extends RpcResponse {
    result: string;
}

export interface RpcPrefixedHexStringResult extends RpcResponse {
    result: PrefixedHexString;
}

export interface RpcValidTypeResult extends RpcResponse {
    result: ValidTypes;
}

export interface RpcBooleanResult extends RpcResponse {
    result: boolean;
}

export interface RpcSyncingResult extends RpcResponse {
    result:
        | boolean
        | {
              startingBlock: ValidTypes;
              currentBlock: ValidTypes;
              highestBlock: ValidTypes;
          };
}

export interface RpcAccountsResult extends RpcResponse {
    result: PrefixedHexString[];
}

export interface RpcBlockResult extends RpcResponse {
    result: null | {
        number: ValidTypes | null;
        hash: PrefixedHexString | null;
        parentHash: PrefixedHexString;
        nonce: PrefixedHexString | null;
        sha3Uncles: PrefixedHexString;
        logsBloom: PrefixedHexString | null;
        transactionsRoot: PrefixedHexString;
        stateRoot: PrefixedHexString;
        receiptsRoot: PrefixedHexString;
        miner: PrefixedHexString;
        difficulty: ValidTypes;
        totalDifficulty: ValidTypes;
        extraData: PrefixedHexString;
        size: ValidTypes;
        gasLimit: ValidTypes;
        gasUsed: ValidTypes;
        timestamp: ValidTypes;
        transactions: EthMinedTransaction[] | PrefixedHexString[];
        uncles: PrefixedHexString[];
    };
}

export interface RpcTransactionResult extends RpcResponse {
    result: null | {
        blockHash: PrefixedHexString | null;
        blockNumber: ValidTypes | null;
        from: PrefixedHexString;
        gas: ValidTypes;
        gasPrice: ValidTypes;
        hash: PrefixedHexString;
        input: PrefixedHexString;
        nonce: ValidTypes;
        to: PrefixedHexString | null;
        transactionIndex: ValidTypes | null;
        value: ValidTypes;
        v: ValidTypes;
        r: PrefixedHexString;
        s: PrefixedHexString;
    };
}

export interface RpcTransactionReceiptResult extends RpcResponse {
    result: null | {
        transactionHash: PrefixedHexString;
        transactionIndex: ValidTypes;
        blockHash: PrefixedHexString;
        blockNumber: ValidTypes;
        from: PrefixedHexString;
        to: PrefixedHexString | null;
        cumulativeGasUsed: ValidTypes;
        gasUsed: ValidTypes;
        contractAddress: PrefixedHexString | null;
        logs: EthLog[];
        logsBloom: PrefixedHexString;
        root?: PrefixedHexString;
        status?: ValidTypes;
    };
}

export interface RpcStringArrayResult extends RpcResponse {
    result: string[];
}

export interface RpcCompiledSolidityResult extends RpcResponse {
    result: CompiledSolidity;
}

export interface RpcLogResult extends RpcResponse {
    result: EthLog[];
}

export interface SubscriptionResponse {
    eventEmitter: EventEmitter;
    subscriptionId: number;
}

export interface IWeb3Provider {
    providerUrl: string;
    setProvider: (providerUrl: string) => void;
    send: (
        rpcOptions: RpcOptions,
        providerCallOptions: ProviderCallOptions
    ) => Promise<RpcResponse>;
    subscribe: (
        rpcOptions: RpcOptions,
        providerCallOptions: ProviderCallOptions
    ) => SubscriptionResponse;
    unsubscribe?: (eventEmitter: EventEmitter, subscriptionId: number) => void;
    disconnect?: () => void;
}
