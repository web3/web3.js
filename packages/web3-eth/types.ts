import { RpcResponse } from 'web3-providers-base/types';
import {
    PrefixedHexString,
    ValidTypes,
    ValidTypesEnum,
} from 'web3-utils/types';

export enum BlockTags {
    latest = 'latest',
    earliest = 'earliest',
    pending = 'pending',
}

export type BlockIdentifier = ValidTypes | BlockTags;

export type EthLog = {
    removed: boolean;
    logIndex: string | null;
    transactionIndex: string | null;
    transactionHash: string | null;
    blockHash: string | null;
    blockNumber: string | null;
    address: string;
    data: string;
    topics: string[];
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
    blockHash: string | null;
    blockNumber: string | null;
    from: string;
    gas: string;
    gasPrice: string;
    hash: string;
    input: string;
    nonce: string;
    to: string | null;
    transactionIndex: string | null;
    value: string;
    v: string;
    r: string;
    s: string;
};

export type EthBlock = {
    number: string | null;
    hash: string | null;
    parentHash: string;
    nonce: string | null;
    sha3Uncles: string;
    logsBloom: string | null;
    transactionsRoot: string;
    stateRoot: string;
    receiptsRoot: string;
    miner: string;
    difficulty: string;
    totalDifficulty: string;
    extraData: string;
    size: string;
    gasLimit: string;
    gasUsed: string;
    timestamp: string;
    transactions: EthMinedTransaction[];
    uncles: string[];
    root?: string;
    status?: string;
};

export type EthTransactionReceipt = {
    transactionHash: string;
    transactionIndex: string;
    blockHash: string;
    blockNumber: string;
    from: string;
    to: string | null;
    cumulativeGasUsed: string;
    gasUsed: string;
    contractAdress: string | null;
    logs: EthLog[];
    logsBloom: string;
};

export type EthCompiledSolidity = {
    code: string;
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

export type EthFilter = {
    fromBlock?: BlockIdentifier;
    toBlock?: BlockIdentifier;
    address?: PrefixedHexString;
    topics?: PrefixedHexString | null | PrefixedHexString[][];
    blockHash?: PrefixedHexString;
};

export interface Web3EthOptions {
    packageName?: string;
    providerUrl: string;
    returnType?: ValidTypesEnum;
}

export interface EthCallTransaction extends EthTransaction {
    to: string;
}

export interface Web3EthResult extends RpcResponse {
    result: ValidTypes;
}

export interface EthStringResult extends RpcResponse {
    result: string;
}

export interface EthStringArrayResult extends RpcResponse {
    result: string[];
}

export interface EthBooleanResult extends RpcResponse {
    result: boolean;
}

export interface EthSyncingResult extends RpcResponse {
    result:
        | {
              startingBlock: string;
              currentBlock: string;
              highestBlock: string;
          }
        | false;
}

export interface EthAccountsResult extends RpcResponse {
    result: string[];
}

export interface EthBlockResult extends RpcResponse {
    result: EthBlock | null;
}

export interface EthTransactionResult extends RpcResponse {
    result: EthMinedTransaction | null;
}

export interface EthTransactionReceiptResult extends RpcResponse {
    result: EthTransactionReceipt | null;
}

export interface EthCompiledSolidityResult extends RpcResponse {
    result: EthCompiledSolidity;
}

export interface EthLogResult extends RpcResponse {
    result: EthLog[];
}
