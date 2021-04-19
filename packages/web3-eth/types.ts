import { RpcResponse } from 'web3-internal-base/types'

export interface EthSyncingResponse extends RpcResponse {
    result: {
        startingBlock: string,
        currentBlock: string,
        highestBlock: string
    }
}
