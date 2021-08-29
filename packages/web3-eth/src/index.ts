import initWeb3Provider from 'web3-core-provider';
import {
    Eth1RequestArguments,
    IWeb3Provider,
    PrefixedHexString,
    EthTransaction,
    BlockIdentifier,
    EthFilter,
    ValidTypes,
} from 'web3-core-types/src/types';

import {
    getClientVersion,
    getCoinbase,
    getGasPrice,
    getHashRate,
    getMining,
    getNetworkListening,
    getNetworkPeerCount,
    getNetworkVersion,
    getProtocolVersion,
    getSha3,
    getSyncing,
    getAccounts,
    getBlockNumber,
    getBalance,
    getStorageAt,
    getTransactionCount,
    getBlockTransactionCountByHash,
    getBlockTransactionCountByNumber,
    getUncleCountByBlockHash,
    getUncleCountByBlockNumber,
    getCode,
    sign,
    signTransaction,
    sendTransaction,
    sendRawTransaction,
    call,
    estimateGas,
    getBlockByHash,
    getBlockByNumber,
    getTransactionByHash,
    getTransactionByBlockHashAndIndex,
    getTransactionByBlockNumberAndIndex,
    getTransactionReceipt,
    getUncleByBlockHashAndIndex,
    getUncleByBlockNumberAndIndex,
    getCompilers,
    compileSolidity,
    compileLLL,
    compileSerpent,
    newFilter,
    newBlockFilter,
    newPendingTransactionFilter,
    uninstallFilter,
    getFilterChanges,
    getFilterLogs,
    getLogs,
    getWork,
    submitWork,
    submitHashRate,
} from 'web3-core-eth-method';

import { Web3EthOptions, EthCallTransaction } from './types';

// TODO Test if removing try/catch throws unhandled promise error

export default class Web3Eth {
    private _provider: IWeb3Provider;

    constructor(options: Web3EthOptions) {
        this._provider = initWeb3Provider(options.web3Client) as IWeb3Provider;
    }

    /**
     * Returns the current client version
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Client version
     */
    getClientVersion = (requestArguments?: Partial<Eth1RequestArguments>) =>
        getClientVersion(this._provider, requestArguments);

    /**
     * Returns Keccak-256 (not the standardized SHA3-256) of the given data
     * @param {string} data Data to convert into SHA3 hash
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} SHA3 hash of {data}
     */
    getSha3 = (
        data: string,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => getSha3(this._provider, data, requestArguments);

    /**
     * Returns the current network version
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Current network version
     */
    getNetworkVersion = (requestArguments?: Partial<Eth1RequestArguments>) =>
        getNetworkVersion(this._provider, requestArguments);

    /**
     * Returns true if client is actively listening for network connections
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} true if currently listening, otherwise false
     */
    getNetworkListening = (requestArguments?: Partial<Eth1RequestArguments>) =>
        getNetworkListening(this._provider, requestArguments);

    /**
     * Returns number of peers currently connected to the client
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Number of connected peers
     */
    getNetworkPeerCount = (requestArguments?: Partial<Eth1RequestArguments>) =>
        getNetworkPeerCount(this._provider, requestArguments);

    /**
     * Returns the current ethereum protocol version
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} The current ethereum protocol version
     */
    getProtocolVersion = (requestArguments?: Partial<Eth1RequestArguments>) =>
        getProtocolVersion(this._provider, requestArguments);

    /**
     * Returns an object with data about the sync status or false when not syncing
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Object with sync status data or false when not syncing
     */
    getSyncing = (requestArguments?: Partial<Eth1RequestArguments>) =>
        getSyncing(this._provider, requestArguments);

    /**
     * Returns the client's coinbase address
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} The current coinbase address
     */
    getCoinbase = (requestArguments?: Partial<Eth1RequestArguments>) =>
        getCoinbase(this._provider, requestArguments);

    /**
     * Returns true if client is actively mining new blocks
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} true if the client is mining, otherwise false
     */
    getMining = (requestArguments?: Partial<Eth1RequestArguments>) =>
        getMining(this._provider, requestArguments);

    /**
     * Returns the number of hashes per second that the node is mining with
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Number of hashes per second
     */
    getHashRate = (requestArguments?: Partial<Eth1RequestArguments>) =>
        getHashRate(this._provider, requestArguments);

    /**
     * Returns the current price per gas in wei
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Current gas price in wei
     */
    getGasPrice = (requestArguments?: Partial<Eth1RequestArguments>) =>
        getGasPrice(this._provider, requestArguments);

    /**
     * Returns a list of addresses owned by client.
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Array of addresses owned by the client
     */
    getAccounts = (requestArguments?: Partial<Eth1RequestArguments>) =>
        getAccounts(this._provider, requestArguments);

    /**
     * Returns the number of most recent block
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Current block number client is on
     */
    getBlockNumber = (requestArguments?: Partial<Eth1RequestArguments>) =>
        getBlockNumber(this._provider, requestArguments);

    /**
     * Returns the balance of the account of given address
     * @param {string} address Address to get balance of
     * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Current balance in wei
     */
    getBalance = (
        address: PrefixedHexString,
        blockIdentifier: BlockIdentifier,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => getBalance(this._provider, address, blockIdentifier, requestArguments);

    /**
     * Returns the value from a storage position at a given address
     * @param {string} address Address of storage to query
     * @param {string|number|BigInt} storagePosition Position in storage to retrieve
     * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Hex string representing value at {storagePosition}
     */
    getStorageAt = (
        address: PrefixedHexString,
        storagePosition: ValidTypes,
        blockIdentifier: BlockIdentifier,
        requestArguments?: Partial<Eth1RequestArguments>
    ) =>
        getStorageAt(
            this._provider,
            address,
            storagePosition,
            blockIdentifier,
            requestArguments
        );

    /**
     * Returns the number of transactions sent from an address
     * @param {string} address Address to get transaction count of
     * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Number of transactions sent by {address}
     */
    getTransactionCount = (
        address: PrefixedHexString,
        blockIdentifier: BlockIdentifier,
        requestArguments?: Partial<Eth1RequestArguments>
    ) =>
        getTransactionCount(
            this._provider,
            address,
            blockIdentifier,
            requestArguments
        );

    /**
     * Returns the number of transactions in a block from a block matching the given block hash
     * @param {string} blockHash Hash of block to query transaction count of
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Number of transactions in block
     */
    getBlockTransactionCountByHash = (
        blockHash: PrefixedHexString,
        requestArguments?: Partial<Eth1RequestArguments>
    ) =>
        getBlockTransactionCountByHash(
            this._provider,
            blockHash,
            requestArguments
        );

    /**
     * Returns the number of transactions in a block from a block matching the given block number
     * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Number of transactions in block
     */
    getBlockTransactionCountByNumber = (
        blockIdentifier: BlockIdentifier,
        requestArguments?: Partial<Eth1RequestArguments>
    ) =>
        getBlockTransactionCountByNumber(
            this._provider,
            blockIdentifier,
            requestArguments
        );

    /**
     * Returns the number of uncles in a block from a block matching the given block hash
     * @param {string} blockHash Hash of block to query
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Number of uncles in block
     */
    getUncleCountByBlockHash = (
        blockHash: PrefixedHexString,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => getUncleCountByBlockHash(this._provider, blockHash, requestArguments);

    /**
     * Returns the number of uncles in a block from a block matching the given block number
     * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Number of uncles in block
     */
    getUncleCountByBlockNumber = (
        blockIdentifier: BlockIdentifier,
        requestArguments?: Partial<Eth1RequestArguments>
    ) =>
        getUncleCountByBlockNumber(
            this._provider,
            blockIdentifier,
            requestArguments
        );

    /**
     * Returns code at a given address
     * @param {string} address Address to get code at
     * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Hex string representing the code at {address}
     */
    getCode = (
        address: PrefixedHexString,
        blockIdentifier: BlockIdentifier,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => getCode(this._provider, address, blockIdentifier, requestArguments);

    /**
     * Calculates an Ethereum specific signature
     * @param {string} address Address to use to sign {data}
     * @param {string} message Message to sign
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Hex string representing signed message
     */
    sign = (
        address: PrefixedHexString,
        message: PrefixedHexString,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => sign(this._provider, address, message, requestArguments);

    /**
     * Signs a transaction that can be submitted to the network at a later time using with sendRawTransaction
     * @param {object} transaction Ethereum transaction
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Hex string representing signed message
     */
    signTransaction = (
        transaction: EthTransaction,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => signTransaction(this._provider, transaction, requestArguments);

    /**
     * Submits a transaction object to the provider to be sign and sent to the network
     * @param {object} transaction Ethereum transaction
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Transaction hash or zero hash if the transaction is not yet available
     */
    sendTransaction = (
        transaction: EthTransaction,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => sendTransaction(this._provider, transaction, requestArguments);

    /**
     * Submits a previously signed transaction object to the network
     * @param {string} rawTransaction Hex string representing previously signed transaction
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Transaction hash or zero hash if the transaction is not yet available
     */
    sendRawTransaction = (
        rawTransaction: PrefixedHexString,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => sendRawTransaction(this._provider, rawTransaction, requestArguments);

    /**
     * Executes a new message call immediately without creating a transaction on the block chain
     * @param {object} transaction Ethereum transaction
     * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Hex string representing return value of executed contract
     */
    call = (
        transaction: EthCallTransaction,
        blockIdentifier: BlockIdentifier,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => call(this._provider, transaction, blockIdentifier, requestArguments);

    /**
     * Generates and returns an estimate of how much gas is necessary to allow the transaction to complete
     * @param {object} transaction Ethereum transaction
     * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Estimated amount of gas to be used
     */
    estimateGas = (
        transaction: EthTransaction,
        blockIdentifier: BlockIdentifier,
        requestArguments?: Partial<Eth1RequestArguments>
    ) =>
        estimateGas(
            this._provider,
            transaction,
            blockIdentifier,
            requestArguments
        );

    /**
     * Returns information about a block by hash
     * @param {string} blockHash Hash of block to get information for
     * @param {boolean} returnFullTxs If true it returns the full transaction objects, if false returns only the hashes of the transactions
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} A block object or null when no block was found
     */
    getBlockByHash = (
        blockHash: PrefixedHexString,
        returnFullTxs: boolean,
        requestArguments?: Partial<Eth1RequestArguments>
    ) =>
        getBlockByHash(
            this._provider,
            blockHash,
            returnFullTxs,
            requestArguments
        );

    /**
     * Returns information about a block by number
     * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
     * @param {boolean} returnFullTxs If true it returns the full transaction objects, if false returns only the hashes of the transactions
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} A block object or null when no block was found
     */
    getBlockByNumber = (
        blockIdentifier: BlockIdentifier,
        returnFullTxs: boolean,
        requestArguments?: Partial<Eth1RequestArguments>
    ) =>
        getBlockByNumber(
            this._provider,
            blockIdentifier,
            returnFullTxs,
            requestArguments
        );

    /**
     * Returns the information about a transaction requested by transaction hash
     * @param {string} txHash Hash of transaction to retrieve
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} A transaction object or {null} when no transaction was found
     */
    getTransactionByHash = (
        txHash: PrefixedHexString,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => getTransactionByHash(this._provider, txHash, requestArguments);

    /**
     * Returns information about a transaction by block hash and transaction index position
     * @param {string} blockHash Hash of block to get transactions of
     * @param {string} transactionIndex Index of transaction to return
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} A transaction object or {null} when no transaction was found
     */
    getTransactionByBlockHashAndIndex = (
        blockHash: PrefixedHexString,
        transactionIndex: ValidTypes,
        requestArguments?: Partial<Eth1RequestArguments>
    ) =>
        getTransactionByBlockHashAndIndex(
            this._provider,
            blockHash,
            transactionIndex,
            requestArguments
        );

    /**
     * Returns information about a transaction by block number and transaction index position
     * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
     * @param {string} transactionIndex Index of transaction to return
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} A transaction object or {null} when no transaction was found
     */
    getTransactionByBlockNumberAndIndex = (
        blockIdentifier: BlockIdentifier,
        transactionIndex: ValidTypes,
        requestArguments?: Partial<Eth1RequestArguments>
    ) =>
        getTransactionByBlockNumberAndIndex(
            this._provider,
            blockIdentifier,
            transactionIndex,
            requestArguments
        );

    // TODO Check if effectiveGasPrice should be included in
    // output formatting
    /**
     * Returns the receipt of a transaction by transaction hash
     * @param {string} txHash Hash of transaction to get receipt of
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} A transaction object or {null} when no receipt was found
     */
    getTransactionReceipt = (
        txHash: PrefixedHexString,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => getTransactionReceipt(this._provider, txHash, requestArguments);

    /**
     * Returns information about a uncle of a block by hash and uncle index position
     * @param {string} blockHash Hash of block to get uncles of
     * @param {string} uncleIndex Index of uncle to retrieve
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} A block object or null when no block was found
     */
    getUncleByBlockHashAndIndex = (
        blockHash: PrefixedHexString,
        uncleIndex: ValidTypes,
        requestArguments?: Partial<Eth1RequestArguments>
    ) =>
        getUncleByBlockHashAndIndex(
            this._provider,
            blockHash,
            uncleIndex,
            requestArguments
        );

    /**
     * Returns information about a uncle of a block by number and uncle index position
     * @param {string|number|BigInt} blockIdentifier Block number, or "latest", "earliest", "pending"
     * @param {string} uncleIndex Index of uncle to retrieve
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} A block object or null when no block was found
     */
    getUncleByBlockNumberAndIndex = (
        blockIdentifier: BlockIdentifier,
        uncleIndex: ValidTypes,
        requestArguments?: Partial<Eth1RequestArguments>
    ) =>
        getUncleByBlockNumberAndIndex(
            this._provider,
            blockIdentifier,
            uncleIndex,
            requestArguments
        );

    /**
     * Returns a list of available compilers in the client
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} A list of available compilers
     */
    getCompilers = (requestArguments?: Partial<Eth1RequestArguments>) =>
        getCompilers(this._provider, requestArguments);

    /**
     * Returns compiled solidity code
     * @param {string} sourceCode Solidity code to be compiled
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Compiled {sourceCode}
     */
    compileSolidity = (
        sourceCode: PrefixedHexString,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => compileSolidity(this._provider, sourceCode, requestArguments);

    /**
     * Returns compiled LLL code
     * @param {string} sourceCode LLL code to be compiled
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Compiled {sourceCode}
     */
    compileLLL = (
        sourceCode: PrefixedHexString,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => compileLLL(this._provider, sourceCode, requestArguments);

    /**
     * Returns compiled serpent code
     * @param {string} sourceCode Serpent code to be compiled
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Compiled {sourceCode}
     */
    compileSerpent = (
        sourceCode: PrefixedHexString,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => compileSerpent(this._provider, sourceCode, requestArguments);

    /**
     * Creates a filter object, based on filter options, to notify when the state changes (logs)
     * @param {object} filter Filter to be created
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Filter id
     */
    newFilter = (
        filter: EthFilter,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => newFilter(this._provider, filter, requestArguments);

    /**
     * Creates a filter in the node, to notify when a new block arrives
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Filter id
     */
    newBlockFilter = (requestArguments?: Partial<Eth1RequestArguments>) =>
        newBlockFilter(this._provider, requestArguments);

    /**
     * Creates a filter in the node, to notify when new pending transactions arrive
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Filter id
     */
    newPendingTransactionFilter = (
        requestArguments?: Partial<Eth1RequestArguments>
    ) => newPendingTransactionFilter(this._provider, requestArguments);

    /**
     * Uninstalls a filter with given id. Should always be called when watch is no longer needed
     * @param {string} filterId Id of filter to uninstall from node
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Returns true if filter was successfully uninstalled, otherwise false
     */
    uninstallFilter = (
        filterId: ValidTypes,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => uninstallFilter(this._provider, filterId, requestArguments);

    /**
     * Polling method for a filter, which returns an array of logs which occurred since last poll
     * @param {string} filterid Id of filter to retrieve changes from
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Array of log objects, or an empty array if nothing has changed since last poll
     */
    getFilterChanges = (
        filterId: ValidTypes,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => getFilterChanges(this._provider, filterId, requestArguments);

    /**
     * Returns an array of all logs matching filter with given id
     * @param {string} filterid Id of filter to retrieve
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Array of log objects, or an empty array if nothing has changed since last poll
     */
    getFilterLogs = (
        filterId: ValidTypes,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => getFilterLogs(this._provider, filterId, requestArguments);

    /**
     * Returns an array of all logs matching a given filter object
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Array of log objects, or an empty array if nothing has changed since last poll
     */
    getLogs = (
        filter: EthFilter,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => getLogs(this._provider, filter, requestArguments);

    /**
     * Returns the hash of the current block, the seedHash, and the boundary condition to be met (“target”)
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Array of work info (in order: current block header pow-hash, seed hash used for the DAG, and boundary condition (“target”), 2^256 / difficulty)
     */
    getWork = (requestArguments?: Partial<Eth1RequestArguments>) =>
        getWork(this._provider, requestArguments);

    /**
     * Used for submitting a proof-of-work solution
     * @param {string} nonce Hex string representing found nonce (64 bits)
     * @param {string} powHash Hex string representing POW hash (256 bits)
     * @param {string} digest Hex string representing mix digest (256 bits)
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Returns true if the provided solution is valid, otherwise false
     */
    submitWork = (
        nonce: ValidTypes,
        powHash: PrefixedHexString,
        digest: PrefixedHexString,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => submitWork(this._provider, nonce, powHash, digest, requestArguments);

    /**
     * Used for submitting mining hashrate
     * @param {string} hashRate Desired hash rate (32 bytes)
     * @param {string} clientId ID identifying the client
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Returns true if the provided solution is valid, otherwise false
     */
    submitHashRate = (
        hashRate: ValidTypes,
        clientId: ValidTypes,
        requestArguments?: Partial<Eth1RequestArguments>
    ) => submitHashRate(this._provider, hashRate, clientId, requestArguments);
}
