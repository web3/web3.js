import {
    BlockIdentifier,
    BlockTags,
    IWeb3Provider,
    Eth1RequestArguments,
    RpcStringResult,
    RpcResponse,
    RpcPrefixedHexStringResult,
    RpcValidTypeResult,
    ValidTypesEnum,
    RpcBooleanResult,
    RpcSyncingResult,
    RpcAccountsResult,
    PrefixedHexString,
    ValidTypes,
    EthTransaction,
    RpcBlockResult,
    RpcTransactionResult,
    RpcTransactionReceiptResult,
    RpcStringArrayResult,
    RpcCompiledSolidityResult,
    EthFilter,
    RpcLogResult,
} from 'web3-core-types/src/types';
import { formatOutput, formatOutputObject, toHex } from 'web3-utils';

import { EthCallTransaction } from './types';

export function isBlockTag(value: BlockIdentifier): boolean {
    return Object.values(BlockTags).includes(value as BlockTags);
}

/**
 * Returns the current client version
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Client version
 */
export async function getClientVersion(
    provider: IWeb3Provider,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcStringResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'web3_clientVersion',
        params: [],
    })) as RpcResponse;
}

/**
 * Returns Keccak-256 (not the standardized SHA3-256) of the given data
 * @param {string} data Data to convert into SHA3 hash
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} SHA3 hash of {data}
 */
export async function getSha3(
    provider: IWeb3Provider,
    data: string,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcPrefixedHexStringResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'web3_sha3',
        params: [data],
    })) as RpcResponse;
}

/**
 * Returns the current network version
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Current network version
 */
export async function getNetworkVersion(
    provider: IWeb3Provider,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcValidTypeResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'net_version',
        params: [],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutput(
            response.result,
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns true if client is actively listening for network connections
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} true if currently listening, otherwise false
 */
export async function getNetworkListening(
    provider: IWeb3Provider,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcBooleanResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'net_listening',
        params: [],
    })) as RpcResponse;
}

/**
 * Returns number of peers currently connected to the client
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Number of connected peers
 */
export async function getNetworkPeerCount(
    provider: IWeb3Provider,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcValidTypeResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'net_peerCount',
        params: [],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutput(
            response.result,
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns the current ethereum protocol version
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} The current ethereum protocol version
 */
export async function getProtocolVersion(
    provider: IWeb3Provider,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcValidTypeResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_protocolVersion',
        params: [],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutput(
            response.result,
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns an object with data about the sync status or false when not syncing
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Object with sync status data or false when not syncing
 */
export async function getSyncing(
    provider: IWeb3Provider,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcSyncingResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_syncing',
        params: [],
    })) as RpcResponse;

    return {
        ...response,
        result:
            typeof response.result === 'boolean'
                ? response.result
                : formatOutputObject(
                      response.result,
                      ['startingBlock', 'currentBlock', 'highestBlock'],
                      requestArguments?.returnType ||
                          ValidTypesEnum.PrefixedHexString
                  ),
    };
}

/**
 * Returns the client's coinbase address
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} The current coinbase address
 */
export async function getCoinbase(
    provider: IWeb3Provider,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcPrefixedHexStringResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'eth_coinbase',
        params: [],
    })) as RpcResponse;
}

/**
 * Returns true if client is actively mining new blocks
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} true if the client is mining, otherwise false
 */
export async function getMining(
    provider: IWeb3Provider,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcBooleanResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'eth_mining',
        params: [],
    })) as RpcResponse;
}

/**
 * Returns the number of hashes per second that the node is mining with
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Number of hashes per second
 */
export async function getHashRate(
    provider: IWeb3Provider,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcValidTypeResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_hashrate',
        params: [],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutput(
            response.result,
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns the current price per gas in wei
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Current gas price in wei
 */
export async function getGasPrice(
    provider: IWeb3Provider,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcValidTypeResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_gasPrice',
        params: [],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutput(
            response.result,
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns a list of addresses owned by client.
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Array of addresses owned by the client
 */
export async function getAccounts(
    provider: IWeb3Provider,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcAccountsResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'eth_accounts',
        params: [],
    })) as RpcResponse;
}

/**
 * Returns the number of most recent block
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Current block number client is on
 */
export async function getBlockNumber(
    provider: IWeb3Provider,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcValidTypeResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_blockNumber',
        params: [],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutput(
            response.result,
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns the balance of the account of given address
 * @param {string} address Address to get balance of
 * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Current balance in wei
 */
export async function getBalance(
    provider: IWeb3Provider,
    address: PrefixedHexString,
    blockIdentifier: BlockIdentifier,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcValidTypeResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_getBalance',
        params: [
            address,
            isBlockTag(blockIdentifier)
                ? (blockIdentifier as BlockTags)
                : toHex(blockIdentifier),
        ],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutput(
            response.result,
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns the value from a storage position at a given address
 * @param {string} address Address of storage to query
 * @param {string|number|BigInt} storagePosition Position in storage to retrieve
 * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Hex string representing value at {storagePosition}
 */
export async function getStorageAt(
    provider: IWeb3Provider,
    address: PrefixedHexString,
    storagePosition: ValidTypes,
    blockIdentifier: BlockIdentifier,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcPrefixedHexStringResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'eth_getStorageAt',
        params: [
            address,
            toHex(storagePosition),
            isBlockTag(blockIdentifier)
                ? (blockIdentifier as BlockTags)
                : toHex(blockIdentifier),
        ],
    })) as RpcResponse;
}

/**
 * Returns the number of transactions sent from an address
 * @param {string} address Address to get transaction count of
 * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Number of transactions sent by {address}
 */
export async function getTransactionCount(
    provider: IWeb3Provider,
    address: PrefixedHexString,
    blockIdentifier: BlockIdentifier,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcValidTypeResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_getTransactionCount',
        params: [
            address,
            isBlockTag(blockIdentifier)
                ? (blockIdentifier as BlockTags)
                : toHex(blockIdentifier),
        ],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutput(
            response.result,
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns the number of transactions in a block from a block matching the given block hash
 * @param {string} blockHash Hash of block to query transaction count of
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Number of transactions in block
 */
export async function getBlockTransactionCountByHash(
    provider: IWeb3Provider,
    blockHash: PrefixedHexString,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcValidTypeResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_getBlockTransactionCountByHash',
        params: [blockHash],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutput(
            response.result,
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns the number of transactions in a block from a block matching the given block number
 * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Number of transactions in block
 */
export async function getBlockTransactionCountByNumber(
    provider: IWeb3Provider,
    blockIdentifier: BlockIdentifier,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcValidTypeResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_getBlockTransactionCountByNumber',
        params: [
            isBlockTag(blockIdentifier)
                ? (blockIdentifier as BlockTags)
                : toHex(blockIdentifier),
        ],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutput(
            response.result,
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns the number of uncles in a block from a block matching the given block hash
 * @param {string} blockHash Hash of block to query
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Number of uncles in block
 */
export async function getUncleCountByBlockHash(
    provider: IWeb3Provider,
    blockHash: PrefixedHexString,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcValidTypeResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_getUncleCountByBlockHash',
        params: [blockHash],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutput(
            response.result,
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns the number of uncles in a block from a block matching the given block number
 * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Number of uncles in block
 */
export async function getUncleCountByBlockNumber(
    provider: IWeb3Provider,
    blockIdentifier: BlockIdentifier,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcValidTypeResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_getUncleCountByBlockNumber',
        params: [
            isBlockTag(blockIdentifier)
                ? (blockIdentifier as BlockTags)
                : toHex(blockIdentifier),
        ],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutput(
            response.result,
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns code at a given address
 * @param {string} address Address to get code at
 * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Hex string representing the code at {address}
 */
export async function getCode(
    provider: IWeb3Provider,
    address: PrefixedHexString,
    blockIdentifier: BlockIdentifier,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcPrefixedHexStringResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'eth_getCode',
        params: [
            address,
            isBlockTag(blockIdentifier)
                ? (blockIdentifier as BlockTags)
                : toHex(blockIdentifier),
        ],
    })) as RpcResponse;
}

/**
 * Calculates an Ethereum specific signature
 * @param {string} address Address to use to sign {data}
 * @param {string} message Message to sign
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Hex string representing signed message
 */
export async function sign(
    provider: IWeb3Provider,
    address: PrefixedHexString,
    message: PrefixedHexString,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcPrefixedHexStringResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'eth_sign',
        params: [address, message],
    })) as RpcResponse;
}

/**
 * Signs a transaction that can be submitted to the network at a later time using with sendRawTransaction
 * @param {object} transaction Ethereum transaction
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Hex string representing signed message
 */
export async function signTransaction(
    provider: IWeb3Provider,
    transaction: EthTransaction,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcPrefixedHexStringResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'eth_signTransaction',
        params: [
            {
                ...transaction,
                gas: transaction.gas ? toHex(transaction.gas) : undefined,
                gasPrice: transaction.gasPrice
                    ? toHex(transaction.gasPrice)
                    : undefined,
                value: transaction.value ? toHex(transaction.value) : undefined,
                nonce: transaction.nonce ? toHex(transaction.nonce) : undefined,
            },
        ],
    })) as RpcResponse;
}

/**
 * Submits a transaction object to the provider to be sign and sent to the network
 * @param {object} transaction Ethereum transaction
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Transaction hash or zero hash if the transaction is not yet available
 */
export async function sendTransaction(
    provider: IWeb3Provider,
    transaction: EthTransaction,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcPrefixedHexStringResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'eth_sendTransaction',
        params: [
            {
                ...transaction,
                gas: transaction.gas ? toHex(transaction.gas) : undefined,
                gasPrice: transaction.gasPrice
                    ? toHex(transaction.gasPrice)
                    : undefined,
                value: transaction.value ? toHex(transaction.value) : undefined,
                nonce: transaction.nonce ? toHex(transaction.nonce) : undefined,
            },
        ],
    })) as RpcResponse;
}

/**
 * Submits a previously signed transaction object to the network
 * @param {string} rawTransaction Hex string representing previously signed transaction
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Transaction hash or zero hash if the transaction is not yet available
 */
export async function sendRawTransaction(
    provider: IWeb3Provider,
    rawTransaction: PrefixedHexString,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcPrefixedHexStringResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'eth_sendRawTransaction',
        params: [rawTransaction],
    })) as RpcResponse;
}

/**
 * Executes a new message call immediately without creating a transaction on the block chain
 * @param {object} transaction Ethereum transaction
 * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Hex string representing return value of executed contract
 */
export async function call(
    provider: IWeb3Provider,
    transaction: EthCallTransaction,
    blockIdentifier: BlockIdentifier,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcResponse> {
    return (await provider.request({
        ...requestArguments,
        method: 'eth_call',
        params: [
            {
                ...transaction,
                gas: transaction.gas ? toHex(transaction.gas) : undefined,
                gasPrice: transaction.gasPrice
                    ? toHex(transaction.gasPrice)
                    : undefined,
                value: transaction.value ? toHex(transaction.value) : undefined,
            },
            isBlockTag(blockIdentifier)
                ? (blockIdentifier as BlockTags)
                : toHex(blockIdentifier),
        ],
    })) as RpcResponse;
}

/**
 * Generates and returns an estimate of how much gas is necessary to allow the transaction to complete
 * @param {object} transaction Ethereum transaction
 * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Estimated amount of gas to be used
 */
export async function estimateGas(
    provider: IWeb3Provider,
    transaction: EthTransaction,
    blockIdentifier: BlockIdentifier,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcValidTypeResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_estimateGas',
        params: [
            {
                ...transaction,
                gas: transaction.gas ? toHex(transaction.gas) : undefined,
                gasPrice: transaction.gasPrice
                    ? toHex(transaction.gasPrice)
                    : undefined,
                value: transaction.value ? toHex(transaction.value) : undefined,
                nonce: transaction.nonce ? toHex(transaction.nonce) : undefined,
            },
            isBlockTag(blockIdentifier)
                ? (blockIdentifier as BlockTags)
                : toHex(blockIdentifier),
        ],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutput(
            response.result,
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns information about a block by hash
 * @param {string} blockHash Hash of block to get information for
 * @param {boolean} returnFullTxs If true it returns the full transaction objects, if false returns only the hashes of the transactions
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} A block object or null when no block was found
 */
export async function getBlockByHash(
    provider: IWeb3Provider,
    blockHash: PrefixedHexString,
    returnFullTxs: boolean,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcBlockResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_getBlockByHash',
        params: [blockHash, returnFullTxs],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutputObject(
            response.result,
            [
                'number',
                'difficulty',
                'totalDifficulty',
                'size',
                'gasLimit',
                'gasUsed',
                'timestamp',
                {
                    transactions: [
                        'blockNumber',
                        'gas',
                        'gasPrice',
                        'nonce',
                        'transactionIndex',
                        'value',
                        'v',
                    ],
                },
            ],
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns information about a block by number
 * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
 * @param {boolean} returnFullTxs If true it returns the full transaction objects, if false returns only the hashes of the transactions
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} A block object or null when no block was found
 */
export async function getBlockByNumber(
    provider: IWeb3Provider,
    blockIdentifier: BlockIdentifier,
    returnFullTxs: boolean,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcBlockResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_getBlockByNumber',
        params: [
            isBlockTag(blockIdentifier)
                ? (blockIdentifier as BlockTags)
                : toHex(blockIdentifier),
            returnFullTxs,
        ],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutputObject(
            response.result,
            [
                'number',
                'difficulty',
                'totalDifficulty',
                'size',
                'gasLimit',
                'gasUsed',
                'timestamp',
                {
                    transactions: [
                        'blockNumber',
                        'gas',
                        'gasPrice',
                        'nonce',
                        'transactionIndex',
                        'value',
                        'v',
                    ],
                },
            ],
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns the information about a transaction requested by transaction hash
 * @param {string} txHash Hash of transaction to retrieve
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} A transaction object or {null} when no transaction was found
 */
export async function getTransactionByHash(
    provider: IWeb3Provider,
    txHash: PrefixedHexString,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcTransactionResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_getTransactionByHash',
        params: [txHash],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutputObject(
            response.result,
            [
                'blockNumber',
                'gas',
                'gasPrice',
                'nonce',
                'transactionIndex',
                'value',
                'v',
            ],
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns information about a transaction by block hash and transaction index position
 * @param {string} blockHash Hash of block to get transactions of
 * @param {string} transactionIndex Index of transaction to return
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} A transaction object or {null} when no transaction was found
 */
export async function getTransactionByBlockHashAndIndex(
    provider: IWeb3Provider,
    blockHash: PrefixedHexString,
    transactionIndex: ValidTypes,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcTransactionResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_getTransactionByBlockHashAndIndex',
        params: [blockHash, toHex(transactionIndex)],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutputObject(
            response.result,
            [
                'blockNumber',
                'gas',
                'gasPrice',
                'nonce',
                'transactionIndex',
                'value',
                'v',
            ],
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns information about a transaction by block number and transaction index position
 * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
 * @param {string} transactionIndex Index of transaction to return
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} A transaction object or {null} when no transaction was found
 */
export async function getTransactionByBlockNumberAndIndex(
    provider: IWeb3Provider,
    blockIdentifier: BlockIdentifier,
    transactionIndex: ValidTypes,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcTransactionResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_getTransactionByBlockNumberAndIndex',
        params: [
            isBlockTag(blockIdentifier)
                ? (blockIdentifier as BlockTags)
                : toHex(blockIdentifier),
            toHex(transactionIndex),
        ],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutputObject(
            response.result,
            [
                'blockNumber',
                'gas',
                'gasPrice',
                'nonce',
                'transactionIndex',
                'value',
                'v',
            ],
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

// TODO Check if effectiveGasPrice should be included in
// output formatting
/**
 * Returns the receipt of a transaction by transaction hash
 * @param {string} txHash Hash of transaction to get receipt of
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} A transaction object or {null} when no receipt was found
 */
export async function getTransactionReceipt(
    provider: IWeb3Provider,
    txHash: PrefixedHexString,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcTransactionReceiptResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_getTransactionReceipt',
        params: [txHash],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutputObject(
            response.result,
            [
                'transactionIndex',
                'blockNumber',
                'cumulativeGasUsed',
                'gasUsed',
                {
                    logs: ['logIndex', 'transactionIndex', 'blockNumber'],
                },
                'status',
            ],
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns information about a uncle of a block by hash and uncle index position
 * @param {string} blockHash Hash of block to get uncles of
 * @param {string} uncleIndex Index of uncle to retrieve
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} A block object or null when no block was found
 */
export async function getUncleByBlockHashAndIndex(
    provider: IWeb3Provider,
    blockHash: PrefixedHexString,
    uncleIndex: ValidTypes,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcBlockResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_getUncleByBlockHashAndIndex',
        params: [blockHash, toHex(uncleIndex)],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutputObject(
            response.result,
            [
                'number',
                'difficulty',
                'totalDifficulty',
                'size',
                'gasLimit',
                'gasUsed',
                'timestamp',
                {
                    transactions: [
                        'blockNumber',
                        'gas',
                        'gasPrice',
                        'nonce',
                        'transactionIndex',
                        'value',
                        'v',
                    ],
                },
            ],
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns information about a uncle of a block by number and uncle index position
 * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
 * @param {string} uncleIndex Index of uncle to retrieve
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} A block object or null when no block was found
 */
export async function getUncleByBlockNumberAndIndex(
    provider: IWeb3Provider,
    blockIdentifier: BlockIdentifier,
    uncleIndex: ValidTypes,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcBlockResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_getUncleByBlockNumberAndIndex',
        params: [
            isBlockTag(blockIdentifier)
                ? (blockIdentifier as BlockTags)
                : toHex(blockIdentifier),
            toHex(uncleIndex),
        ],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutputObject(
            response.result,
            [
                'number',
                'difficulty',
                'totalDifficulty',
                'size',
                'gasLimit',
                'gasUsed',
                'timestamp',
                {
                    transactions: [
                        'blockNumber',
                        'gas',
                        'gasPrice',
                        'nonce',
                        'transactionIndex',
                        'value',
                        'v',
                    ],
                },
            ],
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns a list of available compilers in the client
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} A list of available compilers
 */
export async function getCompilers(
    provider: IWeb3Provider,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcStringArrayResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'eth_getCompilers',
        params: [],
    })) as RpcResponse;
}

/**
 * Returns compiled solidity code
 * @param {string} sourceCode Solidity code to be compiled
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Compiled {sourceCode}
 */
export async function compileSolidity(
    provider: IWeb3Provider,
    sourceCode: PrefixedHexString,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcCompiledSolidityResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'eth_compileSolidity',
        params: [sourceCode],
    })) as RpcResponse;
}

/**
 * Returns compiled LLL code
 * @param {string} sourceCode LLL code to be compiled
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Compiled {sourceCode}
 */
export async function compileLLL(
    provider: IWeb3Provider,
    sourceCode: PrefixedHexString,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcPrefixedHexStringResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'eth_compileLLL',
        params: [sourceCode],
    })) as RpcResponse;
}

/**
 * Returns compiled serpent code
 * @param {string} sourceCode Serpent code to be compiled
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Compiled {sourceCode}
 */
export async function compileSerpent(
    provider: IWeb3Provider,
    sourceCode: PrefixedHexString,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcPrefixedHexStringResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'eth_compileSerpent',
        params: [sourceCode],
    })) as RpcResponse;
}

/**
 * Creates a filter object, based on filter options, to notify when the state changes (logs)
 * @param {object} filter Filter to be created
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Filter id
 */
export async function newFilter(
    provider: IWeb3Provider,
    filter: EthFilter,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcValidTypeResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_newFilter',
        params: [
            {
                ...filter,
                fromBlock: filter.fromBlock
                    ? toHex(filter.fromBlock)
                    : undefined,
                toBlock: filter.toBlock ? toHex(filter.toBlock) : undefined,
            },
        ],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutput(
            response.result,
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Creates a filter in the node, to notify when a new block arrives
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Filter id
 */
export async function newBlockFilter(
    provider: IWeb3Provider,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcValidTypeResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_newBlockFilter',
        params: [],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutput(
            response.result,
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Creates a filter in the node, to notify when new pending transactions arrive
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Filter id
 */
export async function newPendingTransactionFilter(
    provider: IWeb3Provider,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcValidTypeResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_newPendingTransactionFilter',
        params: [],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutput(
            response.result,
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Uninstalls a filter with given id. Should always be called when watch is no longer needed
 * @param {string} filterId Id of filter to uninstall from node
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Returns true if filter was successfully uninstalled, otherwise false
 */
export async function uninstallFilter(
    provider: IWeb3Provider,
    filterId: ValidTypes,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcBooleanResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'eth_uninstallFilter',
        params: [toHex(filterId)],
    })) as RpcResponse;
}

/**
 * Polling method for a filter, which returns an array of logs which occurred since last poll
 * @param {string} filterid Id of filter to retrieve changes from
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Array of log objects, or an empty array if nothing has changed since last poll
 */
export async function getFilterChanges(
    provider: IWeb3Provider,
    filterId: ValidTypes,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcLogResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_getFilterChanges',
        params: [toHex(filterId)],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutputObject(
            response.result,
            ['logIndex', 'transactionIndex', 'blockNumber'],
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns an array of all logs matching filter with given id
 * @param {string} filterid Id of filter to retrieve
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Array of log objects, or an empty array if nothing has changed since last poll
 */
export async function getFilterLogs(
    provider: IWeb3Provider,
    filterId: ValidTypes,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcLogResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_getFilterLogs',
        params: [toHex(filterId)],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutputObject(
            response.result,
            ['logIndex', 'transactionIndex', 'blockNumber'],
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns an array of all logs matching a given filter object
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Array of log objects, or an empty array if nothing has changed since last poll
 */
export async function getLogs(
    provider: IWeb3Provider,
    filter: EthFilter,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcLogResult> {
    const response = (await provider.request({
        ...requestArguments,
        method: 'eth_getLogs',
        params: [
            {
                ...filter,
                fromBlock: filter.fromBlock
                    ? toHex(filter.fromBlock)
                    : undefined,
                toBlock: filter.toBlock ? toHex(filter.toBlock) : undefined,
            },
        ],
    })) as RpcResponse;

    return {
        ...response,
        result: formatOutputObject(
            response.result,
            ['logIndex', 'transactionIndex', 'blockNumber'],
            requestArguments?.returnType || ValidTypesEnum.PrefixedHexString
        ),
    };
}

/**
 * Returns the hash of the current block, the seedHash, and the boundary condition to be met (“target”)
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Array of work info (in order: current block header pow-hash, seed hash used for the DAG, and boundary condition (“target”), 2^256 / difficulty)
 */
export async function getWork(
    provider: IWeb3Provider,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcStringArrayResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'eth_getWork',
        params: [],
    })) as RpcResponse;
}

/**
 * Used for submitting a proof-of-work solution
 * @param {string} nonce Hex string representing found nonce (64 bits)
 * @param {string} powHash Hex string representing POW hash (256 bits)
 * @param {string} digest Hex string representing mix digest (256 bits)
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Returns true if the provided solution is valid, otherwise false
 */
export async function submitWork(
    provider: IWeb3Provider,
    nonce: ValidTypes,
    powHash: PrefixedHexString,
    digest: PrefixedHexString,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcBooleanResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'eth_submitWork',
        params: [toHex(nonce, 8), powHash, digest],
    })) as RpcResponse;
}

/**
 * Used for submitting mining hashrate
 * @param {string} hashRate Desired hash rate (32 bytes)
 * @param {string} clientId ID identifying the client
 * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
 * @returns {Promise} Returns true if the provided solution is valid, otherwise false
 */
export async function submitHashRate(
    provider: IWeb3Provider,
    hashRate: ValidTypes,
    clientId: ValidTypes,
    requestArguments?: Partial<Eth1RequestArguments>
): Promise<RpcBooleanResult> {
    return (await provider.request({
        ...requestArguments,
        method: 'eth_submitHashRate',
        params: [toHex(hashRate, 32), toHex(clientId)],
    })) as RpcResponse;
}
