import Web3RequestManager from 'web3-core-requestmanager';
import { HttpRpcOptions, HttpRpcResponse } from 'web3-providers-http/types';

import {
  EthAddressBlockParmeters, BlockHashParameter, BlockIdentifierParameter,
  EthGetStorageAtParameters, Web3EthOptions, EthSignParameters, EthTransaction,
} from '../types';

export default class Web3Eth {
  private _packageName: string

  private _requestManager: Web3RequestManager

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
  async getProtocolVersion(rpcOptions: HttpRpcOptions): Promise<HttpRpcResponse> {
    try {
      const response = await this._requestManager.send({
        ...rpcOptions,
        method: 'eth_protocolVersion',
        params: [],
      });
      return { ...response, result: BigInt(response.result) };
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
   * Submits a transaction object to the network
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
}
