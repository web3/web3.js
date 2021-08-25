import { EventEmitter } from 'events';
import { AxiosRequestConfig } from 'axios';

export type PrefixedHexString = string;
export type NumberString = string;
export type ValidTypes = number | PrefixedHexString | NumberString | BigInt;
export type BlockIdentifier = ValidTypes | BlockTags;

export enum BlockTags {
    latest = 'latest',
    earliest = 'earliest',
    pending = 'pending',
}

export enum ValidTypesEnum {
    Number = 'Number',
    PrefixedHexString = 'PrefixedHexString',
    NumberString = 'NumberString',
    BigInt = 'BigInt',
}

export enum Web3ProviderEvents {
    Connect = 'connect',
    Disconnect = 'disconnect',
    ChainChanged = 'chainChanged',
    AccountsChanged = 'accountsChanged',
    Message = 'message',
}

export type EthFilter = {
    fromBlock?: BlockIdentifier;
    toBlock?: BlockIdentifier;
    address?: PrefixedHexString;
    topics?: PrefixedHexString | null | PrefixedHexString[][];
    blockHash?: PrefixedHexString;
};

/**
 * @param to is optional when creating a new contract
 * @param gas optional, default set by node 90,000
 * @param gasPrice optional, default to be determined by node
 * @param data optional, but required if {to} is not provided
 */
export type EthTransaction = {
    from: PrefixedHexString;
    to?: PrefixedHexString;
    gas?: ValidTypes;
    gasPrice?: ValidTypes;
    value?: ValidTypes;
    data?: PrefixedHexString;
    nonce?: ValidTypes;
};

export type EthMinedTransaction = {
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

export type EthLog =
    | PrefixedHexString[]
    | {
          removed: boolean;
          logIndex: ValidTypes | null;
          transactionIndex: ValidTypes | null;
          transactionHash: PrefixedHexString | null;
          blockHash: PrefixedHexString | null;
          blockNumber: ValidTypes | null;
          address: PrefixedHexString;
          data: PrefixedHexString;
          topics: PrefixedHexString[];
      };

export type CompiledSolidity = {
    code: PrefixedHexString;
    info: {
        source: string;
        language: string;
        languageVersion: string;
        compilerVersion: string;
        abiDefinition: any[];
        userDoc: {
            methods: { [key: string]: any };
        };
        developerDoc: {
            methods: { [key: string]: any };
        };
    };
};

export type ProviderCallOptions = HttpOptions | undefined; // HttpOptions | WsOptions | IpcOptions

export type RpcParams = (
    | PrefixedHexString
    | number
    | EthTransaction
    | boolean
    | EthFilter
)[];

export type ProviderEventListener =
    | ProviderEventListenerConnect
    | ProviderEventListenerDisconnect
    | ProviderEventListenerChainChanged
    | ProviderEventListenerAccountsChanged
    | ProviderEventListenerMessage;

export type ProviderEventListenerConnect = (
    connectInfo: ProviderConnectInfo
) => void;
export type ProviderEventListenerDisconnect = (error: ProviderRpcError) => void;
export type ProviderEventListenerChainChanged = (chainId: string) => void;
export type ProviderEventListenerAccountsChanged = (accounts: string[]) => void;
export type ProviderEventListenerMessage = (message: ProviderMessage) => void;

export type Web3Client = string | Eip1193Provider;

export interface Eip1193Provider {
    request: (args: Eth1RequestArguments | any) => Promise<any>;
    on: (
        web3ProviderEvents: Web3ProviderEvents,
        listener: ProviderEventListener
    ) => this;
}

export interface ProviderConnectInfo {
    readonly chainId: string;
}
export interface ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
}
export interface ProviderMessage {
    readonly type: string;
    readonly data: unknown;
}

export interface RpcOptions {
    id: number;
    jsonrpc: string;
}

export interface HttpOptions {
    axiosConfig?: AxiosRequestConfig;
    poll?: boolean;
    pollingInterval?: number;
    httpMethod: 'get' | 'post';
}

interface RequestArguments {
    readonly params?: readonly unknown[] | object;
    providerOptions?: HttpOptions;
    returnType?: ValidTypesEnum;
}

export interface Eth1RequestArguments extends RequestArguments {
    readonly method: string;
    rpcOptions?: RpcOptions;
}

export interface Eth2RequestArguments extends RequestArguments {
    readonly endpoint: string;
}

export interface RpcResponse {
    id: number;
    jsonrpc: string;
    result: any;
}

export type Eth2RpcResponse = { [key: string]: any } | { [key: string]: any }[];
export interface IWeb3Provider {
    setWeb3Client: (web3Client: Web3Client) => void;
    supportsSubscriptions?: () => boolean;
    request: (
        args: Eth1RequestArguments | Eth2RequestArguments
    ) => Promise<RpcResponse | Eth2RpcResponse>;
}

export interface PartialRpcOptions extends Partial<RpcOptions> {
    method: string;
    params: RpcParams;
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
