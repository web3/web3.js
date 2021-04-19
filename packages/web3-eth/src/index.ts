import Base from 'web3-internal-base';
import { BaseOpts, RpcParamsBase, RpcResponseBigInt, RpcResponse } from 'web3-internal-base/types';
import { RpcResponseSyncing } from '../types';

export default class Web3Eth extends Base {
  constructor(provider: string, opts: BaseOpts = {}) {
    super('eth', provider, opts);
  }

  /**
   * Returns the current ethereum protocol version
   * @param rpcParams Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {RpcResponseBigInt} which includes a BigInt formatted {result}
   */
  async getProtocolVersion(rpcParams?: RpcParamsBase): Promise<RpcResponseBigInt> {
    try {
      return await this.sendRpcFormatResponse({...rpcParams, method: 'eth_protocolVersion', params: []})
    } catch (error) {
      throw Error(`Error getting protocol version: ${error.message}`)
    }
  }

  /**
   * Returns an object with data about the sync status or {false} when not syncing
   * @param rpcParams Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {RpcResponseSyncing} which is either an object containing sync status, or {false} if node is not syncing
   */
   async getSyncing(rpcParams?: RpcParamsBase): Promise<RpcResponseSyncing> {
    try {
      // TODO - figure out how to make typescript happy here
      // @ts-ignore
      return await this.sendRpc({...rpcParams, method: 'eth_syncing', params: []})
    } catch (error) {
      throw Error(`Error getting syncing info: ${error.message}`)
    }
  }

  /**
   * Returns the client's coinbase address
   * @param rpcParams Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {RpcResponseBigInt} which includes a BigInt formatted {result}
   */
   async getCoinbase(rpcParams?: RpcParamsBase): Promise<RpcResponse> {
    try {
      return await this.sendRpc({...rpcParams, method: 'eth_coinbase', params: []})
    } catch (error) {
      throw Error(`Error getting coinbase address: ${error.message}`)
    }
  }

  /**
   * Returns {true} if client is actively mining new blocks
   * 
   * @param rpcParams Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {RpcResponse} which includes a BigInt formatted {result}
   */
  async getMining(rpcParams?: RpcParamsBase): Promise<RpcResponse> {
    try {
      return await this.sendRpc({...rpcParams, method: 'eth_mining', params: []})
    } catch (error) {
      throw Error(`Error getting coinbase address: ${error.message}`)
    }
  }

  /**
   * Returns the number of hashes per second that the node is mining with
   * 
   * @param rpcParams Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {RpcResponse} which includes a BigInt formatted {result}
   */
   async getHashRate(rpcParams?: RpcParamsBase): Promise<RpcResponse> {
    try {
      return await this.sendRpc({...rpcParams, method: 'eth_mining', params: []})
    } catch (error) {
      throw Error(`Error getting coinbase address: ${error.message}`)
    }
  }

  /**
   * 
   * @param rpcParams Optionaly provide {id} and {jsonrpc} params to RPC call
   * @returns {RpcResponseBigInt} which includes a BigInt formatted {result}
   */
  async getBlockNumber(rpcParams?: RpcParamsBase): Promise<RpcResponseBigInt> {
    try {
      return await this.sendRpcFormatResponse({...rpcParams, method: 'eth_blockNumber', params: []})
    } catch (error) {
      throw Error(`Error getting block number: ${error.message}`)
    }
  }
}
