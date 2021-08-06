import initWeb3Provider from 'web3-core-provider';
import {
    RpcResponse,
    RpcStringResult,
    RpcPrefixedHexStringResult,
    RpcValidTypeResult,
    RpcBooleanResult,
    RpcSyncingResult,
    RpcAccountsResult,
    RpcBlockResult,
    RpcTransactionResult,
    RpcTransactionReceiptResult,
    RpcStringArrayResult,
    RpcCompiledSolidityResult,
    RpcLogResult,
    RequestArguments,
    IWeb3Provider,
} from 'web3-core-types/lib/types';
import { toHex, formatOutput, formatOutputObject } from 'web3-utils';
import {
    PrefixedHexString,
    EthTransaction,
    BlockIdentifier,
    EthFilter,
    BlockTags,
    ValidTypes,
    ValidTypesEnum,
} from 'web3-utils/lib/types';

import { Web3EthOptions, EthCallTransaction } from './types';

export default class Web3Eth {
    private _defaultReturnType: ValidTypesEnum;

    provider: IWeb3Provider;

    constructor(options: Web3EthOptions) {
        this.provider = initWeb3Provider(options.web3Client);
        this._defaultReturnType =
            options.returnType || ValidTypesEnum.PrefixedHexString;
    }

    private static _isBlockTag(value: BlockIdentifier): boolean {
        return Object.values(BlockTags).includes(value as BlockTags);
    }

    // /**
    //  * Returns the current client version
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Client version
    //  */
    async getClientVersion(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'web3_clientVersion',
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting client version: ${error.message}`);
        }
    }

    // /**
    //  * Returns Keccak-256 (not the standardized SHA3-256) of the given data
    //  * @param {string} data Data to convert into SHA3 hash
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} SHA3 hash of {data}
    //  */
    async getSha3(
        data: string,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcPrefixedHexStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'web3_clientVersion',
                params: [data],
            });
        } catch (error) {
            throw Error(`Error getting sha3 hash: ${error.message}`);
        }
    }

    // /**
    //  * Returns the current network version
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Current network version
    //  */
    async getNetworkVersion(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcValidTypeResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'net_version',
                params: [],
            });

            return {
                ...response,
                result: formatOutput(
                    (response as RpcResponse).result,
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(`Error getting network version: ${error.message}`);
        }
    }

    // /**
    //  * Returns true if client is actively listening for network connections
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} true if currently listening, otherwise false
    //  */
    async getNetworkListening(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcBooleanResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'net_listening',
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting network listening: ${error.message}`);
        }
    }

    // /**
    //  * Returns number of peers currently connected to the client
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} true if currently listening, otherwise false
    //  */
    async getNetworkPeerCount(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcValidTypeResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'net_peerCount',
                params: [],
            });

            return {
                ...response,
                result: formatOutput(
                    (response as RpcResponse).result,
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(`Error getting network peer count: ${error.message}`);
        }
    }

    // /**
    //  * Returns the current ethereum protocol version
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} The current ethereum protocol version
    //  */
    async getProtocolVersion(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcValidTypeResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_protocolVersion',
                params: [],
            });

            return {
                ...response,
                result: formatOutput(
                    (response as RpcResponse).result,
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(`Error getting protocol version: ${error.message}`);
        }
    }

    // /**
    //  * Returns an object with data about the sync status or false when not syncing
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Object with sync status data or false when not syncing
    //  */
    async getSyncing(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcSyncingResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_syncing',
                params: [],
            });

            return {
                ...response,
                result:
                    typeof (response as RpcResponse).result === 'boolean'
                        ? (response as RpcResponse).result
                        : formatOutputObject(
                              (response as RpcResponse).result,
                              ['startingBlock', 'currentBlock', 'highestBlock'],
                              requestArguments?.returnType ||
                                  this._defaultReturnType
                          ),
            };
        } catch (error) {
            throw Error(`Error getting syncing status: ${error.message}`);
        }
    }

    // /**
    //  * Returns the client's coinbase address
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} The current coinbase address
    //  */
    async getCoinbase(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcPrefixedHexStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'eth_coinbase',
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting coinbase address: ${error.message}`);
        }
    }

    // /**
    //  * Returns true if client is actively mining new blocks
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} true if the client is mining, otherwise false
    //  */
    async getMining(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcBooleanResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'eth_mining',
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting mining status: ${error.message}`);
        }
    }

    // /**
    //  * Returns the number of hashes per second that the node is mining with
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Number of hashes per second
    //  */
    async getHashRate(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcValidTypeResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_hashrate',
                params: [],
            });

            return {
                ...response,
                result: formatOutput(
                    (response as RpcResponse).result,
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(`Error getting hash rate: ${error.message}`);
        }
    }

    // /**
    //  * Returns the current price per gas in wei
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Hex string representing current gas price in wei
    //  */
    async getGasPrice(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcValidTypeResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_gasPrice',
                params: [],
            });

            return {
                ...response,
                result: formatOutput(
                    (response as RpcResponse).result,
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(`Error getting gas price: ${error.message}`);
        }
    }

    // /**
    //  * Returns a list of addresses owned by client.
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Array of addresses owned by the client
    //  */
    async getAccounts(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcAccountsResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'eth_accounts',
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting accounts: ${error.message}`);
        }
    }

    // /**
    //  * Returns the number of most recent block
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Hex string representing current block number client is on
    //  */
    async getBlockNumber(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcValidTypeResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_blockNumber',
                params: [],
            });

            return {
                ...response,
                result: formatOutput(
                    (response as RpcResponse).result,
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(`Error getting block number: ${error.message}`);
        }
    }

    // /**
    //  * Returns the balance of the account of given address
    //  * @param {string} address Address to get balance of
    //  * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Hex string representing current balance in wei
    //  */
    async getBalance(
        address: PrefixedHexString,
        blockIdentifier: BlockIdentifier,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcValidTypeResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_getBalance',
                params: [
                    address,
                    Web3Eth._isBlockTag(blockIdentifier)
                        ? (blockIdentifier as BlockTags)
                        : toHex(blockIdentifier),
                ],
            });

            return {
                ...response,
                result: formatOutput(
                    (response as RpcResponse).result,
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(`Error getting balance: ${error.message}`);
        }
    }

    // /**
    //  * Returns the value from a storage position at a given address
    //  * @param {string} address Address of storage to query
    //  * @param {string} storagePosition Hex string representing position in storage to retrieve
    //  * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Hex string representing value at {storagePosition}
    //  */
    async getStorageAt(
        address: PrefixedHexString,
        storagePosition: ValidTypes,
        blockIdentifier: BlockIdentifier,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcPrefixedHexStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'eth_getStorageAt',
                params: [
                    address,
                    toHex(storagePosition),
                    Web3Eth._isBlockTag(blockIdentifier)
                        ? (blockIdentifier as BlockTags)
                        : toHex(blockIdentifier),
                ],
            });
        } catch (error) {
            throw Error(`Error getting storage value: ${error.message}`);
        }
    }

    // /**
    //  * Returns the number of transactions sent from an address
    //  * @param {string} address Address to get transaction count of
    //  * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Hex string representing number of transactions sent by {address}
    //  */
    async getTransactionCount(
        address: PrefixedHexString,
        blockIdentifier: BlockIdentifier,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcValidTypeResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_getTransactionCount',
                params: [
                    address,
                    Web3Eth._isBlockTag(blockIdentifier)
                        ? (blockIdentifier as BlockTags)
                        : toHex(blockIdentifier),
                ],
            });

            return {
                ...response,
                result: formatOutput(
                    (response as RpcResponse).result,
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(`Error getting transaction count: ${error.message}`);
        }
    }

    // /**
    //  * Returns the number of transactions in a block from a block matching the given block hash
    //  * @param {string} blockHash Hash of block to query transaction count of
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Hex string representing number of transactions in block
    //  */
    async getBlockTransactionCountByHash(
        blockHash: PrefixedHexString,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcValidTypeResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_getBlockTransactionCountByHash',
                params: [blockHash],
            });

            return {
                ...response,
                result: formatOutput(
                    (response as RpcResponse).result,
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(
                `Error getting transaction count for block by hash: ${error.message}`
            );
        }
    }

    // /**
    //  * Returns the number of transactions in a block from a block matching the given block number
    //  * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Hex string representing number of transactions in block
    //  */
    async getBlockTransactionCountByNumber(
        blockIdentifier: BlockIdentifier,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcValidTypeResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_getBlockTransactionCountByNumber',
                params: [
                    Web3Eth._isBlockTag(blockIdentifier)
                        ? (blockIdentifier as BlockTags)
                        : toHex(blockIdentifier),
                ],
            });

            return {
                ...response,
                result: formatOutput(
                    (response as RpcResponse).result,
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(
                `Error getting transaction count for block by number: ${error.message}`
            );
        }
    }

    // /**
    //  * Returns the number of uncles in a block from a block matching the given block hash
    //  * @param {string} blockHash Hash of block to query
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Hex string representing number of uncles in block
    //  */
    async getUncleCountByBlockHash(
        blockHash: PrefixedHexString,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcValidTypeResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_getUncleCountByBlockHash',
                params: [blockHash],
            });

            return {
                ...response,
                result: formatOutput(
                    (response as RpcResponse).result,
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(
                `Error getting uncle count for block by hash: ${error.message}`
            );
        }
    }

    // /**
    //  * Returns the number of uncles in a block from a block matching the given block number
    //  * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Hex string representing number of uncles in block
    //  */
    async getUncleCountByBlockNumber(
        blockIdentifier: BlockIdentifier,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcValidTypeResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_getUncleCountByBlockNumber',
                params: [
                    Web3Eth._isBlockTag(blockIdentifier)
                        ? (blockIdentifier as BlockTags)
                        : toHex(blockIdentifier),
                ],
            });

            return {
                ...response,
                result: formatOutput(
                    (response as RpcResponse).result,
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(
                `Error getting uncle count for block by number: ${error.message}`
            );
        }
    }

    // /**
    //  * Returns code at a given address
    //  * @param {string} address Address to get code at
    //  * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Hex string representing the code at {address}
    //  */
    async getCode(
        address: PrefixedHexString,
        blockIdentifier: BlockIdentifier,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcPrefixedHexStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'eth_getCode',
                params: [
                    address,
                    Web3Eth._isBlockTag(blockIdentifier)
                        ? (blockIdentifier as BlockTags)
                        : toHex(blockIdentifier),
                ],
            });
        } catch (error) {
            throw Error(`Error getting code at address: ${error.message}`);
        }
    }

    // /**
    //  * Calculates an Ethereum specific signature
    //  * @param {string} address Address to use to sign {data}
    //  * @param {string} message Message to sign
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Hex string representing signed message
    //  */
    async sign(
        address: PrefixedHexString,
        message: PrefixedHexString,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcPrefixedHexStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'eth_sign',
                params: [address, message],
            });
        } catch (error) {
            throw Error(`Error signing message: ${error.message}`);
        }
    }

    // /**
    //  * Signs a transaction that can be submitted to the network at a later time using with sendRawTransaction
    //  * @param {object} transaction Ethereum transaction
    //  * @param {string} transaction.from Address transaction will be sent from
    //  * @param {string} transaction.to Address transaction is directed towards (optional when creating new contract)
    //  * @param {string} transaction.gas Hex string representing gas to provide for transaction (ETH node defaults to 90,000)
    //  * @param {string} transaction.gasPrice Hex string representing price paid for each unit of gas in Wei (ETH node will determine if not provided)
    //  * @param {string} transaction.value Hex string representing number of Wei to send to {to}
    //  * @param {string} transaction.data Hex string representing compiled code of a contract or the hash of the invoked method signature and encoded parameters
    //  * @param {string} transaction.nonce Can be used to overwrite pending transactions that use the same nonce
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Hex string representing signed message
    //  */
    async signTransaction(
        transaction: EthTransaction,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcPrefixedHexStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'eth_signTransaction',
                params: [
                    {
                        ...transaction,
                        gas: transaction.gas
                            ? toHex(transaction.gas)
                            : undefined,
                        gasPrice: transaction.gasPrice
                            ? toHex(transaction.gasPrice)
                            : undefined,
                        value: transaction.value
                            ? toHex(transaction.value)
                            : undefined,
                        nonce: transaction.nonce
                            ? toHex(transaction.nonce)
                            : undefined,
                    },
                ],
            });
        } catch (error) {
            throw Error(`Error signing transaction: ${error.message}`);
        }
    }

    // /**
    //  * Submits a transaction object to the provider to be sign and sent to the network
    //  * @param {object} transaction Ethereum transaction
    //  * @param {string} transaction.from Address transaction will be sent from
    //  * @param {string} transaction.to Address transaction is directed towards (optional when creating new contract)
    //  * @param {string} transaction.gas Hex string representing gas to provide for transaction (ETH node defaults to 90,000)
    //  * @param {string} transaction.gasPrice Hex string representing price paid for each unit of gas in Wei (ETH node will determine if not provided)
    //  * @param {string} transaction.value Hex string representing number of Wei to send to {to}
    //  * @param {string} transaction.data Hex string representing compiled code of a contract or the hash of the invoked method signature and encoded parameters
    //  * @param {string} transaction.nonce Can be used to overwrite pending transactions that use the same nonce
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Transaction hash or zero hash if the transaction is not yet available
    //  */
    async sendTransaction(
        transaction: EthTransaction,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcPrefixedHexStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'eth_sendTransaction',
                params: [
                    {
                        ...transaction,
                        gas: transaction.gas
                            ? toHex(transaction.gas)
                            : undefined,
                        gasPrice: transaction.gasPrice
                            ? toHex(transaction.gasPrice)
                            : undefined,
                        value: transaction.value
                            ? toHex(transaction.value)
                            : undefined,
                        nonce: transaction.nonce
                            ? toHex(transaction.nonce)
                            : undefined,
                    },
                ],
            });
        } catch (error) {
            throw Error(`Error sending transaction: ${error.message}`);
        }
    }

    // /**
    //  * Submits a previously signed transaction object to the network
    //  * @param {string} rawTransaction Hex string representing previously signed transaction
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Transaction hash or zero hash if the transaction is not yet available
    //  */
    async sendRawTransaction(
        rawTransaction: PrefixedHexString,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcPrefixedHexStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'eth_sendRawTransaction',
                params: [rawTransaction],
            });
        } catch (error) {
            throw Error(`Error sending raw transaction: ${error.message}`);
        }
    }

    // // TODO Discuss formatting result
    // /**
    //  * Executes a new message call immediately without creating a transaction on the block chain
    //  * @param {object} transaction Ethereum transaction
    //  * @param {string} transaction.from Address transaction will be sent from
    //  * @param {string} transaction.to Address transaction is directed towards
    //  * @param {string} transaction.gas Hex string representing gas to provide for transaction (ETH node defaults to 90,000)
    //  * @param {string} transaction.gasPrice Hex string representing price paid for each unit of gas in Wei (ETH node will determine if not provided)
    //  * @param {string} transaction.value Hex string representing number of Wei to send to {to}
    //  * @param {string} transaction.data Hash of the method signature and encoded parameters
    //  * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Hex string representing return value of executed contract
    //  */
    async call(
        transaction: EthCallTransaction,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcResponse> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'eth_call',
                params: [
                    {
                        ...transaction,
                        gas: transaction.gas
                            ? toHex(transaction.gas)
                            : undefined,
                        gasPrice: transaction.gasPrice
                            ? toHex(transaction.gasPrice)
                            : undefined,
                        value: transaction.value
                            ? toHex(transaction.value)
                            : undefined,
                    },
                ],
            });
        } catch (error) {
            throw Error(`Error sending call transaction: ${error.message}`);
        }
    }

    // /**
    //  * Generates and returns an estimate of how much gas is necessary to allow the transaction to complete
    //  * @param {object} transaction Ethereum transaction
    //  * @param {string} transaction.from Address transaction will be sent from (optional)
    //  * @param {string} transaction.to Address transaction is directed towards (optional)
    //  * @param {string} transaction.gas Hex string representing gas to provide for transaction (ETH node defaults to 90,000)
    //  * @param {string} transaction.gasPrice Hex string representing price paid for each unit of gas in Wei (ETH node will determine if not provided)
    //  * @param {string} transaction.value Hex string representing number of Wei to send to {to} (optional)
    //  * @param {string} transaction.data Hash of the method signature and encoded parameters (optional)
    //  * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Hex string representing estimated amount of gas to be used
    //  */
    async estimateGas(
        transaction: EthTransaction,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcValidTypeResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_estimateGas',
                params: [
                    {
                        ...transaction,
                        gas: transaction.gas
                            ? toHex(transaction.gas)
                            : undefined,
                        gasPrice: transaction.gasPrice
                            ? toHex(transaction.gasPrice)
                            : undefined,
                        value: transaction.value
                            ? toHex(transaction.value)
                            : undefined,
                        nonce: transaction.nonce
                            ? toHex(transaction.nonce)
                            : undefined,
                    },
                ],
            });

            return {
                ...response,
                result: formatOutput(
                    (response as RpcResponse).result,
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(`Error getting gas estimate: ${error.message}`);
        }
    }

    // /**
    //  * Returns information about a block by hash
    //  * @param {string} blockHash Hash of block to get information for
    //  * @param {boolean} returnFullTxs If true it returns the full transaction objects, if false returns only the hashes of the transactions
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} A block object or null when no block was found
    //  */
    async getBlockByHash(
        blockHash: PrefixedHexString,
        returnFullTxs: boolean,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcBlockResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_getBlockByHash',
                params: [blockHash, returnFullTxs],
            });

            return {
                ...response,
                result: formatOutputObject(
                    (response as RpcResponse).result,
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
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(`Error getting block by hash: ${error.message}`);
        }
    }

    // /**
    //  * Returns information about a block by number
    //  * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
    //  * @param {boolean} returnFullTxs If true it returns the full transaction objects, if false returns only the hashes of the transactions
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} A block object or null when no block was found
    //  */
    async getBlockByNumber(
        blockIdentifier: BlockIdentifier,
        returnFullTxs: boolean,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcBlockResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_getBlockByNumber',
                params: [
                    Web3Eth._isBlockTag(blockIdentifier)
                        ? (blockIdentifier as BlockTags)
                        : toHex(blockIdentifier),
                    returnFullTxs,
                ],
            });

            return {
                ...response,
                result: formatOutputObject(
                    (response as RpcResponse).result,
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
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(`Error getting block by number: ${error.message}`);
        }
    }

    // /**
    //  * Returns the information about a transaction requested by transaction hash
    //  * @param {string} txHash Hash of transaction to retrieve
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} A transaction object or {null} when no transaction was found
    //  */
    async getTransactionByHash(
        txHash: PrefixedHexString,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcTransactionResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_getTransactionByHash',
                params: [txHash],
            });

            return {
                ...response,
                result: formatOutputObject(
                    (response as RpcResponse).result,
                    [
                        'blockNumber',
                        'gas',
                        'gasPrice',
                        'nonce',
                        'transactionIndex',
                        'value',
                        'v',
                    ],
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(`Error getting transaction by hash: ${error.message}`);
        }
    }

    // /**
    //  * Returns information about a transaction by block hash and transaction index position
    //  * @param {string} blockHash Hash of block to get transactions of
    //  * @param {string} transactionIndex Hex string representing index of transaction to return
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} A transaction object or {null} when no transaction was found
    //  */
    async getTransactionByBlockHashAndIndex(
        blockHash: PrefixedHexString,
        transactionIndex: ValidTypes,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcTransactionResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_getTransactionByBlockHashAndIndex',
                params: [blockHash, toHex(transactionIndex)],
            });

            return {
                ...response,
                result: formatOutputObject(
                    (response as RpcResponse).result,
                    [
                        'blockNumber',
                        'gas',
                        'gasPrice',
                        'nonce',
                        'transactionIndex',
                        'value',
                        'v',
                    ],
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(
                `Error getting transaction by block hash and index: ${error.message}`
            );
        }
    }

    // /**
    //  * Returns information about a transaction by block number and transaction index position
    //  * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
    //  * @param {string} transactionIndex Hex string representing index of transaction to return
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} A transaction object or {null} when no transaction was found
    //  */
    async getTransactionByBlockNumberAndIndex(
        blockIdentifier: BlockIdentifier,
        transactionIndex: ValidTypes,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcTransactionResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_getTransactionByBlockNumberAndIndex',
                params: [
                    Web3Eth._isBlockTag(blockIdentifier)
                        ? (blockIdentifier as BlockTags)
                        : toHex(blockIdentifier),
                    toHex(transactionIndex),
                ],
            });

            return {
                ...response,
                result: formatOutputObject(
                    (response as RpcResponse).result,
                    [
                        'blockNumber',
                        'gas',
                        'gasPrice',
                        'nonce',
                        'transactionIndex',
                        'value',
                        'v',
                    ],
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(
                `Error getting transaction by block number and index: ${error.message}`
            );
        }
    }

    // /**
    //  * Returns the receipt of a transaction by transaction hash
    //  * @param {string} txHash Hash of transaction to get receipt of
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} A transaction object or {null} when no receipt was found
    //  */
    async getTransactionReceipt(
        txHash: PrefixedHexString,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcTransactionReceiptResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_getTransactionReceipt',
                params: [txHash],
            });

            return {
                ...response,
                result: formatOutputObject(
                    (response as RpcResponse).result,
                    [
                        'transactionIndex',
                        'blockNumber',
                        'cumulativeGasUsed',
                        'gasUsed',
                        {
                            logs: [
                                'logIndex',
                                'transactionIndex',
                                'blockNumber',
                            ],
                        },
                        'status',
                    ],
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(`Error getting transaction reciept: ${error.message}`);
        }
    }

    // /**
    //  * Returns information about a uncle of a block by hash and uncle index position
    //  * @param {string} blockHash Hash of block to get uncles of
    //  * @param {string} uncleIndex Index of uncle to retrieve
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} A block object or null when no block was found
    //  */
    async getUncleByBlockHashAndIndex(
        blockHash: PrefixedHexString,
        uncleIndex: ValidTypes,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcBlockResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_getUncleByBlockHashAndIndex',
                params: [blockHash, toHex(uncleIndex)],
            });

            return {
                ...response,
                result: formatOutputObject(
                    (response as RpcResponse).result,
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
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(
                `Error getting uncle by block hash and index: ${error.message}`
            );
        }
    }

    // /**
    //  * Returns information about a uncle of a block by number and uncle index position
    //  * @param {string|number} blockIdentifier Integer or hex string representing block number, or "latest", "earliest", "pending"
    //  * @param {string} uncleIndex Index of uncle to retrieve
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} A block object or null when no block was found
    //  */
    async getUncleByBlockNumberAndIndex(
        blockIdentifier: BlockIdentifier,
        uncleIndex: ValidTypes,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcBlockResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_getUncleByBlockNumberAndIndex',
                params: [
                    Web3Eth._isBlockTag(blockIdentifier)
                        ? (blockIdentifier as BlockTags)
                        : toHex(blockIdentifier),
                    toHex(uncleIndex),
                ],
            });

            return {
                ...response,
                result: formatOutputObject(
                    (response as RpcResponse).result,
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
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(
                `Error getting uncle by block number and index: ${error.message}`
            );
        }
    }

    // /**
    //  * Returns a list of available compilers in the client
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} A list of available compilers
    //  */
    async getCompilers(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringArrayResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'eth_getCompilers',
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting compilers: ${error.message}`);
        }
    }

    // /**
    //  * Returns compiled solidity code
    //  * @param {string} sourceCode Solidity code to be compiled
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} compiled {sourceCode}
    //  */
    async compileSolidity(
        sourceCode: PrefixedHexString,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcCompiledSolidityResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'eth_compileSolidity',
                params: [sourceCode],
            });
        } catch (error) {
            throw Error(
                `Error getting compiling solidity code: ${error.message}`
            );
        }
    }

    // /**
    //  * Returns compiled LLL code
    //  * @param {string} sourceCode LLL code to be compiled
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} compiled {sourceCode}
    //  */
    async compileLLL(
        sourceCode: PrefixedHexString,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcPrefixedHexStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'eth_compileLLL',
                params: [sourceCode],
            });
        } catch (error) {
            throw Error(`Error getting compiling LLL code: ${error.message}`);
        }
    }

    // /**
    //  * Returns compiled serpent code
    //  * @param {string} sourceCode Serpent code to be compiled
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} compiled {sourceCode}
    //  */
    async compileSerpent(
        sourceCode: PrefixedHexString,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcPrefixedHexStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'eth_compileSerpent',
                params: [sourceCode],
            });
        } catch (error) {
            throw Error(
                `Error getting compiling serpent code: ${error.message}`
            );
        }
    }

    // /**
    //  * Creates a filter object, based on filter options, to notify when the state changes (logs)
    //  * @param {object} filter Filter to be created
    //  * @param {string|number} filter.fromBlock Start filter at integer block number or "latest", "earliest", "pending"
    //  * @param {string|number} filter.toBlock End filter at integer block number or "latest", "earliest", "pending"
    //  * @param {string|string[]} filter.address: Contract address or list of addresses from which logs should originate
    //  * @param {string[]} filter.topics Topics to use for filtering (optional)
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Filter id
    //  */
    async newFilter(
        filter: EthFilter,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcValidTypeResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_newFilter',
                params: [
                    {
                        ...filter,
                        fromBlock: filter.fromBlock
                            ? toHex(filter.fromBlock)
                            : undefined,
                        toBlock: filter.toBlock
                            ? toHex(filter.toBlock)
                            : undefined,
                    },
                ],
            });

            return {
                ...response,
                result: formatOutput(
                    (response as RpcResponse).result,
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(`Error creating filter: ${error.message}`);
        }
    }

    // /**
    //  * Creates a filter in the node, to notify when a new block arrives
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Filter id
    //  */
    async newBlockFilter(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcValidTypeResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_newBlockFilter',
                params: [],
            });

            return {
                ...response,
                result: formatOutput(
                    (response as RpcResponse).result,
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(`Error creating block filter: ${error.message}`);
        }
    }

    // /**
    //  * Creates a filter in the node, to notify when new pending transactions arrive
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Filter id
    //  */
    async newPendingTransactionFilter(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcValidTypeResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_newPendingTransactionFilter',
                params: [],
            });

            return {
                ...response,
                result: formatOutput(
                    (response as RpcResponse).result,
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(
                `Error creating pending transaction filter: ${error.message}`
            );
        }
    }

    // /**
    //  * Uninstalls a filter with given id. Should always be called when watch is no longer needed
    //  * @param {string} filterId Id of filter to uninstall from node
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Returns true if filter was successfully uninstalled, otherwise false
    //  */
    async uninstallFilter(
        filterId: ValidTypes,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcBooleanResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'eth_uninstallFilter',
                params: [toHex(filterId)],
            });
        } catch (error) {
            throw Error(`Error uninstalling filter: ${error.message}`);
        }
    }

    // // TODO Formatting output could be intensive since {response} is an array of results
    // /**
    //  * Polling method for a filter, which returns an array of logs which occurred since last poll
    //  * @param {string} filterid Id of filter to retrieve changes from
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Array of log objects, or an empty array if nothing has changed since last poll
    //  */
    async getFilterChanges(
        filterId: ValidTypes,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcLogResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_getFilterChanges',
                params: [toHex(filterId)],
            });

            return {
                ...response,
                result: formatOutputObject(
                    (response as RpcResponse).result,
                    ['logIndex', 'transactionIndex', 'blockNumber'],
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(`Error getting filter changes: ${error.message}`);
        }
    }

    // // TODO Formatting output could be intensive since {response} is an array of results
    // /**
    //  * Returns an array of all logs matching filter with given id
    //  * @param {string} filterid Id of filter to retrieve
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Array of log objects, or an empty array if nothing has changed since last poll
    //  */
    async getFilterLogs(
        filterId: ValidTypes,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcLogResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_getFilterLogs',
                params: [toHex(filterId)],
            });

            return {
                ...response,
                result: formatOutputObject(
                    (response as RpcResponse).result,
                    ['logIndex', 'transactionIndex', 'blockNumber'],
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(`Error getting filter changes: ${error.message}`);
        }
    }

    // // TODO Formatting output could be intensive since {response} is an array of results
    // /**
    //  * Returns an array of all logs matching a given filter object
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Array of log objects, or an empty array if nothing has changed since last poll
    //  */
    async getLogs(
        filter: EthFilter,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcLogResult> {
        try {
            const response = await this.provider.request({
                ...requestArguments,
                method: 'eth_getLogs',
                params: [
                    {
                        ...filter,
                        fromBlock: filter.fromBlock
                            ? toHex(filter.fromBlock)
                            : undefined,
                        toBlock: filter.toBlock
                            ? toHex(filter.toBlock)
                            : undefined,
                    },
                ],
            });

            return {
                ...response,
                result: formatOutputObject(
                    (response as RpcResponse).result,
                    ['logIndex', 'transactionIndex', 'blockNumber'],
                    requestArguments?.returnType || this._defaultReturnType
                ),
            };
        } catch (error) {
            throw Error(`Error getting logs: ${error.message}`);
        }
    }

    // /**
    //  * Returns the hash of the current block, the seedHash, and the boundary condition to be met (“target”)
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Array of work info (in order: current block header pow-hash, seed hash used for the DAG, and boundary condition (“target”), 2^256 / difficulty)
    //  */
    async getWork(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringArrayResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'eth_getWork',
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting work: ${error.message}`);
        }
    }

    // /**
    //  * Used for submitting a proof-of-work solution
    //  * @param {string} nonce Hex string representing found nonce (64 bits)
    //  * @param {string} powHash Hex string representing POW hash (256 bits)
    //  * @param {string} digest Hex string representing mix digest (256 bits)
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Returns true if the provided solution is valid, otherwise false
    //  */
    async submitWork(
        nonce: ValidTypes,
        powHash: PrefixedHexString,
        digest: PrefixedHexString,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcBooleanResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'eth_submitWork',
                params: [toHex(nonce, 8), powHash, digest],
            });
        } catch (error) {
            throw Error(`Error submitting work: ${error.message}`);
        }
    }

    // /**
    //  * Used for submitting mining hashrate
    //  * @param {string} hashRate Hex string representing desired hash rate (32 bytes)
    //  * @param {string} clientId Hex string representing ID identifying the client
    //  * @param {object} callOptions
    //  * @param {object} callOptions.providerCallOptions Varies based on provider type (e.g. HttpOptions)
    //  * @param {object} callOptions.rpcOptions
    //  * @param {number} callOptions.rpcOptions.id (Optional) Id to pass along with RPC request. Gets returned by RPC node
    //  * @param {string} callOptions.rpcOptions.jsonrpc (Optional) Version of JSON RPC version
    //  * @param {string} callOptions.returnType (Optional) Desired return type of formattable outputs
    //  * @param {boolean} callOptions.subscribe (Optional) If true, returns Node.js EventEmitter and polls
    //  * @returns {Promise} Returns true if the provided solution is valid, otherwise false
    //  */
    async submitHashRate(
        hashRate: ValidTypes,
        clientId: ValidTypes,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcBooleanResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                method: 'eth_submitHashRate',
                params: [toHex(hashRate, 32), toHex(clientId)],
            });
        } catch (error) {
            throw Error(`Error submitting hash rate: ${error.message}`);
        }
    }
}
