import { Base } from 'web3-internal-base';
import {
  BaseAPISchema, BaseOpts, RpcParamsBase, RpcResponse
} from 'web3-internal-base/types';
import { DefaultSchema } from './schema';

import { Web3Eth as IWeb3Eth } from '../types';

// @ts-ignore - ETH2BeaconChain incorrectly implements interface IETH2BeaconChain
// because methods are added during runtime
// export class Web3Eth extends Base implements IWeb3Eth {
export default class Web3Eth extends Base implements IWeb3Eth {
  constructor(
    provider: string,
    schema: BaseAPISchema = DefaultSchema,
    opts: BaseOpts = { protectProvider: true },
  ) {
    super(provider, schema, opts);
  }

  // async getBlocknumber(rpcParams: RpcParamsBase): Promise<RpcResponse> {
  //   return { id: undefined, jsonrpc: undefined, result: undefined }
  // }
}
