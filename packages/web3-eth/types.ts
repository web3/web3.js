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

/**
 * @param gas eth_call consumes zero gas, but this parameter may be needed by some executions
 */
export type EthCallTransaction = {
    from: PrefixedHexString;
    to: PrefixedHexString;
    gas?: ValidTypes;
    gasPrice?: ValidTypes;
    value?: ValidTypes;
    data?: PrefixedHexString;
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
