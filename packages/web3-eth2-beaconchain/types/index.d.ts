import { Genesis } from '@chainsafe/lodestar-types'

export interface ETH2BeaconChain {
  getGenesis(): Promise<Genesis>
  getBlockHeader(): Promise<any>
}
