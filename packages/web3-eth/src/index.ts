import Web3RequestManager from 'web3-core-requestmanager'
import { HttpRpcOptions, HttpRpcResponse } from 'web3-providers-http/types'
import { toBigInt } from 'web3-utils'

import { Web3EthOptions } from '../types'

export default class Web3Eth {
  packageName: string
  requestManager: Web3RequestManager

  constructor(options: Web3EthOptions) {
    this.requestManager = new Web3RequestManager({
      providerString: options.providerString,
      protectProvider: options.providerOptions?.protectProvider || false,
      supportsSubscriptions: options.providerOptions?.supportsSubscriptions || false
    })
    this.packageName = options.packageName || 'eth'
  }

  /**
   * Returns the current ethereum protocol version
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @param options Optional method options such as {formatBigInt}
   * @returns {HttpRpcResponse} Contains returns JSON RPC data
   */
  async getProtocolVersion(rpcOptions: HttpRpcOptions): Promise<HttpRpcResponse> {
    try {
      const response = await this.requestManager.send({
        ...rpcOptions,
        method: 'eth_protocolVersion',
        params: []
      })
      return {...response, result: toBigInt(response.result)}
    } catch (error) {
      throw Error(`Error getting protocol version: ${error.message}`)
    }
  }

  /**
   * Returns an object with data about the sync status or {false} when not syncing
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Contains returns JSON RPC data
   */
   async getSyncing(rpcOptions?: HttpRpcOptions): Promise<HttpRpcResponse> {
    try {
      return await this.requestManager.send({
        ...rpcOptions,
        method: 'eth_syncing',
        params: []
      })
    } catch (error) {
      throw Error(`Error getting syncing info: ${error.message}`)
    }
  }

  /**
   * Returns the client's coinbase address
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Contains returns JSON RPC data
   */
   async getCoinbase(rpcOptions?: HttpRpcOptions): Promise<HttpRpcResponse> {
    try {
      return await this.requestManager.send({
        ...rpcOptions,
        method: 'eth_coinbase',
        params: []
      })
    } catch (error) {
      throw Error(`Error getting coinbase address: ${error.message}`)
    }
  }

  /**
   * Returns {true} if client is actively mining new blocks
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Contains returns JSON RPC data
   */
  async getMining(rpcOptions?: HttpRpcOptions): Promise<HttpRpcResponse> {
    try {
      return await this.requestManager.send({
        ...rpcOptions,
        method: 'eth_mining',
        params: []
      })
    } catch (error) {
      throw Error(`Error getting mining info: ${error.message}`)
    }
  }

  /**
   * Returns the number of hashes per second that the node is mining with
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Contains returns JSON RPC data
   */
   async getHashRate(rpcOptions?: HttpRpcOptions): Promise<HttpRpcResponse> {
    try {
      const response = await this.requestManager.send({
        ...rpcOptions,
        method: 'eth_hashrate',
        params: []
      })
      return {...response, result: toBigInt(response.result)}
    } catch (error) {
      throw Error(`Error getting hash rate: ${error.message}`)
    }
  }

  /**
   * Returns the current price per gas in wei
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Contains returns JSON RPC data
   */
   async getGasPrice(rpcOptions?: HttpRpcOptions): Promise<HttpRpcResponse> {
    try {
      const response = await this.requestManager.send({
        ...rpcOptions,
        method: 'eth_gasPrice',
        params: []
      })
      return {...response, result: toBigInt(response.result)}
    } catch (error) {
      throw Error(`Error getting hash rate: ${error.message}`)
    }
  }

  /**
   * Returns a list of addresses owned by client.
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Contains returns JSON RPC data
   */
   async getAccounts(rpcOptions?: HttpRpcOptions): Promise<HttpRpcResponse> {
    try {
      return await this.requestManager.send({
        ...rpcOptions,
        method: 'eth_accounts',
        params: []
      })
    } catch (error) {
      throw Error(`Error getting hash rate: ${error.message}`)
    }
  }

  /**
   * Returns the number of most recent block
   * @param rpcOptions Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {HttpRpcResponse} Contains returns JSON RPC data
   */
  async getBlockNumber(rpcOptions?: HttpRpcOptions): Promise<HttpRpcResponse> {
    try {
      const response = await this.requestManager.send({
        ...rpcOptions,
        method: 'eth_blockNumber',
        params: []
      })
      return {...response, result: toBigInt(response.result)}
    } catch (error) {
      throw Error(`Error getting block number: ${error.message}`)
    }
  }
}
