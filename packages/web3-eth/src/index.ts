import { Base } from 'web3-internal-base';
import { BaseOpts, RpcParamsBase } from 'web3-internal-base/types';

import { FormattedRpcResponse } from '../types';

export default class Web3Eth extends Base {
  constructor(
    provider: string,
    opts: BaseOpts = { protectProvider: true },
  ) {
    super('eth', provider, opts);
  }

  async getBlockNumber(rpcParams?: RpcParamsBase): Promise<FormattedRpcResponse> {
    try {
      const response = await this.sendRpc({...rpcParams, method: 'eth_blockNumber', params: []})
      const bigIntBlockNumber = BigInt(response.result)
      if (bigIntBlockNumber === undefined) throw Error(`Unable to convert returned result: ${response.result} into a BigInt`)
      return {...response, result: bigIntBlockNumber}
    } catch (error) {
      throw Error(`Error getting block number: ${error.message}`)
    }
  }
}
