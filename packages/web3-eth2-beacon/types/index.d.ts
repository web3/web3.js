import { Genesis } from '@chainsafe/lodestar-types'

export interface IETH2Beacon {
  getGenesis(): Promise<Genesis>
  getBlockHeader(): Promise<any>
}
