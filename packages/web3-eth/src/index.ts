import Web3RequestManager from 'web3-core-requestmanager';
import { HttpRpcOptions } from 'web3-providers-http/types';

import {
    Web3EthOptions,
    EthTransaction,
    EthCallTransaction,
    BlockIdentifier,
    EthStringResult,
    EthSyncingResult,
    EthBooleanResult,
    EthAccountsResult,
    EthBlockResult,
    EthTransactionResult,
    EthTransactionReceiptResult,
    EthStringArrayResult,
    EthCompiledSolidityResult,
    EthLogResult,
    EthFilter,
} from '../types';

export default class Web3Eth {
    private _requestManager: Web3RequestManager;
    private _DEFAULT_JSON_RPC_VERSION = '2.0';

    constructor(options: Web3EthOptions) {
        this._requestManager = new Web3RequestManager({
            providerUrl: options.providerUrl,
        });
    }

    /**
     * Returns the current client version
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Client version
     */
    async getClientVersion(
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'web3_clientVersion',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting client version: ${error.message}`);
        }
    }

    /**
     * Returns Keccak-256 (not the standardized SHA3-256) of the given data
     * @param {string} data Data to convert into SHA3 hash
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} SHA3 hash of {data}
     */
    async getSha3(
        data: string,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'web3_sha3',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [data],
            });
        } catch (error) {
            throw Error(`Error getting sha3 hash: ${error.message}`);
        }
    }

    /**
     * Returns the current network version
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Current network version
     */
    async getNetworkVersion(
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'net_version',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting network version: ${error.message}`);
        }
    }

    /**
     * Returns true if client is actively listening for network connections
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} true if currently listening, otherwise false
     */
    async getNetworkListening(
        rpcOptions?: HttpRpcOptions
    ): Promise<EthBooleanResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'net_listening',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting network listening: ${error.message}`);
        }
    }

    /**
     * Returns number of peers currently connected to the client
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} true if currently listening, otherwise false
     */
    async getNetworkPeerCount(
        rpcOptions?: HttpRpcOptions
    ): Promise<EthBooleanResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'net_peerCount',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting network peer count: ${error.message}`);
        }
    }

    /**
     * Returns the current ethereum protocol version
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} The current ethereum protocol version
     */
    async getProtocolVersion(
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_protocolVersion',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting protocol version: ${error.message}`);
        }
    }

    /**
     * Returns an object with data about the sync status or false when not syncing
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Object with sync status data or false when not syncing
     */
    async getSyncing(rpcOptions?: HttpRpcOptions): Promise<EthSyncingResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_syncing',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting syncing status: ${error.message}`);
        }
    }

    /**
     * Returns the client's coinbase address
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} The current coinbase address
     */
    async getCoinbase(rpcOptions?: HttpRpcOptions): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_coinbase',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting coinbase address: ${error.message}`);
        }
    }

    /**
     * Returns true if client is actively mining new blocks
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} true if the client is mining, otherwise false
     */
    async getMining(rpcOptions?: HttpRpcOptions): Promise<EthBooleanResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_mining',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting mining status: ${error.message}`);
        }
    }

    /**
     * Returns the number of hashes per second that the node is mining with
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Number of hashes per second
     */
    async getHashRate(rpcOptions?: HttpRpcOptions): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_hashrate',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting hash rate: ${error.message}`);
        }
    }

    /**
     * Returns the current price per gas in wei
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing current gas price in wei
     */
    async getGasPrice(rpcOptions?: HttpRpcOptions): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_gasPrice',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting gas price: ${error.message}`);
        }
    }

    /**
     * Returns a list of addresses owned by client.
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Array of addresses owned by the client
     */
    async getAccounts(rpcOptions?: HttpRpcOptions): Promise<EthAccountsResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_accounts',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting accounts: ${error.message}`);
        }
    }

    /**
     * Returns the number of most recent block
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing current block number client is on
     */
    async getBlockNumber(
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_blockNumber',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting block number: ${error.message}`);
        }
    }

    /**
     * Returns the balance of the account of given address
     * @param {string} address Address to get balance of
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing current balance in wei
     */
    async getBalance(
        address: string,
        blockIdentifier: BlockIdentifier,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getBalance',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [address, blockIdentifier],
            });
        } catch (error) {
            throw Error(`Error getting balance: ${error.message}`);
        }
    }

    /**
     * Returns the value from a storage position at a given address
     * @param {string} address Address of storage to query
     * @param {string} storagePosition Hex string representing position in storage to retrieve
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing value at {storagePosition}
     */
    async getStorageAt(
        address: string,
        storagePosition: string,
        blockIdentifier: BlockIdentifier,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getStorageAt',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [address, storagePosition, blockIdentifier],
            });
        } catch (error) {
            throw Error(`Error getting storage value: ${error.message}`);
        }
    }

    /**
     * Returns the number of transactions sent from an address
     * @param {string} address Address to get transaction count of
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing number of transactions sent by {address}
     */
    async getTransactionCount(
        address: string,
        blockIdentifier: BlockIdentifier,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getTransactionCount',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [address, blockIdentifier],
            });
        } catch (error) {
            throw Error(`Error getting transaction count: ${error.message}`);
        }
    }

    /**
     * Returns the number of transactions in a block from a block matching the given block hash
     * @param {string} blockHash Hash of block to query transaction count of
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing number of transactions in block
     */
    async getBlockTransactionCountByHash(
        blockHash: string,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getBlockTransactionCountByHash',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [blockHash],
            });
        } catch (error) {
            throw Error(
                `Error getting transaction count for block by hash: ${error.message}`
            );
        }
    }

    /**
     * Returns the number of transactions in a block from a block matching the given block number
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing number of transactions in block
     */
    async getBlockTransactionCountByNumber(
        blockIdentifier: BlockIdentifier,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getBlockTransactionCountByNumber',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [blockIdentifier],
            });
        } catch (error) {
            throw Error(
                `Error getting transaction count for block by number: ${error.message}`
            );
        }
    }

    /**
     * Returns the number of uncles in a block from a block matching the given block hash
     * @param {string} blockHash Hash of block to query
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing number of uncles in block
     */
    async getUncleCountByBlockHash(
        blockHash: string,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getUncleCountByBlockHash',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [blockHash],
            });
        } catch (error) {
            throw Error(
                `Error getting uncle count for block by hash: ${error.message}`
            );
        }
    }

    /**
     * Returns the number of uncles in a block from a block matching the given block number
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing number of uncles in block
     */
    async getUncleCountByBlockNumber(
        blockIdentifier: BlockIdentifier,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getUncleCountByBlockNumber',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [blockIdentifier],
            });
        } catch (error) {
            throw Error(
                `Error getting uncle count for block by number: ${error.message}`
            );
        }
    }

    /**
     * Returns code at a given address
     * @param {string} address Address to get code at
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing the code at {address}
     */
    async getCode(
        address: string,
        blockIdentifier: BlockIdentifier,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getCode',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [address, blockIdentifier],
            });
        } catch (error) {
            throw Error(`Error getting code at address: ${error.message}`);
        }
    }

    /**
     * Calculates an Ethereum specific signature
     * @param {string} address Address to use to sign {data}
     * @param {string} message Message to sign
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing signed message
     */
    async sign(
        address: string,
        message: string,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_sign',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [address, message],
            });
        } catch (error) {
            throw Error(`Error signing message: ${error.message}`);
        }
    }

    /**
     * Signs a transaction that can be submitted to the network at a later time using with sendRawTransaction
     * @param {object} transaction Ethereum transaction
     * @param {string} transaction.from Address transaction will be sent from
     * @param {string} transaction.to Address transaction is directed towards (optional when creating new contract)
     * @param {string} transaction.gas Hex string representing gas to provide for transaction (ETH node defaults to 90,000)
     * @param {string} transaction.gasPrice Hex string representing price paid for each unit of gas in Wei (ETH node will determine if not provided)
     * @param {string} transaction.value Hex string representing number of Wei to send to {to}
     * @param {string} transaction.data Hex string representing compiled code of a contract or the hash of the invoked method signature and encoded parameters
     * @param {string} transaction.nonce Can be used to overwrite pending transactions that use the same nonce
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing signed message
     */
    async signTransaction(
        transaction: EthTransaction,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_signTransaction',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [{ ...transaction }],
            });
        } catch (error) {
            throw Error(`Error signing transaction: ${error.message}`);
        }
    }

    /**
     * Submits a transaction object to the provider to be sign and sent to the network
     * @param {object} transaction Ethereum transaction
     * @param {string} transaction.from Address transaction will be sent from
     * @param {string} transaction.to Address transaction is directed towards (optional when creating new contract)
     * @param {string} transaction.gas Hex string representing gas to provide for transaction (ETH node defaults to 90,000)
     * @param {string} transaction.gasPrice Hex string representing price paid for each unit of gas in Wei (ETH node will determine if not provided)
     * @param {string} transaction.value Hex string representing number of Wei to send to {to}
     * @param {string} transaction.data Hex string representing compiled code of a contract or the hash of the invoked method signature and encoded parameters
     * @param {string} transaction.nonce Can be used to overwrite pending transactions that use the same nonce
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Transaction hash or zero hash if the transaction is not yet available
     */
    async sendTransaction(
        transaction: EthTransaction,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_sendTransaction',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [{ ...transaction }],
            });
        } catch (error) {
            throw Error(`Error sending transaction: ${error.message}`);
        }
    }

    /**
     * Submits a previously signed transaction object to the network
     * @param {string} rawTransaction Hex string representing previously signed transaction
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Transaction hash or zero hash if the transaction is not yet available
     */
    async sendRawTransaction(
        rawTransaction: string,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_sendRawTransaction',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [rawTransaction],
            });
        } catch (error) {
            throw Error(`Error sending raw transaction: ${error.message}`);
        }
    }

    /**
     * TODO Result is probably more than hex string, or perhpas should be decoded
     *
     * Executes a new message call immediately without creating a transaction on the block chain
     * @param {object} transaction Ethereum transaction
     * @param {string} transaction.from Address transaction will be sent from
     * @param {string} transaction.to Address transaction is directed towards
     * @param {string} transaction.gas Hex string representing gas to provide for transaction (ETH node defaults to 90,000)
     * @param {string} transaction.gasPrice Hex string representing price paid for each unit of gas in Wei (ETH node will determine if not provided)
     * @param {string} transaction.value Hex string representing number of Wei to send to {to}
     * @param {string} transaction.data Hash of the method signature and encoded parameters
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing return value of executed contract
     */
    async call(
        transaction: EthCallTransaction,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_call',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [transaction],
            });
        } catch (error) {
            throw Error(`Error sending call transaction: ${error.message}`);
        }
    }

    /**
     * Generates and returns an estimate of how much gas is necessary to allow the transaction to complete
     * @param {object} transaction Ethereum transaction
     * @param {string} transaction.from Address transaction will be sent from (optional)
     * @param {string} transaction.to Address transaction is directed towards (optional)
     * @param {string} transaction.gas Hex string representing gas to provide for transaction (ETH node defaults to 90,000)
     * @param {string} transaction.gasPrice Hex string representing price paid for each unit of gas in Wei (ETH node will determine if not provided)
     * @param {string} transaction.value Hex string representing number of Wei to send to {to} (optional)
     * @param {string} transaction.data Hash of the method signature and encoded parameters (optional)
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Hex string representing estimated amount of gas to be used
     */
    async estimateGas(
        transaction: EthTransaction,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_estimateGas',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [transaction],
            });
        } catch (error) {
            throw Error(`Error getting gas estimate: ${error.message}`);
        }
    }

    /**
     * Returns information about a block by hash
     * @param {string} blockHash Hash of block to get information for
     * @param {boolean} returnFullTxs If true it returns the full transaction objects, if false returns only the hashes of the transactions
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} A block object or null when no block was found
     */
    async getBlockByHash(
        blockHash: string,
        returnFullTxs: boolean,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthBlockResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getBlockByHash',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [blockHash, returnFullTxs],
            });
        } catch (error) {
            throw Error(`Error getting block by hash: ${error.message}`);
        }
    }

    /**
     * Returns information about a block by number
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {boolean} returnFullTxs If true it returns the full transaction objects, if false returns only the hashes of the transactions
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} A block object or null when no block was found
     */
    async getBlockByNumber(
        blockIdentifier: BlockIdentifier,
        returnFullTxs: boolean,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthBlockResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getBlockByNumber',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [blockIdentifier, returnFullTxs],
            });
        } catch (error) {
            throw Error(`Error getting block by number: ${error.message}`);
        }
    }

    /**
     * Returns the information about a transaction requested by transaction hash
     * @param {string} txHash Hash of transaction to retrieve
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} A transaction object or {null} when no transaction was found
     */
    async getTransactionByHash(
        txHash: string,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthTransactionResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getTransactionByHash',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [txHash],
            });
        } catch (error) {
            throw Error(`Error getting transaction by hash: ${error.message}`);
        }
    }

    /**
     * Returns information about a transaction by block hash and transaction index position
     * @param {string} blockHash Hash of block to get transactions of
     * @param {string} transactionIndex Hex string representing index of transaction to return
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} A transaction object or {null} when no transaction was found
     */
    async getTransactionByBlockHashAndIndex(
        blockHash: string,
        transactionIndex: string,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthTransactionResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getTransactionByBlockHashAndIndex',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [blockHash, transactionIndex],
            });
        } catch (error) {
            throw Error(
                `Error getting transaction by block hash and index: ${error.message}`
            );
        }
    }

    /**
     * Returns information about a transaction by block number and transaction index position
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {string} transactionIndex Hex string representing index of transaction to return
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} A transaction object or {null} when no transaction was found
     */
    async getTransactionByBlockNumberAndIndex(
        blockIdentifier: BlockIdentifier,
        transactionIndex: string,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthTransactionResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getTransactionByBlockNumberAndIndex',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [blockIdentifier, transactionIndex],
            });
        } catch (error) {
            throw Error(
                `Error getting transaction by block number and index: ${error.message}`
            );
        }
    }

    /**
     * Returns the receipt of a transaction by transaction hash
     * @param {string} txHash Hash of transaction to get receipt of
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} A transaction object or {null} when no receipt was found
     */
    async getTransactionReceipt(
        txHash: string,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthTransactionReceiptResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getTransactionReceipt',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [txHash],
            });
        } catch (error) {
            throw Error(`Error getting transaction reciept: ${error.message}`);
        }
    }

    /**
     * Returns information about a uncle of a block by hash and uncle index position
     * @param {string} blockHash Hash of block to get uncles of
     * @param {string} uncleIndex Index of uncle to retrieve
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} A block object or null when no block was found
     */
    async getUncleByBlockHashAndIndex(
        blockHash: string,
        uncleIndex: string,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthBlockResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getUncleByBlockHashAndIndex',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [blockHash, uncleIndex],
            });
        } catch (error) {
            throw Error(
                `Error getting uncle by block hash and index: ${error.message}`
            );
        }
    }

    /**
     * Returns information about a uncle of a block by number and uncle index position
     * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
     * @param {string} uncleIndex Index of uncle to retrieve
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} A block object or null when no block was found
     */
    async getUncleByBlockNumberAndIndex(
        blockIdentifier: BlockIdentifier,
        uncleIndex: string,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthBlockResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getUncleByBlockNumberAndIndex',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [blockIdentifier, uncleIndex],
            });
        } catch (error) {
            throw Error(
                `Error getting uncle by block number and index: ${error.message}`
            );
        }
    }

    /**
     * Returns a list of available compilers in the client
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} A list of available compilers
     */
    async getCompilers(
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringArrayResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getCompilers',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting compilers: ${error.message}`);
        }
    }

    /**
     * Returns compiled solidity code
     * @param {string} sourceCode Solidity code to be compiled
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} compiled {sourceCode}
     */
    async compileSolidity(
        sourceCode: string,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthCompiledSolidityResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_compileSolidity',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [sourceCode],
            });
        } catch (error) {
            throw Error(
                `Error getting compiling solidity code: ${error.message}`
            );
        }
    }

    /**
     * Returns compiled LLL code
     * @param {string} sourceCode LLL code to be compiled
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} compiled {sourceCode}
     */
    async compileLLL(
        sourceCode: string,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_compileLLL',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [sourceCode],
            });
        } catch (error) {
            throw Error(`Error getting compiling LLL code: ${error.message}`);
        }
    }

    /**
     * Returns compiled serpent code
     * @param {string} sourceCode Serpent code to be compiled
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} compiled {sourceCode}
     */
    async compileSerpent(
        sourceCode: string,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_compileSerpent',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [sourceCode],
            });
        } catch (error) {
            throw Error(
                `Error getting compiling serpent code: ${error.message}`
            );
        }
    }

    /**
     * Creates a filter object, based on filter options, to notify when the state changes (logs)
     * @param {object} filter Filter to be created
     * @param {string|number} filter.fromBlock Start filter at integer block number or "latest", "earliest", "pending"
     * @param {string|number} filter.toBlock End filter at integer block number or "latest", "earliest", "pending"
     * @param {string|string[]} filter.address: Contract address or list of addresses from which logs should originate
     * @param {string[]} filter.topics Topics to use for filtering (optional)
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Filter id
     */
    async newFilter(
        filter: EthFilter,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_newFilter',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [filter],
            });
        } catch (error) {
            throw Error(`Error creating filter: ${error.message}`);
        }
    }

    /**
     * Creates a filter in the node, to notify when a new block arrives
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Filter id
     */
    async newBlockFilter(
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_newBlockFilter',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [],
            });
        } catch (error) {
            throw Error(`Error creating block filter: ${error.message}`);
        }
    }

    /**
     * Creates a filter in the node, to notify when new pending transactions arrive
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Filter id
     */
    async newPendingTransactionFilter(
        rpcOptions?: HttpRpcOptions
    ): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_newPendingTransactionFilter',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [],
            });
        } catch (error) {
            throw Error(
                `Error creating pending transaction filter: ${error.message}`
            );
        }
    }

    /**
     * Uninstalls a filter with given id. Should always be called when watch is no longer needed
     * @param {string} filterId Id of filter to uninstall from node
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Returns true if filter was successfully uninstalled, otherwise false
     */
    async uninstallFilter(
        filterId: string,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthBooleanResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_uninstallFilter',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [filterId],
            });
        } catch (error) {
            throw Error(`Error uninstalling filter: ${error.message}`);
        }
    }

    /**
     * Polling method for a filter, which returns an array of logs which occurred since last poll
     * @param {string} filterid Id of filter to retrieve changes from
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Array of log objects, or an empty array if nothing has changed since last poll
     */
    async getFilterChanges(
        filterId: string,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthLogResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getFilterChanges',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [filterId],
            });
        } catch (error) {
            throw Error(`Error getting filter changes: ${error.message}`);
        }
    }

    /**
     * Returns an array of all logs matching filter with given id
     * @param {string} filterid Id of filter to retrieve
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Array of log objects, or an empty array if nothing has changed since last poll
     */
    async getFilterLogs(
        filterId: string,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthLogResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getFilterLogs',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [filterId],
            });
        } catch (error) {
            throw Error(`Error getting filter changes: ${error.message}`);
        }
    }

    /**
     * Returns an array of all logs matching a given filter object
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Array of log objects, or an empty array if nothing has changed since last poll
     */
    async getLogs(
        filter: EthFilter,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthLogResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getLogs',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [filter],
            });
        } catch (error) {
            throw Error(`Error getting logs: ${error.message}`);
        }
    }

    /**
     * Returns the hash of the current block, the seedHash, and the boundary condition to be met (“target”)
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Array of work info (in order: current block header pow-hash, seed hash used for the DAG, and boundary condition (“target”), 2^256 / difficulty)
     */
    async getWork(rpcOptions?: HttpRpcOptions): Promise<EthStringArrayResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_getWork',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting work: ${error.message}`);
        }
    }

    /**
     * Used for submitting a proof-of-work solution
     * @param {string} nonce Hex string representing found nonce (64 bits)
     * @param {string} powHash Hex string representing POW hash (256 bits)
     * @param {string} digest Hex string representing mix digest (256 bits)
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Returns true if the provided solution is valid, otherwise false
     */
    async submitWork(
        nonce: string,
        powHash: string,
        digest: string,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthBooleanResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_submitWork',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [nonce, powHash, digest],
            });
        } catch (error) {
            throw Error(`Error submitting work: ${error.message}`);
        }
    }

    /**
     * Used for submitting mining hashrate
     * @param {string} hashRate Hex string representing desired hash rate (32 bytes)
     * @param {string} clientId Hex string representing ID identifying the client
     * @param {object} rpcOptions RPC options
     * @param {number} rpcOptions.id ID used to identify request
     * @param {string} rpcOptions.jsonrpc JSON RPC version
     * @returns {Promise} Returns true if the provided solution is valid, otherwise false
     */
    async submitHashRate(
        hashRate: string,
        clientId: string,
        rpcOptions?: HttpRpcOptions
    ): Promise<EthBooleanResult> {
        try {
            return await this._requestManager.send({
                ...rpcOptions,
                method: 'eth_submitHashRate',
                jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
                params: [hashRate, clientId],
            });
        } catch (error) {
            throw Error(`Error submitting hash rate: ${error.message}`);
        }
    }
}
