import { Genesis } from '@chainsafe/lodestar-types'

export interface IETH2BeaconChain {
  getGenesis(): Promise<Genesis>
  getBlockHeader(): Promise<any>
}
