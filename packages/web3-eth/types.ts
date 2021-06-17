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
        nonce: ValidTypes | null;
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
        transactions: PrefixedHexString[];
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
    };
}

export interface EthCallTransaction extends EthTransaction {
    to: string;
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
