import { HttpRpcResponse } from 'web3-providers-http/types';

export enum BlockTags {
    latest = 'latest',
    earliest = 'earliest',
    pending = 'pending',
}

/**
 * @param BlockIdentifier If string is passed, it must be a hex string
 */
export type BlockIdentifier = number | string | BlockTags;

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
    from: string;
    to?: string;
    gas?: BigInt;
    gasPrice?: BigInt;
    value?: BigInt;
    data?: string;
    nonce?: number;
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
    address?: string;
    topics?: string | null | string[][];
    blochHash?: string;
};

export interface Web3EthOptions {
    packageName?: string;
    providerUrl: string;
}

export interface EthCallTransaction extends EthTransaction {
    to: string;
}

export interface EthStringResult extends HttpRpcResponse {
    result: string;
}

export interface EthStringArrayResult extends HttpRpcResponse {
    result: string[];
}

export interface EthBooleanResult extends HttpRpcResponse {
    result: boolean;
}

export interface EthSyncingResult extends HttpRpcResponse {
    result:
        | {
              startingBlock: string;
              currentBlock: string;
              highestBlock: string;
          }
        | false;
}

export interface EthAccountsResult extends HttpRpcResponse {
    result: string[];
}

export interface EthBlockResult extends HttpRpcResponse {
    result: EthBlock | null;
}

export interface EthTransactionResult extends HttpRpcResponse {
    result: EthMinedTransaction | null;
}

export interface EthTransactionReceiptResult extends HttpRpcResponse {
    result: EthTransactionReceipt | null;
}

export interface EthCompiledSolidityResult extends HttpRpcResponse {
    result: EthCompiledSolidity;
}

export interface EthLogResult extends HttpRpcResponse {
    result: EthLog[];
}
