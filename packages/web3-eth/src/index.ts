import Web3RequestManager from 'web3-core-requestmanager';
import { HttpRpcOptions, HttpRpcResponse } from 'web3-providers-http/types';

import {
  EthAddressBlockParmeters, BlockHashParameter, BlockIdentifierParameter,
  EthGetStorageAtParameters, Web3EthOptions, EthSignParameters, EthTransaction, EthCallTransaction, blockIdentifier,
} from '../types';

export default class Web3Eth {
  private _packageName: string

  private _requestManager: Web3RequestManager

  private _DEFAULT_JSON_RPC_VERSION = '2.0'

  constructor(options: Web3EthOptions) {
    this._requestManager = new Web3RequestManager({
      providerUrl: options.providerUrl,
    });
    this._packageName = options.packageName || 'eth';
  }

  get packageName() {
    return this._packageName;
  }

  /**
   * Returns the current ethereum protocol version
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @param options Optional method options such as {formatBigInt}
   * @returns {HttpRpcResponse} Contains returns JSON RPC data
   */
  async getProtocolVersion(rpcOptions?: HttpRpcOptions): Promise<HttpRpcResponse> {
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
   * Returns an object with data about the sync status or {false} when not syncing
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Contains returns JSON RPC data
   */
  async getSyncing(rpcOptions?: HttpRpcOptions): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_syncing',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [],
      });
    } catch (error) {
      throw Error(`Error getting syncing info: ${error.message}`);
    }
  }

  /**
   * Returns the client's coinbase address
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Contains returns JSON RPC data
   */
  async getCoinbase(rpcOptions?: HttpRpcOptions): Promise<HttpRpcResponse> {
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
   * Returns {true} if client is actively mining new blocks
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Contains returns JSON RPC data
   */
  async getMining(rpcOptions?: HttpRpcOptions): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_mining',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [],
      });
    } catch (error) {
      throw Error(`Error getting mining info: ${error.message}`);
    }
  }

  /**
   * Returns the number of hashes per second that the node is mining with
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Contains returns JSON RPC data
   */
  async getHashRate(rpcOptions?: HttpRpcOptions): Promise<HttpRpcResponse> {
    try {
      const response = await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_hashrate',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [],
      });
      return { ...response, result: BigInt(response.result) };
    } catch (error) {
      throw Error(`Error getting hash rate: ${error.message}`);
    }
  }

  /**
   * Returns the current price per gas in wei
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Contains returns JSON RPC data
   */
  async getGasPrice(rpcOptions?: HttpRpcOptions): Promise<HttpRpcResponse> {
    try {
      const response = await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_gasPrice',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [],
      });
      return { ...response, result: BigInt(response.result) };
    } catch (error) {
      throw Error(`Error getting hash rate: ${error.message}`);
    }
  }

  /**
   * Returns a list of addresses owned by client.
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Contains returns JSON RPC data
   */
  async getAccounts(rpcOptions?: HttpRpcOptions): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_accounts',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [],
      });
    } catch (error) {
      throw Error(`Error getting hash rate: ${error.message}`);
    }
  }

  /**
   * Returns the number of most recent block
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Contains returns JSON RPC data
   */
  async getBlockNumber(rpcOptions?: HttpRpcOptions): Promise<HttpRpcResponse> {
    try {
      const response = await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_blockNumber',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [],
      });
      return { ...response, result: BigInt(response.result) };
    } catch (error) {
      throw Error(`Error getting block number: ${error.message}`);
    }
  }

  /**
   * Returns the balance of the account of given address
   * @param params Contains address to get balance of and an optional identifier
   * for what block to use for the query
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Returns address balance in Wei formatted as BigInt
   */
  async getBalance(
    params: EthAddressBlockParmeters,
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      const response = await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_getBalance',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [
          params.address,
          params.block || 'latest',
        ],
      });
      return { ...response, result: BigInt(response.result) };
    } catch (error) {
      throw Error(`Error getting balance: ${error.message}`);
    }
  }

  /**
   * Returns the value from a storage position at a given address
   * @param params Contains address to query storage of, position in storage,
   * and an optional identifier for what block to use for the query
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Returns the value at provided storage position
   */
  async getStorageAt(
    params: EthGetStorageAtParameters,
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_getStorageAt',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [
          params.address,
          params.position,
          params.block || 'latest',
        ],
      });
    } catch (error) {
      throw Error(`Error getting storage: ${error.message}`);
    }
  }

  /**
   * Returns the number of transactions sent from an address
   * @param params Contains address to query transaction count of,
   * and an optional identifier for what block to use for the query
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Returns transaction count for provided address
   */
  async getTransactionCount(
    params: EthAddressBlockParmeters,
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_getTransactionCount',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [
          params.address,
          params.block || 'latest',
        ],
      });
    } catch (error) {
      throw Error(`Error getting transaction count: ${error.message}`);
    }
  }

  /**
   * Returns the number of transactions in a block from a block matching the given block hash
   * @param params Contains hash of block to query
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Returns the number of transaction included in provided block
   */
  async getBlockTransactionCountByHash(
    params: BlockHashParameter,
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_getBlockTransactionCountByHash',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [
          params.blockHash,
        ],
      });
    } catch (error) {
      throw Error(`Error getting transaction count for block by hash: ${error.message}`);
    }
  }

  /**
   * Returns the number of transactions in a block from a block matching the given block number
   * @param params Contains number of block to query
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Returns the number of transaction included in provided block
   */
  async getBlockTransactionCountByNumber(
    params: BlockIdentifierParameter,
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_getBlockTransactionCountByNumber',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [
          params.blockNumber,
        ],
      });
    } catch (error) {
      throw Error(`Error getting transaction count for block by number: ${error.message}`);
    }
  }

  /**
   * Returns the number of uncles in a block from a block matching the given block hash
   * @param params Contains hash of block to query
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Returns the number of uncles included in provided block
   */
  async getUncleCountByBlockHash(
    params: BlockHashParameter,
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_getUncleCountByBlockHash',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [
          params.blockHash,
        ],
      });
    } catch (error) {
      throw Error(`Error getting uncle count for block by hash: ${error.message}`);
    }
  }

  /**
   * Returns the number of uncles in a block from a block matching the given block number
   * @param params Contains number of block to query
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Returns the number of uncles included in provided block
   */
  async getUncleCountByBlockNumber(
    params: BlockIdentifierParameter,
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_getUncleCountByBlockNumber',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [
          params.blockNumber,
        ],
      });
    } catch (error) {
      throw Error(`Error getting uncle count for block by number: ${error.message}`);
    }
  }

  /**
   * Returns code at a given address
   * @param params Contains address to query code of,
   * and an optional identifier for what block to use for the query
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Returns the code from the given address
   */
  async getCode(
    params: EthAddressBlockParmeters,
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_getCode',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [
          params.address,
          params.block || 'latest',
        ],
      });
    } catch (error) {
      throw Error(`Error getting code for address: ${error.message}`);
    }
  }

  /**
   * Calculates an Ethereum specific signature
   * @param params Contains address to use to sign,
   * and a message to sign
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Signed message
   */
  async sign(
    params: EthSignParameters,
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_sign',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [
          params.address,
          params.message,
        ],
      });
    } catch (error) {
      throw Error(`Error signing message: ${error.message}`);
    }
  }

  /**
   * Signs a transaction that can be submitted to the network at a later time using with sendRawTransaction
   * @param params A transaction object containing:
   * from, to, gas, gasPrice, value, data, and nonce
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Signed transaction object
   */
   async signTransaction(
    transaction: EthTransaction,
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_signTransaction',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [{
          ...transaction,
          gas: `0x${transaction.gas?.toString(16)}`,
          gasPrice: `0x${transaction.gasPrice?.toString(16)}`,
          value: `0x${transaction.value?.toString(16)}`,
        }],
      });
    } catch (error) {
      throw Error(`Error signing transaction: ${error.message}`);
    }
  }

  /**
   * Submits a transaction object to the provider to be sign and sent to the network
   * @param params A transaction object containing:
   * from, to, gas, gasPrice, value, data, and nonce
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
   async sendTransaction(
    transaction: EthTransaction,
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_sendTransaction',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [{
          ...transaction,
          gas: transaction.gas ? `0x${transaction.gas.toString(16)}` : undefined,
          gasPrice: transaction.gasPrice ? `0x${transaction.gasPrice.toString(16)}` : undefined,
          value: transaction.value ? `0x${transaction.value.toString(16)}` : undefined
        }],
      });
    } catch (error) {
      throw Error(`Error sending transaction: ${error.message}`);
    }
  }

  /**
   * Submits a previously signed transaction object to the network
   * @param params Contains the raw signed transaction
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
   async sendRawTransaction(
    params: {rawTransaction: string},
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_sendRawTransaction',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [params.rawTransaction],
      });
    } catch (error) {
      throw Error(`Error sending raw transaction: ${error.message}`);
    }
  }

  /**
   * Executes a new message call immediately without creating a transaction on the block chain
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
   async call(
    transaction: EthCallTransaction,
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
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
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
   async estimateGas(
    transaction: EthTransaction,
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
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
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
   async getBlockByHash(
    params: {blockHash: string, returnFullTxs?: boolean},
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_getBlockByHash',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [
          params.blockHash,
          params.returnFullTxs || false
        ],
      });
    } catch (error) {
      throw Error(`Error getting block by hash: ${error.message}`);
    }
  }

  /**
   * Returns information about a block by number
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
   async getBlockByNumber(
    params: {blockIdentifier: blockIdentifier, returnFullTxs?: boolean},
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_getBlockByNumber',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [
          params.blockIdentifier,
          params.returnFullTxs || false
        ],
      });
    } catch (error) {
      throw Error(`Error getting block by hash: ${error.message}`);
    }
  }

  /**
   * Returns the information about a transaction requested by transaction hash
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
   async getTransactionByHash(
    params: {txHash: string},
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_getTransactionByHash',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [params.txHash],
      });
    } catch (error) {
      throw Error(`Error getting transaction by hash: ${error.message}`);
    }
  }

  /**
   * Returns information about a transaction by block hash and transaction index position
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
   async getTransactionByBlockHashAndIndex(
    params: {blockHash: string, transactionIndex: string},
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_getTransactionByBlockHashAndIndex',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [params.blockHash, params.transactionIndex],
      });
    } catch (error) {
      throw Error(`Error getting transaction by block hash and index: ${error.message}`);
    }
  }

  /**
   * Returns information about a transaction by block number and transaction index position
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
   async getTransactionByBlockNumberAndIndex(
    params: {blockIdentifier: blockIdentifier, transactionIndex: string},
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_getTransactionByBlockNumberAndIndex',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [params.blockIdentifier, params.transactionIndex],
      });
    } catch (error) {
      throw Error(`Error getting transaction by block hash and index: ${error.message}`);
    }
  }

  /**
   * Returns the receipt of a transaction by transaction hash
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
   async getTransactionReceipt(
    txHash: string,
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
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
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
   async getUncleByBlockHashAndIndex(
    blockHash: string,
    uncleIndex: string,
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_getUncleByBlockHashAndIndex',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [blockHash, uncleIndex],
      });
    } catch (error) {
      throw Error(`Error getting uncle by block hash and index: ${error.message}`);
    }
  }

  /**
   * Returns information about a uncle of a block by number and uncle index position
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
   async getUncleByBlockNumberAndIndex(
    blockIdentifier: blockIdentifier,
    uncleIndex: string,
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_getUncleByBlockNumberAndIndex',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [blockIdentifier, uncleIndex],
      });
    } catch (error) {
      throw Error(`Error getting uncle by block number and index: ${error.message}`);
    }
  }

  /**
   * Returns a list of available compilers in the client
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
   async getCompilers(
    rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
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
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
   async compileSolidity(
     sourceCode: string,
     rpcOptions?: HttpRpcOptions,
  ): Promise<HttpRpcResponse> {
    try {
      return await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_compileSolidity',
        jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
        params: [sourceCode],
      });
    } catch (error) {
      throw Error(`Error getting compiling solidity code: ${error.message}`);
    }
  }

  /**
   * Returns compiled LLL code
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
   async compileLLL(
    sourceCode: string,
    rpcOptions?: HttpRpcOptions,
 ): Promise<HttpRpcResponse> {
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
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
  async compileSerpent(
    sourceCode: string,
    rpcOptions?: HttpRpcOptions,
 ): Promise<HttpRpcResponse> {
   try {
     return await this._requestManager.send({
       ...rpcOptions,
       method: 'eth_compileSerpent',
       jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
       params: [sourceCode],
     });
   } catch (error) {
     throw Error(`Error getting compiling serpent code: ${error.message}`);
   }
 }

 /**
   * Creates a filter object, based on filter options, to notify when the state changes (logs)
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
  async newFilter(
    filter: {
      fromBlock?: blockIdentifier,
      toBlock?: blockIdentifier,
      address?: string,
      topics?: string | null | string[][]
    },
    rpcOptions?: HttpRpcOptions,
 ): Promise<HttpRpcResponse> {
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
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
  async newBlockFilter(
    rpcOptions?: HttpRpcOptions,
 ): Promise<HttpRpcResponse> {
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
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
  async newPendingTransactionFilter(
    rpcOptions?: HttpRpcOptions,
 ): Promise<HttpRpcResponse> {
   try {
     return await this._requestManager.send({
       ...rpcOptions,
       method: 'eth_newPendingTransactionFilter',
       jsonrpc: rpcOptions?.jsonrpc || this._DEFAULT_JSON_RPC_VERSION,
       params: [],
     });
   } catch (error) {
     throw Error(`Error creating pending transaction filter: ${error.message}`);
   }
 }

 /**
   * Uninstalls a filter with given id. Should always be called when watch is no longer needed
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
  async uninstallFilter(
    filterId: string,
    rpcOptions?: HttpRpcOptions,
 ): Promise<HttpRpcResponse> {
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
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
  async getFilterChanges(
    filterId: string,
    rpcOptions?: HttpRpcOptions,
 ): Promise<HttpRpcResponse> {
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
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
  async getFilterLogs(
    filterId: string,
    rpcOptions?: HttpRpcOptions,
 ): Promise<HttpRpcResponse> {
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
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
  async getLogs(
    filter: {
      fromBlock?: blockIdentifier,
      toBlock?: blockIdentifier,
      address?: string,
      topics?: string | null | string[][],
      blochHash?: string
    },
    rpcOptions?: HttpRpcOptions,
 ): Promise<HttpRpcResponse> {
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
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
  async getWork(
    rpcOptions?: HttpRpcOptions,
 ): Promise<HttpRpcResponse> {
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
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
  async submitWork(
    nonce: string,
    powHash: string,
    digest: string,
    rpcOptions?: HttpRpcOptions,
 ): Promise<HttpRpcResponse> {
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
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
  async submitHashRate(
    hashRate: string,
    clientId: string,
    rpcOptions?: HttpRpcOptions,
 ): Promise<HttpRpcResponse> {
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

 /**
   * Used for submitting mining hashrate
   * @param params Transaction object
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Transaction hash or zero hash if transaction has not been mined
   */
  async submitHashRate(
    hashRate: string,
    clientId: string,
    rpcOptions?: HttpRpcOptions,
 ): Promise<HttpRpcResponse> {
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
